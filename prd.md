# Product Requirements Document (PRD)
**Project Name:** Prometric Hero: 45-Day Challenge
**Version:** 2.0 (LocalStorage Pivot)
**Status:** Active Development
**Platform:** Progressive Web App (PWA) / Static Web Site
**Last Updated:** February 15, 2026

---

## 1. Executive Summary
**Prometric Hero** is a "compact," gamified exam preparation tool designed for medical professionals (Nurses, Pharmacists, GPs) preparing for Gulf licensing exams. It acts as a digital career coach, drip-feeding content over a strict **45-day schedule**.

**Pivot Note (v2.0):** To ensure sustainability and zero-cost deployment, the application has moved from a Cloud/Firebase architecture to a **Local-First** architecture. All data is persisted on the user's device.

---

## 2. Core Features & Functional Requirements

### 3.1 Onboarding & "The Contract"
* **Territory & Specialty Selection:** User selects target exam (DHA/MOH/etc.) and role.
* **The Pledge:** Digital commitment to the 45-day schedule.
* **Storage:** Profile data stored in `localStorage` (`prometric_user_profile`).

### 3.2 The 45-Day Campaign (The Syllabus)
* **Daily Unlock Mechanism:**
    * Content is technically accessible but UI enforces sequential progression.
    * **Completion Criteria:** Read Topic → Complete 50 MCQs → Pass Checkpoint Quiz (>80%).
* **Data Source:** Questions loaded from static JSON bundle (`final_questionnaire_data.json`).
* **Progress Tracking:**
    * Saved locally: `prometric_user_progress`.
    * Tracks: `{ dayId, setsCompleted: [], checkpointScore: number }`.

### 3.3 Gamification (The "Worlds")
* **Structure:** 7 Worlds (Foundation, The Engine, The Lab, etc.).
* **Rewards:** Badges and Learning Points (LP) stored locally.
* **Streak System:** Calculated based on last login date stored in local profile.

### 3.4 Community & Social (Simulated)
* **Previous Scope:** Real-time chat (Removed to avoid backend costs).
* **Current Scope:** "The Lounge" is now a static or simulated view, or removed entirely in favor of focusing on study mechanics.

### 3.5 The "Vault" (Rewards)
* **Unlock logic:** Based on local LP counters and Day progression.

---

## 3. Technical Architecture (Local-First)

### 3.1 Frontend
* **Framework:** React.js + TypeScript + Vite
* **UI:** Tailwind CSS
* **State:** React Context / Local State
* **Hosting:** Vercel (Static)

### 3.2 Data persistence
* **Primary Store:** `window.localStorage`
* **Sync:** None (Device specific)
* **Backup:** User must not clear browser cache to retain progress.

### 3.3 Authentication (LocalAuth)
* **Mechanism:** Simulation of Auth.
* **Credentials:** Email/Password stored (hashed) in `localStorage`.
* **Security Note:** This is "soft" security meant to separate profiles on a shared device, not "hard" security against hacking (since data is on client).

---

## 4. Monetization Strategy (Revised)
* **Model:** Completely Free / Open Source (initially).
* **Future:** Potential for client-side license key activation if needed, but currently focused on free utility.

---

## 5. Success Metrics
* **Completion Rate:** % of users finishing Day 45.
* **Engagement:** Daily active usage.
* **Performance:** 100/100 Lighthouse score (due to static nature).

---

**Approvals:**
- [x] User (Pivot to LocalStorage approved Feb 15, 2026)
