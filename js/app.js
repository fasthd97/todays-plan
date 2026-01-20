console.log('APP.JS LOADING');


import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
console.log('IMPORTING FIREBASE MODULES');

//javascriptconsole.log('APP.JS IMPORTS COMPLETE');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
let currentUser = null;
let unsubscribeFromData = null;
let isSigningUp = false;
let isDarkMode = false;

function init() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('dateInput');
    if (dateInput) dateInput.value = today;
    
    const todayDay = days[new Date().getDay()];
    const todayElement = document.getElementById(todayDay);
    if (todayElement) todayElement.checked = true;
    
    createScheduleRows();
    createTaskRows();
    createIdeasList();
    setupAuthUI();
    setupThemeToggle();
    loadThemePreference();
}

function createScheduleRows() {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = '';
    for (let i = 0; i < 17; i++) {
        const row = document.createElement('div');
        row.className = 'schedule-row';
        row.innerHTML = `<div class="time-dot"></div><input type="text" class="schedule-input" id="schedule${i}" placeholder="">`;
        scheduleList.appendChild(row);
    }
}

function createTaskRows() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const task = document.createElement('div');
        task.className = 'task-item';
        task.innerHTML = `<input type="checkbox" class="task-checkbox" id="task${i}"><input type="text" class="task-input" id="taskInput${i}" placeholder="">`;
        tasksList.appendChild(task);
    }
}

function createIdeasList() {
    const ideasList = document.getElementById('ideasList');
    ideasList.innerHTML = '';
    // Ideas will be created dynamically when loaded from data
}

function setupAuthUI() {
    const authSubmit = document.getElementById('authSubmit');
    const authToggleLink = document.getElementById('authToggleLink');
    if (!authSubmit || !authToggleLink) return;
    
    authSubmit.addEventListener('click', handleAuthSubmit);
    authToggleLink.addEventListener('click', () => {
        isSigningUp = !isSigningUp;
        if (isSigningUp) {
            document.getElementById('authTitle').textContent = 'Create Account';
            document.getElementById('authSubmit').textContent = 'Sign Up';
            document.getElementById('authToggleText').textContent = 'Already have an account?';
            document.getElementById('authToggleLink').textContent = 'Sign in';
        } else {
            document.getElementById('authTitle').textContent = 'Sign in to sync across devices';
            document.getElementById('authSubmit').textContent = 'Sign In';
            document.getElementById('authToggleText').textContent = "Don't have an account?";
            document.getElementById('authToggleLink').textContent = 'Sign up';
        }
    });
    document.getElementById('authPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAuthSubmit();
    });
}

async function handleAuthSubmit() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    if (!email || !password) {
        showMessage('Please enter email and password', 'error');
        return;
    }
    try {
        if (isSigningUp) {
            await createUserWithEmailAndPassword(auth, email, password);
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
    } catch (error) {
        let message = 'Authentication failed';
        if (error.code === 'auth/email-already-in-use') message = 'Email already in use';
        else if (error.code === 'auth/invalid-email') message = 'Invalid email';
        else if (error.code === 'auth/weak-password') message = 'Password too weak (min 6 characters)';
        else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') message = 'Invalid email or password';
        showMessage(message, 'error');
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('statusIndicator').textContent = `Signed in as ${user.email}`;
        document.getElementById('statusIndicator').classList.add('synced');
        loadThemeFromFirestore(user.uid);
        listenToUserData(user.uid);
        setupAutoSave();
    } else {
        currentUser = null;
        document.getElementById('authSection').classList.remove('hidden');
        document.getElementById('statusIndicator').textContent = 'Not connected';
        document.getElementById('statusIndicator').classList.remove('synced', 'syncing');
        if (unsubscribeFromData) {
            unsubscribeFromData();
            unsubscribeFromData = null;
        }
    }
});

function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme(isDarkMode);
    saveThemePreference(isDarkMode);
}

function applyTheme(darkMode) {
    const body = document.body;
    const toggle = document.getElementById('themeToggle');
    if (darkMode) {
        body.classList.add('dark-mode');
        if (toggle) toggle.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        if (toggle) toggle.textContent = '🌙';
    }
}

async function saveThemePreference(darkMode) {
    localStorage.setItem('darkMode', darkMode);
    if (currentUser) {
        try {
            const docRef = doc(db, 'users', currentUser.uid, 'settings', 'preferences');
            await setDoc(docRef, { darkMode }, { merge: true });
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    }
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
        isDarkMode = savedTheme === 'true';
        applyTheme(isDarkMode);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode = prefersDark;
        applyTheme(isDarkMode);
    }
}

async function loadThemeFromFirestore(userId) {
    try {
        const docRef = doc(db, 'users', userId, 'settings', 'preferences');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.darkMode !== undefined) {
                isDarkMode = data.darkMode;
                applyTheme(isDarkMode);
            }
        }
    } catch (error) {
        console.error('Error loading theme preference:', error);
    }
}

