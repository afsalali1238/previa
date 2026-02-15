import { create } from 'zustand';
import type { AuthState } from '../types/user.types';
import { auth } from '../../../lib/firebase/config';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    loading: true,
    error: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    logout: async () => {
        try {
            await auth.signOut();
            set({ user: null, profile: null, isAuthenticated: false, error: null });
        } catch (error: any) {
            set({ error: error.message });
        }
    },
}));
