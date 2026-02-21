import React, { useState } from 'react';

interface ReferralProps {
    referralCount: number;
    onBack: () => void;
}

export const Referral: React.FC<ReferralProps> = ({ referralCount, onBack }) => {
    const [copied, setCopied] = useState(false);
    const referralCode = 'HERO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const referralLink = `https://provia.app/invite/${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard?.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join PROVIA!',
                text: 'I\'m crushing my Prometric exam prep with this app! Use my code to join:',
                url: referralLink,
            });
        } else {
            handleCopy();
        }
    };

    const rewards = [
        { count: 1, reward: '🎁 +200 XP Bonus', achieved: referralCount >= 1 },
        { count: 3, reward: '🏅 Ambassador Badge', achieved: referralCount >= 3 },
        { count: 5, reward: '❤️ +2 Extra Hearts', achieved: referralCount >= 5 },
        { count: 10, reward: '👑 VIP Status', achieved: referralCount >= 10 },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#e2e8f0',
            padding: '1.5rem',
        }}>
            <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button onClick={onBack} style={{
                        background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem',
                    }}>←</button>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>🤝 Invite Friends</h2>
                </div>

                {/* Hero */}
                <div style={{
                    textAlign: 'center', marginBottom: '2rem',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '1.5rem',
                    padding: '2rem', border: '1px solid rgba(148, 163, 184, 0.1)',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Study Together, Win Together
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        Invite friends to join PROVIA. You both earn rewards!
                    </p>

                    {/* Referral count */}
                    <div style={{
                        fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem',
                        background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>{referralCount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>friends invited</div>
                </div>

                {/* Share Link */}
                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '1rem',
                    padding: '1.25rem', marginBottom: '1rem',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Your Invite Link</div>
                    <div style={{
                        display: 'flex', gap: '0.5rem', alignItems: 'center',
                    }}>
                        <div style={{
                            flex: 1, padding: '0.6rem 0.75rem', background: 'rgba(15, 23, 42, 0.6)',
                            borderRadius: '0.5rem', fontSize: '0.75rem', color: '#94a3b8',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{referralLink}</div>
                        <button onClick={handleCopy} style={{
                            padding: '0.6rem 1rem', background: copied ? '#22c55e' : '#2563eb',
                            color: '#fff', border: 'none', borderRadius: '0.5rem',
                            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                        }}>{copied ? '✓ Copied' : 'Copy'}</button>
                    </div>
                </div>

                <button onClick={handleShare} style={{
                    width: '100%', padding: '0.875rem',
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    color: '#fff', border: 'none', borderRadius: '0.75rem',
                    fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: '1.5rem',
                }}>📤 Share with Friends</button>

                {/* Reward Tiers */}
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem' }}>
                    Referral Rewards
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {rewards.map(r => (
                        <div key={r.count} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: r.achieved ? 'rgba(34, 197, 94, 0.08)' : 'rgba(30, 41, 59, 0.5)',
                            border: r.achieved ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(148, 163, 184, 0.05)',
                            borderRadius: '0.75rem',
                        }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: r.achieved ? '#22c55e' : 'rgba(100, 116, 139, 0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 700, color: r.achieved ? '#fff' : '#64748b',
                            }}>{r.achieved ? '✓' : r.count}</div>
                            <span style={{
                                fontSize: '0.9rem',
                                color: r.achieved ? '#22c55e' : '#94a3b8',
                                fontWeight: r.achieved ? 600 : 400,
                            }}>{r.reward}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
