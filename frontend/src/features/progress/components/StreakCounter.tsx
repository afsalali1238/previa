import React from 'react';

interface StreakCounterProps {
    count: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ count }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#fff7ed', // orange-50
            borderRadius: '2rem',
            border: '1px solid #ffedd5', // orange-100
        }}>
            <span style={{ fontSize: '1.25rem' }}>🔥</span>
            <span style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: '#f59e0b',
            }}>{count}</span>
            <span style={{ fontSize: '0.75rem', color: '#f97316' }}>day streak</span>
        </div>
    );
};
