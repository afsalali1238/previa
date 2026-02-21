import React, { useState } from 'react';
import { useProviaStore } from './store/proviaStore';
import { useQuizStore } from '../quiz/store/quizStore';
import type { Question } from '../quiz/store/quizStore';
import { QuizEngine } from '../quiz/QuizEngine';

const WORLD_NAMES = [
  "The Foundation",
  "The Engine",
  "The Lab",
  "Clinical Mastery",
  "Toxicology & Safety",
  "Advanced Pharmacotherapy",
  "The Final Boss"
];

const WORLD_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Orange
  "#8b5cf6", // Purple
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#f43f5e"  // Rose
];

export const Roadmap: React.FC = () => {
  const { roadmap, heroCredits, streak } = useProviaStore();
  const { startQuiz } = useQuizStore();
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDayClick = (dayId: number) => {
    try {
        // Mock data generator for testing Ghost Rule
        const mockQuestions: Question[] = [];
        for (let d = 1; d <= 45; d++) {
            for (let q = 1; q <= 60; q++) {
                mockQuestions.push({
                    id: `d${d}q${q}`,
                    question: `Sample Question ${q} for Day ${d}?`,
                    options: ['Option A', 'Option B', 'Option C', 'Option D'],
                    correctAnswer: 0,
                    explanation: 'Example explanation.',
                    topic: 'General Pharmacy',
                    dayId: d
                });
            }
        }

        startQuiz(dayId, mockQuestions); 
        setActiveDay(dayId);
        setError(null);
    } catch (e: any) {
        setError(e.message);
        setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4">
      {activeDay && (
        <QuizEngine dayId={activeDay} onClose={() => setActiveDay(null)} />
      )}

      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-8 py-4 rounded-3xl font-black shadow-[0_0_50px_rgba(225,68,100,0.4)] animate-bounce">
          ⚠️ {error}
        </div>
      )}

      {/* Header Stats */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-12 bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl sticky top-4 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 px-6 py-3 rounded-2xl border border-amber-500/20 flex items-center gap-3">
            <span className="text-xl">💎</span>
            <div className="flex flex-col">
              <span className="text-amber-500 font-black leading-none">{heroCredits}</span>
              <span className="text-[8px] uppercase font-black tracking-tighter text-amber-500/50">Hero Credits</span>
            </div>
          </div>
          <div className="bg-orange-500/10 px-6 py-3 rounded-2xl border border-orange-500/20 flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <div className="flex flex-col">
              <span className="text-orange-500 font-black leading-none">{streak}</span>
              <span className="text-[8px] uppercase font-black tracking-tighter text-orange-500/50">Day Streak</span>
            </div>
          </div>
        </div>
        <div className="text-right">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent italic tracking-tighter leading-none">PROVIA</h1>
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Mastery Program</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto space-y-16 relative pb-40">
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-emerald-500 via-orange-500 via-purple-500 to-rose-500 opacity-10 -translate-x-1/2 z-0" />

        {WORLD_NAMES.map((world, wIdx) => {
          const worldDays = roadmap.filter(d => d.worldId === wIdx + 1);
          return (
            <div key={world} className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-800" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 whitespace-nowrap">{world}</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-800" />
              </div>
              
              <div className="flex flex-col items-center gap-14">
                {worldDays.map((day, dIdx) => (
                  <button
                    key={day.id}
                    onClick={() => handleDayClick(day.id)}
                    disabled={!day.unlocked}
                    className={`
                      relative group flex items-center justify-center w-24 h-24 rounded-[2.5rem] rotate-45 transition-all duration-500
                      ${day.completed ? 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 
                        day.unlocked ? 'bg-slate-900 border-2 border-slate-700 hover:scale-110 active:scale-95 shadow-2xl hover:border-white/20' : 
                        'bg-slate-950 border border-slate-900 opacity-30'}
                    `}
                    style={{
                      borderColor: day.unlocked && !day.completed ? WORLD_COLORS[wIdx] : undefined,
                      marginLeft: dIdx % 2 === 0 ? '80px' : '-80px'
                    }}
                  >
                    <div className="-rotate-45 flex flex-col items-center">
                      <span className={`text-lg font-black ${day.unlocked ? 'text-white' : 'text-slate-700'}`}>{day.id}</span>
                      {day.completed ? (
                        <svg className="w-6 h-6 text-white animate-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : day.unlocked ? (
                        <div className="flex flex-col items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping mb-1" />
                            <span className="text-[8px] font-black text-blue-400 tracking-widest">START</span>
                        </div>
                      ) : (
                        <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>

                    {day.completed && (
                        <div className="absolute inset-0 rounded-[2.5rem] border-2 border-white/20 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
