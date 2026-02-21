import type { User } from 'firebase/auth';

export interface UserProfile {
    uid: string;
    phone?: string;
    displayName: string;
    email: string;
    photoURL?: string;
    territory?: 'DHA' | 'MOH' | 'SLE' | 'HAAD';
    specialty?: 'Nurse' | 'Pharmacist' | 'GP';
    currentDay: number;
    streakCount: number;
    learningPoints: number;
    hearts: number;
    contractSignedAt?: any; // Firestore Timestamp
    lastActive: any; // Firestore Timestamp
    paymentStatus: 'free' | 'paid' | 'referral';
    unlockedDays: number[];
    completedDays: number[];
    vaultItems: string[];
    referralCode: string;
    referredBy: string | null;
    referralCount: number;
    createdAt: any; // Firestore Timestamp
}

export interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setProfile: (profile: UserProfile | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => Promise<void>;
}
