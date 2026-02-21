import React from 'react';
import { StepIndicator } from '../components/StepIndicator';
import type { Territory } from '../types/onboarding.types';
import { TERRITORIES } from '../types/onboarding.types';

interface TerritorySelectionProps {
    selected: Territory | null;
    onSelect: (territory: Territory) => void;
    onNext: () => void;
    onBack: () => void;
}

export const TerritorySelection: React.FC<TerritorySelectionProps> = ({ selected, onSelect, onNext, onBack }) => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#e2e8f0',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <div style={{ maxWidth: '480px', width: '100%', paddingTop: '2rem' }}>
                <StepIndicator currentStep={1} totalSteps={3} labels={['Territory', 'Specialty', 'Contract']} />

                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>
                    Select Your Territory
                </h2>
                <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    Which licensing exam are you preparing for?
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    {TERRITORIES.map((t) => {
                        const isSelected = selected?.id === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => onSelect(t)}
                                style={{
                                    padding: '1.5rem 1rem',
                                    backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                                    border: isSelected ? '2px solid #2563eb' : '2px solid rgba(148, 163, 184, 0.1)',
                                    borderRadius: '1rem',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s ease',
                                    color: '#e2e8f0',
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.flag}</div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={onBack} style={{
                        flex: 1, padding: '0.875rem', background: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8',
                        border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                    }}>Back</button>
                    <button onClick={onNext} disabled={!selected} style={{
                        flex: 2, padding: '0.875rem',
                        background: selected ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'rgba(100, 116, 139, 0.2)',
                        color: selected ? '#fff' : '#64748b',
                        border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600,
                        cursor: selected ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                    }}>Continue</button>
                </div>
            </div>
        </div>
    );
};
