import React from 'react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    labels?: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, labels }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {Array.from({ length: totalSteps }, (_, i) => {
                const step = i + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;
                return (
                    <React.Fragment key={step}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.35rem',
                        }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: isCompleted ? '#22c55e' : isActive ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'rgba(100, 116, 139, 0.2)',
                                color: isCompleted || isActive ? '#fff' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                transition: 'all 0.3s ease',
                            }}>
                                {isCompleted ? '✓' : step}
                            </div>
                            {labels && labels[i] && (
                                <span style={{
                                    fontSize: '0.65rem',
                                    color: isActive ? '#e2e8f0' : '#64748b',
                                    fontWeight: isActive ? 600 : 400,
                                }}>{labels[i]}</span>
                            )}
                        </div>
                        {step < totalSteps && (
                            <div style={{
                                width: '40px',
                                height: '2px',
                                background: isCompleted ? '#22c55e' : 'rgba(100, 116, 139, 0.2)',
                                marginBottom: labels ? '1.2rem' : 0,
                                transition: 'background 0.3s ease',
                            }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};
