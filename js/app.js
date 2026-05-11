// =============================================================================
// TODAY'S PLAN — app.js
// =============================================================================
// This is the entire brain of the app. It handles:
//   1. Building the page layout (schedule rows, task rows, etc.)
//   2. Authentication (sign in, sign up, forgot password, sign out)
//   3. Saving and loading data to/from Firebase (the cloud database)
//   4. Auto-saving whenever you type anything
//   5. Rolling tasks forward to tomorrow
//   6. Study timers
//   7. Dark mode
// =============================================================================

// These console.log lines were used for debugging during development.
// They print messages to the browser DevTools console so you can see
// what's loading and in what order.
console.log('APP.JS LOADING');


// =============================================================================
// IMPORTS
// =============================================================================
// ES Modules — JavaScript's way of pulling in code from other files or packages.
// Instead of one giant file, we import only what we need from each library.

// Our own Firebase config file (reads from environment variables, no keys in code)
import { firebaseConfig } from './firebase-config.js';

// Firebase core — initializes the connection to your Firebase project
import { initializeApp } from 'firebase/app';

// Firebase Auth — handles sign in, sign up, sign out, password reset
// We rename 'signOut' to 'firebaseSignOut' to avoid naming conflicts with
// our own signOut function defined later
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut, sendPasswordResetEmail } from 'firebase/auth';

// Firebase Firestore — the cloud database
// doc = reference to a specific document
// setDoc = write/overwrite a document
// getDoc = read a document once
// onSnapshot = listen for real-time changes to a document
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

console.log('IMPORTING FIREBASE MODULES');


// =============================================================================
// FIREBASE INITIALIZATION
// =============================================================================
// Connect to Firebase using the config values from firebase-config.js
// These three lines set up the three Firebase services we use:

const app = initializeApp(firebaseConfig);  // Core Firebase connection
const auth = getAuth(app);                  // Authentication service
const db = getFirestore(app);               // Firestore database service


// =============================================================================
// GLOBAL STATE
// =============================================================================
// These variables track the app's current state. They're defined outside
// any function so every function can read and update them.

// Days array used to map checkbox IDs to day names
const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

// Stores the currently signed-in user object (null if not signed in)
let currentUser = null;

// Stores the function that stops listening to Firestore updates.
// We need this so we can stop listening when the user signs out.
let unsubscribeFromData = null;

// Tracks whether the auth form is in "sign in" or "sign up" mode
let isSigningUp = false;

// Tracks whether dark mode is on or off
let isDarkMode = false;

// Tracks active study timers. Map = key-value store. Key = timer index, Value = timer info
const studyTimers = new Map();


// =============================================================================
// INITIALIZATION
// =============================================================================
// init() runs once when the page first loads. It sets up the entire UI.

function init() {
    // Set the date input to today's date using ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('dateInput');
    if (dateInput) dateInput.value = today;

    // Check today's day of week checkbox automatically
    const todayDay = days[new Date().getDay()]; // getDay() returns 0=Sun, 1=Mon, etc.
    const todayElement = document.getElementById(todayDay);
    if (todayElement) todayElement.checked = true;

    // Build the dynamic sections of the UI
    createScheduleRows();  // Creates 17 schedule time slot inputs
    createTaskRows();      // Creates 8 task checkbox + text pairs
    createIdeasList();     // Initializes empty ideas list (populated from Firebase)

    // Set up event listeners and UI behavior
    setupAuthUI();        // Wires up sign in/up/out buttons
    setupThemeToggle();   // Wires up the dark mode button
    loadThemePreference();// Loads saved theme from localStorage

    // Make certain functions available globally so HTML onclick="" attributes can call them.
    // Normally JS module functions aren't accessible from HTML — this fixes that.
    window.addNewStudyItem = addNewStudyItem;
    window.toggleTimer = toggleTimer;
    window.deleteStudyItem = deleteStudyItem;
    window.addNewIdea = addNewIdea;
}


// =============================================================================
// UI BUILDERS
// =============================================================================
// These functions build parts of the page dynamically using JavaScript
// instead of writing them statically in HTML. This makes them easier
// to populate from saved data later.

