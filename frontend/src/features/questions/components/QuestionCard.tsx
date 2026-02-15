import React from 'react';
import type { Question } from '../types/question.types';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    selectedAnswer: number | null;
    showExplanation: boolean;
    onSelectAnswer: (index: number) => void;
    onNext: () => void;
}

const optionLabels = ['A', 'B', 'C', 'D'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question, questionNumber, totalQuestions, selectedAnswer, showExplanation, onSelectAnswer, onNext
}) => {
    return (
        <div style={{
            maxWidth: '600px',
            width: '100%',
            margin: '0 auto',
        }}>
            {/* Progress */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Question {questionNumber}/{totalQuestions}</span>
                    {question.category && (
                        <span style={{
                            fontSize: '0.7rem', color: '#2563eb', background: '#eff6ff',
                            padding: '0.2rem 0.6rem', borderRadius: '1rem', fontWeight: 600,
                        }}>{question.category}</span>
                    )}
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                    <div style={{
                        height: '100%', borderRadius: '3px', transition: 'width 0.3s ease',
                        background: '#2563eb',
                        width: `${(questionNumber / totalQuestions) * 100}%`,
                    }} />
                </div>
            </div>

            {/* Question */}
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 600, color: '#0f172a' }}>{question.text}</p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {question.options.map((option, i) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = i === question.correctAnswer;
                    const showResult = showExplanation;

                    let bg = '#ffffff';
                    let border = '1px solid #e2e8f0';
                    let textColor = '#334155';
                    let shadow = '0 1px 2px rgba(0,0,0,0.05)';

                    if (showResult) {
                        if (isCorrect) {
                            bg = '#f0fdf4'; // green-50
                            border = '2px solid #22c55e';
                            textColor = '#15803d'; // green-700
                        } else if (isSelected && !isCorrect) {
                            bg = '#fef2f2'; // red-50
                            border = '2px solid #ef4444';
                            textColor = '#b91c1c'; // red-700
                        }
                    } else if (isSelected) {
                        bg = '#eff6ff'; // blue-50
                        border = '2px solid #2563eb';
                        textColor = '#1e40af'; // blue-800
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => !showExplanation && onSelectAnswer(i)}
                            disabled={showExplanation}
                            style={{
                                padding: '1rem 1.25rem',
                                background: bg,
                                border,
                                borderRadius: '0.75rem',
                                cursor: showExplanation ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                transition: 'all 0.2s ease',
                                color: textColor,
                                textAlign: 'left',
                                boxShadow: shadow,
                            }}
                        >
                            <span style={{
                                minWidth: '28px', height: '28px', borderRadius: '50%',
                                background: showResult && isCorrect ? '#22c55e' : showResult && isSelected && !isCorrect ? '#ef4444' : '#f1f5f9',
                                color: showResult && (isCorrect || isSelected) ? '#fff' : '#64748b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                            }}>
                                {showResult && isCorrect ? '✓' : showResult && isSelected && !isCorrect ? '✗' : optionLabels[i]}
                            </span>
                            <span style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{option}</span>
                        </button>
                    );
                })}
            </div>

            {/* Explanation */}
            {showExplanation && (
                <div style={{
                    backgroundColor: '#eff6ff', // blue-50
                    border: '1px solid #dbeafe', // blue-100
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb', marginBottom: '0.5rem' }}>💡 Explanation</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#334155' }}>{question.explanation}</p>
                </div>
            )}

            {/* Next Button */}
            {showExplanation && (
                <button
                    onClick={onNext}
                    style={{
                        width: '100%',
                        padding: '0.875rem',
                        background: '#2563eb', // Solid blue
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'transform 0.15s',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    {/* Show different text for last question */}
                    Next Question →
                </button>
            )}
        </div>
    );
};
