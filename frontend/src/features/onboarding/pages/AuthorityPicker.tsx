import React from 'react';
import { AUTHORITIES, type Authority } from '../types/onboarding.types';

interface AuthorityPickerProps {
    selected: Authority | null;
    onSelect: (authority: Authority) => void;
    onContinue: () => void;
}

export const AuthorityPicker: React.FC<AuthorityPickerProps> = ({ selected, onSelect, onContinue }) => {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#1e293b',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🇦🇪</div>
                <h2 style={{
                    fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem',
                    color: '#0f172a',
                }}>Select Your Authority</h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2rem' }}>
                    Which UAE health authority exam are you preparing for?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {AUTHORITIES.map(auth => {
                        const isSelected = selected?.id === auth.id;
                        return (
                            <button key={auth.id} onClick={() => onSelect(auth)} style={{
                                padding: '1.25rem',
                                background: isSelected ? '#eff6ff' : '#ffffff',
                                border: isSelected ? `2px solid ${auth.color}` : '1px solid #e2e8f0',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                color: '#1e293b',
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                width: '100%',
                                boxShadow: isSelected ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                            }}>
                                <span style={{ fontSize: '1.75rem' }}>{auth.emoji}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>{auth.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{auth.fullName}</div>
                                </div>
                                {isSelected && (
                                    <span style={{ marginLeft: 'auto', color: auth.color, fontSize: '1.25rem' }}>✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button onClick={onContinue} disabled={!selected} style={{
                    width: '100%', padding: '0.9rem',
                    background: selected ? '#2563eb' : '#cbd5e1',
                    color: '#fff', border: 'none', borderRadius: '0.75rem',
                    fontSize: '1rem', fontWeight: 700,
                    cursor: selected ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    boxShadow: selected ? '0 4px 6px -1px rgba(37, 99, 235, 0.2)' : 'none',
                }}>
                    Start 45-Day Challenge 🚀
                </button>
            </div>
        </div>
    );
};