function createScheduleRows() {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = ''; // Clear any existing content

    // Create 17 time slot rows (roughly 6am to 10pm)
    for (let i = 0; i < 17; i++) {
        const row = document.createElement('div');
        row.className = 'schedule-row';
        // Each row has a dot (styled as a timeline marker) and a text input
        row.innerHTML = `<div class="time-dot"></div><input type="text" class="schedule-input" id="schedule${i}" placeholder="">`;
        scheduleList.appendChild(row);
    }
}

function createTaskRows() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';

    // Create 8 task rows, each with a checkbox and a text input
    for (let i = 0; i < 8; i++) {
        const task = document.createElement('div');
        task.className = 'task-item';
        task.innerHTML = `<input type="checkbox" class="task-checkbox" id="task${i}"><input type="text" class="task-input" id="taskInput${i}" placeholder="">`;
        tasksList.appendChild(task);
    }
}

function createIdeasList() {
    // Just clears the list — ideas are populated later when data loads from Firebase
    const ideasList = document.getElementById('ideasList');
    ideasList.innerHTML = '';
}


// =============================================================================
// AUTHENTICATION UI
// =============================================================================
// Wires up all the auth-related buttons and links

function setupAuthUI() {
    const authSubmit = document.getElementById('authSubmit');
    const authToggleLink = document.getElementById('authToggleLink');

    // Safety check — if the auth elements don't exist, stop here
    if (!authSubmit || !authToggleLink) return;

    // Sign In / Sign Up button
    authSubmit.addEventListener('click', handleAuthSubmit);

    // Forgot Password link — sends a reset email via Firebase
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
        forgotLink.addEventListener('click', async () => {
            const email = document.getElementById('authEmail').value;

            // Can't send reset email without knowing the address
            if (!email) {
                showMessage('Enter your email above first', 'error');
                return;
            }

            try {
                // Firebase sends the reset email — we don't handle this ourselves
                await sendPasswordResetEmail(auth, email);
                showMessage('Password reset email sent — check your inbox', 'success');
            } catch (error) {
                // Log the full error for debugging, show a friendly message to the user
                console.error('Password reset error:', error);
                showMessage('Could not send reset email: ' + error.message, 'error');
            }
        });
    }

    // Toggle between Sign In and Sign Up modes
    authToggleLink.addEventListener('click', () => {
        isSigningUp = !isSigningUp; // Flip the boolean

        if (isSigningUp) {
            // Switch UI to "Create Account" mode
            document.getElementById('authTitle').textContent = 'Create Account';
            document.getElementById('authSubmit').textContent = 'Sign Up';
            document.getElementById('authToggleText').textContent = 'Already have an account?';
            document.getElementById('authToggleLink').textContent = 'Sign in';
        } else {
            // Switch UI back to "Sign In" mode
            document.getElementById('authTitle').textContent = 'Sign in to sync across devices';
            document.getElementById('authSubmit').textContent = 'Sign In';
            document.getElementById('authToggleText').textContent = "Don't have an account?";
            document.getElementById('authToggleLink').textContent = 'Sign up';
        }
    });

    // Allow pressing Enter in the password field to submit
    document.getElementById('authPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAuthSubmit();
    });
}

// Handles the actual sign in or sign up when the button is clicked
async function handleAuthSubmit() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    if (!email || !password) {
        showMessage('Please enter email and password', 'error');
        return;
    }

    try {
        if (isSigningUp) {
            // Create a new account — Firebase stores the credentials
            await createUserWithEmailAndPassword(auth, email, password);
        } else {
            // Sign in to an existing account
            await signInWithEmailAndPassword(auth, email, password);
        }
        // If successful, onAuthStateChanged (below) fires automatically
    } catch (error) {
        // Map Firebase error codes to human-readable messages
        let message = 'Authentication failed';
        if (error.code === 'auth/email-already-in-use') message = 'Email already in use';
        else if (error.code === 'auth/invalid-email') message = 'Invalid email';
        else if (error.code === 'auth/weak-password') message = 'Password too weak (min 6 characters)';
        else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') message = 'Invalid email or password';
        showMessage(message, 'error');
    }
}


