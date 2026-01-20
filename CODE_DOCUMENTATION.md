# Today's Plan - Complete Documentation

## 📋 Project Overview
**Today's Plan** is a modern daily planner web application with real-time Firebase synchronization, offline PWA capabilities, and cross-device theme syncing.

### ✨ Key Features
- 📅 **Daily Planning**: Schedule, priorities, tasks, notes, water tracking
- 🔄 **Real-time Sync**: Firebase Firestore integration
- 🔐 **Authentication**: Email/password with Firebase Auth
- 🌙 **Theme System**: Light/dark mode with device sync
- 📱 **PWA Ready**: Offline functionality, installable
- ⚡ **Auto-save**: Debounced saves every second
- 🔄 **Roll Forward**: Move incomplete tasks to tomorrow

---

## 🏗️ Architecture

### File Structure
```
todays-plan/
├── index.html              # Main HTML structure (UI layout)
├── css/
│   └── style.css          # Complete styling system
├── js/
│   ├── app.js             # Core application logic (380+ lines)
│   └── firebase-config.js # Firebase configuration
├── service-worker.js       # PWA offline caching
├── manifest.json          # PWA manifest (installable app)
├── CODE_DOCUMENTATION.md  # This documentation
├── README.md              # Project overview
├── .gitignore             # Git ignore rules
└── LICENSE                # MIT license
```

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Styling**: Modern CSS (Grid, Flexbox, Custom Properties)
- **PWA**: Service Worker, Web App Manifest
- **Hosting**: GitHub Pages compatible

---

## 🔧 Core Components

### 1. User Interface (index.html)
```html
<!-- Status indicator and theme toggle -->
<div class="status-indicator">Not connected</div>
<button class="theme-toggle">🌙</button>

<!-- Authentication modal -->
<div class="auth-section hidden">
  <!-- Email/password login form -->
</div>

<!-- Main planner interface -->
<div class="container">
  <!-- Date selection and day checkboxes -->
  <div class="header">
    <input type="date" id="dateInput">
    <div class="days"><!-- MON-SUN checkboxes --></div>
  </div>
  
  <!-- Three-column layout -->
  <div class="main-content">
    <div class="schedule-section">   <!-- 17 time slots -->
    <div class="priorities-section"> <!-- 3 priority items -->
    <div class="other-tasks-section"><!-- 8 task checkboxes -->
  </div>
  
  <!-- Notes and water tracking -->
  <textarea id="notes"></textarea>
  <div class="water-tracker"><!-- 8 water checkboxes --></div>
  
  <!-- Action buttons -->
  <div class="buttons">
    <button onclick="rollForward()">Roll to Tomorrow</button>
    <button onclick="clearAll()">Clear All</button>
    <button onclick="signOut()">Sign Out</button>
  </div>
</div>
```

### 2. Data Model
```javascript
// Firestore document structure: /users/{userId}/planner/current
{
  date: "2024-01-15",                    // Selected date (ISO format)
  days: {                               // Day selection checkboxes
    sun: false, mon: true, tue: false,
    wed: false, thu: false, fri: false, sat: false
  },
  schedule: [                           // 17 schedule time slots
    "9:00 AM - Team meeting",
    "10:30 AM - Code review",
    "", // Empty slots
    // ... 14 more slots
  ],
  priorities: [                         // 3 priority tasks
    "Complete project proposal",
    "Review quarterly reports", 
    "Call client about requirements"
  ],
  tasks: [                              // 8 general tasks
    { checked: false, text: "Buy groceries" },
    { checked: true, text: "Walk the dog" },
    { checked: false, text: "" }, // Empty task
    // ... 5 more tasks
  ],
  notes: "Meeting notes and reminders...", // Free-form text
  water: [                              // 8 water intake checkboxes
    true, true, false, false,           // 2 glasses consumed
    false, false, false, false
  ],
  lastUpdated: "2024-01-15T10:30:00Z"   // Timestamp for sync
}
```

### 3. Application Logic (app.js)

#### Core Variables
```javascript
const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
let currentUser = null;           // Firebase user object
let unsubscribeFromData = null;   // Firestore listener cleanup
let isSigningUp = false;          // Auth form state
let isDarkMode = false;           // Theme state
```

#### Initialization Flow
```javascript
function init() {
  // 1. Set today's date in date input
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dateInput').value = today;
  
  // 2. Check today's day checkbox
  const todayDay = days[new Date().getDay()];
  document.getElementById(todayDay).checked = true;
  
  // 3. Create dynamic UI elements
  createScheduleRows();  // 17 schedule inputs
  createTaskRows();      // 8 task checkboxes + inputs
  
  // 4. Setup event handlers
  setupAuthUI();         // Login/signup forms
  setupThemeToggle();    // Dark/light mode
  
  // 5. Load saved theme
  loadThemePreference(); // From localStorage or system
}
```

