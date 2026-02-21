import React, { useRef, useState, useEffect } from 'react';
import { StepIndicator } from '../components/StepIndicator';
import type { Territory, Specialty } from '../types/onboarding.types';

interface ContractPledgeProps {
    territory: Territory;
    specialty: Specialty;
    userName: string;
    onComplete: (signature: string) => void;
    onBack: () => void;
}

export const ContractPledge: React.FC<ContractPledgeProps> = ({ territory, specialty, userName, onComplete, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const today = new Date();
    const completion = new Date(today);
    completion.setDate(completion.getDate() + 45);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
    }, []);

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
    };

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(true);
        setHasSigned(true);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const endDraw = () => setIsDrawing(false);

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSigned(false);
    };

    const handleSubmit = () => {
        const dataUrl = canvasRef.current?.toDataURL() || '';
        onComplete(dataUrl);
    };

    const canSubmit = hasSigned && agreed;

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
            <div style={{ maxWidth: '520px', width: '100%', paddingTop: '2rem' }}>
                <StepIndicator currentStep={3} totalSteps={3} labels={['Territory', 'Specialty', 'Contract']} />

                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem' }}>
                    The Hero's Pledge ✍️
                </h2>

                {/* Contract Text */}
                <div style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    color: '#cbd5e1',
                }}>
                    <p style={{ marginBottom: '1rem' }}>
                        I, <strong style={{ color: '#60a5fa' }}>{userName}</strong>, commit to completing the
                        PROVIA 45-Day Challenge.
                    </p>
                    <p style={{ marginBottom: '0.75rem' }}>I understand that:</p>
                    <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.35rem' }}>I must complete each day's content before unlocking the next</li>
                        <li style={{ marginBottom: '0.35rem' }}>Days 1-5 are free, Day 6+ requires payment or 3 referrals</li>
                        <li style={{ marginBottom: '0.35rem' }}>My streak resets if I miss a day</li>
                        <li>I can repair my streak max 2 times</li>
                    </ul>
                    <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.1)', paddingTop: '0.75rem', fontSize: '0.85rem' }}>
                        <div>🎯 Target Exam: <strong>{territory.flag} {territory.name} — {specialty.name}</strong></div>
                        <div>📅 Start Date: <strong>{today.toLocaleDateString()}</strong></div>
                        <div>🏁 Expected Completion: <strong>{completion.toLocaleDateString()}</strong></div>
                    </div>
                </div>

                {/* Signature Canvas */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Your Signature</label>
                        {hasSigned && (
                            <button onClick={clearSignature} style={{
                                background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem',
                            }}>Clear</button>
                        )}
                    </div>
                    <canvas
                        ref={canvasRef}
                        width={460}
                        height={120}
                        style={{
                            width: '100%',
                            height: '120px',
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            borderRadius: '0.75rem',
                            border: hasSigned ? '2px solid #2563eb' : '2px dashed rgba(148, 163, 184, 0.3)',
                            cursor: 'crosshair',
                            touchAction: 'none',
                        }}
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={endDraw}
                        onMouseLeave={endDraw}
                        onTouchStart={startDraw}
                        onTouchMove={draw}
                        onTouchEnd={endDraw}
                    />
                    {!hasSigned && <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem', textAlign: 'center' }}>Draw your signature above</p>}
                </div>

                {/* Agree Checkbox */}
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#94a3b8',
                }}>
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                    />
                    I agree to the Terms & Conditions
                </label>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={onBack} style={{
                        flex: 1, padding: '0.875rem', background: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8',
                        border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                    }}>Back</button>
                    <button onClick={handleSubmit} disabled={!canSubmit} style={{
                        flex: 2, padding: '0.875rem',
                        background: canSubmit ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(100, 116, 139, 0.2)',
                        color: canSubmit ? '#fff' : '#64748b',
                        border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700,
                        cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                    }}>🚀 Start Day 1!</button>
                </div>
            </div>
        </div>
    );
};
