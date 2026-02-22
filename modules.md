# System Modules & Architecture

## Project: PROVIA — 45-Day Prometric Challenge
**Architecture Type**: Static SPA with Zustand State + LocalStorage Persistence
**Last Updated**: February 22, 2026

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                        │
│                    React 19 + TypeScript + Vite 7                │
│                                                                  │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────────┐   │
│  │    Pages       │  │  Zustand       │  │   Features       │   │
│  │  Dashboard.tsx │  │   Stores       │  │  (quiz, roadmap  │   │
│  │  LandingPage   │  │  (4 stores)    │  │   auth, battle)  │   │
│  └──────┬────────┘  └──────┬─────────┘  └──────┬───────────┘   │
│         │                  │                    │               │
└─────────┼──────────────────┼────────────────────┼───────────────┘
          │                  │                    │
          ▼                  ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Browser Storage (Persistence)                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐   │
│  │  Zustand/      │  │  Static JSON   │  │  Firebase Auth  │   │
│  │  localStorage  │  │  (Questions)   │  │  (Google OAuth) │   │
│  └────────────────┘  └────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module Breakdown

### 🔵 State Management (Zustand Stores)

#### 1. proviaStore (`features/roadmap/store/proviaStore.ts`)
**Purpose**: Core application state.
- **Data**: 45-day roadmap, hero credits, streak, duels, last login.
- **Actions**: `completeDay`, `unlockDay`, `addCredits`, `spendCredits`, `updateStreak`, `startDuel`, `resolveDuel`.
- **Persistence**: `provia-v2-store` in localStorage.

#### 2. quizStore (`features/quiz/store/quizStore.ts`)
**Purpose**: Quiz engine state.
- **Data**: Active quiz questions, current index, answers, attempt history.
- **Actions**: `startQuiz`, `answerQuestion`, `submitQuiz`, `getAttemptInfo`.
- **Rules**: 3 attempts/day, 30-min cooldown, 80% pass mark.
- **Persistence**: `quiz-store` in localStorage.

#### 3. authStore (`features/auth/store/authStore.ts`)
**Purpose**: Authentication session.
- **Data**: Current user, auth state.
- **Actions**: `login`, `logout`, `setUser`.
- **Persistence**: `auth-store` in localStorage.

#### 4. themeStore (`features/theme/themeStore.ts`)
**Purpose**: UI theme preference.
- **Data**: `mode` ('dark' | 'light').
- **Actions**: `toggleMode`.
- **Persistence**: `theme-store` in localStorage.

---

### 🟢 Feature Modules

#### 5. Quiz Engine (`features/quiz/QuizEngine.tsx`)
- Full quiz UI with question cards, progress bar, timer display.
- Attempt tracking with cooldown enforcement.
- Results screen with score, pass/fail, and credit rewards.

#### 6. Dashboard (`pages/Dashboard.tsx`)
- **4 Tabs**: Home, Tests, Battle, Discussions.
- **Home Tab**: Progress card, stats grid (credits, streak, days), 45-day roadmap grid.
- **Tests Tab**: 5 milestone checkpoint tests.
- **Battle Tab**: Quick match + challenge-by-ID.
- **Discussions Tab**: 4 threaded discussion categories.
- **Settings**: Theme toggle, sign out.

#### 7. Roadmap Grid (embedded in Dashboard)
- 9×5 grid of day tiles with world-colored indicators.
- All days tappable → shows topic detail bottom sheet.
- Locked days show topic info + lock notice.
- Unlocked days show TAKE TEST button + attempt info.

#### 8. Landing Page (`pages/LandingPage.tsx`)
- Marketing page with feature showcase.
- CTA to get started.

#### 9. Onboarding (`features/onboarding/`)
- Multi-step flow: Welcome → Territory → Specialty → Authority → Contract.
- Creates initial profile in localStorage.

#### 10. Auth (`features/auth/`)
- Login/Signup UI.
- Google OAuth integration.
- Protected route component.

---

### 🟡 Data & Services

#### 11. Question Data (`features/questions/data/final_questionnaire_data.json`)
- 2,000+ MCQs mapped to 45 days.
- Fields: `day`, `text`, `options`, `correctAnswer`, `explanation`, `category`.

#### 12. Local Services (`services/`)
- `localAuth.ts` — Offline auth simulation.
- `localStore.ts` — Offline data persistence.
- `database/` — Firebase Firestore services (for future use).

---

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.2 | UI framework |
| `zustand` | 5.0 | State management |
| `react-router-dom` | 7.13 | Routing |
| `firebase` | 12.9 | Google OAuth |
| `lucide-react` | 0.575 | Icons |
| `tailwindcss` | 3.4 | Styling |
| `vite` | 7.3 | Build tool |
| `typescript` | 5.9 | Type safety |

---

## Future Modules
- **PWA Service Worker**: Offline caching for assets and HTML.
- **Data Export/Import**: Backup/restore progress as JSON.
- **Real Multiplayer Battle**: WebSocket or P2P quiz battles.
- **Push Notifications**: Daily study reminders.
