import {
    signInWithPopup,
    GoogleAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    type ConfirmationResult,
    type User
} from 'firebase/auth';
import { auth } from '../../../lib/firebase/config';

export class AuthService {
    private static googleProvider = new GoogleAuthProvider();

    static async loginWithGoogle(): Promise<User> {
        try {
            const result = await signInWithPopup(auth, this.googleProvider);
            return result.user;
        } catch (error) {
            console.error('Login with Google failed', error);
            throw error;
        }
    }

    static setupRecaptcha(elementId: string): RecaptchaVerifier {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved
                }
            });
        }
        return window.recaptchaVerifier;
    }

    static async loginWithPhone(phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
        try {
            return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        } catch (error) {
            console.error('Phone login failed', error);
            throw error;
        }
    }
}

// Add types for window.recaptchaVerifier
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}
