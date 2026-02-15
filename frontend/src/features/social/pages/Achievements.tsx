import React from 'react';

import { ACHIEVEMENTS } from '../data/social.data';

interface AchievementsProps {
    unlockedIds: string[];
    onBack: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ unlockedIds, onBack }) => {
    const achievements = ACHIEVEMENTS.map(a => ({
        ...a,
        unlocked: unlockedIds.includes(a.id),
    }));

    const unlocked = achievements.filter(a => a.unlocked);
    const progress = Math.round((unlocked.length / achievements.length) * 100);

    const categories = ['streak', 'quiz', 'social', 'milestone'] as const;
    const categoryLabels = { streak: '🔥 Streak', quiz: '📝 Quiz', social: '🤝 Social', milestone: '🏁 Milestone' };

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
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>🏅 Achievements</h2>
                    <span style={{
                        marginLeft: 'auto', fontSize: '0.85rem', color: '#22c55e', fontWeight: 600,
                    }}>{unlocked.length}/{achievements.length}</span>
                </div>

                {/* Overall progress */}
                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '1rem',
                    padding: '1.25rem', marginBottom: '1.5rem',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Collection Progress</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22c55e' }}>{progress}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(100, 116, 139, 0.2)', borderRadius: '4px' }}>
                        <div style={{
                            height: '100%', borderRadius: '4px', transition: 'width 0.5s ease',
                            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                            width: `${progress}%`,
                        }} />
                    </div>
                </div>

                {/* By Category */}
                {categories.map(cat => {
                    const catAchievements = achievements.filter(a => a.category === cat);
                    if (catAchievements.length === 0) return null;
                    return (
                        <div key={cat} style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                                {categoryLabels[cat]}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                {catAchievements.map(a => (
                                    <div key={a.id} style={{
                                        padding: '1rem',
                                        backgroundColor: a.unlocked ? 'rgba(34, 197, 94, 0.08)' : 'rgba(30, 41, 59, 0.5)',
                                        border: a.unlocked ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(148, 163, 184, 0.05)',
                                        borderRadius: '0.75rem',
                                        opacity: a.unlocked ? 1 : 0.5,
                                        textAlign: 'center',
                                    }}>
                                        <div style={{
                                            fontSize: '1.75rem', marginBottom: '0.35rem',
                                            filter: a.unlocked ? 'none' : 'grayscale(1)',
                                        }}>{a.icon}</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.15rem' }}>{a.name}</div>
                                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{a.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
