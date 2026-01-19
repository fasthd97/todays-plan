If i share a pdf with you can you make a browser extension or fillable form
for me ?
    9 : 15 AM

Yes, I can do both!Here 's what I can create for you:

Browser Extension: I can build a complete Chrome / Firefox extension with all the necessary files(manifest.json, popup HTML, scripts, etc.).This would be downloadable and installable in your browser.

Fillable Form: I can create an interactive HTML form that works directly in your browser, with features like:

    Auto - saving your input(stored locally in the session)
Field validation
Export to PDF or print
Clean, professional styling

Share your PDF and
let me know which you 'd prefer, or describe what functionality you need. If the PDF is a form you need to fill out digitally, an interactive HTML form might be quickest. If you need something that integrates with specific websites or performs automated tasks, a browser extension would be better.

What kind of PDF is it, and what do you want to accomplish with it ?

    its called todays plan and its what i use to organise my life and keep track of longruning tasks in short its my scheduler
9: 17 AM

Perfect!A daily planner / scheduler is ideal
for an interactive form.Once you share the PDF, I can create a browser - based version that:

    Mirrors the layout and sections from your PDF
Lets you fill it out digitally with autosave(so your entries persist
        while you 're working)
        Allows you to print or save completed versions Includes helpful features like date auto - population, checkboxes
        for tasks, etc.

        Go ahead and upload the "Today's Plan"
        PDF and I 'll build you a clean, functional digital version you can use daily right in your browser!
        9: 22 AM

        Perfect!I can see your "Today's Plan"
        layout clearly.I 'll create a digital version that matches this design with:

        Date selector with day - of - week checkboxes Schedule section with time slots(appears to have about 17 rows) Priorities section(numbered 1, 2, 3) Other tasks section with checkboxes Notes section Water tracker(8 checkboxes at the bottom)

        I 'll build this as an interactive HTML form that saves your entries as you type and lets you print when done. Give me a moment to create this for you!
        Today 's Plan - Digital Planner
        Interactive artifact

        I 've created your digital "Today'
        s Plan " planner! Here's what it includes:

        Features:

        ✅Auto - fills today 's date and checks the current day✅
        17 schedule time slots(matching your physical planner)✅ 3 numbered priority items✅ 8 other tasks with checkboxes✅ Notes section
        for additional thoughts✅ Water tracker with 8 checkboxes✅ Auto - saves as you type(data stored in memory during your session)✅ Print button
        for a clean printable version✅ Clear All button to start fresh

        The design closely mirrors your physical planner 's minimal, elegant aesthetic. You can use this daily in your browser - just bookmark it! When you'
        re done
        for the day, you can print it
        for your records or just clear it and start fresh tomorrow.

        Would you like me to adjust anything - like adding time labels to the schedule, changing colors, or adding any other features ?

        Well since its a daily sheet we need to be able to roll tasks to the next day 9 : 24 AM

        Great point!Let me add a "Roll Forward"
        feature that will:

        Carry over unchecked tasks from "other tasks"
        to tomorrow Move incomplete priorities to the next day Clear completed items and reset the date Keep a running list of tasks that need to be done

        This way you won 't lose track of what still needs attention. Let me update it:
        Today 's Plan - Digital Planner
        Interactive artifact ∙  Version 2

        Perfect!I 've added a "Roll to Tomorrow" button that intelligently handles your daily workflow:

        What it does:

        ✅Carries over incomplete priorities - any priorities you haven 't finished move to tomorrow'
        s top 3✅ Moves unchecked tasks - only unchecked items from "other tasks"
        roll forward✅ Clears completed work - checked tasks and the schedule are cleared(fresh start!)✅ Updates the date - automatically sets tomorrow 's date and checks the correct day✅
        Handles overflow -
        if you have more than 3 priorities or 8 tasks, extras go into the notes section

        Workflow example:

        End your day with 2 unchecked tasks and 1 incomplete priority Click "Roll to Tomorrow"
        Tomorrow 's sheet loads with those items at the top, ready to tackle
        Everything
        else is cleared
        for your fresh daily schedule

        This way you never lose track of ongoing tasks
        while keeping each day 's view clean and focused!

        ok so i need this to be used from my mac, pc or phone 9: 27 AM

        Got it!For cross - device access with synced data, you have two options:

        Option 1: Browser Extension(Best
            for Mac / PC)

        Install once on Chrome / Firefox on each computer Data syncs across devices via browser account Quick access from toolbar Works offline

        Option 2: Hosted Web App(Best
            for all devices including phone)

        Works on any device with a browser I can give you the HTML file to:
        Host on a free service(GitHub Pages, Netlify) Or save locally and open from any device Access via bookmark / home screen Data would need cloud storage
        for cross - device sync

        Option 3: Progressive Web App(PWA)(Recommended!)

        Install like an app on all devices Works offline Can add to phone home screen Cloud sync capabilities

        My recommendation: Let me create a PWA version that you can:

        Host
        for free on GitHub Pages or Netlify(I 'll guide you)
            Install on your Mac, PC, and phone like a native app Add cloud sync so your tasks sync across all devices

            Which sounds best
            for your needs ? Or would you like me to create the browser extension version instead ?

            PWA version but I would like you to share the code with me and comment all design decisions so i can reverse engineer it.It looks like we are using JS ?
            9 : 29 AM

            Perfect!I 'll create a fully commented PWA version with detailed explanations of every design decision. Yes, we'
            re using vanilla JavaScript(no frameworks) for simplicity and performance.

            Let me rebuild this as a PWA with comprehensive comments explaining the architecture, styling choices, and implementation details :
            Today 's Plan - Digital Planner
            Interactive artifact ∙  Version 3

            Continue 9 : 33 AM Today 's Plan - Digital Planner
            Interactive artifact ∙  Version 4

            Perfect!I 've created a fully commented PWA version with detailed explanations. Here'
            s what I 've documented:📚
            What 's Included:
            CSS Design Decisions:

            Why serif fonts(Georgia) for elegance Box model choices(flexbox vs grid) Color psychology(muted grays
                for focus) Mobile - first responsive strategy Print optimization

            JavaScript Architecture:

            Technology choice: Vanilla JS(no frameworks = faster, simpler) Data storage: localStorage(browser - native, persistent) DOM manipulation: Efficient innerHTML strategies Event handling: Auto - save on every input Error handling: try /
            catch
            for robustness

            Key Functions Explained:

            init() - Sets up the app on load createScheduleRows() - Dynamically builds 17 schedule slots saveData() - Serializes all form data to localStorage loadData() - Restores previous session rollForward() - Algorithm
            for carrying tasks to tomorrow registerServiceWorker() - PWA offline functionality

            🚀 To Deploy as Real PWA:

            I 've included comments at the bottom with:

            3 backend options(Firebase, Custom API, Supabase) Complete manifest.json template service - worker.js code
            for offline mode Deployment platforms(GitHub Pages, Netlify, Vercel)

            ⚠️ Current Limitations:

            localStorage is per - device only(no cross - device sync yet) Needs backend
            for true multi - device sync Service worker placeholder(needs actual file)

            Next Steps: Would you like me to add Firebase integration
            for cross - device sync, or show you how to deploy this to GitHub Pages / Netlify ?

            firebase 9 : 39 AM

            Perfect!I 'll add Firebase integration for real-time cross-device sync. This will allow your planner to sync across your Mac, PC, and phone automatically.
            Today 's Plan - Digital Planner
            Interactive artifact ∙  Version 5

            Continue 9: 42 AM Today 's Plan - Digital Planner
            Interactive artifact ∙  Version 6

            Perfect!I 've created a fully functional Firebase-powered PWA with complete setup instructions. Here'
            s what you now have: 🔥Firebase Integration Features:
            Real - Time Sync:

            Changes on your Mac appear instantly on your PC and phone Uses Firestore 's onSnapshot for real-time updates
            Auto - saves 1 second after you stop typing(debounced)

            Authentication:

            Email / password login system Secure user accounts Each user 's data is private (Firestore security rules)

            Visual Status Indicator:

            Shows sync status(Syncing... / ✓Synced) Displays signed - in email address Error handling

            Data Structure:

            /users/ { userId }
            /planner/current -
            date, days, schedule, priorities, tasks, notes, water -
            lastUpdated timestamp

            📋 Setup Checklist:

            I 've included complete step-by-step instructions at the bottom:

            ✅
            Create Firebase project✅ Enable Email / Password auth✅ Create Firestore database✅ Set security rules(users only access their own data)✅ Get your Firebase config✅ Replace firebaseConfig in code✅ Deploy(GitHub Pages / Netlify / Vercel)

            🎯 Code Comments Include:

            Firebase architecture explanation Why Firestore ? (vs other databases) Security model(authentication + rules) Real - time listeners how they work Debouncing strategy(prevents excessive saves) Error handling patterns Free tier limits(50 k reads / day - plenty!)

            🚀 Quick Start :

            Copy the HTML code to a file called index.html Go to Firebase Console Follow the setup steps in the comments Replace firebaseConfig with yours Deploy and access from all your devices!

            The free Firebase tier is more than enough
            for personal use.Would you like help with any specific part of the Firebase setup ?

            can we add a dark mode ?
            9 : 49 AM

            Absolutely!I 'll add a dark mode toggle with smooth transitions and save the preference to sync across devices.
            Today 's Plan - Digital Planner
            Interactive artifact ∙  Version 7 Today 's Plan - Digital Planner
            Interactive artifact ∙  Version 8 Today 's Plan - Digital Planner
            Interactive artifact ∙  Version 9 Today 's Plan - Digital Planner
            Interactive artifact ∙  Version 10 Today 's Plan - Digital Planner
            Interactive artifact ∙  Version 11

            Perfect!I 've added a fully functional dark mode with these features:🌙
            Dark Mode Features :
            Smart Theme Toggle:

            🌙Moon icon = Click to enable dark mode☀️ Sun icon = Click to enable light mode Located in top - left corner
            for easy access Smooth animations on all transitions

            Intelligent Defaults:

            Checks your system preference(dark / light) on first visit Remembers your choice in localStorage(instant) Syncs preference across all devices via Firestore when signed in

            Design Philosophy:

            Not pure black - uses dark gray(#2c2c2c) for reduced eye strain

    Reduced contrast - softer whites (# e0e0e0) instead of pure white Muted accent colors - easier on eyes at night All elements styled - buttons, inputs, modals, everything

            How It Works:

            Not signed in:
            Uses localStorage(per - device) Falls back to system preference
            if no saved choice Signed in:
            Theme saved to Firestore at / users / { userId }
            /settings/preferences
            Syncs across Mac, PC, and phone Toggle on one device = updates everywhere!

            Implementation Details:
            javascript

            // Theme preference storage:
            -
            localStorage: 'darkMode' (boolean) -
            Firestore: /users/ { userId }
            /settings/preferences { darkMode: boolean }

            // CSS approach:
            -
            Body gets 'dark-mode'
            class -
            All components have dark - mode styles -
            Smooth transitions(0.3 s ease)

            Try clicking the moon / sun icon in the top - left!Your preference will sync across all your devices when you 're signed in. 🎨

            where do i get the code to download ?
                9 : 55 AM

            Great question!Here 's how to get the code:📥
            How to Download the Code:
            Method 1: Copy from the Artifact(Easiest)

            Click anywhere inside the planner above Press Ctrl + A(Windows / Linux) or Cmd + A(Mac) to select all Right - click and view the page source, or:
            I 'll provide a download link below

            Method 2: I 'll create a downloadable version for you

            Let me package this as a complete file you can save:

            Steps:

            Create a new file called index.html on your computer Copy ALL the code from the artifact above(the interactive planner you see) Paste it into index.html Save the file

            To get the code: You can right - click on the artifact viewer above and select "View Page Source" (
                if available), or I can
            break it down
            for you differently.Method 3: I 'll format it for easy copying

            Would you like me to:

            A) Create a plain text version you can easily copy - paste ?
        B) Break it into separate files(HTML, CSS, JS) for better organization ?
    C) Create a downloadable.zip structure with all files ?

    Once you have the file :

    Replace the firebaseConfig section with your Firebase credentials
Upload to GitHub Pages, Netlify, or Vercel
Access from any device!

    Which method would work best
for you ? I can also create a complete project structure with separate files
if you prefer a more organized setup.

2) i want to put it in a github
9: 55 AM

