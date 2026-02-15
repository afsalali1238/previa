import React from 'react';
import type { LeaderboardEntry } from '../data/social.data';
import { MOCK_LEADERBOARD } from '../data/social.data';

interface LeaderboardProps {
    currentUserXP: number;
    currentUserName: string;
    currentUserStreak: number;
    currentUserDays: number;
    currentUserLevel: number;
    onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
    currentUserXP, currentUserName, currentUserStreak, currentUserDays, currentUserLevel, onBack
}) => {
    const currentUser: LeaderboardEntry = {
        rank: 0, name: currentUserName, avatar: '💊', authority: 'DHA',
        level: currentUserLevel, xp: currentUserXP, streak: currentUserStreak,
        daysCompleted: currentUserDays, isCurrentUser: true,
    };

    const allEntries = [...MOCK_LEADERBOARD, currentUser]
        .sort((a, b) => b.xp - a.xp)
        .map((e, i) => ({ ...e, rank: i + 1 }));

    const topThree = allEntries.slice(0, 3);
    const rest = allEntries.slice(3);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#1e293b', padding: '1.5rem',
        }}>
            <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.5rem' }}>←</button>
                    <h2 style={{
                        fontSize: '1.3rem', fontWeight: 700,
                        color: '#0f172a',
                    }}>🏆 Leaderboard</h2>
                </div>

                {/* Podium */}
                <div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
                    gap: '0.75rem', marginBottom: '2rem', padding: '0 1rem',
                }}>
                    {[topThree[1], topThree[0], topThree[2]].map((entry, i) => {
                        if (!entry) return null;
                        const heights = ['110px', '140px', '90px'];
                        const medals = ['🥈', '🥇', '🥉'];
                        const borderColors = ['#94a3b8', '#fbbf24', '#cd7f32'];
                        return (
                            <div key={entry.rank} style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{medals[i]}</div>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    border: `3px solid ${borderColors[i]}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', marginBottom: '0.35rem',
                                    background: entry.isCurrentUser ? '#eff6ff' : '#ffffff',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                }}>{entry.avatar}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: entry.isCurrentUser ? '#2563eb' : '#334155' }}>
                                    {entry.name.split(' ')[0]}
                                </div>
                                <div style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>{entry.xp} XP</div>
                                <div style={{
                                    width: '100%', height: heights[i],
                                    background: entry.isCurrentUser
                                        ? 'linear-gradient(180deg, #dbeafe 0%, #eff6ff 100%)' // blue-100 to blue-50
                                        : 'linear-gradient(180deg, #e2e8f0 0%, #f1f5f9 100%)', // slate-200 to slate-100
                                    borderRadius: '0.5rem 0.5rem 0 0', marginTop: '0.5rem',
                                    border: '1px solid #cbd5e1', borderBottom: 'none',
                                }} />
                            </div>
                        );
                    })}
                </div>

                {/* Rest */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {rest.map((entry) => (
                        <div key={entry.rank} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                            backgroundColor: entry.isCurrentUser ? '#eff6ff' : '#ffffff',
                            border: entry.isCurrentUser ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                            borderRadius: '0.75rem',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        }}>
                            <span style={{ width: '24px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textAlign: 'center' }}>{entry.rank}</span>
                            <span style={{ fontSize: '1.25rem' }}>{entry.avatar}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: entry.isCurrentUser ? '#2563eb' : '#1e293b' }}>
                                    {entry.name} {entry.isCurrentUser && '(You)'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                    Lv.{entry.level} • {entry.authority} • 🔥{entry.streak}
                                </div>
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>{entry.xp}</span>
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>XP</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
