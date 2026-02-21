import React from 'react';
import { OPPONENTS } from '../data/battle.data';
import type { Opponent } from '../data/battle.data';

interface OpponentSelectProps {
    onSelect: (opponent: Opponent) => void;
    onBack: () => void;
}

export const OpponentSelect: React.FC<OpponentSelectProps> = ({ onSelect, onBack }) => {
    const statusColors = { online: '#22c55e', busy: '#f59e0b', offline: '#64748b' };
    const statusLabels = { online: 'Online', busy: 'In Battle', offline: 'Offline' };

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
                    }}>⚔️ Choose Opponent</h2>
                </div>

                {/* Battle Info */}
                <div style={{
                    backgroundColor: '#fef2f2', borderRadius: '1rem', // red-50
                    padding: '1rem', marginBottom: '1.5rem',
                    border: '1px solid #fecaca', // red-200
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 500 }}>
                        ⚡ 5 questions • 15 seconds each • Winner takes 100 XP
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {OPPONENTS.map(opp => {
                        const canChallenge = opp.status === 'online';
                        return (
                            <button key={opp.id} onClick={() => canChallenge && onSelect(opp)} disabled={!canChallenge} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '0.75rem',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                cursor: canChallenge ? 'pointer' : 'default',
                                opacity: canChallenge ? 1 : 0.6,
                                transition: 'all 0.2s', color: '#1e293b', textAlign: 'left', width: '100%',
                                boxShadow: canChallenge ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%', position: 'relative',
                                    background: '#f1f5f9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
                                }}>
                                    {opp.avatar}
                                    <div style={{
                                        position: 'absolute', bottom: '2px', right: '2px',
                                        width: '10px', height: '10px', borderRadius: '50%',
                                        background: statusColors[opp.status],
                                        border: '2px solid #ffffff',
                                    }} />
                                </div>
                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{opp.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                        Lv.{opp.level} • {opp.authority} • {statusLabels[opp.status]}
                                    </div>
                                </div>
                                {/* Win rate */}
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>{opp.winRate}%</div>
                                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>win rate</div>
                                </div>
                                {canChallenge && (
                                    <div style={{
                                        padding: '0.4rem 0.75rem', background: 'linear-gradient(135deg, #dc2626, #ea580c)',
                                        borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                                    }}>⚔️</div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Random Match */}
                <button onClick={() => {
                    const online = OPPONENTS.filter(o => o.status === 'online');
                    if (online.length > 0) onSelect(online[Math.floor(Math.random() * online.length)]);
                }} style={{
                    width: '100%', padding: '1rem', marginTop: '1.5rem',
                    background: 'linear-gradient(135deg, #dc2626, #ea580c)',
                    color: '#fff', border: 'none', borderRadius: '0.75rem',
                    fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.2)',
                }}>
                    🎲 Random Opponent
                </button>
            </div>
        </div>
    );
};
