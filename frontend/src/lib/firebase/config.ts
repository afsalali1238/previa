import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Debug: log config on load
console.log('🔥 Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? '✅ SET' : '❌ MISSING',
    authDomain: firebaseConfig.authDomain || '❌ MISSING',
    projectId: firebaseConfig.projectId || '❌ MISSING',
});

// Check if Firebase has real credentials
export const isConfigured =
    !!firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_api_key_here' &&
    firebaseConfig.apiKey !== '';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.warn('⚠️ Firebase initialization failed. Running in demo mode.', error);
    // Provide a minimal fallback so the app doesn't crash
    app = initializeApp({ apiKey: 'x', projectId: 'x', appId: 'x' }, 'fallback');
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
}

if (!isConfigured) {
    console.warn(
        '⚠️ Firebase is not configured with real credentials.\n' +
        '   Update frontend/.env with your Firebase project config.\n' +
        '   App will run in demo mode without real authentication.'
    );
}

export const googleProvider = new GoogleAuthProvider();
export { auth, db, storage };
export default app!;

