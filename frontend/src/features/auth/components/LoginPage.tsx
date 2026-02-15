import React, { useState } from 'react';
import { authService } from '../../../services/auth';

interface LoginPageProps {
    onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await authService.loginWithGoogle();
            onLogin();
        } catch (err: any) {
            console.error("Login failed", err);
            setError("Google login failed. Please try again.");
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                if (!email.trim() || password.length < 6) {
                    setError('Valid email and password (6+ chars) required.');
                    setLoading(false);
                    return;
                }
                // Note: Auth service signup just creates the auth user. 
                // Profile creation happens in App.tsx upon auth state change detection.
                await authService.signupWithEmail(email.trim(), password);
            } else {
                await authService.loginWithEmail(email.trim(), password);
            }
            onLogin();
        } catch (err: any) {
            console.error("Auth error", err);
            setError(err.message || 'Authentication failed.');
        }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%', padding: '0.8rem 1rem', marginBottom: '0.75rem',
        background: '#ffffff', border: '1px solid #e2e8f0',
        borderRadius: '0.75rem', color: '#1e293b', fontSize: '0.9rem', outline: 'none',
        boxSizing: 'border-box' as const,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    };

    const canSubmit = email.trim() && password.length >= 6;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#1e293b',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{ maxWidth: '380px', width: '100%' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px', height: '100px', margin: '0 auto 1.5rem',
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
                    }}>💊</div>
                    <h1 style={{
                        fontSize: '2.5rem', fontWeight: 900,
                        color: '#0f172a',
                        marginBottom: '0.25rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}>PROVIA</h1>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        UAE Pharmacist Exam Prep
                    </p>
                </div>

                {/* Google Button */}
                <button onClick={handleGoogleLogin} disabled={loading} style={{
                    width: '100%', padding: '0.8rem', marginBottom: '1.5rem',
                    background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    fontSize: '0.95rem', fontWeight: 600, color: '#334155', cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s',
                }}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: '18px', height: '18px' }} />
                    Continue with Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    <span style={{ padding: '0 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                </div>

                {/* Tab */}
                <div style={{
                    display: 'flex', marginBottom: '1.5rem', background: '#f1f5f9',
                    borderRadius: '0.75rem', padding: '0.25rem',
                }}>
                    {['Sign Up', 'Sign In'].map((label, i) => {
                        const active = isSignUp ? i === 0 : i === 1;
                        return (
                            <button key={label} onClick={() => { setIsSignUp(i === 0); setError(''); }} style={{
                                flex: 1, padding: '0.6rem', border: 'none', borderRadius: '0.6rem',
                                background: active ? '#ffffff' : 'transparent',
                                color: active ? '#1e293b' : '#94a3b8',
                                fontWeight: active ? 700 : 500, fontSize: '0.85rem', cursor: 'pointer',
                                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.2s',
                            }}>{label}</button>
                        );
                    })}
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem',
                        padding: '0.6rem 0.8rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#dc2626',
                    }}>⚠️ {error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {isSignUp && (
                        <input
                            type="text" placeholder="Your name (Optional)" value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={inputStyle}
                        />
                    )}
                    <input
                        type="email" placeholder="Email address" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        type="password" placeholder={isSignUp ? "Create password (6+ chars)" : "Password"} value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ ...inputStyle, marginBottom: '1rem' }}
                    />
                    <button type="submit" disabled={!canSubmit || loading} style={{
                        width: '100%', padding: '0.85rem',
                        background: canSubmit && !loading ? '#2563eb' : '#cbd5e1',
                        color: '#fff', border: 'none', borderRadius: '0.75rem',
                        fontSize: '1rem', fontWeight: 700,
                        cursor: canSubmit && !loading ? 'pointer' : 'default',
                        boxShadow: canSubmit ? '0 4px 6px -1px rgba(37, 99, 235, 0.2)' : 'none',
                        transition: 'all 0.2s',
                    }}>
                        {loading ? '...' : isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                    Data is stored securely in the cloud
                </p>
            </div>
        </div>
    );
};

