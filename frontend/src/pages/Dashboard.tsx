import React from 'react';
import { useAuthStore } from '../features/auth/store/authStore';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuthStore();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#e2e8f0',
            padding: '2rem',
        }}>
            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                paddingTop: '3rem',
            }}>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Welcome, {user?.displayName || 'Hero'}! 🎯
                </h1>

                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                }}>
                    <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Your UID</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{user?.uid || 'Not logged in'}</p>
                </div>

                <button
                    onClick={() => logout()}
                    style={{
                        padding: '0.75rem 2rem',
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};
