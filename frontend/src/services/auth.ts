import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import { auth } from '../lib/firebase/config';

// Re-export type for use in other files
export type { User };

export const authService = {
    // Social Login
    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (error) {
            console.error("Google login failed", error);
            throw error;
        }
    },

    // Email/Password Login
    async loginWithEmail(email: string, pass: string) {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        return result.user;
    },

    // Email/Password Signup
    async signupWithEmail(email: string, pass: string) {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        return result.user;
    },

    // Logout
    async logout() {
        return signOut(auth);
    },

    // State Listener
    onAuthChange(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    }
};