// =============================================================================
// AUTH STATE LISTENER
// =============================================================================
// onAuthStateChanged fires automatically whenever the user's sign-in state changes.
// This is Firebase's way of telling us "someone just signed in" or "someone just signed out."
// It also fires once when the page first loads, so we always know the current state.

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUser = user;

        // Hide the login form
        document.getElementById('authSection').classList.add('hidden');

        // Show who's signed in on the status bar
        document.getElementById('statusIndicator').textContent = `Signed in as ${user.email}`;
        document.getElementById('statusIndicator').classList.add('synced');

        // Load their saved theme from Firestore (so dark mode persists across devices)
        loadThemeFromFirestore(user.uid);

        // Start listening to their saved data in Firestore
        listenToUserData(user.uid);

        // Start auto-saving whenever they type
        setupAutoSave();
    } else {
        // User is signed out
        currentUser = null;

        // Show the login form
        document.getElementById('authSection').classList.remove('hidden');

        // Reset the status indicator
        document.getElementById('statusIndicator').textContent = 'Not connected';
        document.getElementById('statusIndicator').classList.remove('synced', 'syncing');

        // Stop listening to Firestore — no point syncing if no one is logged in
        if (unsubscribeFromData) {
            unsubscribeFromData(); // Calling this function cancels the listener
            unsubscribeFromData = null;
        }
    }
});


// =============================================================================
// THEME (DARK MODE)
// =============================================================================

function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme(isDarkMode);
    saveThemePreference(isDarkMode); // Save to both localStorage and Firestore
}

function applyTheme(darkMode) {
    const body = document.body;
    const toggle = document.getElementById('themeToggle');

    if (darkMode) {
        body.classList.add('dark-mode');   // CSS handles the actual color changes
        if (toggle) toggle.textContent = '☀️'; // Switch icon to sun
    } else {
        body.classList.remove('dark-mode');
        if (toggle) toggle.textContent = '🌙'; // Switch icon to moon
    }
}

// Save theme to localStorage (instant, works offline) AND Firestore (syncs across devices)
async function saveThemePreference(darkMode) {
    localStorage.setItem('darkMode', darkMode);

    if (currentUser) {
        try {
            // Store in a 'settings/preferences' document under the user's ID
            const docRef = doc(db, 'users', currentUser.uid, 'settings', 'preferences');
            await setDoc(docRef, { darkMode }, { merge: true }); // merge:true won't overwrite other settings
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    }
}

// Load theme preference when the page first loads (before Firebase connects)
function loadThemePreference() {
    const savedTheme = localStorage.getItem('darkMode');

    if (savedTheme !== null) {
        // Use the locally saved preference
        isDarkMode = savedTheme === 'true'; // localStorage stores strings, not booleans
        applyTheme(isDarkMode);
    } else {
        // No saved preference — use the OS preference (system dark mode setting)
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode = prefersDark;
        applyTheme(isDarkMode);
    }
}

// Load theme from Firestore after sign-in (overrides localStorage if different)
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


// =============================================================================
// FIRESTORE DATA SYNC
// =============================================================================
// This is where the real-time sync magic happens.

// Start listening to the user's planner document in Firestore.
// onSnapshot fires immediately with current data, then fires again
// every time the data changes (from any device).
function listenToUserData(userId) {
    // Path in Firestore: users/{userId}/planner/current
    const docRef = doc(db, 'users', userId, 'planner', 'current');

    // onSnapshot returns a function that, when called, stops the listener.
    // We store it in unsubscribeFromData so we can stop it on sign-out.
    unsubscribeFromData = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            // Document exists — load the data into the UI
            const data = docSnap.data();
            loadDataFromFirestore(data);
            updateStatus('synced');
        } else {
            // No document yet — this is a new user, save an empty document
            saveDataToFirestore();
        }
    }, (error) => {
        console.error('Error listening to data:', error);
        updateStatus('error');
    });
}

