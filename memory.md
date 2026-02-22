# Development Memory Log

## [2026-02-22] - Day Topic Visibility & Build Fix
### Context
Users couldn't see topics for locked days — tapping was blocked. Also, an unused variable caused Vercel build failure.
### Decision
Allow all days (locked included) to be tapped for topic viewing. Only show TAKE TEST for unlocked days.
### Implementation
- Removed `if (!day.unlocked) return;` guard in `RoadmapGrid`.
- Added Main Topic banner, "Also Covered" sub-topics, and 🔒 lock notice for locked days.
- Fixed `TS6133` error (unused `roadmap` variable in `Dashboard.tsx`).

---

## [2026-02-21] - Google OAuth & Vercel Deployment
### Context
Needed real authentication and a live deployment pipeline.
### Decision
Integrated Google OAuth2 for sign-in. Deployed via Vercel CLI (`npx vercel --prod`).
### Implementation
- Added Google OAuth flow in auth services.
- Deployed frontend to Vercel (auto-deploys on `git push origin main`).
- Fixed orphaned files (`features/auth/`, `pages/Dashboard.tsx`) with broken Firebase imports.

---

## [2026-02-20] - Zustand State Management & New Features
### Context
React Context was becoming unwieldy. Needed a cleaner global state solution.
### Decision
Migrate to **Zustand** for all global state.
### Implementation
- Created `proviaStore.ts` — roadmap, hero credits, streak, duels.
- Created `quizStore.ts` — quiz state, attempt tracking, cooldowns.
- Created `authStore.ts` — auth state, login/logout.
- Created `themeStore.ts` — dark/light mode toggle.
- Built **QuizEngine** with 3 attempts/day, 30-min cooldown, 80% pass mark.
- Built **Dashboard** with 4 tabs: Home, Tests, Battle, Discussions.
- Built **Landing Page** for marketing.

---

## [2026-02-15] - The Great Migration to LocalStorage
### Context
Firebase required Billing on Google Cloud Platform — not suitable for free/prototype phase.
### Decision
**Switch to a Local-First Architecture.**
### Implementation
- **Auth**: Replaced `firebase/auth` with `localAuth.ts` (mock signup/signin with hashed passwords in localStorage).
- **Database**: Replaced `firestore` with `localStore.ts` (JSON in localStorage).
- **Questions**: Import `final_questionnaire_data.json` directly into the bundle.
### Impacts
- **Positive**: Zero cost, zero latency, works offline, easier deployment.
- **Negative**: No cross-device sync, no real security, slightly larger bundle.

---

## [2026-02-14] - Build & Deploy
### Decision
**Use Vercel for Hosting.**
- Added `vercel.json` for SPA rewrite rules.
- Successfully deployed via CLI.

---
