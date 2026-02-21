import { create } from 'zustand';

// Bypass Auth for testing: Automatically "logs in" as a guest
export const useAuthStore = create<any>((set) => ({
    user: {
        uid: 'guest-tester-' + Math.random().toString(36).substr(2, 9),
        displayName: 'Guest Tester',
        email: 'tester@provia.app',
    },
    isAuthenticated: false,

    // Google Sign In now acts as an immediate bypass
    login: async () => {
        set({ isAuthenticated: true });
    },

    logout: async () => {
        set({ isAuthenticated: false });
    },
}));
