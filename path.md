# Project Structure & File Paths

## Root Directory: `Prometric/frontend`

## Directory Tree

```
frontend/
├── dist/                   # Production build output
├── public/                 # Static assets
│   └── vite.svg
│
├── src/
│   ├── assets/             # Images and styles
│   │   ├── react.svg
│   │   └── ...
│   │
│   ├── features/           # Feature-based architecture
│   │   ├── auth/
│   │   │   └── components/
│   │   │       └── LoginPage.tsx    # Local auth login/signup
│   │   │
│   │   ├── dashboard/      # Main Dashboard
│   │   │
│   │   ├── onboarding/     # Initial user setup
│   │   │   └── components/
│   │   │       ├── AuthorityPicker.tsx
│   │   │       └── UserOnboarding.tsx
│   │   │
│   │   └── questions/      # Quiz Engine
│   │       ├── components/
│   │       │   ├── QuestionCard.tsx
│   │       │   └── QuizResults.tsx
│   │       ├── data/
│   │       │   ├── final_questionnaire_data.json  # The Core Data
│   │       │   └── mockQuestions.ts
│   │       └── pages/
│   │           └── DailyQuestions.tsx
│   │
│   ├── services/           # Data & Business Logic
│   │   ├── localAuth.ts    # Replaces Firebase Auth
│   │   └── localStore.ts   # Replaces Firestore
│   │
│   ├── App.tsx             # Main Application Controller
│   ├── main.tsx            # Entry Point
│   ├── index.css           # Tailwind/Global styles
│   └── vite-env.d.ts
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json             # Deployment config
└── README.md
```

## Key Files
- **`src/services/localAuth.ts`**: The brain of the offline authentication system.
- **`src/services/localStore.ts`**: The brain of the offline data persistence.
- **`src/features/questions/data/final_questionnaire_data.json`**: Contains all 2,000+ questions.
- **`src/App.tsx`**: Orchestrates the state between Login, Onboarding, and Dashboard.

## Output Config
- Build commands output to `./dist`
- Vercel serves from `./dist` (configured as SPA).
