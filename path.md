# Project Structure & File Paths

## Root Directory: `Prometric/frontend`

## Directory Tree

```
frontend/
├── dist/                        # Production build output
├── public/                      # Static assets
│   ├── logo-provia.png          # App logo
│   ├── manifest.json            # PWA manifest
│   └── vite.svg
│
├── src/
│   ├── features/                # Feature-based architecture
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginPage.tsx          # Login/Signup UI
│   │   │   │   └── ProtectedRoute.tsx     # Route guard
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts             # Auth hook
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts        # Auth business logic
│   │   │   ├── store/
│   │   │   │   └── authStore.ts           # Zustand auth state
│   │   │   └── types/
│   │   │       └── user.types.ts
│   │   │
│   │   ├── battle/
│   │   │   ├── data/
│   │   │   │   └── battle.data.ts         # Mock battle data
│   │   │   └── pages/
│   │   │       ├── BattleArena.tsx
│   │   │       ├── ChatPage.tsx
│   │   │       └── OpponentSelect.tsx
│   │   │
│   │   ├── onboarding/
│   │   │   ├── components/
│   │   │   │   └── StepIndicator.tsx
│   │   │   ├── pages/
│   │   │   │   ├── AuthorityPicker.tsx
│   │   │   │   ├── ContractPledge.tsx
│   │   │   │   ├── SpecialtySelection.tsx
│   │   │   │   ├── TerritorySelection.tsx
│   │   │   │   └── Welcome.tsx
│   │   │   └── types/
│   │   │       └── onboarding.types.ts
│   │   │
│   │   ├── progress/
│   │   │   └── components/
│   │   │       ├── StatsCard.tsx
│   │   │       └── StreakCounter.tsx
│   │   │
│   │   ├── questions/
│   │   │   ├── components/
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   └── QuizResults.tsx
│   │   │   ├── data/
│   │   │   │   ├── final_questionnaire_data.json  # 2,000+ questions
│   │   │   │   └── mockQuestions.ts
│   │   │   ├── pages/
│   │   │   │   └── DailyQuestions.tsx
│   │   │   └── types/
│   │   │       └── question.types.ts
│   │   │
│   │   ├── quiz/
│   │   │   ├── QuizEngine.tsx             # Core quiz UI & logic
│   │   │   └── store/
│   │   │       └── quizStore.ts           # Zustand quiz state
│   │   │
│   │   ├── roadmap/
│   │   │   ├── Roadmap.tsx
│   │   │   └── store/
│   │   │       └── proviaStore.ts         # Zustand main state (roadmap, credits, streaks)
│   │   │
│   │   ├── social/
│   │   │   ├── TheLounge.tsx
│   │   │   ├── data/
│   │   │   │   └── social.data.ts
│   │   │   └── pages/
│   │   │       ├── Achievements.tsx
│   │   │       ├── Leaderboard.tsx
│   │   │       └── Referral.tsx
│   │   │
│   │   └── theme/
│   │       └── themeStore.ts              # Zustand dark/light mode
│   │
│   ├── lib/
│   │   └── firebase/
│   │       └── config.ts                  # Firebase config (Google OAuth)
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx                  # Main app (Home, Tests, Battle, Chat tabs)
│   │   └── LandingPage.tsx                # Marketing landing page
│   │
│   ├── services/
│   │   ├── auth.ts
│   │   ├── localAuth.ts                   # Local auth service
│   │   ├── localStore.ts                  # Local data persistence
│   │   └── database/
│   │       ├── index.ts
│   │       ├── firestore.service.ts
│   │       ├── questions.db.ts
│   │       └── users.db.ts
│   │
│   ├── App.tsx                            # Root component & routing
│   ├── App.css                            # Component styles
│   ├── main.tsx                           # Entry point
│   ├── index.css                          # Global + Tailwind styles
│   └── vite-env.d.ts
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── vercel.json                            # SPA rewrite rules
└── README.md
```

## Key Files
- **`src/pages/Dashboard.tsx`**: Main app — 4 tabs (Home, Tests, Battle, Discussions), roadmap grid, settings.
- **`src/features/quiz/QuizEngine.tsx`**: Quiz flow with attempt limits, cooldowns, scoring.
- **`src/features/quiz/store/quizStore.ts`**: Quiz state (attempts, cooldowns, scores).
- **`src/features/roadmap/store/proviaStore.ts`**: Core state (45-day roadmap, hero credits, streak, duels).
- **`src/features/theme/themeStore.ts`**: Dark/light mode preference.
- **`src/features/auth/store/authStore.ts`**: Auth session state.
- **`src/features/questions/data/final_questionnaire_data.json`**: All 2,000+ questions.
- **`src/pages/LandingPage.tsx`**: Marketing page.

## Output Config
- Build output: `./dist`
- Vercel serves from `./dist` (SPA mode via `vercel.json`).
- Deploy: `npx vercel --prod --yes` from `frontend/` directory.
