import React from 'react';

interface WelcomeProps {
    onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#e2e8f0',
            padding: '2rem',
            textAlign: 'center',
        }}>
            <img src="/logo.png" alt="PROVIA Logo" style={{ width: '240px', height: 'auto', marginBottom: '2rem', filter: 'drop-shadow(0 0 25px rgba(37, 99, 235, 0.4))' }} />

            <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 900,
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
            }}>
                PROVIA
            </h1>

            <p style={{
                fontSize: '1.1rem',
                color: '#94a3b8',
                marginBottom: '0.5rem',
                fontWeight: 500,
            }}>
                45-Day Challenge
            </p>

            <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                maxWidth: '320px',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
            }}>
                Conquer your Gulf licensing exam with gamified daily challenges, streak rewards, and a structured path to success.
            </p>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                width: '100%',
                maxWidth: '320px',
            }}>
                <button
                    onClick={onStart}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.4)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    Begin Your Journey 🚀
                </button>
            </div>

            <div style={{
                marginTop: '3rem',
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
            }}>
                {[
                    { label: '50 Qs/Day', icon: '📝' },
                    { label: '45 Days', icon: '📅' },
                    { label: 'Streaks', icon: '🔥' },
                ].map((item) => (
                    <div key={item.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.label}</div>
                    </div>
                ))}
            </div>

            <p style={{
                marginTop: '2rem',
                fontSize: '0.75rem',
                color: '#475569',
            }}>
                DHA • MOH • SLE • HAAD
            </p>
        </div>
    );
};