// Takes data from Firestore and populates all the form fields on the page
function loadDataFromFirestore(data) {
    // Temporarily stop auto-save listeners while we populate the form.
    // Without this, filling in fields would trigger saves which would trigger
    // more loads — an infinite loop.
    document.removeEventListener('input', handleAutoSave);
    document.removeEventListener('change', handleAutoSave);

    try {
        // Date input
        if (data.date) document.getElementById('dateInput').value = data.date;

        // Day of week checkboxes
        if (data.days) {
            days.forEach(day => {
                document.getElementById(day).checked = data.days[day] || false;
            });
        }

        // Schedule slots (array of 17 strings)
        if (data.schedule) {
            data.schedule.forEach((text, i) => {
                const el = document.getElementById(`schedule${i}`);
                if (el) el.value = text || '';
            });
        }

        // Priority inputs (array of 3 strings)
        if (data.priorities) {
            data.priorities.forEach((text, i) => {
                const el = document.getElementById(`priority${i + 1}`);
                if (el) el.value = text || '';
            });
        }

        // Tasks (array of {checked, text} objects)
        if (data.tasks) {
            data.tasks.forEach((task, i) => {
                const checkEl = document.getElementById(`task${i}`);
                const textEl = document.getElementById(`taskInput${i}`);
                if (checkEl) checkEl.checked = task.checked || false;
                if (textEl) textEl.value = task.text || '';
            });
        }

        // Notes textarea
        if (data.notes) document.getElementById('notes').value = data.notes;

        // Ideas list (dynamically rendered)
        if (data.ideas) renderIdeas(data.ideas);

        // Study items (dynamically rendered)
        if (data.studyItems) renderStudyItems(data.studyItems);

        // Water tracker checkboxes (array of 8 booleans)
        if (data.water) {
            data.water.forEach((checked, i) => {
                const el = document.getElementById(`water${i + 1}`);
                if (el) el.checked = checked || false;
            });
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }

    // Re-attach auto-save listeners after a short delay
    // The delay ensures all the field values are settled before we start listening
    setTimeout(() => {
        document.addEventListener('input', handleAutoSave);
        document.addEventListener('change', handleAutoSave);
    }, 100);
}

// Reads all form fields and saves them as a single document to Firestore
async function saveDataToFirestore() {
    if (!currentUser) return; // Can't save if not signed in

    updateStatus('syncing');

    // Build the data object by reading every field from the DOM
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
        lastUpdated: new Date().toISOString() // Timestamp for debugging
    };

    // Day checkboxes → { sun: false, mon: true, ... }
    days.forEach(day => {
        data.days[day] = document.getElementById(day).checked;
    });

    // Schedule inputs → ['meeting at 9', '', 'lunch', ...]
    for (let i = 0; i < 17; i++) {
        data.schedule.push(document.getElementById(`schedule${i}`).value);
    }

    // Priority inputs → ['finish report', 'call dentist', '']
    for (let i = 1; i <= 3; i++) {
        data.priorities.push(document.getElementById(`priority${i}`).value);
    }

    // Tasks → [{ checked: true, text: 'buy groceries' }, ...]
    for (let i = 0; i < 8; i++) {
        data.tasks.push({
            checked: document.getElementById(`task${i}`).checked,
            text: document.getElementById(`taskInput${i}`).value
        });
    }

    // Ideas — collected from dynamically created elements (not fixed IDs)
    const ideaInputs = document.querySelectorAll('.idea-input');
    ideaInputs.forEach(input => {
        if (input.value.trim()) { // Only save non-empty ideas
            data.ideas.push(input.value.trim());
        }
    });

    // Study items — subject + total accumulated time
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

    // Water checkboxes → [true, false, true, ...]
    for (let i = 1; i <= 8; i++) {
        data.water.push(document.getElementById(`water${i}`).checked);
    }

    try {
        const docRef = doc(db, 'users', currentUser.uid, 'planner', 'current');
        // merge: true means we update only the fields we send, not wipe the whole document
        await setDoc(docRef, data, { merge: true });
        updateStatus('synced');
    } catch (error) {
        console.error('Error saving data:', error);
        updateStatus('error');
    }
}