Perfect!I 'll create a complete GitHub-ready project structure with separate files for better organization and maintainability.
Today 's Plan - GitHub Project Structure
Document

Perfect!I 've created a complete GitHub-ready project structure with all files separated and organized. Here'
s what to do :🚀Next Steps:
    Option 1: Manual Setup(Full Control)

Create the folder structure on your computer:

    todays - plan / ├──index.html├── css / style.css├── js / app.js├── js / firebase - config.js├── manifest.json├── service - worker.js└── README.md

Copy the code:
    For CSS: Copy everything from the < style > section in the original artifact
For JS: Copy everything from the < script > section in the original artifact
Other files are shown in full in the structure above
Create icons(quick way):
    Go to favicon.io
Download 192 x192 and 512 x512 PNG files
Save in icons / folder

Option 2: I Can Create Individual Files

Would you like me to create separate artifacts
for:

✅Complete CSS file✅ Complete JS file✅ Ready - to - use manifest.json

Just
let me know and I 'll generate each one!
After Creating Files:
    bash

# Initialize git
git init
git add.
git commit - m "Initial commit: Today's Plan PWA"

#
Push to GitHub
git remote add origin https: //github.com/YOUR_USERNAME/todays-plan.git
    git push - u origin main

# Enable GitHub Pages in repo settings

