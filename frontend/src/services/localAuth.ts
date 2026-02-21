// localStorage-based auth service (no Firebase needed)

export interface LocalUser {
    id: string;
    name: string;
    email: string;
}

interface StoredUser {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
}

const USERS_KEY = 'provia_users';
const SESSION_KEY = 'provia_session';

type AuthCallback = (user: LocalUser | null) => void;
const listeners: AuthCallback[] = [];

function getUsers(): StoredUser[] {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveUsers(users: StoredUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Simple hash (not cryptographic - fine for demo/local use)
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(36);
}

function notifyListeners(user: LocalUser | null) {
    listeners.forEach(cb => cb(user));
}

export const localAuth = {
    signup(name: string, email: string, password: string): LocalUser {
        const users = getUsers();
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            throw new Error('An account with this email already exists. Try signing in.');
        }
        if (password.length < 4) {
            throw new Error('Password must be at least 4 characters.');
        }

        const newUser: StoredUser = {
            id: 'user_' + Date.now().toString(36),
            name,
            email: email.toLowerCase(),
            passwordHash: simpleHash(password),
        };
        users.push(newUser);
        saveUsers(users);

        const session: LocalUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        notifyListeners(session);
        return session;
    },

    signin(email: string, password: string): LocalUser {
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            throw new Error('No account found with this email. Try signing up.');
        }
        if (user.passwordHash !== simpleHash(password)) {
            throw new Error('Incorrect password.');
        }

        const session: LocalUser = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        notifyListeners(session);
        return session;
    },

    signout() {
        localStorage.removeItem(SESSION_KEY);
        notifyListeners(null);
    },

    getCurrentUser(): LocalUser | null {
        try {
            const data = localStorage.getItem(SESSION_KEY);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    onAuthChange(callback: AuthCallback): () => void {
        listeners.push(callback);
        // Immediately fire with current state
        callback(localAuth.getCurrentUser());
        return () => {
            const idx = listeners.indexOf(callback);
            if (idx >= 0) listeners.splice(idx, 1);
        };
    },
};
