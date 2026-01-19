# Today's Plan - Code Documentation

## Overview
A daily planner web app with Firebase authentication and real-time sync. Users can manage schedules, priorities, tasks, notes, and water intake.

## File Structure
```
todays-plan/
├── index.html          # Main HTML structure
├── css/style.css       # Styling (not shown)
├── js/
│   ├── app.js          # Main application logic
│   └── firebase-config.js # Firebase configuration
├── service-worker.js   # PWA offline functionality
└── manifest.json       # PWA manifest
```

## Core Components

### 1. Authentication System
- **Firebase Auth**: Email/password authentication
- **Auto-sync**: Data syncs across devices when signed in
- **Local storage**: Works offline, syncs when online

### 2. Data Structure
```javascript
{
  date: "2024-01-15",           // Selected date
  days: { mon: true, tue: false }, // Day checkboxes
  schedule: ["9am meeting", ""], // 17 schedule slots
  priorities: ["Task 1", "", ""], // 3 priority items
  tasks: [                      // 8 task items
    { checked: false, text: "Buy groceries" }
  ],
  notes: "Meeting notes...",    // Free text area
  water: [true, false, ...]     // 8 water tracking checkboxes
}
```

### 3. Key Functions

#### Initialization (`init()`)
- Sets today's date
- Checks current day
- Creates dynamic DOM elements
- Sets up event listeners
- Loads theme preference

#### Authentication (`handleAuthSubmit()`)
- Handles sign-in/sign-up
- Shows user-friendly error messages
- Triggers data sync on success

#### Data Management
- **`saveDataToFirestore()`**: Saves all form data to Firebase
- **`loadDataFromFirestore()`**: Loads data and populates form
- **`handleAutoSave()`**: Debounced auto-save (1 second delay)

#### Theme System
- **`toggleTheme()`**: Switches between light/dark mode
- **`applyTheme()`**: Updates UI colors and icons
- Syncs theme preference across devices

#### Roll Forward Feature (`rollForward()`)
- Moves incomplete tasks to tomorrow
- Clears completed items
- Updates date to next day
- Preserves incomplete priorities and tasks

### 4. Security Features
- **Environment variables**: API keys not hardcoded
- **Input validation**: Checks for required fields
- **Error handling**: Graceful failure handling
- **User feedback**: Toast messages instead of alerts

### 5. Performance Optimizations
- **Debounced auto-save**: Prevents excessive Firebase writes
- **Real-time listeners**: Only updates when data changes
- **Conditional DOM access**: Null checks prevent crashes

## Firebase Integration

### Authentication
```javascript
// Sign in
await signInWithEmailAndPassword(auth, email, password);

// Sign up  
await createUserWithEmailAndPassword(auth, email, password);
```

### Data Storage
```javascript
// Save data
const docRef = doc(db, 'users', userId, 'planner', 'current');
await setDoc(docRef, data, { merge: true });

// Listen for changes
onSnapshot(docRef, (docSnap) => {
  if (docSnap.exists()) loadDataFromFirestore(docSnap.data());
});
```

## PWA Features
- **Service Worker**: Caches resources for offline use
- **Manifest**: Enables "Add to Home Screen"
- **Responsive**: Works on mobile and desktop

## Error Handling
- DOM element null checks prevent crashes
- Firebase errors show user-friendly messages
- Network failures handled gracefully
- Auto-retry for failed operations

## Usage Flow
1. User opens app
2. Can use offline or sign in for sync
3. Fill out daily planner sections
4. Data auto-saves every second
5. "Roll Forward" moves incomplete items to tomorrow
6. Theme and data sync across devices

## Development Notes
- Uses ES6 modules for Firebase imports
- Event listeners added after DOM ready
- Debounced saves prevent API spam
- Theme preference stored locally and in Firebase