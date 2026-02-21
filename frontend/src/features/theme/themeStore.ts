import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    mode: 'dark' | 'light';
    toggleMode: () => void;
    setMode: (mode: 'dark' | 'light') => void;
}

// Apply theme immediately on load
const savedTheme = (() => {
    try {
        const stored = localStorage.getItem('provia-theme');
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed?.state?.mode || 'light';
        }
    } catch { /* ignore */ }
    return 'light';
})();
document.documentElement.setAttribute('data-theme', savedTheme);

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: savedTheme as 'dark' | 'light',
            toggleMode: () => set((s) => {
                const newMode = s.mode === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newMode);
                return { mode: newMode };
            }),
            setMode: (mode) => {
                document.documentElement.setAttribute('data-theme', mode);
                set({ mode });
            },
        }),
        { name: 'provia-theme' }
    )
);