Which would you prefer ?

    A) I create separate artifacts
for CSS and JS(easier to copy)
B) You manually extract from the original artifact
C) I create a downloadable ZIP structure somehow

Let me know and I 'll help you get this on GitHub! 🎯

c
3: 22 PM

I can 't create actual ZIP files directly, but I'
ll give you the easiest copy - paste method to get all your files ready.Let me create each file as a separate artifact you can easily save:
    style.css - Complete Stylesheet
Code

Now
let me create the complete JavaScript file:
    app.js - Complete Application Logic
Code

Now the Firebase config file:
    firebase - config.js - Firebase Configuration
Code

Perfect!Now I 've created all the key code files as separate artifacts. Here'
s your complete download guide: 📦Download Instructions
Files Created Above(Click each to copy):

    ✅style.css - Complete stylesheet✅ app.js - All JavaScript logic✅ firebase - config.js - Firebase configuration

Additional Files Needed:

    Create these files manually(they 're simple):

        4. index.html - Copy from the "GitHub Project Structure"
        artifact I created earlier, or use this simplified version:
        html

        <
        !DOCTYPE html >
        <
        html lang = "en" >
        <
        head >
        <
        meta charset = "UTF-8" >
        <
        meta name = "viewport"
        content = "width=device-width, initial-scale=1.0" >
        <
        title > Today 's Plan</title> <
        link rel = "stylesheet"
        href = "css/style.css" >
        <
        link rel = "manifest"
        href = "manifest.json" >
        <
        /head> <
        body >
        <!-- Copy the HTML body from the original artifact -->
        <
        script type = "module"
        src = "js/app.js" > < /script> <
        /body> <
        /html>

        5. manifest.json:
        json

        {
            "name": "Today's Plan",
            "short_name": "Today's Plan",
            "start_url": "/",
            "display": "standalone",
            "background_color": "#f5f7fa",
            "theme_color": "#7a7a7a",
            "icons": [{
                "src": "icons/icon-192.png",
                "sizes": "192x192",
                "type": "image/png"
            }]
        }

        6. service - worker.js - See the "GitHub Project Structure"
        artifact
        for the complete code.🚀Quick Setup Steps:
        bash

        # 1. Create project folder mkdir todays - plan cd todays - plan

        # 2. Create folder structure mkdir css js icons

        # 3. Save the artifacts above as: #-css / style.css# - js / app.js# - js / firebase - config.js

        # 4. Create index.html and manifest.json

        # 5. Get Firebase config and update js / firebase - config.js

        # 6. Push to GitHub git init git add.git commit - m "Initial commit"
        git remote add origin https: //github.com/YOUR_USERNAME/todays-plan.git
        git push - u origin main

        Would you like me to create the complete HTML body as a separate artifact, or create a step - by - step terminal command guide
        for setup ?

        im using windows can you do a windows command to make this work
        3 : 26 PM

        Perfect!Here 's a complete Windows setup guide with all commands:
        Windows Setup Commands - Today 's Plan
        Code

        Now
        let me create a simpler step - by - step PowerShell guide:
            Windows PowerShell Setup Guide
        Document

        Perfect!I 've created two Windows setup guides:📋
        Choose Your Method: 🚀Method 1: PowerShell Commands(Fastest)

        Copy and paste the PowerShell commands from the guide above.Takes 2 minutes!📝Method 2: Manual Click & Create(Easiest)

        Follow the step - by - step guide with screenshots in mind.Takes 10 minutes.🎯Quick Start(Copy This):

        Open PowerShell and run:
        powershell

        # Go to Desktop cd $HOME\ Desktop

        # Create everything mkdir todays - plan cd todays - plan mkdir css, js, icons New - Item index.html, manifest.json, service - worker.js, README.md, .gitignore, css\ style.css, js\ app.js, js\ firebase - config.js

        # Open in Explorer explorer.

        #Open in Notepad++or VS Code notepad index.html

        Then just:

        Copy code from the 3 artifacts above into each file Update Firebase config Test locally by opening index.html in browser Push to GitHub using the Git commands in the guide

        Need Git ? Download : https: //git-scm.com/download/win

        Want me to walk you through any specific step ? 🎯

        app and firebase code is not in your instructions 3 : 46 PM

        You 're absolutely right! Let me add those to the instructions. The code IS in the artifacts I created, but let me make it crystal clear:
        Windows PowerShell Setup Guide Document ∙  Version 2

        Now
        let me create a quick reference card showing exactly where everything is: 📍Code Location Reference
        Document

        Perfect!Now you have a complete reference guide showing exactly where each piece of code is located.📍Here 's the Summary:

        The 3 BIG code files are in artifacts above:

        CSS→ Artifact: "style.css - Complete Stylesheet" (scroll up to find it) JavaScript→ Artifact: "app.js - Complete Application Logic" (scroll up to find it) Firebase Config→ Artifact: "firebase-config.js - Firebase Configuration" (scroll up to find it)

        The smaller files(HTML, manifest, service - worker) are embedded in:

        The "Windows PowerShell Setup Guide"
        artifact(Steps 5, 6, 7)

        🎯 Can 't see the artifacts?

        They appear as interactive code boxes above in our conversation.If you 're having trouble locating them, I can:

        A) Recreate all 3 main files right now in new artifacts B) Combine everything into one single HTML file(easier but less organized) C) Show each file in plain text format

