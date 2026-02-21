import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    type Timestamp,
    type FieldValue
} from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import type { User } from 'firebase/auth';

// ── Types ──
export interface UserProfile {
    userId: string;
    displayName: string;
    email: string;
    territory: string | null;
    specialty: string | null;
    currentDay: number;
    completedDays: number[];
    streakCount: number;
    learningPoints: number;
    hearts: number;
    referralCode: string;
    referralCount: number;
    vaultItems: string[];
    createdAt: string | Timestamp | FieldValue;
    lastActive: string | Timestamp | FieldValue;
}

export interface DayProgress {
    dayId: number;
    setsCompleted: boolean[]; // [true, true, false...]
    checkpointScore: number | null;
    completedAt: string | Timestamp | FieldValue;
}

// ── Service ──
export const storeService = {

    // ── Profile Management ──

    async loadProfile(userId: string): Promise<UserProfile | null> {
        try {
            const docRef = doc(db, 'users', userId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const data = snap.data() as UserProfile;
                return data;
            }
            return null;
        } catch (error) {
            console.error("Error loading profile:", error);
            return null;
        }
    },

    async createProfile(user: User, additionalData?: Partial<UserProfile>): Promise<UserProfile> {
        const profile: UserProfile = {
            userId: user.uid,
            displayName: user.displayName || user.email?.split('@')[0] || 'Hero',
            email: user.email || '',
            territory: additionalData?.territory || null,
            specialty: additionalData?.specialty || null,
            currentDay: 1,
            completedDays: [],
            streakCount: 0,
            learningPoints: 0,
            hearts: 5,
            referralCode: 'HERO-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            referralCount: 0,
            vaultItems: [],
            createdAt: serverTimestamp(),
            lastActive: serverTimestamp(),
        };

        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, profile);
        return profile;
    },

    async updateProfile(userId: string, updates: Partial<UserProfile>) {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
            ...updates,
            lastActive: serverTimestamp()
        });
    },

    // ── Progress Tracking ──

    async saveDayProgress(userId: string, dayId: number, data: Partial<DayProgress>) {
        // We store progress in a subcollection to keep the main user doc light
        const docRef = doc(db, 'users', userId, 'progress', dayId.toString());
        await setDoc(docRef, {
            ...data,
            dayId,
            updatedAt: serverTimestamp()
        }, { merge: true });
    },

    // ── Questions (Static JSON to save reads) ──
    async loadQuestions(): Promise<any[]> {
        // We still use the bundled JSON for questions to avoid massive Firestore costs for thousands of reads
        const data = await import('../features/questions/data/final_questionnaire_data.json');
        return (data as any).default || data;
    },

    getQuestionsForDay(questions: any[], day: number): any[] {
        return questions.filter((q: any) => q.day === day);
    }
};
