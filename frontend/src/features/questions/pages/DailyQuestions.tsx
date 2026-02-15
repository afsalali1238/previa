import React, { useState, useCallback } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { QuizResults } from '../components/QuizResults';
import { getQuestionsForDay } from '../data/mockQuestions';
import type { Answer } from '../types/question.types';

interface DailyQuestionsProps {
    day: number;
    onComplete: (score: number, total: number) => void;
    onBack: () => void;
}

export const DailyQuestions: React.FC<DailyQuestionsProps> = ({ day, onComplete, onBack }) => {
    const questions = getQuestionsForDay(day);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = questions[currentIndex];

    // Safety check if questions are missing or index is out of bounds
    if (!currentQuestion) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>No questions found for Day {day}</div>;
    }

    const correctCount = answers.filter(a => a.isCorrect).length;

    const handleSelectAnswer = useCallback((index: number) => {
        if (showExplanation) return;
        setSelectedAnswer(index);
        setShowExplanation(true);

        const answer: Answer = {
            questionId: currentQuestion.id,
            selectedIndex: index,
            isCorrect: index === currentQuestion.correctAnswer,
            timeSpent: 0,
        };
        setAnswers(prev => [...prev, answer]);
    }, [showExplanation, currentQuestion]);

    const handleNext = useCallback(() => {
        if (currentIndex + 1 >= questions.length) {
            setIsComplete(true);
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    }, [currentIndex, questions.length]);

    const handleRetry = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setAnswers([]);
        setIsComplete(false);
    };

    const handleContinue = () => {
        onComplete(correctCount, questions.length);
    };

    if (isComplete) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f8fafc',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                color: '#1e293b',
            }}>
                <QuizResults
                    correct={correctCount}
                    total={questions.length}
                    onRetry={handleRetry}
                    onContinue={handleContinue}
                    isCheckpoint={false}
                />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            color: '#1e293b',
            padding: '1.5rem',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                maxWidth: '600px',
                margin: '0 auto 1.5rem',
            }}>
                <button onClick={onBack} style={{
                    background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
                    fontSize: '1.5rem', padding: '0.25rem',
                }}>←</button>
                <h2 style={{
                    fontSize: '1.1rem', fontWeight: 700,
                    color: '#0f172a',
                }}>Day {day}</h2>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    {correctCount}/{answers.length} ✓
                </span>
            </div>

            <QuestionCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswer}
                showExplanation={showExplanation}
                onSelectAnswer={handleSelectAnswer}
                onNext={handleNext}
            />
        </div>
    );
};
