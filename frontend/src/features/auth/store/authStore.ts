import { create } from 'zustand';
import type { AuthState } from '../types/user.types';

// Simulation of Firebase Auth for the Local-First Pivot
export const useAuthStore = create<AuthState>((set) => ({
    user: {
        uid: 'local-hero-123',
        displayName: 'Afsal Ali',
        email: 'hero@provia.app',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        phoneNumber: null,
        photoURL: null,
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => '',
        getIdTokenResult: async () => ({}) as any,
        reload: async () => {},
        toJSON: () => ({}),
    } as any,
    profile: null,
    loading: false,
    error: null,
    isAuthenticated: true,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    logout: async () => {
        set({ user: null, profile: null, isAuthenticated: false, error: null });
    },
}));