function listenToUserData(userId) {
    const docRef = doc(db, 'users', userId, 'planner', 'current');
    unsubscribeFromData = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            loadDataFromFirestore(data);
            updateStatus('synced');
        } else {
            saveDataToFirestore();
        }
    }, (error) => {
        console.error('Error listening to data:', error);
        updateStatus('error');
    });
}

function loadDataFromFirestore(data) {
    document.removeEventListener('input', handleAutoSave);
    document.removeEventListener('change', handleAutoSave);
    try {
        if (data.date) document.getElementById('dateInput').value = data.date;
        if (data.days) {
            days.forEach(day => {
                document.getElementById(day).checked = data.days[day] || false;
            });
        }
        if (data.schedule) {
            data.schedule.forEach((text, i) => {
                const el = document.getElementById(`schedule${i}`);
                if (el) el.value = text || '';
            });
        }
        if (data.priorities) {
            data.priorities.forEach((text, i) => {
                const el = document.getElementById(`priority${i + 1}`);
                if (el) el.value = text || '';
            });
        }
        if (data.tasks) {
            data.tasks.forEach((task, i) => {
                const checkEl = document.getElementById(`task${i}`);
                const textEl = document.getElementById(`taskInput${i}`);
                if (checkEl) checkEl.checked = task.checked || false;
                if (textEl) textEl.value = task.text || '';
            });
        }
        if (data.notes) document.getElementById('notes').value = data.notes;
        if (data.ideas) {
            renderIdeas(data.ideas);
        }
        if (data.studyItems) {
            renderStudyItems(data.studyItems);
        }
        if (data.water) {
            data.water.forEach((checked, i) => {
                const el = document.getElementById(`water${i + 1}`);
                if (el) el.checked = checked || false;
            });
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    setTimeout(() => {
        document.addEventListener('input', handleAutoSave);
        document.addEventListener('change', handleAutoSave);
    }, 100);
}

async function saveDataToFirestore() {
    if (!currentUser) return;
    updateStatus('syncing');
    const data = {
        date: document.getElementById('dateInput').value,
        days: {},
        schedule: [],
        priorities: [],
        tasks: [],
        ideas: [],
        studyItems: [],
        notes: document.getElementById('notes').value,
        water: [],
        lastUpdated: new Date().toISOString()
    };
    days.forEach(day => {
        data.days[day] = document.getElementById(day).checked;
    });
    for (let i = 0; i < 17; i++) {
        data.schedule.push(document.getElementById(`schedule${i}`).value);
    }
    for (let i = 1; i <= 3; i++) {
        data.priorities.push(document.getElementById(`priority${i}`).value);
    }
    for (let i = 0; i < 8; i++) {
        data.tasks.push({
            checked: document.getElementById(`task${i}`).checked,
            text: document.getElementById(`taskInput${i}`).value
        });
    }
    
    // Collect ideas
    const ideaInputs = document.querySelectorAll('.idea-input');
    ideaInputs.forEach(input => {
        if (input.value.trim()) {
            data.ideas.push(input.value.trim());
        }
    });
    
    // Collect study items
    const studyItems = document.querySelectorAll('.study-item');
    studyItems.forEach(item => {
        const input = item.querySelector('.study-input');
        const timeDisplay = item.querySelector('.study-time-display');
        if (input && input.value.trim()) {
            data.studyItems.push({
                subject: input.value.trim(),
                totalTime: parseInt(timeDisplay?.dataset.totalSeconds || '0')
            });
        }
    });
    for (let i = 1; i <= 8; i++) {
        data.water.push(document.getElementById(`water${i}`).checked);
    }
    try {
        const docRef = doc(db, 'users', currentUser.uid, 'planner', 'current');
        await setDoc(docRef, data, { merge: true });
        updateStatus('synced');
    } catch (error) {
        console.error('Error saving data:', error);
        updateStatus('error');
    }
}

let saveTimeout;

function handleAutoSave() {
    updateStatus('syncing');
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveDataToFirestore();
    }, 1000);
}

function setupAutoSave() {
    document.addEventListener('input', handleAutoSave);
    document.addEventListener('change', handleAutoSave);
}

function updateStatus(status) {
    const indicator = document.getElementById('statusIndicator');
    indicator.classList.remove('synced', 'syncing');
    if (status === 'synced') {
        indicator.textContent = '✓ Synced';
        indicator.classList.add('synced');
    } else if (status === 'syncing') {
        indicator.textContent = 'Syncing...';
        indicator.classList.add('syncing');
    } else if (status === 'error') {
        indicator.textContent = '⚠ Sync error';
    }
}

