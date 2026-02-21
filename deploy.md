# Deployment Guide

This guide covers how to push your code to GitHub, deploy it to Vercel, and understand the database setup.

## 1. Git Push (Version Control)

> **✅ Git Installed**: I successfully installed Git for you!
> **⚠️ Action Required**: Please **RESTART YOUR TERMINAL** (close and reopen VS Code) for the `git` command to work.

### Steps (After Restarting Terminal)
1.  **Navigate to the project folder**:
    ```powershell
    cd frontend
    ```

2.  **Initialize Git**:
    ```powershell
    git init
    git add .
    git commit -m "Integrated Firebase Auth & Firestore"
    ```

3.  **Connect to GitHub**:
    *(Replace `YOUR_REPO_URL` with the one from GitHub)*
    ```powershell
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

---

## 2. Connecting to Vercel

Vercel is the recommended host for this React application.

### Option A: Vercel CLI (Fastest)
You can deploy directly from your terminal without using GitHub.
```powershell
cd frontend
npx vercel
# Follow the prompts (Keep default settings)
```

### Option B: Vercel Dashboard (Recommended for CI/CD)
1.  Go to [Vercel.com](https://vercel.com) and Sign Up/Login.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository**: Select the GitHub repo you just pushed.
4.  **Configure Project**:
    - **Framework Preset**: Vite
    - **Root Directory**: `frontend` (Important!)
    - **Environment Variables**: You MUST add your Firebase keys here:
        - `VITE_FIREBASE_API_KEY`
        - `VITE_FIREBASE_AUTH_DOMAIN`
        - `VITE_FIREBASE_PROJECT_ID`
        - (etc...)
5.  **Deploy**: Click "Deploy".

---

## 3. Database Setup (Firebase) 

### Current Status: Active 🔥
The application usage **Firebase Authentication** and **Cloud Firestore**.

### Key Requirements
1.  **Billing**: Your Google Cloud project must be on the **Blaze (Pay-as-you-go)** plan.
2.  **Collection**: The app automatically creates a `users` collection.
3.  **Rules**: Ensure your Firestore Security Rules allow read/write for authenticated users:
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
          
          match /progress/{dayId} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
    }
    ```