#### Authentication System
```javascript
// Firebase Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    // Hide auth form, show sync status
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('statusIndicator').textContent = `Signed in as ${user.email}`;
    
    // Start real-time data sync
    listenToUserData(user.uid);
    setupAutoSave();
  } else {
    currentUser = null;
    // Show auth form, stop sync
    document.getElementById('authSection').classList.remove('hidden');
    if (unsubscribeFromData) unsubscribeFromData();
  }
});

// Login/Signup handler
async function handleAuthSubmit() {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  
  try {
    if (isSigningUp) {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch (error) {
    // Show user-friendly error messages
    showMessage(getErrorMessage(error.code), 'error');
  }
}
```

#### Data Synchronization
```javascript
// Real-time Firestore listener
function listenToUserData(userId) {
  const docRef = doc(db, 'users', userId, 'planner', 'current');
  
  unsubscribeFromData = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      // Load data from Firestore and populate UI
      loadDataFromFirestore(docSnap.data());
      updateStatus('synced');
    } else {
      // First time user - save current UI state
      saveDataToFirestore();
    }
  });
}

// Auto-save with debouncing
let saveTimeout;
function handleAutoSave() {
  updateStatus('syncing');
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveDataToFirestore();
  }, 1000); // 1 second delay
}

// Save all form data to Firestore
async function saveDataToFirestore() {
  if (!currentUser) return;
  
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
  
  // Collect all form data
  days.forEach(day => {
    data.days[day] = document.getElementById(day).checked;
  });
  
  for (let i = 0; i < 17; i++) {
    data.schedule.push(document.getElementById(`schedule${i}`).value);
  }
  
  // ... collect priorities, tasks, water data
  
  try {
    const docRef = doc(db, 'users', currentUser.uid, 'planner', 'current');
    await setDoc(docRef, data, { merge: true });
    updateStatus('synced');
  } catch (error) {
    updateStatus('error');
  }
}
```

#### Theme System
```javascript
// Theme toggle with cross-device sync
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

// Save theme to both localStorage and Firestore
async function saveThemePreference(darkMode) {
  localStorage.setItem('darkMode', darkMode);
  
  if (currentUser) {
    const docRef = doc(db, 'users', currentUser.uid, 'settings', 'preferences');
    await setDoc(docRef, { darkMode }, { merge: true });
  }
}
```

#### Roll Forward Feature
```javascript
// Move incomplete tasks to tomorrow
window.rollForward = async function() {
  if (!showConfirm('Move unchecked tasks to tomorrow?')) return;
  
  // Collect incomplete priorities and tasks
  const incompletePriorities = [];
  const incompleteTasks = [];
  
  for (let i = 1; i <= 3; i++) {
    const val = document.getElementById(`priority${i}`).value.trim();
    if (val) incompletePriorities.push(val);
  }
  
  for (let i = 0; i < 8; i++) {
    const checked = document.getElementById(`task${i}`).checked;
    const val = document.getElementById(`taskInput${i}`).value.trim();
    if (val && !checked) incompleteTasks.push(val);
  }
  
  // Clear all current data
  clearAll(false);
  
  // Set tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('dateInput').value = tomorrow.toISOString().split('T')[0];
  
  // Repopulate with incomplete items
  incompletePriorities.forEach((item, i) => {
    if (i < 3) document.getElementById(`priority${i + 1}`).value = item;
  });
  
  incompleteTasks.forEach((item, i) => {
    if (i < 8) document.getElementById(`taskInput${i}`).value = item;
  });
  
  // Add overflow to notes
  const overflow = [...incompletePriorities.slice(3), ...incompleteTasks.slice(8)];
  if (overflow.length > 0) {
    document.getElementById('notes').value = 
      'Carried over from yesterday:\n' + overflow.map(item => '• ' + item).join('\n');
  }
  
  if (currentUser) await saveDataToFirestore();
};
```

---

## 🎨 Styling System (style.css)

### Design Principles
- **Mobile-first**: Responsive design starting from 320px
- **Modern CSS**: Grid, Flexbox, Custom Properties
- **Accessibility**: High contrast, keyboard navigation
- **Performance**: Hardware-accelerated animations

