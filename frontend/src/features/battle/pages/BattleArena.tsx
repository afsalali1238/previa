import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BATTLE_QUESTIONS } from '../data/battle.data';
import type { Opponent } from '../data/battle.data';

interface BattleArenaProps {
    opponent: Opponent;
    onComplete: (won: boolean, xpEarned: number) => void;
    onBack: () => void;
}

const TIMER_SECONDS = 15;

export const BattleArena: React.FC<BattleArenaProps> = ({ opponent, onComplete, onBack }) => {
    const [phase, setPhase] = useState<'countdown' | 'playing' | 'result'>('countdown');
    const [countdown, setCountdown] = useState(3);
    const [qIndex, setQIndex] = useState(0);
    const [timer, setTimer] = useState(TIMER_SECONDS);
    const [playerScore, setPlayerScore] = useState(0);
    const [oppScore, setOppScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    const question = BATTLE_QUESTIONS[qIndex];

    // Countdown phase
    useEffect(() => {
        if (phase !== 'countdown') return;
        if (countdown <= 0) { setPhase('playing'); return; }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [phase, countdown]);

    // Question timer
    useEffect(() => {
        if (phase !== 'playing' || showAnswer) return;
        timerRef.current = setInterval(() => {
            setTimer(t => {
                if (t <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    handleTimeout();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [phase, qIndex, showAnswer]);

    const handleTimeout = useCallback(() => {
        setShowAnswer(true);
        // Opponent "answers" with some probability
        const oppCorrect = Math.random() < (opponent.winRate / 100);
        if (oppCorrect) setOppScore(s => s + 1);
        setTimeout(() => nextQuestion(), 1500);
    }, [qIndex, opponent.winRate]);

    const handleAnswer = (idx: number) => {
        if (selected !== null || showAnswer) return;
        if (timerRef.current) clearInterval(timerRef.current);
        setSelected(idx);
        setShowAnswer(true);

        const correct = idx === question.correctAnswer;
        if (correct) setPlayerScore(s => s + 1);

        // Simulate opponent
        const oppCorrect = Math.random() < (opponent.winRate / 100);
        if (oppCorrect) setOppScore(s => s + 1);

        setTimeout(() => nextQuestion(), 1500);
    };

    const nextQuestion = () => {
        if (qIndex + 1 >= BATTLE_QUESTIONS.length) {
            setPhase('result');
        } else {
            setQIndex(i => i + 1);
            setSelected(null);
            setShowAnswer(false);
            setTimer(TIMER_SECONDS);
        }
    };

    // ─── COUNTDOWN ───
    if (phase === 'countdown') {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: '#f8fafc',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#1e293b',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🧑</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>You</div>
                    </div>
                    <div style={{
                        fontSize: '1.5rem', fontWeight: 800,
                        color: '#f59e0b',
                    }}>VS</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{opponent.avatar}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{opponent.name.split(' ')[0]}</div>
                    </div>
                </div>
                <div style={{
                    fontSize: '5rem', fontWeight: 800,
                    color: '#f59e0b',
                }}>{countdown || 'GO!'}</div>
            </div>
        );
    }

    // ─── RESULT ───
    if (phase === 'result') {
        const won = playerScore > oppScore;
        const tie = playerScore === oppScore;
        const xpEarned = won ? 100 : tie ? 30 : 10;
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: '#f8fafc',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#1e293b',
                padding: '2rem', textAlign: 'center',
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    {won ? '🏆' : tie ? '🤝' : '😤'}
                </div>
                <h2 style={{
                    fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem',
                    color: won ? '#16a34a' : tie ? '#d97706' : '#dc2626',
                }}>
                    {won ? 'Victory!' : tie ? 'Draw!' : 'Defeated!'}
                </h2>

                <div style={{
                    display: 'flex', gap: '2rem', alignItems: 'center',
                    marginBottom: '2rem', marginTop: '1rem',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem' }}>🧑</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>{playerScore}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>You</div>
                    </div>
                    <div style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 700 }}>—</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem' }}>{opponent.avatar}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{oppScore}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{opponent.name.split(' ')[0]}</div>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#fffbeb', borderRadius: '1rem', // amber-50
                    padding: '0.75rem 1.5rem', marginBottom: '2rem',
                    border: '1px solid #fcd34d',
                }}>
                    <span style={{ color: '#d97706', fontWeight: 700 }}>+{xpEarned} XP</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                    <button onClick={onBack} style={{
                        flex: 1, padding: '0.875rem', background: '#f1f5f9',
                        color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '0.75rem',
                        fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                    }}>Back</button>
                    <button onClick={() => onComplete(won, xpEarned)} style={{
                        flex: 2, padding: '0.875rem',
                        background: '#2563eb',
                        color: '#fff', border: 'none', borderRadius: '0.75rem',
                        fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                    }}>Continue</button>
                </div>
            </div>
        );
    }

    // ─── PLAYING ───
    const timerColor = timer <= 5 ? '#ef4444' : timer <= 10 ? '#f59e0b' : '#22c55e';

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#1e293b', padding: '1.5rem',
        }}>
            <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                {/* Score Bar */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '1rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>🧑</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>{playerScore}</span>
                    </div>
                    <div style={{
                        fontSize: '2rem', fontWeight: 800, color: timerColor,
                        minWidth: '50px', textAlign: 'center',
                    }}>{timer}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{oppScore}</span>
                        <span style={{ fontSize: '1.25rem' }}>{opponent.avatar}</span>
                    </div>
                </div>

                {/* Timer Bar */}
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', marginBottom: '1.5rem' }}>
                    <div style={{
                        height: '100%', borderRadius: '3px', background: timerColor,
                        width: `${(timer / TIMER_SECONDS) * 100}%`, transition: 'width 1s linear',
                    }} />
                </div>

                {/* Question count */}
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                    Question {qIndex + 1} of {BATTLE_QUESTIONS.length}
                </div>

                {/* Question */}
                <div style={{
                    backgroundColor: '#ffffff', borderRadius: '1rem',
                    padding: '1.25rem', marginBottom: '1rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}>
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, fontWeight: 600, color: '#0f172a' }}>{question.text}</p>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {question.options.map((opt, i) => {
                        const isSelected = selected === i;
                        const isCorrect = i === question.correctAnswer;
                        let bg = '#ffffff';
                        let border = '1px solid #e2e8f0';
                        let color = '#334155';
                        let shadow = '0 1px 2px rgba(0,0,0,0.05)';

                        if (showAnswer && isCorrect) {
                            bg = '#f0fdf4'; border = '2px solid #22c55e'; color = '#15803d';
                        }
                        else if (showAnswer && isSelected && !isCorrect) {
                            bg = '#fef2f2'; border = '2px solid #ef4444'; color = '#b91c1c';
                        }

                        return (
                            <button key={i} onClick={() => handleAnswer(i)} disabled={showAnswer} style={{
                                padding: '0.875rem 1rem', background: bg, border, borderRadius: '0.75rem',
                                cursor: showAnswer ? 'default' : 'pointer', color,
                                fontSize: '0.95rem', textAlign: 'left', transition: 'all 0.2s',
                                boxShadow: shadow,
                            }}>
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