// =============================================================================
// AUTO-SAVE
// =============================================================================
// Instead of making the user click a Save button, we watch for any input
// and save automatically after 1 second of inactivity (debouncing).

let saveTimeout; // Stores the pending timeout so we can cancel and restart it

// Called every time the user types or changes anything
function handleAutoSave() {
    updateStatus('syncing'); // Show "Syncing..." immediately for responsiveness
    clearTimeout(saveTimeout); // Cancel the previous timer if still counting

    // Start a new 1-second timer — if nothing else changes, save after 1 second
    // This prevents saving on every single keystroke
    saveTimeout = setTimeout(() => {
        saveDataToFirestore();
    }, 1000);
}

// Attach the auto-save listener to the whole document
// 'input' fires when text changes, 'change' fires when checkboxes toggle
function setupAutoSave() {
    document.addEventListener('input', handleAutoSave);
    document.addEventListener('change', handleAutoSave);
}


// =============================================================================
// STATUS INDICATOR
// =============================================================================
// Updates the small status bar at the top of the page

function updateStatus(status) {
    const indicator = document.getElementById('statusIndicator');
    indicator.classList.remove('synced', 'syncing'); // Reset classes

    if (status === 'synced') {
        indicator.textContent = '✓ Synced';
        indicator.classList.add('synced'); // CSS makes this green
    } else if (status === 'syncing') {
        indicator.textContent = 'Syncing...';
        indicator.classList.add('syncing'); // CSS makes this yellow/amber
    } else if (status === 'error') {
        indicator.textContent = '⚠ Sync error'; // CSS makes this red
    }
}


// =============================================================================
// ROLL TO TOMORROW
// =============================================================================
// Moves incomplete tasks and priorities to tomorrow, clears completed ones.
// window. prefix makes this callable from the onclick="" in index.html

window.rollForward = async function() {
    if (!showConfirm('This will:\n• Move unchecked tasks to tomorrow\n• Clear completed items\n• Reset the date to tomorrow\n\nContinue?')) return;

    // Collect incomplete priorities (no checkbox — all roll forward if not empty)
    const incompletePriorities = [];
    for (let i = 1; i <= 3; i++) {
        const val = document.getElementById(`priority${i}`).value.trim();
        if (val) incompletePriorities.push(val);
    }

    // Collect only unchecked tasks
    const incompleteTasks = [];
    for (let i = 0; i < 8; i++) {
        const checked = document.getElementById(`task${i}`).checked;
        const val = document.getElementById(`taskInput${i}`).value.trim();
        if (val && !checked) incompleteTasks.push(val); // Only if not checked off
    }

    // Collect all ideas (they always roll forward)
    const allIdeas = [];
    const ideaInputs = document.querySelectorAll('.idea-input');
    ideaInputs.forEach(input => {
        if (input.value.trim()) allIdeas.push(input.value.trim());
    });

    // Clear everything
    clearAll(false); // false = don't ask for confirmation again

    // Set date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    document.getElementById('dateInput').value = tomorrowStr;

    // Check tomorrow's day of week
    const tomorrowDay = days[tomorrow.getDay()];
    document.getElementById(tomorrowDay).checked = true;

    // Fill in carried-over priorities (max 3)
    for (let i = 0; i < Math.min(incompletePriorities.length, 3); i++) {
        document.getElementById(`priority${i + 1}`).value = incompletePriorities[i];
    }

    // Fill in carried-over tasks (max 8)
    for (let i = 0; i < Math.min(incompleteTasks.length, 8); i++) {
        document.getElementById(`taskInput${i}`).value = incompleteTasks[i];
    }

    // Restore all ideas
    renderIdeas(allIdeas);

    // If there were more items than slots, dump the overflow into notes
    const overflow = [...incompletePriorities.slice(3), ...incompleteTasks.slice(8)];
    if (overflow.length > 0) {
        document.getElementById('notes').value = 'Carried over from yesterday:\n' + overflow.map(item => '• ' + item).join('\n');
    }

    // Save the new day's data to Firestore
    if (currentUser) await saveDataToFirestore();
};


