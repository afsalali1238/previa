// localStorage-based data store (replaces Firestore)

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
    createdAt: string;
}

const PROFILE_KEY = 'provia_profile';
const PROGRESS_KEY = 'provia_progress';

export const localStore = {
    // ── Profile ──
    saveProfile(profile: UserProfile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    },

    loadProfile(userId: string): UserProfile | null {
        try {
            const data = localStorage.getItem(PROFILE_KEY);
            if (!data) return null;
            const profile = JSON.parse(data) as UserProfile;
            return profile.userId === userId ? profile : null;
        } catch {
            return null;
        }
    },

    createDefaultProfile(userId: string, name: string, email: string): UserProfile {
        const profile: UserProfile = {
            userId,
            displayName: name,
            email,
            territory: null,
            specialty: null,
            currentDay: 1,
            completedDays: [],
            streakCount: 0,
            learningPoints: 0,
            hearts: 5,
            referralCode: 'HERO-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            referralCount: 0,
            vaultItems: [],
            createdAt: new Date().toISOString(),
        };
        localStore.saveProfile(profile);
        return profile;
    },

    updateProfile(updates: Partial<UserProfile>) {
        const data = localStorage.getItem(PROFILE_KEY);
        if (!data) return;
        const profile = JSON.parse(data) as UserProfile;
        Object.assign(profile, updates);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    },

    // ── Questions ──
    async loadQuestions(): Promise<any[]> {
        const data = await import('../features/questions/data/final_questionnaire_data.json');
        return (data as any).default || data;
    },

    getQuestionsForDay(questions: any[], day: number): any[] {
        return questions.filter((q: any) => q.day === day);
    },

    // ── Clear ──
    clearAll() {
        localStorage.removeItem(PROFILE_KEY);
        localStorage.removeItem(PROGRESS_KEY);
    },
};
