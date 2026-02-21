import React, { useState } from 'react';
import { useQuizStore } from './store/quizStore';
import { useProviaStore } from '../roadmap/store/proviaStore';

export const QuizEngine: React.FC<{ dayId: number; onClose: () => void }> = ({ dayId, onClose }) => {
  const { questions, currentIndex, submitAnswer, finishQuiz } = useQuizStore();
  const { completeDay } = useProviaStore();
  const [result, setResult] = useState<{ score: number; passed: boolean; cooldownMins: number } | null>(null);
  const [showGate, setShowGate] = useState(true);

  const handleAnswer = (idx: number) => {
    submitAnswer(idx);
    if (currentIndex === questions.length - 1) {
      const res = finishQuiz(dayId);
      setResult(res);
      if (res.passed) {
        completeDay(dayId, res.score);
      }
    }
  };

  if (showGate) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 text-center">
        <div className="max-w-sm w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl">
          <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto text-4xl">📚</div>
          <div>
            <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">Mission Activation</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Are you ready to start today's test? Review the <span className="text-blue-400 font-bold">Telegram Study Materials</span> before proceeding.
            </p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => setShowGate(false)}
              className="w-full py-4 bg-blue-600 rounded-2xl font-black text-xs tracking-widest hover:bg-blue-500 transition-all shadow-lg"
            >
              LAUNCH TEST
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-800 rounded-2xl font-black text-xs tracking-widest text-slate-400 hover:bg-slate-700 transition-all"
            >
              NOT READY
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-sm w-full space-y-6">
          <div className={`text-6xl mb-4 ${result.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
            {result.passed ? '🎉' : '⏳'}
          </div>
          <h2 className="text-3xl font-black tracking-tighter italic">{result.passed ? 'MASTERY ACHIEVED!' : 'STUDY REQUIRED'}</h2>
          <div className="text-5xl font-mono text-blue-400">{Math.round(result.score)}%</div>
          
          <p className="text-slate-400 text-sm">
            {result.passed 
              ? `Congratulations! You have unlocked the next day and earned 10 Hero Credits.` 
              : `You didn't reach the 80% mastery threshold. A ${result.cooldownMins} minute cooldown is active. Go back and learn the topic.`}
          </p>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-800 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-700 transition-all"
          >
            RETURN TO ROADMAP
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center">
        <button onClick={onClose} className="text-slate-500 font-bold uppercase tracking-widest">Back to Roadmap</button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in fade-in duration-500">
      <div className="h-2 bg-slate-900 w-full">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
          style={{ width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-6 pt-12 overflow-y-auto pb-12">
        <div className="mb-8">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Day {dayId} Mission • {currentIndex + 1} / {questions.length || 0}</span>
          <h3 className="text-xl font-bold mt-4 leading-relaxed tracking-tight">{currentQ.question}</h3>
        </div>

        <div className="space-y-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full p-6 bg-slate-900 border border-slate-800 rounded-[2rem] text-left hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-black group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors uppercase">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-slate-300 font-medium leading-snug group-hover:text-white transition-colors">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