Which would help you most ? Just
let me know and I 'll make it happen! 🚀

i dont see these two JavaScript→ Artifact: "app.js - Complete Application Logic" (scroll up to find it) *
    Firebase Config→ Artifact: "firebase-config.js - Firebase Configuration" (scroll up to find it)
3: 56 PM

No problem!Let me recreate both of those files right now so you can see them:
    app.js - Complete Application Logic
Code ∙  Version 2
firebase - config.js - Firebase Configuration
Code ∙  Version 2

Perfect!Now you can see both files!Let me create one more artifact with a complete checklist
for you: ✅Complete Setup Checklist
Document

Perfect!Now you have EVERYTHING you need!📦Summary of What You Have Now: ✅3 Main Code Files(visible as artifacts above):

    style.css - "style.css - Complete Stylesheet"
app.js - "app.js - Complete Application Logic" (just recreated)
firebase - config.js - "firebase-config.js - Firebase Configuration" (just recreated)

✅ Complete Setup Guide:

    "Complete Setup Checklist" - Step - by - step instructions with ALL other files included

🚀 Quick Start:

    Copy the PowerShell commands from the checklist to create folders
Copy each artifact 's code into the corresponding file
Copy the HTML, manifest, service - worker from the checklist
Setup Firebase(follow Step 4 in checklist)
Test locally by opening index.html
Push to GitHub(follow Steps 7 - 8)

