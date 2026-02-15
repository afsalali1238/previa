# Development Memory Log

## [2026-02-15] - The Great Migration to LocalStorage
### Context
We encountered a blocker with Firebase: utilizing `firestore` and `auth` effectively required enabling Billing on the Google Cloud Platform, which was not desirable for this free/prototype phase.

### Decision
**Switch to a Local-First Architecture.**
- **Frontend Only**: The app is now a standalone static site.
- **Verification**: Verified build and deployed to Vercel.

### Implementation
- **Auth**: Replaced `firebase/auth` with `localAuth.ts`. This service mocks the `signup/signin` flow and stores credentials (hashed) in localStorage. It emits events similar to Firebase's `onAuthStateChanged` so the React `useEffect` hooks didn't need major logic rewrites.
- **Database**: Replaced `firestore` with `localStore.ts`. User profiles are just JSON strings in localStorage keys.
- **Questions**: Instead of fetching from DB, we import the `final_questionnaire_data.json` directly into the bundle.

### Impacts
- **Positive**: Zero cost, zero latency, works offline, easier deployment.
- **Negative**: No cross-device sync, no real security (data is accessible to user), app bundle size increased slightly (due to JSON data).

---

## [2026-02-14] - Build & Deploy
### Decision
**Use Vercel for Hosting.**
- **Context**: Need a free, fast host for a React SPA.
- **Implementation**: Added `vercel.json` for Rewrite rules (SPA support), successfully deployed via CLI.

---