// =============================================================================
// CLEAR ALL
// =============================================================================

window.clearAll = async function(askConfirm = true) {
    if (askConfirm && !showConfirm('Are you sure you want to clear all entries?')) return;

    // Clear all text inputs and textareas
    document.querySelectorAll('input[type="text"], textarea').forEach(el => el.value = '');

    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);

    if (askConfirm) {
        // Reset date to today (only when manually clearing, not when rolling forward)
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateInput').value = today;
        const todayDay = days[new Date().getDay()];
        document.getElementById(todayDay).checked = true;
    }

    if (currentUser) await saveDataToFirestore();
};


// =============================================================================
// SIGN OUT
// =============================================================================

window.signOut = async function() {
    if (showConfirm('Sign out? Your data is saved and will sync when you sign back in.')) {
        try {
            await firebaseSignOut(auth);
            // onAuthStateChanged will fire automatically and update the UI
        } catch (error) {
            showMessage('Error signing out', 'error');
        }
    }
};


// =============================================================================
// STARTUP
// =============================================================================
// Run init() when the DOM is ready.
// If the DOM is already loaded (readyState != 'loading'), run immediately.
// Otherwise wait for DOMContentLoaded event.

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Shows a temporary toast notification in the top-right corner
// type = 'error' (red) or 'success' (green)
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
    setTimeout(() => messageDiv.remove(), 3000); // Auto-remove after 3 seconds
}

// Wrapper around browser's built-in confirm() dialog
// Returns true if user clicks OK, false if they click Cancel
function showConfirm(message) {
    return confirm(message);
}


// =============================================================================
// IDEAS
// =============================================================================
// Ideas are stored as a simple array of strings in Firestore.
// The UI is built dynamically — there are no fixed HTML elements for ideas.

// Rebuilds the ideas list from an array of strings
function renderIdeas(ideas) {
    const ideasList = document.getElementById('ideasList');
    ideasList.innerHTML = ''; // Clear existing ideas

    ideas.forEach((idea, index) => {
        const ideaItem = document.createElement('div');
        ideaItem.className = 'idea-item';
        ideaItem.innerHTML = `
            <textarea class="idea-input" placeholder="Enter your idea..." rows="1">${idea}</textarea>
            <button class="idea-delete" onclick="deleteIdea(this)" title="Delete idea">×</button>
        `;
        ideasList.appendChild(ideaItem);

        // Auto-resize the textarea to fit its content
        const textarea = ideaItem.querySelector('.idea-input');
        textarea.addEventListener('input', autoResizeTextarea);
        autoResizeTextarea.call(textarea); // Run immediately to size it correctly
    });
}

// Adds a new empty idea input when the "+ Add Idea" button is clicked
function addNewIdea() {
    const ideasList = document.getElementById('ideasList');
    const ideaItem = document.createElement('div');
    ideaItem.className = 'idea-item';

    ideaItem.innerHTML = `
        <textarea class="idea-input" placeholder="Enter your idea..." rows="1"></textarea>
        <button class="idea-delete" onclick="deleteIdea(this)" title="Delete idea">×</button>
    `;

    ideasList.appendChild(ideaItem);

    // Focus the new input so the user can start typing immediately
    const textarea = ideaItem.querySelector('.idea-input');
    textarea.focus();
    textarea.addEventListener('input', autoResizeTextarea);

    // Save after a short delay so Firebase has the new empty slot
    if (currentUser) {
        setTimeout(() => saveDataToFirestore(), 500);
    }
}

// Auto-resize a textarea to fit its content (no fixed height, grows as you type)
function autoResizeTextarea() {
    this.style.height = 'auto';
    this.style.height = Math.max(this.scrollHeight, 60) + 'px';
}

// Make addNewIdea available globally (called from HTML onclick)
window.addNewIdea = addNewIdea;

// Delete an idea — uses the button element to find and remove its parent
window.deleteIdea = function(element) {
    element.closest('.idea-item').remove();

    if (currentUser) {
        setTimeout(() => saveDataToFirestore(), 100);
    }
};