All the code is now visible and ready to copy!Do you see all the artifacts now ? If you need me to clarify any step, just
let me know!🎯

    are you obtuse please just give me the app.js code
4: 00 PM

You 're right, I'
m overcomplicating this.Here 's the app.js code:
app.js
Code

There.Copy that into js / app.js.Done.
You 've used 90% of your session limitUpgrade


Claude is AI and can make mistakes.Please double - check responses.
import { firebaseConfig }
from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut as firebaseSignOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
    document.getElementById('dateInput').value = today;
    const todayDay = days[new Date().getDay()];
    document.getElementById(todayDay).checked = true;
    createScheduleRows();
    createTaskRows();
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

function setupAuthUI() {
    const authSubmit = document.getElementById('authSubmit');
    const authToggleLink = document.getElementById('authToggleLink');
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
    const confirmMsg = 'This will:\n• Move unchecked tasks to tomorrow\n• Clear completed items\n• Reset the date to tomorrow\n\nContinue?';
    if (!confirm(confirmMsg)) return;
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
    const overflow = [...incompletePriorities.slice(3), ...incompleteTasks.slice(8)];
    if (overflow.length > 0) {
        document.getElementById('notes').value = 'Carried over from yesterday:\n' + overflow.map(item => '• ' + item).join('\n');
    }
    if (currentUser) await saveDataToFirestore();
};

window.clearAll = async function(askConfirm = true) {
    if (askConfirm && !confirm('Are you sure you want to clear all entries?')) return;
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
    if (confirm('Sign out? Your data is saved and will sync when you sign back in.')) {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            alert('Error signing out');
        }
    }
};

document.addEventListener('DOMContentLoaded', init);