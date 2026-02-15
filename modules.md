# System Modules & Architecture

## Project: Prometric Hero - 45-Day Challenge
**Architecture Type**: Static SPA with LocalStorage Persistence
**Last Updated**: February 15, 2026

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                    │
│                    React + TypeScript + Vite                 │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │      UI      │  │   Logic      │  │     Data     │     │
│  │ (Components) │  │   (Hooks)    │  │  (Services)  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │             │
└─────────┼─────────────────┼─────────────────┼─────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Browser Storage (Persistence)              │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐     │
│  │ LocalStorage │   │ Static JSON  │   │  IndexedDB   │     │
│  │ (User Data)  │   │ (Questions)  │   │  (Future)    │     │
│  └──────────────┘   └──────────────┘   └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Module Breakdown

### 🔵 Core Services (Local Replacement)
Instead of Firebase, we now use custom local services.

#### 1. LocalAuth Service (`src/services/localAuth.ts`)
**Purpose**: Manage user session and "login" state.
- **Functions**: `signup`, `signin`, `signout`, `getCurrentUser`.
- **Storage**: `prometric_users` array and `prometric_session` object in localStorage.
- **Security**: Simple hash for password (client-side only).

#### 2. LocalStore Service (`src/services/localStore.ts`)
**Purpose**: Manage persistence of complex data.
- **Keys**:
  - `prometric_profile_{userId}`: User settings, current day, points.
  - `prometric_progress_{userId}`: Array of completed questions/days.
- **Data Loading**: Loads static questions from `final_questionnaire_data.json`.

---

### 🟢 Feature Modules

#### 3. Question Engine
- **Files**: `DailyQuestions.tsx`, `QuestionCard.tsx`.
- **Logic**: 
  - Fetches questions for `currentDay` from JSON.
  - Tracks correct/incorrect answers in component state.
  - Commits results to `localStore` upon set completion.

#### 4. Dashboard & Progress
- **Files**: `Dashboard.tsx`.
- **Logic**:
  - specific circular progress bars for "Worlds".
  - Unlocks days based on local profile data.

#### 5. Onboarding
- **Files**: `UserOnboarding.tsx`, `AuthorityPicker.tsx`.
- **Logic**:
  - Creates initial profile in `localStore`.
  - Sets "Contract Signed" timestamp.

---

## Refactoring History (Migration from Firebase)

### [2026-02-15] - The Local Storage Migration
**Context**: Firebase billing requirements prevented free deployment.
**Decision**: Rip out all Firebase dependencies.
**Implementation**:
- Removed `firebase/app`, `firebase/auth`, `firebase/firestore`.
- Created `localAuth` to mimicking the `onAuthStateChanged` observer pattern so UI components required minimal changes.
- Created `localStore` to mimic Firestore document retrieval.
- Updated `App.tsx` to initialize local services instead of Firebase.

---

## Future Modules
- **PWA offline caching**: Service Worker setup to ensure `index.html` and assets load without network.
- **Data Export**: Allow users to download their progress JSON as backup.
