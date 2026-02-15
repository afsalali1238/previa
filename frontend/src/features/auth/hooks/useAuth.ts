import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isConfigured } from '../../../lib/firebase/config';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
    const store = useAuthStore();

    useEffect(() => {
        if (!isConfigured) {
            // Firebase not configured — just stop loading so the UI renders
            store.setLoading(false);
            return;
        }

        try {
            const unsubscribe = onAuthStateChanged(auth,
                (user) => {
                    store.setUser(user);
                    store.setLoading(false);
                },
                (error) => {
                    store.setError(error.message);
                    store.setLoading(false);
                }
            );
            return () => unsubscribe();
        } catch (error) {
            console.warn('Auth listener failed:', error);
            store.setLoading(false);
        }
    }, []);

    return store;
};
