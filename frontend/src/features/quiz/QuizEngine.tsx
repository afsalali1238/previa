import React, { useState, useEffect } from 'react';
import { useQuizStore } from './store/quizStore';
import { useProviaStore } from '../roadmap/store/proviaStore';
import { CheckCircle, XCircle, Trophy, Clock, Star, LayoutGrid, ArrowLeft, ArrowRight } from 'lucide-react';

export const QuizEngine: React.FC<{ dayId: number; onClose: () => void }> = ({ dayId, onClose }) => {
  const {
    questions, currentIndex, answers, bookmarked, mode,
    setAnswer, toggleBookmark, setCurrentIndex, finishQuiz
  } = useQuizStore();

  const { completeDay } = useProviaStore();
  const [result, setResult] = useState<{ score: number; passed: boolean; cooldownMins: number; attemptsLeft?: number; lockedUntilTomorrow?: boolean } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0); // For daily mode (count up)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(questions.length * 90); // For mock mode (count down, 90s per Q)
  const [showReview, setShowReview] = useState(false);

  // Time tracking
  useEffect(() => {
    if (result) return;
    const interval = setInterval(() => {
      setTotalTimeSpent(t => t + 1);

      if (mode === 'daily') {
        if (!showFeedback) setTimeSpent(t => t + 1);
      } else {
        setTimeLeft(t => {
          if (t <= 1) {
            handleFinalSubmit();
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [showFeedback, result, mode]);

  useEffect(() => {
    if (mode === 'daily') setTimeSpent(0);
  }, [currentIndex, mode]);

  const currentQ = questions[currentIndex];
  // Convert answers record to selected answer for this question
  const selectedAnswer = answers[currentIndex] ?? null;
  const isCorrect = selectedAnswer !== null && currentQ && selectedAnswer === currentQ.correctAnswer;
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = (idx: number) => {
    if (mode === 'daily') {
      if (showFeedback) return; // prevent double-tap
      setAnswer(currentIndex, idx);
      setShowFeedback(true);
    } else {
      // Mock mode: just select, no feedback
      setAnswer(currentIndex, idx);
    }
  };

  const handleNext = () => {
    if (mode === 'daily') {
      if (isLast) {
        handleFinalSubmit();
      } else {
        setCurrentIndex(currentIndex + 1);
        setShowFeedback(false);
      }
    } else {
      if (isLast) {
        setShowReview(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinalSubmit = () => {
    const res = finishQuiz(dayId);
    setResult(res);
    if (res.passed) {
      completeDay(dayId, res.score);
    }
    setShowReview(false);
  };

  // ── Result Screen ──
  if (result) {
    if (mode === 'mock') {
      const topicsStats = questions.reduce((acc, q, i) => {
        const topic = q.topic || 'General';
        if (!acc[topic]) acc[topic] = { total: 0, correct: 0 };
        acc[topic].total += 1;
        if (answers[i] === q.correctAnswer) acc[topic].correct += 1;
        return acc;
      }, {} as Record<string, { total: number; correct: number }>);

      const totalCorrect = Object.values(topicsStats).reduce((sum, s) => sum + s.correct, 0);
      const totalItems = questions.length;

      const confNumber = Math.floor(Math.random() * 8999999999) + 1000000000; // Fake 10 digit

      return (
        <div className="fixed inset-0 z-[100] bg-[#fafafa] flex flex-col p-4 md:p-8 overflow-y-auto font-sans">
          <div className="max-w-3xl w-full mx-auto bg-white shadow-xl shadow-slate-200/50 p-6 md:p-12 mt-4 md:mt-10" style={{ borderTop: '4px solid #3b82f6' }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 text-xs text-slate-800 gap-4">
              <div>
                <h1 className="text-sm md:text-base font-bold text-slate-900 mb-1">PROVIA Pharmacy Prometric Exam</h1>
                <p className="text-slate-500">Day {dayId} Checkpoint / Mock</p>
              </div>
              <div className="text-right space-y-1 w-full md:w-auto flex flex-col items-start md:items-end">
                <p><span className="font-semibold text-slate-600">Date of Exam:</span> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p><span className="font-semibold text-slate-600">Confirmation Number:</span> {confNumber}</p>
                <p><span className="font-semibold text-slate-600">Govt ID/ Passport:</span> P-REVIEW-MODE</p>
                <p><span className="font-semibold text-slate-600">Exam Center:</span> 8824</p>
              </div>
            </div>

            {/* Score & Title */}
            <div className="text-center mb-10">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Your Exam Result = {Math.round(result.score)}%</h2>
              <h3 className="text-base font-semibold text-slate-700">Diagnostic Information</h3>
            </div>

            {/* Table */}
            <div className="w-full">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 border-b-2 border-slate-800 text-xs font-bold text-slate-800">
                <div className="col-span-8"></div>
                <div className="col-span-2 text-center">Number of Items Correct</div>
                <div className="col-span-2 text-center">Total Number of Items</div>
              </div>

              {/* Table Body */}
              <div className="text-sm text-slate-700">
                {Object.entries(topicsStats).map(([topicName, stats], i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 py-4 border-b border-slate-200 items-center">
                    <div className="col-span-8 font-medium pr-4">{topicName}</div>
                    <div className="col-span-2 text-center font-semibold">{stats.correct}</div>
                    <div className="col-span-2 text-center">{stats.total}</div>
                  </div>
                ))}

                {/* Total Row */}
                <div className="grid grid-cols-12 gap-4 py-4 border-b-2 border-slate-800 items-center font-bold text-slate-900">
                  <div className="col-span-8">Total</div>
                  <div className="col-span-2 text-center">{totalCorrect}</div>
                  <div className="col-span-2 text-center">{totalItems}</div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white font-bold text-xs tracking-widest hover:bg-slate-800 transition-colors uppercase"
              >
                Close Report & Return
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Daily Mode Mastery Screen
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
              : mode === 'daily'
                ? result.lockedUntilTomorrow
                  ? 'You have used all 3 attempts today. Come back tomorrow!'
                  : `You didn't reach the 80% pass mark. Go review the topic and come back in 30 minutes. ${result.attemptsLeft ?? 0} attempt(s) remaining today.`
                : 'You did not reach the 80% pass mark for this test. Keep studying!'
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

  // ── Review Screen (Mock Mode Only) ──
  if (showReview) {
    const answeredCount = Object.keys(answers).length;
    return (
      <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-md">
        <div className="flex-1 overflow-y-auto px-4 py-8 max-w-lg mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white">Review Answers</h2>
            <p className="text-slate-400 text-sm mt-1">
              Answered: <span className="text-emerald-400 font-bold">{answeredCount}</span> / {questions.length}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {questions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isMarked = bookmarked[idx] || false;

              let bg = 'var(--bg-card)';
              let border = 'var(--border)';
              if (isAnswered) {
                bg = 'var(--accent-blue)';
                border = 'var(--accent-blue)';
              }

              return (
                <button
                  key={idx}
                  onClick={() => { setShowReview(false); setCurrentIndex(idx); }}
                  className="aspect-square rounded-xl flex items-center justify-center font-bold text-sm relative transition-transform active:scale-90"
                  style={{ backgroundColor: bg, border: `1px solid ${border}`, color: isAnswered ? '#fff' : 'var(--text-secondary)' }}
                >
                  {idx + 1}
                  {isMarked && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 border border-slate-900 flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-slate-900 fill-slate-900" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        <div className="p-4 max-w-lg mx-auto w-full flex gap-3 pb-8">
          <button
            onClick={() => setShowReview(false)}
            className="flex-1 py-4 rounded-2xl font-black text-xs tracking-widest text-white border border-slate-700 active:scale-95"
          >
            BACK
          </button>
          <button
            onClick={handleFinalSubmit}
            className="flex-1 py-4 rounded-2xl font-black text-xs tracking-widest text-white bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            SUBMIT TEST
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

  // Formatter for time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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
          {mode === 'mock' ? 'MOCK EXAM' : `Day ${dayId}`} · {currentIndex + 1}/{questions.length}
        </span>
        <div
          className="text-[11px] font-bold flex-shrink-0 w-12 text-right"
          style={{ color: (mode === 'daily' && timeSpent > 90) || (mode === 'mock' && timeLeft < 60) ? '#ef4444' : 'var(--text-muted)' }}
        >
          {mode === 'daily' ? formatTime(timeSpent) : formatTime(timeLeft)}
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

            if (mode === 'daily' && showFeedback) {
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
              textColor = 'var(--text-primary)';
              labelBg = 'var(--accent-blue)';
              labelColor = '#fff';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={mode === 'daily' && showFeedback}
                className="w-full p-4 rounded-xl text-left flex items-center gap-3 transition-all active:scale-[0.98]"
                style={{ backgroundColor: bgColor, border: `1.5px solid ${borderColor}` }}
              >
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: labelBg, color: labelColor }}>
                  {mode === 'daily' && showFeedback && isCorrectOption ? '✓' : mode === 'daily' && showFeedback && isSelected && !isCorrectOption ? '✗' : String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm font-medium leading-snug" style={{ color: textColor }}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback (Daily Mode Only) */}
        {mode === 'daily' && showFeedback && (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl p-3" style={{ backgroundColor: isCorrect ? '#10b98110' : '#ef444410', border: `1px solid ${isCorrect ? '#10b98130' : '#ef444430'}` }}>
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>
                {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {!isCorrect && (
                <p className="text-xs font-semibold mt-1 mb-1" style={{ color: 'var(--text-primary)' }}>
                  Correct Answer: {currentQ.options[currentQ.correctAnswer]}
                </p>
              )}
              {currentQ.explanation && currentQ.explanation.trim() !== '' && (
                <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>{currentQ.explanation}</p>
              )}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl font-black text-xs tracking-widest text-white active:scale-95 transition-transform"
              style={{ backgroundColor: 'var(--accent-blue)' }}
            >
              {isLast ? 'FINISH TEST' : 'NEXT QUESTION →'}
            </button>
          </div>
        )}

        {/* Mock Mode Navigation */}
        {mode === 'mock' && (
          <div className="mt-6 pt-4 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => toggleBookmark(currentIndex)}
              className="py-3.5 px-4 rounded-xl flex items-center justify-center active:scale-95 transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid ${bookmarked[currentIndex] ? '#f59e0b' : 'var(--border)'}` }}
            >
              <Star className={`w-5 h-5 ${bookmarked[currentIndex] ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            </button>

            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="py-3.5 px-4 rounded-xl flex items-center justify-center active:scale-95 disabled:opacity-30"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowReview(true)}
              className="py-3.5 px-4 rounded-xl flex items-center justify-center active:scale-95"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="flex-1 py-3.5 rounded-xl font-black text-xs tracking-widest text-white active:scale-95 flex items-center justify-center gap-1"
              style={{ backgroundColor: 'var(--accent-blue)' }}
            >
              {isLast ? 'REVIEW' : 'NEXT'}
              {!isLast && <ArrowRight className="w-4 h-4 ml-1" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