### Color Scheme
```css
:root {
  --primary: #333;
  --background: #f5f5f5;
  --text: #333;
  --border: #ddd;
  --accent: #007bff;
}

/* Dark mode overrides */
body.dark-mode {
  --background: #1a1a1a;
  --text: #e0e0e0;
  --border: #444;
}
```

### Layout System
```css
/* Main container */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Three-column grid */
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 30px;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
```

---

## 🔐 Security & Privacy

### Firebase Security Rules
```javascript
// Firestore rules (set in Firebase Console)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Data Protection
- **User Isolation**: Each user can only access their own data
- **Authentication Required**: All data operations require valid login
- **Input Sanitization**: Form data is cleaned before storage
- **Error Handling**: Sensitive errors are not exposed to users

---

## 📱 PWA Features

### Service Worker (service-worker.js)
```javascript
// Cache strategy for offline functionality
const CACHE_NAME = 'todays-plan-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/app.js',
  '/js/firebase-config.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### Web App Manifest (manifest.json)
```json
{
  "name": "Today's Plan",
  "short_name": "TodaysPlan",
  "description": "Daily planner with cloud sync",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f5f5f5",
  "theme_color": "#333333",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🚀 Performance Optimizations

### JavaScript Optimizations
- **Debounced Auto-save**: Prevents excessive Firebase writes
- **Event Delegation**: Efficient event handling
- **Lazy Loading**: Firebase modules loaded on demand
- **Memory Management**: Proper cleanup of listeners

### CSS Optimizations
- **Hardware Acceleration**: `transform` and `opacity` animations
- **Efficient Selectors**: Avoid complex CSS selectors
- **Critical CSS**: Inline critical styles
- **Responsive Images**: Optimized for different screen sizes

### Network Optimizations
- **Firebase Caching**: Automatic offline persistence
- **Service Worker**: Cache static assets
- **Compression**: Gzip compression for text files
- **CDN**: Firebase hosting with global CDN

---

## 🧪 Testing & Debugging

### Manual Testing Checklist
- [ ] **Authentication**: Login, signup, logout flows
- [ ] **Data Sync**: Real-time updates across devices
- [ ] **Offline Mode**: Works without internet connection
- [ ] **Theme Toggle**: Light/dark mode persistence
- [ ] **Roll Forward**: Incomplete tasks move to tomorrow
- [ ] **Responsive**: Works on mobile, tablet, desktop
- [ ] **PWA**: Installable, works offline

### Debug Tools
```javascript
// Enable Firebase debug logging
const db = getFirestore(app);
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

// Console logging for development
console.log('User authenticated:', currentUser?.email);
console.log('Data saved:', data);
console.log('Theme changed:', isDarkMode);
```

---

## 🔧 Development Setup

### Prerequisites
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+)
- Firebase project with Firestore and Authentication enabled
- Text editor (VS Code recommended)

### Local Development
1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd todays-plan
   ```

2. **Configure Firebase**
   - Create Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Update `js/firebase-config.js` with your config

3. **Set Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

4. **Serve locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using VS Code Live Server extension
   ```

### Deployment
- **GitHub Pages**: Push to `gh-pages` branch
- **Firebase Hosting**: `firebase deploy`
- **Netlify**: Connect GitHub repository
- **Vercel**: Import GitHub project

---

## 📈 Future Enhancements

### Planned Features
- [ ] **Calendar View**: Monthly/weekly calendar interface
- [ ] **Task Categories**: Color-coded task organization
- [ ] **Habit Tracking**: Daily habit streaks
- [ ] **Data Export**: PDF/CSV export functionality
- [ ] **Collaboration**: Share plans with team members
- [ ] **Analytics**: Productivity insights and trends
- [ ] **Notifications**: Browser push notifications
- [ ] **Voice Input**: Speech-to-text for quick entry

### Technical Improvements
- [ ] **TypeScript**: Add type safety
- [ ] **Testing**: Unit and integration tests
- [ ] **Build Process**: Webpack/Vite bundling
- [ ] **State Management**: Redux/Zustand for complex state
- [ ] **Component Framework**: React/Vue migration
- [ ] **Database**: Consider PostgreSQL for complex queries

---

## 📞 Support & Contributing

### Getting Help
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Feature requests and questions
- **Documentation**: Check this file for detailed info

### Contributing Guidelines
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- **JavaScript**: ES6+ features, async/await preferred
- **CSS**: BEM methodology, mobile-first approach
- **HTML**: Semantic markup, accessibility attributes
- **Comments**: Document complex logic and business rules

---

## 📄 License
MIT License - see LICENSE file for details

---

*Last updated: January 2024*