# Product Requirements Document (PRD)
**Project Name:** PROVIA — 45-Day Prometric Challenge
**Version:** 3.0 (Zustand + Feature Architecture)
**Status:** Live & Iterating
**Platform:** Progressive Web App (PWA) / Static Web Site
**Last Updated:** February 22, 2026

---

## 1. Executive Summary
**PROVIA** is a gamified exam preparation tool for medical professionals (Pharmacists, Nurses, GPs) preparing for Gulf licensing exams (DHA, MOH, HAAD, etc.). It delivers a strict **45-day study plan** with daily topic unlocks, quizzes with attempt limits, and gamification (Hero Credits, streaks, battle arena).

**Architecture:** Local-first React SPA with Zustand state management, deployed as a static site on Vercel.

---

## 2. Core Features

### 2.1 Authentication
* **Google OAuth** for sign-in (via Firebase Auth).
* **Local Auth** fallback (email/password stored in localStorage).
* Protected routes via `ProtectedRoute` component.

### 2.2 The 45-Day Campaign
* **45 daily topics** mapped from real Prometric exam syllabus.
* **Sequential unlock**: Complete Day N (≥80% quiz score) → Day N+1 unlocks.
* **Day detail sheet**: Tap any day (including locked) to see its main topic + sub-topics.
* **7 Worlds**: Foundation, The Engine, The Lab, Clinical Mastery, Toxicology & Safety, Advanced Pharmaco, Final Boss.

### 2.3 Quiz Engine
* **Questions**: 2,000+ MCQs from `final_questionnaire_data.json`.
* **Attempt limits**: 3 attempts per day per topic.
* **Cooldown**: 30-minute wait between failed attempts.
* **Pass mark**: 80% required to complete a day.
* **Scoring**: Hero Credits awarded on pass (+10 HC).
* **Metrics**: Constant timer (flags >90s per question), displays average time/question on results.

### 2.4 Gamification
* **Hero Credits (HC)**: Earned by passing quizzes, winning battles.
* **Streak System**: Daily login tracking.
* **Milestone Tests**: Checkpoint exams at Days 10, 20, 30, 40, and a Final Mock at Day 45.

### 2.5 Battle Arena (Simulated)
* **Quick Match**: Random opponent pairing.
* **Challenge by ID**: Search and challenge specific players.
* **Stake**: 20 HC entry fee, winner takes all.
* *Note: Currently simulated with fake opponents.*

### 2.6 Discussions (Simulated)
* 4 categories: Study Materials, Doubts & Questions, Exam Tips, General Chat.
* Threaded format with mock data.

### 2.7 Settings & Theme
* **Dark/Light mode** toggle (defaults to Light Mode, persisted in localStorage).
* **Sign out** functionality.

---

## 3. Technical Architecture

### 3.1 Frontend
* **Framework:** React 19 + TypeScript + Vite 7
* **State:** Zustand (persisted via `zustand/persist`)
* **UI:** Tailwind CSS 3.4
* **Routing:** React Router DOM 7
* **Icons:** Lucide React + Emoji
* **Hosting:** Vercel (Static)

### 3.2 State Stores (Zustand)
| Store | File | Purpose |
|-------|------|---------|
| `proviaStore` | `features/roadmap/store/proviaStore.ts` | Roadmap, credits, streak, duels |
| `quizStore` | `features/quiz/store/quizStore.ts` | Quiz state, attempts, cooldowns |
| `authStore` | `features/auth/store/authStore.ts` | Auth session |
| `themeStore` | `features/theme/themeStore.ts` | Dark/light mode |

### 3.3 Data Persistence
* **Primary:** `localStorage` via Zustand `persist` middleware.
* **Keys:** `provia-v2-store`, `quiz-store`, `auth-store`, `theme-store`.
* **Backup:** None (device-specific).

### 3.4 Authentication
* **Primary:** Google OAuth2 (Firebase Auth SDK).
* **Fallback:** Local email/password auth.

---

## 4. Deployment
* **Host:** Vercel (free tier)
* **Deploy:** `npx vercel --prod --yes` from `frontend/`
* **Git:** Push to `origin/main` triggers auto-deploy.
* **URL:** `https://frontend-beta-flax-54.vercel.app/`

---

## 5. Success Metrics
* **Completion Rate:** % of users finishing Day 45.
* **Daily Engagement:** Active sessions per day.
* **Quiz Performance:** Average score trends over 45 days.

---

**Approvals:**
- [x] LocalStorage pivot approved (Feb 15, 2026)
- [x] Zustand migration approved (Feb 20, 2026)
- [x] Google OAuth integration (Feb 21, 2026)
