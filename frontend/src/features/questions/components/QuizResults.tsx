import React from 'react';

interface QuizResultsProps {
    correct: number;
    total: number;
    onRetry: () => void;
    onContinue: () => void;
    isCheckpoint?: boolean;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ correct, total, onRetry, onContinue, isCheckpoint }) => {
    const percentage = Math.round((correct / total) * 100);
    const passed = isCheckpoint ? percentage >= 80 : true;

    let emoji: string;
    let message: string;
    let color: string;

    if (percentage === 100) {
        emoji = '🏆'; message = 'Perfect Score!'; color = '#fbbf24';
    } else if (percentage >= 80) {
        emoji = '🎉'; message = 'Excellent!'; color = '#22c55e';
    } else if (percentage >= 60) {
        emoji = '👍'; message = 'Good effort!'; color = '#60a5fa';
    } else {
        emoji = '💪'; message = 'Keep practicing!'; color = '#f87171';
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            padding: '2rem',
            color: '#1e293b',
        }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{emoji}</div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color }}>{message}</h2>

            {isCheckpoint && !passed && (
                <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    You need 80% to pass the checkpoint. Try again!
                </p>
            )}

            {/* Score Circle */}
            <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: `conic-gradient(${color} ${percentage * 3.6}deg, #e2e8f0 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
            }}>
                <div style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color }}>{percentage}%</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{correct}/{total}</span>
                </div>
            </div>

            {/* Stats */}
            <div style={{
                display: 'flex',
                gap: '2rem',
                marginBottom: '2rem',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22c55e' }}>{correct}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Correct</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>{total - correct}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Wrong</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#60a5fa' }}>{percentage}%</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Accuracy</div>
                </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                {(!passed || !isCheckpoint) && (
                    <button onClick={onRetry} style={{
                        flex: 1, padding: '0.875rem', background: '#f1f5f9', color: '#64748b',
                        border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                    }}>
                        {isCheckpoint && !passed ? 'Retry Quiz' : 'Review'}
                    </button>
                )}
                {(passed || !isCheckpoint) && (
                    <button onClick={onContinue} style={{
                        flex: 2, padding: '0.875rem',
                        background: '#2563eb',
                        color: '#fff', border: 'none', borderRadius: '0.75rem',
                        fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                    }}>
                        {isCheckpoint ? '🎯 Complete Day!' : 'Continue →'}
                    </button>
                )}
            </div>
        </div>
    );
};