window.rollForward = async function() {
    if (!showConfirm('This will:\n• Move unchecked tasks to tomorrow\n• Clear completed items\n• Reset the date to tomorrow\n\nContinue?')) return;
    const incompletePriorities = [];
    for (let i = 1; i <= 3; i++) {
        const val = document.getElementById(`priority${i}`).value.trim();
        if (val) incompletePriorities.push(val);
    }
    const incompleteTasks = [];
    for (let i = 0; i < 8; i++) {
        const checked = document.getElementById(`task${i}`).checked;
        const val = document.getElementById(`taskInput${i}`).value.trim();
        if (val && !checked) incompleteTasks.push(val);
    }
    
    // Collect all ideas (they all roll forward)
    const allIdeas = [];
    const ideaInputs = document.querySelectorAll('.idea-input');
    ideaInputs.forEach(input => {
        if (input.value.trim()) allIdeas.push(input.value.trim());
    });
    clearAll(false);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    document.getElementById('dateInput').value = tomorrowStr;
    const tomorrowDay = days[tomorrow.getDay()];
    document.getElementById(tomorrowDay).checked = true;
    for (let i = 0; i < Math.min(incompletePriorities.length, 3); i++) {
        document.getElementById(`priority${i + 1}`).value = incompletePriorities[i];
    }
    for (let i = 0; i < Math.min(incompleteTasks.length, 8); i++) {
        document.getElementById(`taskInput${i}`).value = incompleteTasks[i];
    }
    
    // Restore all ideas
    renderIdeas(allIdeas);
    
    const overflow = [...incompletePriorities.slice(3), ...incompleteTasks.slice(8)];
    if (overflow.length > 0) {
        document.getElementById('notes').value = 'Carried over from yesterday:\n' + overflow.map(item => '• ' + item).join('\n');
    }
    if (currentUser) await saveDataToFirestore();
};

window.clearAll = async function(askConfirm = true) {
    if (askConfirm && !showConfirm('Are you sure you want to clear all entries?')) return;
    document.querySelectorAll('input[type="text"], textarea').forEach(el => el.value = '');
    document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    if (askConfirm) {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateInput').value = today;
        const todayDay = days[new Date().getDay()];
        document.getElementById(todayDay).checked = true;
    }
    if (currentUser) await saveDataToFirestore();
};

