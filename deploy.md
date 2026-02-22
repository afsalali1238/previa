# Deployment Guide

## Project: PROVIA (Prometric Hero)
**Last Updated**: February 22, 2026

---

## 1. Git Push (Version Control)

### Quick Push
```powershell
cd c:\Users\HP\Desktop\antigravity\PROVIA\Prometric
git add -A
git commit -m "Your commit message"
git push origin main
```

### Repository
- **Remote**: `origin` → GitHub (`afsalali1238/previa`)
- **Branch**: `main`

---

## 2. Deploy to Vercel

### Option A: CLI Deploy (Fastest)
```powershell
cd c:\Users\HP\Desktop\antigravity\PROVIA\Prometric\frontend
npx vercel --prod --yes
```
This builds and deploys in ~25 seconds.

### Option B: Auto-Deploy via Git
Pushing to `origin/main` triggers automatic Vercel deployment if the GitHub repo is connected in the Vercel dashboard.

### Vercel Config
- **Framework**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (runs `tsc -b && vite build`)
- **Output Directory**: `dist`
- **SPA Rewrites**: Configured in `vercel.json`

### Current Production URL
`https://frontend-beta-flax-54.vercel.app/`

---

## 3. Local Development

### Start Dev Server
```powershell
cd c:\Users\HP\Desktop\antigravity\PROVIA\Prometric\frontend
npm run dev
```
Opens at `http://localhost:5173/`

### Build Check (Before Deploy)
```powershell
cd c:\Users\HP\Desktop\antigravity\PROVIA\Prometric\frontend
npx tsc -b
```
Fix any TypeScript errors before deploying.

---

## 4. Data Architecture
- **No backend server required** — fully static SPA.
- **State**: Zustand stores persisted to `localStorage`.
- **Auth**: Google OAuth via Firebase Auth SDK (client-side only).
- **Questions**: Bundled as static JSON (`final_questionnaire_data.json`).

---

## 5. Common Issues

| Issue | Fix |
|-------|-----|
| Build fails with TS errors | Run `npx tsc -b` locally, fix reported errors |
| Vercel deploy fails | Check build logs at `https://vercel.com/dashboard` |
| PowerShell `&&` doesn't work | Use separate commands (one per line) |
| Old data showing | Clear `localStorage` in browser DevTools |
