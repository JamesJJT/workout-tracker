# Gym App

A small React Native / Expo app for tracking workouts and sessions. It includes a lightweight in-app router, a searchable/filterable workouts catalog, session creation and history persistence via AsyncStorage, and simple modals for creating custom workouts and recording sessions.

**Quick summary:**
- Small custom Router with `Home` and `History` screens.
- Workouts loaded from `workouts-data.json` and can be extended.
- Sessions are stored in AsyncStorage under the key `workoutHistory`.
- Modals are rendered at the app root to avoid input/re-render issues.

## Features

- Browse and search workouts
- Filter workouts by category
- Start and end workout sessions (records exercises)
- View full session history and delete individual sessions
- Show last 3 sessions on the Home screen
- Create custom workouts via a modal

## Requirements

- Node.js (16+ recommended)
- npm (or Yarn)
- Expo CLI (optional, recommended for running on device/emulator)

## Install

Clone the repo and install dependencies:

```bash
git clone <this-repo>
cd gym-app
npm install
```

If you use Expo, you can install the Expo CLI globally:

```bash
npx expo-cli --version || npm install -g expo-cli
```

## Run

Start the Metro bundler and launch in Expo Go or an emulator:

```bash
npm start
# or
npx expo start
```

Follow the on-screen instructions to open the app on your device or simulator.

## Project structure (important files)

- `App.js` — top-level state, persistence, router, and modal rendering
- `workouts-data.json` — catalog of built-in workouts
- `components/` — UI components (SessionCard, WorkoutModal, CreateWorkoutModal, etc.)
- `navigation/Router.js` — tiny custom router implementation
- `screens/` — `HomeScreen.js` and `HistoryScreen.js`
- `styles/` — shared styles

## Data & Persistence

- Built-in workouts are stored in `workouts-data.json`.
- Sessions saved by the app are persisted to AsyncStorage under the key `workoutHistory`.
- If you want to seed sample sessions, you can either:
  - Modify `App.js` to programmatically write to AsyncStorage on first run, or
  - Provide a JSON import utility in the app that reads a file and writes to AsyncStorage.

## Adding Workouts

To add workouts, edit `workouts-data.json`. Each workout includes an `id`, `name`, `category`, and optional `description`. The app will merge custom workouts created at runtime with the built-in set.

Example workout entry:

```json
{
  "id": "131",
  "name": "Sample Exercise",
  "category": "Legs",
  "description": "Short description"
}
```

## Development notes

- Modals are intentionally mounted in `App.js` so opening inputs don't close when navigating between screens.
- The app uses a minimal custom router to avoid adding `react-navigation`. If you prefer full navigation features, consider migrating to `react-navigation`.
- If you run into dependency or Metro errors after changing packages, try removing `node_modules` and reinstalling:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

PRs welcome. Keep changes focused and avoid large unrelated dependency upgrades in the same PR.