window.signOut = async function() {
    if (showConfirm('Sign out? Your data is saved and will sync when you sign back in.')) {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            showMessage('Error signing out', 'error');
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// Utility functions for better UX
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        padding: 12px 20px; border-radius: 4px; color: white;
        background: ${type === 'error' ? '#e74c3c' : '#2ecc71'};
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

function showConfirm(message) {
    return confirm(message); // Keep for now, replace with custom modal later
}
// Ideas functionality
function renderIdeas(ideas) {
    const ideasList = document.getElementById('ideasList');
    ideasList.innerHTML = '';
    
    ideas.forEach((idea, index) => {
        const ideaItem = document.createElement('div');
        ideaItem.className = 'idea-item';
        ideaItem.innerHTML = `
            <textarea class="idea-input" placeholder="Enter your idea..." rows="1">${idea}</textarea>
            <button class="idea-delete" onclick="deleteIdea(this)" title="Delete idea">×</button>
        `;
        ideasList.appendChild(ideaItem);
        
        // Auto-resize textarea
        const textarea = ideaItem.querySelector('.idea-input');
        textarea.addEventListener('input', autoResizeTextarea);
        autoResizeTextarea.call(textarea);
    });
}

function addNewIdea() {
    const ideasList = document.getElementById('ideasList');
    const ideaItem = document.createElement('div');
    ideaItem.className = 'idea-item';
    
    const ideaIndex = document.querySelectorAll('.idea-item').length;
    ideaItem.innerHTML = `
        <textarea class="idea-input" placeholder="Enter your idea..." rows="1"></textarea>
        <button class="idea-delete" onclick="deleteIdea(this)" title="Delete idea">×</button>
    `;
    
    ideasList.appendChild(ideaItem);
    
    // Focus new idea input
    const textarea = ideaItem.querySelector('.idea-input');
    textarea.focus();
    textarea.addEventListener('input', autoResizeTextarea);
    
    // Auto-save when new idea is added
    if (currentUser) {
        setTimeout(() => {
            saveDataToFirestore();
        }, 500);
    }
}

function deleteIdea(index) {
    const ideaItems = document.querySelectorAll('.idea-item');
    if (ideaItems[index]) {
        ideaItems[index].remove();
        
        // Re-index remaining delete buttons
        document.querySelectorAll('.idea-delete').forEach((btn, i) => {
            btn.setAttribute('onclick', `deleteIdea(${i})`);
        });
        
        // Auto-save after deletion
        if (currentUser) {
            setTimeout(() => {
                saveDataToFirestore();
            }, 100);
        }
    }
}

function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
}

// Make functions globally available
window.addNewIdea = addNewIdea;
window.deleteIdea = function(element) {
    element.closest('.idea-item').remove();
    
    // Auto-save after deletion
    if (currentUser) {
        setTimeout(() => {
            saveDataToFirestore();
        }, 100);
    }
};
// Study tracking functionality
let studyTimers = new Map();

function renderStudyItems(studyItems) {
    const studyList = document.getElementById('studyList');
    studyList.innerHTML = '';
    
    studyItems.forEach((item, index) => {
        const studyItem = document.createElement('div');
        studyItem.className = 'study-item';
        studyItem.innerHTML = `
            <div class="study-header">
                <input type="text" class="study-input" placeholder="Subject to study..." value="${item.subject}">
                <div class="study-controls">
                    <div class="study-timer" id="timer-${index}">00:00</div>
                    <button class="timer-btn" onclick="toggleTimer(${index})" id="btn-${index}">Start</button>
                    <button class="study-delete" onclick="deleteStudyItem(${index})" title="Delete study item">×</button>
                </div>
            </div>
            <div class="study-time-display" data-total-seconds="${item.totalTime}">
                Total time: ${formatTime(item.totalTime)}
            </div>
        `;
        studyList.appendChild(studyItem);
    });
}

function addNewStudyItem() {
    const studyList = document.getElementById('studyList');
    const studyIndex = document.querySelectorAll('.study-item').length;
    
    const studyItem = document.createElement('div');
    studyItem.className = 'study-item';
    studyItem.innerHTML = `
        <div class="study-header">
            <input type="text" class="study-input" placeholder="Subject to study...">
            <div class="study-controls">
                <div class="study-timer" id="timer-${studyIndex}">00:00</div>
                <button class="timer-btn" onclick="toggleTimer(${studyIndex})" id="btn-${studyIndex}">Start</button>
                <button class="study-delete" onclick="deleteStudyItem(${studyIndex})" title="Delete study item">×</button>
            </div>
        </div>
        <div class="study-time-display" data-total-seconds="0">
            Total time: 0m
        </div>
    `;
    
    studyList.appendChild(studyItem);
    
    // Focus new study input
    const input = studyItem.querySelector('.study-input');
    input.focus();
    
    // Auto-save when new study item is added
    if (currentUser) {
        setTimeout(() => {
            saveDataToFirestore();
        }, 500);
    }
}

function toggleTimer(index) {
    const timerDisplay = document.getElementById(`timer-${index}`);
    const button = document.getElementById(`btn-${index}`);
    const timeDisplay = document.querySelector(`#studyList .study-item:nth-child(${index + 1}) .study-time-display`);
    
    if (studyTimers.has(index)) {
        // Stop timer
        clearInterval(studyTimers.get(index).interval);
        studyTimers.delete(index);
        button.textContent = 'Start';
        button.classList.remove('stop');
        
        // Auto-save when timer stops
        if (currentUser) {
            setTimeout(() => {
                saveDataToFirestore();
            }, 100);
        }
    } else {
        // Start timer
        const startTime = Date.now();
        const currentSeconds = parseInt(timeDisplay.dataset.totalSeconds || '0');
        
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const totalSeconds = currentSeconds + elapsed;
            
            timerDisplay.textContent = formatTime(elapsed);
            timeDisplay.textContent = `Total time: ${formatTime(totalSeconds)}`;
            timeDisplay.dataset.totalSeconds = totalSeconds;
        }, 1000);
        
        studyTimers.set(index, { interval, startTime });
        button.textContent = 'Stop';
        button.classList.add('stop');
    }
}

function deleteStudyItem(index) {
    // Stop timer if running
    if (studyTimers.has(index)) {
        clearInterval(studyTimers.get(index).interval);
        studyTimers.delete(index);
    }
    
    const studyItems = document.querySelectorAll('.study-item');
    if (studyItems[index]) {
        studyItems[index].remove();
        
        // Re-index remaining items
        document.querySelectorAll('.study-item').forEach((item, i) => {
            const timer = item.querySelector('.study-timer');
            const button = item.querySelector('.timer-btn');
            const deleteBtn = item.querySelector('.study-delete');
            
            timer.id = `timer-${i}`;
            button.id = `btn-${i}`;
            button.setAttribute('onclick', `toggleTimer(${i})`);
            deleteBtn.setAttribute('onclick', `deleteStudyItem(${i})`);
        });
        
        // Auto-save after deletion
        if (currentUser) {
            setTimeout(() => {
                saveDataToFirestore();
            }, 100);
        }
    }
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

// Make functions globally available
window.addNewStudyItem = addNewStudyItem;
window.toggleTimer = toggleTimer;
window.deleteStudyItem = deleteStudyItem;