// =============================================================================
// STUDY TIMERS
// =============================================================================
// Study items have a subject name and a running timer that tracks total study time.
// Multiple timers can run simultaneously.

// Renders study items from saved data (subject + previously accumulated time)
function renderStudyItems(items) {
    const studyList = document.getElementById('studyList');
    studyList.innerHTML = '';

    items.forEach((item, index) => {
        const studyItem = document.createElement('div');
        studyItem.className = 'study-item';
        const formattedTime = formatTime(item.totalTime || 0);
        studyItem.innerHTML = `
            <div class="study-header">
                <input type="text" class="study-input" placeholder="Subject to study..." value="${item.subject || ''}">
                <div class="study-controls">
                    <div class="study-timer" id="timer-${index}">00:00</div>
                    <button class="timer-btn" onclick="toggleTimer(${index})" id="btn-${index}">Start</button>
                    <button class="study-delete" onclick="deleteStudyItem(${index})" title="Delete study item">×</button>
                </div>
            </div>
            <div class="study-time-display" data-total-seconds="${item.totalTime || 0}">
                Total time: ${formattedTime}
            </div>
        `;
        studyList.appendChild(studyItem);
    });
}

// Adds a new empty study item
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
    studyItem.querySelector('.study-input').focus();

    if (currentUser) {
        setTimeout(() => saveDataToFirestore(), 500);
    }
}

// Start or stop a specific timer by its index
function toggleTimer(index) {
    const timerDisplay = document.getElementById(`timer-${index}`);
    const button = document.getElementById(`btn-${index}`);
    const timeDisplay = document.querySelector(`#studyList .study-item:nth-child(${index + 1}) .study-time-display`);

    if (studyTimers.has(index)) {
        // Timer is running — stop it
        clearInterval(studyTimers.get(index).interval);
        studyTimers.delete(index);
        button.textContent = 'Start';
        button.classList.remove('stop');

        if (currentUser) {
            setTimeout(() => saveDataToFirestore(), 100);
        }
    } else {
        // Timer is stopped — start it
        const startTime = Date.now();
        const currentSeconds = parseInt(timeDisplay.dataset.totalSeconds || '0');

        // setInterval runs the callback every 1000ms (1 second)
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const totalSeconds = currentSeconds + elapsed;

            // Update the live timer display (shows current session time)
            timerDisplay.textContent = formatTime(elapsed);

            // Update the total time display (session + all previous sessions)
            timeDisplay.textContent = `Total time: ${formatTime(totalSeconds)}`;
            timeDisplay.dataset.totalSeconds = totalSeconds; // Store for saving
        }, 1000);

        // Store the interval reference so we can stop it later
        studyTimers.set(index, { interval, startTime });
        button.textContent = 'Stop';
        button.classList.add('stop');
    }
}

// Remove a study item and stop its timer if running
function deleteStudyItem(index) {
    if (studyTimers.has(index)) {
        clearInterval(studyTimers.get(index).interval);
        studyTimers.delete(index);
    }

    const studyItems = document.querySelectorAll('.study-item');
    if (studyItems[index]) {
        studyItems[index].remove();

        // Re-index remaining items so their onclick references stay correct
        document.querySelectorAll('.study-item').forEach((item, i) => {
            const timer = item.querySelector('.study-timer');
            const button = item.querySelector('.timer-btn');
            const deleteBtn = item.querySelector('.study-delete');

            timer.id = `timer-${i}`;
            button.id = `btn-${i}`;
            button.setAttribute('onclick', `toggleTimer(${i})`);
            deleteBtn.setAttribute('onclick', `deleteStudyItem(${i})`);
        });

        if (currentUser) {
            setTimeout(() => saveDataToFirestore(), 100);
        }
    }
}

// Converts a number of seconds to a human-readable string
// Examples: 3661 → "1h 1m", 125 → "2m 5s", 45 → "45s"
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

// Make timer functions globally available
window.addNewStudyItem = addNewStudyItem;
window.toggleTimer = toggleTimer;
window.deleteStudyItem = deleteStudyItem;
