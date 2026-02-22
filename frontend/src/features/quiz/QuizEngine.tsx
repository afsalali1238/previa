import React, { useState } from 'react';
import { useQuizStore } from './store/quizStore';
import { useProviaStore } from '../roadmap/store/proviaStore';
import { CheckCircle, XCircle, Trophy, Clock } from 'lucide-react';

export const QuizEngine: React.FC<{ dayId: number; onClose: () => void }> = ({ dayId, onClose }) => {
  const { questions, currentIndex, submitAnswer, finishQuiz } = useQuizStore();
  const { completeDay } = useProviaStore();
  const [result, setResult] = useState<{ score: number; passed: boolean; cooldownMins: number; attemptsLeft?: number; lockedUntilTomorrow?: boolean } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  React.useEffect(() => {
    setTimeSpent(0);
  }, [currentIndex]);

  React.useEffect(() => {
    if (showFeedback || result) return;
    const interval = setInterval(() => {
      setTimeSpent(t => t + 1);
      setTotalTimeSpent(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showFeedback, result, currentIndex]);

  const currentQ = questions[currentIndex];
  const isCorrect = selectedAnswer !== null && currentQ && selectedAnswer === currentQ.correctAnswer;
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = (idx: number) => {
    if (showFeedback) return; // prevent double-tap
    setSelectedAnswer(idx);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    submitAnswer(selectedAnswer);

    if (isLast) {
      const res = finishQuiz(dayId);
      setResult(res);
      if (res.passed) {
        completeDay(dayId, res.score);
      }
    }

    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // ── Result Screen ──
  if (result) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-sm w-full space-y-6">
          <div className="flex justify-center mb-4 text-6xl">
            {result.passed ? <Trophy className="w-16 h-16 text-amber-500" /> : <Clock className="w-16 h-16 text-blue-500" />}
          </div>
          <h2 className="text-3xl font-black tracking-tighter italic" style={{ color: 'var(--text-primary)' }}>
            {result.passed ? 'MASTERY ACHIEVED!' : 'STUDY REQUIRED'}
          </h2>
          <div className="text-5xl font-mono" style={{ color: result.passed ? 'var(--accent-green)' : '#ef4444' }}>
            {Math.round(result.score)}%
          </div>

          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {result.passed
              ? 'Congratulations! You have unlocked the next day and earned 10 Hero Credits.'
              : result.lockedUntilTomorrow
                ? 'You have used all 3 attempts today. Come back tomorrow!'
                : `You didn't reach the 80% pass mark. Go review the topic and come back in 30 minutes. ${result.attemptsLeft ?? 0} attempt(s) remaining today.`
            }
          </p>

          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: 'var(--text-muted)' }}>Required</span>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>80%</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: 'var(--text-muted)' }}>Your Score</span>
              <span className="font-bold" style={{ color: result.passed ? 'var(--accent-green)' : '#ef4444' }}>{Math.round(result.score)}%</span>
            </div>
            <div className="flex justify-between text-xs mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Avg Time/Q</span>
              <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                {Math.floor(totalTimeSpent / questions.length / 60)}:{(Math.floor(totalTimeSpent / questions.length) % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-black text-xs tracking-widest active:scale-95 transition-transform"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            RETURN TO ROADMAP
          </button>
        </div>
      </div>
    );
  }

  // ── No question fallback ──
  if (!currentQ) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <button onClick={onClose} className="font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Back to Roadmap</button>
    </div>
  );

  // ── Quiz Screen ──
  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Progress bar */}
      <div className="h-2 w-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={onClose} className="p-1 rounded-lg active:scale-90" style={{ color: 'var(--text-muted)' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
          Day {dayId} · {currentIndex + 1}/{questions.length}
        </span>
        <div
          className="text-[11px] font-bold flex-shrink-0 w-12 text-right"
          style={{ color: timeSpent > 90 ? '#ef4444' : 'var(--text-muted)' }}
        >
          {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Question + Options */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-5 pt-6 overflow-y-auto pb-8">
        <h3 className="text-base font-bold leading-relaxed mb-6" style={{ color: 'var(--text-primary)' }}>
          {currentQ.question}
        </h3>

        <div className="space-y-3 flex-1">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrectOption = i === currentQ.correctAnswer;
            let borderColor = 'var(--border)';
            let bgColor = 'var(--bg-secondary)';
            let textColor = 'var(--text-secondary)';
            let labelBg = 'var(--bg-card)';
            let labelColor = 'var(--text-muted)';

            if (showFeedback) {
              if (isCorrectOption) {
                borderColor = '#10b981';
                bgColor = '#10b98110';
                textColor = 'var(--text-primary)';
                labelBg = '#10b98120';
                labelColor = '#10b981';
              } else if (isSelected && !isCorrectOption) {
                borderColor = '#ef4444';
                bgColor = '#ef444410';
                textColor = 'var(--text-primary)';
                labelBg = '#ef444420';
                labelColor = '#ef4444';
              }
            } else if (isSelected) {
              borderColor = 'var(--accent-blue)';
              bgColor = 'var(--accent-blue)' + '10';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showFeedback}
                className="w-full p-4 rounded-xl text-left flex items-center gap-3 transition-all active:scale-[0.98]"
                style={{ backgroundColor: bgColor, border: `1.5px solid ${borderColor}` }}
              >
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: labelBg, color: labelColor }}>
                  {showFeedback && isCorrectOption ? '✓' : showFeedback && isSelected && !isCorrectOption ? '✗' : String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm font-medium leading-snug" style={{ color: textColor }}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback + Next */}
        {showFeedback && (
          <div className="mt-4 space-y-3">
            {currentQ.explanation && (
              <div className="rounded-xl p-3" style={{ backgroundColor: isCorrect ? '#10b98110' : '#ef444410', border: `1px solid ${isCorrect ? '#10b98130' : '#ef444430'}` }}>
                <p className="flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>
                  {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{currentQ.explanation}</p>
              </div>
            )}
            {!currentQ.explanation && (
              <div className="rounded-xl p-3 text-center" style={{ backgroundColor: isCorrect ? '#10b98110' : '#ef444410', border: `1px solid ${isCorrect ? '#10b98130' : '#ef444430'}` }}>
                <p className="flex justify-center items-center gap-1.5 text-sm font-bold" style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>
                  {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {isCorrect ? 'Correct!' : `Incorrect — Answer: ${String.fromCharCode(65 + currentQ.correctAnswer)}`}
                </p>
              </div>
            )}
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl font-black text-xs tracking-widest text-white active:scale-95 transition-transform"
              style={{ backgroundColor: 'var(--accent-blue)' }}
            >
              {isLast ? 'FINISH TEST' : 'NEXT QUESTION →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
