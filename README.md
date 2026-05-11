# Today's Plan

A lightweight daily productivity planner built with vanilla JavaScript, Firebase, and deployed as a Progressive Web App (PWA).

**[→ Live App](https://fasthd97.github.io/todays-plan/)**

---

## Features

- **Daily schedule** — 17 time slots to plan your day hour by hour
- **Priorities** — 3 top priorities + overflow task list
- **Ideas capture** — quick add/remove idea list
- **Study timer** — per-topic Pomodoro-style timers
- **Water tracker** — 8-glass daily tracker
- **Notes** — freeform daily notes
- **Roll to Tomorrow** — carries incomplete tasks to the next day
- **Dark mode** — toggle between light and dark themes
- **Cross-device sync** — Firebase Auth + Firestore keeps your data in sync across devices
- **Installable PWA** — add to your home screen on iOS or Android for a native app feel

---

## Using the App

Visit **[fasthd97.github.io/todays-plan](https://fasthd97.github.io/todays-plan/)**, create an account, and start planning. Your data is private to your account.

**To install on mobile:**
- **iOS (Safari):** Tap the share icon → "Add to Home Screen"
- **Android (Chrome):** Tap the menu → "Add to Home Screen" or "Install App"

---

## Running Your Own Instance

### 1. Fork and clone
```bash
git clone https://github.com/your-username/todays-plan.git
cd todays-plan
npm install
```

### 2. Create a Firebase project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database**
5. Go to Project Settings → Your apps → Add web app → copy the config values

### 3. Set up environment variables
```bash
cp .env.example .env
# Fill in your Firebase values
```

### 4. Run locally
```bash
npm run dev
# Opens at http://localhost:5173
```

### 5. Deploy to GitHub Pages
Add your Firebase values as repository secrets under **Settings → Secrets and variables → Actions**, then push to `main`. GitHub Actions handles the rest.

Change your Pages source to **GitHub Actions** under Settings → Pages.

---

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES Modules), HTML, CSS
- **Auth & Database:** Firebase Authentication + Firestore
- **Build:** Vite
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions

---

## Project Structure

```
todays-plan/
├── .github/workflows/deploy.yml   # Auto-deploy on push to main
├── css/style.css
├── js/
│   ├── app.js                     # Main application logic
│   └── firebase-config.js         # Reads config from env vars
├── .env.example                   # Template — copy to .env with your values
├── index.html
├── manifest.json                  # PWA manifest
├── service-worker.js              # Offline support
└── vite.config.js
```

---

## Security

Firebase credentials are injected at build time via environment variables — no keys are stored in the repository. See `.env.example` for the required variables.
