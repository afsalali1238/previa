import React from 'react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: string;
    color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color = '#60a5fa' }) => {
    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '1.25rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            textAlign: 'center',
            flex: 1,
            minWidth: '100px',
        }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{icon}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color, marginBottom: '0.15rem' }}>{value}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        </div>
    );
};
