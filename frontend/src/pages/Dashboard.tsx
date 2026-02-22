import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../features/auth/store/authStore';
import { useProviaStore, type ProviaState } from '../features/roadmap/store/proviaStore';
import { useQuizStore } from '../features/quiz/store/quizStore';
import { useThemeStore } from '../features/theme/themeStore';
import type { Question } from '../features/quiz/store/quizStore';
import { QuizEngine } from '../features/quiz/QuizEngine';
import rawQuestions from '../features/questions/data/final_questionnaire_data.json';

// Map raw JSON to Question interface
const ALL_QUESTIONS: Question[] = (rawQuestions as Array<{ day: number; text: string; options: string[]; correctAnswer: number; explanation: string; category: string }>).map((q, i) => ({
  id: `q-${i}`,
  question: q.text,
  options: q.options,
  correctAnswer: q.correctAnswer,
  explanation: q.explanation || '',
  topic: q.category,
  dayId: q.day,
}));

/* ═══ CONSTANTS ═══ */
const WORLD_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#f43f5e"];
const WORLD_NAMES = ["Foundation", "The Engine", "The Lab", "Clinical Mastery", "Toxicology & Safety", "Advanced Pharmaco", "Final Boss"];

const MILESTONE_TESTS = [
  { id: 'mt-10', title: 'Checkpoint 1', subtitle: 'Days 1–10 Review', requiredDay: 10, icon: '🏁', color: '#3b82f6', dayRange: [1, 10] },
  { id: 'mt-20', title: 'Checkpoint 2', subtitle: 'Days 11–20 Review', requiredDay: 20, icon: '🎯', color: '#10b981', dayRange: [11, 20] },
  { id: 'mt-30', title: 'Checkpoint 3', subtitle: 'Days 21–30 Review', requiredDay: 30, icon: '⚡', color: '#f59e0b', dayRange: [21, 30] },
  { id: 'mt-40', title: 'Checkpoint 4', subtitle: 'Days 31–40 Review', requiredDay: 40, icon: '🔥', color: '#8b5cf6', dayRange: [31, 40] },
  { id: 'mt-45', title: 'Full Mock Exam', subtitle: 'All 45 Days — Final Boss', requiredDay: 45, icon: '👑', color: '#f43f5e', dayRange: [1, 45] },
];

const DISCUSSION_CATEGORIES = [
  {
    id: 'materials', title: 'Study Materials', icon: '📚', color: '#3b82f6', threads: [
      { title: 'Best resources for Adrenergic Pharmacology?', user: 'Dr. Fatima', replies: 12, time: '2h ago' },
      { title: 'Diuretics video notes — sharing my summary', user: 'PharmAli', replies: 8, time: '5h ago' },
      { title: 'CVS pharmacology cheat sheet (PDF)', user: 'Sara_RX', replies: 23, time: '1d ago' },
    ]
  },
  {
    id: 'doubts', title: 'Doubts & Questions', icon: '❓', color: '#f59e0b', threads: [
      { title: 'Suspension vs Emulsion — key differences?', user: 'RxStudent', replies: 15, time: '3h ago' },
      { title: 'How to calculate milli-equivalence?', user: 'MedNerd99', replies: 6, time: '6h ago' },
      { title: 'α1 vs α2 receptor subtypes confusion', user: 'PharmQueen', replies: 19, time: '1d ago' },
    ]
  },
  {
    id: 'tips', title: 'Exam Tips & Strategy', icon: '💡', color: '#10b981', threads: [
      { title: 'My 45-day study plan that worked', user: 'Dr. Faisal', replies: 34, time: '4h ago' },
      { title: 'How to handle exam anxiety on test day', user: 'GulfExamPrep', replies: 11, time: '12h ago' },
    ]
  },
  {
    id: 'general', title: 'General Chat', icon: '💬', color: '#8b5cf6', threads: [
      { title: "Day 16 gang — who's studying today?", user: 'PharmAli', replies: 7, time: '1h ago' },
      { title: 'Just passed my DHA exam! AMA', user: 'Dr. Noor', replies: 45, time: '3d ago' },
    ]
  },
];

/* ═══ HOME TAB ═══ */
const HomeTab: React.FC<{ onStartQuiz: (dayId: number) => void }> = ({ onStartQuiz }) => {
  const { heroCredits, streak, roadmap } = useProviaStore();
  const completedDays = roadmap.filter(d => d.completed).length;
  const currentDay = roadmap.find(d => d.unlocked && !d.completed)?.id || 1;
  const progress = Math.round((completedDays / 45) * 100);

  return (
    <div className="px-4 pt-5 pb-8 space-y-5">
      {/* Progress Card */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>45-Day Progress</p>
            <h2 className="text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>Day {currentDay}</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {roadmap.find(d => d.id === currentDay)?.title || 'Ready'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black" style={{ color: 'var(--accent-blue)' }}>{completedDays}</span>
            <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>/45</span>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000" style={{ width: `${Math.max(progress, 2)}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '💎', value: heroCredits, label: 'Hero Credits', color: '#f59e0b' },
          { icon: '🔥', value: streak, label: 'Day Streak', color: '#f97316' },
          { icon: '✅', value: completedDays, label: 'Days Done', color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <span className="text-xl">{s.icon}</span>
            <p className="text-lg font-black mt-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* 45-Day Grid */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>45-Day Progress</h3>
          <span className="text-sm font-black" style={{ color: 'var(--accent-blue)' }}>{completedDays}/45</span>
        </div>
        <RoadmapGrid onDayClick={onStartQuiz} />
      </div>
    </div>
  );
};

/* ═══ ROADMAP GRID ═══ */
const RoadmapGrid: React.FC<{ onDayClick?: (dayId: number) => void }> = ({ onDayClick }) => {
  const { roadmap } = useProviaStore();
  const { getAttemptInfo } = useQuizStore();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showStudyConfirm, setShowStudyConfirm] = useState(false);
  const selected = roadmap.find(d => d.id === selectedDay);
  const attemptInfo = selectedDay ? getAttemptInfo(selectedDay) : null;

  const handleTap = (day: typeof roadmap[0]) => {
    setSelectedDay(day.id);
    setShowStudyConfirm(false);
  };

  const handleConfirmStudied = () => {
    if (selectedDay) {
      setShowStudyConfirm(false);
      setSelectedDay(null);
      onDayClick?.(selectedDay);
    }
  };

  return (
    <>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}>
        {roadmap.map((day) => {
          const isCompleted = day.completed;
          const isCurrent = day.unlocked && !day.completed;
          const isLocked = !day.unlocked;
          const worldColor = WORLD_COLORS[(day.worldId || 1) - 1];

          return (
            <button
              key={day.id}
              onClick={() => handleTap(day)}
              className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-transform active:scale-90"
              style={{
                backgroundColor: isCompleted ? '#10b981' : isCurrent ? 'var(--bg-secondary)' : 'var(--bg-card)',
                border: isCurrent ? `2px solid ${worldColor}` : isCompleted ? 'none' : '1px solid var(--border-subtle)',
                color: isCompleted ? 'white' : isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                opacity: isLocked ? 0.45 : 1,
                minHeight: '34px',
                cursor: 'pointer',
              }}
            >
              {isCompleted ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : day.id}
            </button>
          );
        })}
      </div>

      {/* Day Detail Sheet */}
      {selectedDay && selected && !showStudyConfirm && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedDay(null)}>
          <div className="w-full max-w-lg rounded-t-3xl p-5 pb-8" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--border)' }} />

            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: WORLD_COLORS[(selected.worldId || 1) - 1] }}>
                  Day {selected.id} · {WORLD_NAMES[(selected.worldId || 1) - 1]}
                </span>
                <h3 className="text-lg font-black mt-0.5" style={{ color: 'var(--text-primary)' }}>{selected.title}</h3>
              </div>
              {selected.completed ? (
                <span className="text-2xl">✅</span>
              ) : !selected.unlocked ? (
                <span className="text-2xl">🔒</span>
              ) : null}
            </div>

            {/* Main Topic Banner */}
            <div className="rounded-xl p-3.5 mb-3" style={{ backgroundColor: WORLD_COLORS[(selected.worldId || 1) - 1] + '12', border: `1px solid ${WORLD_COLORS[(selected.worldId || 1) - 1]}30` }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: WORLD_COLORS[(selected.worldId || 1) - 1] }}>📚 Main Topic</p>
              <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{selected.title}</p>
            </div>

            {/* Sub-Topics */}
            {selected.subTopics.length > 0 && (
              <div className="space-y-1.5 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Also Covered</p>
                {selected.subTopics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: WORLD_COLORS[(selected.worldId || 1) - 1] }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{topic}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Locked Day Notice */}
            {!selected.unlocked && (
              <div className="rounded-xl p-3 mb-4 text-center" style={{ backgroundColor: '#f59e0b10', border: '1px solid #f59e0b30' }}>
                <p className="text-xs font-bold" style={{ color: '#f59e0b' }}>🔒 Complete previous days to unlock this test</p>
              </div>
            )}

            {/* Attempt Info — only for unlocked days */}
            {selected.unlocked && attemptInfo && (
              <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>Attempts today</span>
                  <span className="font-bold" style={{ color: attemptInfo.attemptsLeft > 0 ? 'var(--accent-green)' : '#ef4444' }}>
                    {attemptInfo.attemptsUsed}/3 used
                  </span>
                </div>
                {attemptInfo.isLockedToday && (
                  <p className="text-[11px] font-bold mt-2" style={{ color: '#ef4444' }}>❌ 3 attempts used today. Come back tomorrow!</p>
                )}
                {attemptInfo.cooldownUntil && !attemptInfo.isLockedToday && (
                  <p className="text-[11px] font-bold mt-2" style={{ color: '#f59e0b' }}>
                    ⏳ Go refer the topic and come back at {new Date(attemptInfo.cooldownUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>Pass mark: 80% · 3 attempts per day</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setSelectedDay(null)} className="flex-1 py-3.5 rounded-xl text-xs font-black tracking-widest active:scale-95" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                CLOSE
              </button>
              {selected.unlocked && (
                <button onClick={() => setShowStudyConfirm(true)} className="flex-1 py-3.5 rounded-xl text-xs font-black tracking-widest text-white active:scale-95" style={{ backgroundColor: 'var(--accent-blue)' }}>
                  {selected.completed ? 'RETAKE TEST' : 'TAKE TEST'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Study Confirmation */}
      {showStudyConfirm && selected && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-5" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <span className="text-4xl">📖</span>
            <h3 className="text-lg font-black mt-3" style={{ color: 'var(--text-primary)' }}>Ready for the test?</h3>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Have you studied <strong style={{ color: 'var(--text-primary)' }}>{selected.title}</strong> and all its sub-topics?
            </p>
            <p className="text-[10px] mt-2 font-bold" style={{ color: 'var(--text-muted)' }}>
              You need 80% to pass · {attemptInfo?.attemptsLeft || 3} attempts remaining today
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowStudyConfirm(false)} className="flex-1 py-3.5 rounded-xl text-xs font-black tracking-widest active:scale-95" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                NOT YET
              </button>
              <button onClick={handleConfirmStudied} className="flex-1 py-3.5 rounded-xl text-xs font-black tracking-widest text-white active:scale-95" style={{ backgroundColor: 'var(--accent-green)' }}>
                YES, START!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ═══ TESTS TAB (Milestone Tests Only) ═══ */
const TestsTab: React.FC<{ onStartQuiz: (dayId: number) => void }> = ({ onStartQuiz }) => {
  const { roadmap } = useProviaStore();
  const completedDays = roadmap.filter(d => d.completed).length;

  return (
    <div className="px-4 pt-5 pb-8 space-y-5">
      <div className="text-center py-2">
        <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>📋 Milestone Tests</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Unlock tests by completing daily topics</p>
      </div>

      <div className="space-y-3">
        {MILESTONE_TESTS.map((test) => {
          const isUnlocked = completedDays >= test.requiredDay;
          const progressDays = Math.min(completedDays, test.requiredDay);
          const progressPct = Math.round((progressDays / test.requiredDay) * 100);

          return (
            <div key={test.id} className="rounded-2xl p-4 transition-all" style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid ${isUnlocked ? test.color + '40' : 'var(--border)'}`, opacity: isUnlocked ? 1 : 0.6 }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: test.color + '15' }}>
                  {isUnlocked ? test.icon : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{test.title}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{test.subtitle}</p>

                  {/* Progress bar for locked tests */}
                  {!isUnlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[9px] font-bold mb-1">
                        <span style={{ color: 'var(--text-muted)' }}>{progressDays}/{test.requiredDay} days</span>
                        <span style={{ color: test.color }}>{progressPct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: test.color }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isUnlocked && (
                <button onClick={() => onStartQuiz(test.dayRange[0])} className="w-full mt-3 py-3 rounded-xl text-xs font-black tracking-widest text-white active:scale-95" style={{ backgroundColor: test.color }}>
                  START TEST
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══ BATTLE TAB ═══ */
const BattleTab: React.FC = () => {
  const { heroCredits } = useProviaStore();
  const [searchId, setSearchId] = useState('');
  const [matchStatus, setMatchStatus] = useState<'idle' | 'searching' | 'found'>('idle');
  const [opponent, setOpponent] = useState<{ name: string; level: number } | null>(null);

  const FAKE_OPPONENTS = [
    { name: 'Dr. Sarah', level: 5 }, { name: 'PharmAli', level: 12 }, { name: 'RxMaster', level: 8 },
    { name: 'Dr. Fatima', level: 15 }, { name: 'MedNerd99', level: 3 }, { name: 'GulfPrep', level: 9 },
  ];

  const handleRandomMatch = () => {
    setMatchStatus('searching');
    setOpponent(null);
    setTimeout(() => {
      setOpponent(FAKE_OPPONENTS[Math.floor(Math.random() * FAKE_OPPONENTS.length)]);
      setMatchStatus('found');
    }, 2000);
  };

  const handleSearchById = () => {
    if (!searchId.trim()) return;
    setMatchStatus('searching');
    setOpponent(null);
    setTimeout(() => {
      setOpponent({ name: `Player #${searchId}`, level: Math.floor(Math.random() * 15) + 1 });
      setMatchStatus('found');
    }, 1500);
  };

  return (
    <div className="px-4 pt-5 pb-8 space-y-5">
      <div className="text-center py-4">
        <span className="text-4xl">⚔️</span>
        <h2 className="text-xl font-black mt-2" style={{ color: 'var(--text-primary)' }}>Battle Arena</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Challenge opponents and earn Hero Credits</p>
      </div>

      <div className="rounded-xl p-3 flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <span>💎</span>
        <span className="text-sm font-black" style={{ color: '#f59e0b' }}>{heroCredits} HC</span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>· Entry: 20 HC</span>
      </div>

      {/* Random Match */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Quick Match</h3>
        <button onClick={handleRandomMatch} disabled={matchStatus === 'searching' || heroCredits < 20} className="w-full py-4 rounded-xl font-black text-sm tracking-widest text-white active:scale-95 disabled:opacity-50" style={{ backgroundColor: '#ef4444' }}>
          {matchStatus === 'searching' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />SEARCHING...
            </span>
          ) : '🎲 RANDOM OPPONENT'}
        </button>
      </div>

      {/* Search by ID */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Challenge by ID</h3>
        <div className="flex gap-2">
          <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Enter Player ID..." className="flex-1 px-4 py-3.5 rounded-xl text-sm font-medium outline-none" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <button onClick={handleSearchById} disabled={!searchId.trim() || heroCredits < 20} className="px-5 py-3.5 rounded-xl font-black text-xs tracking-widest text-white active:scale-95 disabled:opacity-50" style={{ backgroundColor: 'var(--accent-blue)' }}>FIND</button>
        </div>
      </div>

      {/* Found */}
      {matchStatus === 'found' && opponent && (
        <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid var(--accent-green)` }}>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-green)' }}>Opponent Found!</p>
          <div className="w-16 h-16 rounded-full mx-auto mt-3 flex items-center justify-center text-2xl font-black" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--accent-blue)' }}>{opponent.name.charAt(0)}</div>
          <p className="text-lg font-black mt-2" style={{ color: 'var(--text-primary)' }}>{opponent.name}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Level {opponent.level}</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => { setMatchStatus('idle'); setOpponent(null); }} className="flex-1 py-3.5 rounded-xl text-xs font-black tracking-widest active:scale-95" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>CANCEL</button>
            <button className="flex-1 py-3.5 rounded-xl text-xs font-black tracking-widest text-white active:scale-95" style={{ backgroundColor: '#ef4444' }}>⚔️ BATTLE!</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══ DISCUSSIONS TAB ═══ */
const DiscussionsTab: React.FC = () => {
  const [expandedCat, setExpandedCat] = useState<string | null>('materials');

  return (
    <div className="px-4 pt-5 pb-8 space-y-4">
      <div className="text-center py-2">
        <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>💬 Discussions</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Learn together, pass together</p>
      </div>

      {DISCUSSION_CATEGORIES.map((cat) => {
        const isOpen = expandedCat === cat.id;
        return (
          <div key={cat.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <button onClick={() => setExpandedCat(isOpen ? null : cat.id)} className="w-full flex items-center gap-3 p-4 text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: cat.color + '15' }}>{cat.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{cat.title}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{cat.threads.length} threads</p>
              </div>
              <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-2">
                {cat.threads.map((thread, tIdx) => (
                  <div key={tIdx} className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{thread.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-medium" style={{ color: cat.color }}>{thread.user}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>💬 {thread.replies}</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{thread.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 rounded-xl text-[10px] font-bold tracking-widest active:scale-95" style={{ backgroundColor: 'var(--bg-primary)', color: cat.color, border: `1px dashed ${cat.color}40` }}>+ NEW THREAD</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ═══ SETTINGS ═══ */
const SettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { mode, toggleMode } = useThemeStore();
  const { logout } = useAuthStore();

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-3xl p-5 pb-8" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: 'var(--border)' }} />
        <h3 className="text-lg font-black mb-5" style={{ color: 'var(--text-primary)' }}>⚙️ Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{mode === 'dark' ? '🌙' : '☀️'}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Appearance</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{mode === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
            </div>
            <button onClick={toggleMode} className="relative w-12 h-7 rounded-full transition-all duration-300" style={{ backgroundColor: mode === 'dark' ? 'var(--accent-blue)' : 'var(--border)' }}>
              <div className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300" style={{ left: mode === 'dark' ? '22px' : '2px' }} />
            </button>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 rounded-xl p-4 active:scale-95" style={{ backgroundColor: '#ef444415', border: '1px solid #ef444430' }}>
            <span className="text-xl">🚪</span>
            <p className="text-sm font-bold" style={{ color: '#ef4444' }}>Sign Out</p>
          </button>
        </div>
        <button onClick={onClose} className="w-full py-3.5 mt-4 rounded-xl text-xs font-black tracking-widest active:scale-95" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>CLOSE</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════ */
/*                MAIN DASHBOARD                   */
/* ═══════════════════════════════════════════════ */
type TabId = 'home' | 'tests' | 'battle' | 'discussions';
const TAB_CONFIG: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'tests', label: 'Tests', icon: '📋' },
  { id: 'battle', label: 'Battle', icon: '⚔️' },
  { id: 'discussions', label: 'Chat', icon: '💬' },
];

export const Dashboard: React.FC = () => {
  const streak = useProviaStore((s: ProviaState) => s.streak);
  const heroCredits = useProviaStore((s: ProviaState) => s.heroCredits);
  const updateStreak = useProviaStore((s: ProviaState) => s.updateStreak);

  const { startQuiz } = useQuizStore();
  const { mode } = useThemeStore();

  const [tab, setTab] = useState<TabId>('home');
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { updateStreak(); }, [updateStreak]);

  const handleStartQuiz = (dayId: number) => {
    try {
      startQuiz(dayId, ALL_QUESTIONS);
      setActiveQuiz(dayId);
    } catch (_e: unknown) { /* cooldown or locked */ }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh]" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {activeQuiz && <QuizEngine dayId={activeQuiz} onClose={() => setActiveQuiz(null)} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl" style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-4 py-2.5 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <img src="/logo-provia.png" alt="Provia" className="w-7 h-7 rounded-lg object-contain" style={{ mixBlendMode: mode === 'dark' ? 'screen' : 'multiply' }} />
            <span className="text-base font-black italic tracking-tighter bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">PROVIA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-black" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b30' }}>💎 {heroCredits}</div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-black" style={{ backgroundColor: '#f9731615', color: '#f97316', border: '1px solid #f9731630' }}>🔥 {streak}</div>
            <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg active:scale-90" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto pb-24">
        {tab === 'home' && <HomeTab onStartQuiz={handleStartQuiz} />}
        {tab === 'tests' && <TestsTab onStartQuiz={handleStartQuiz} />}
        {tab === 'battle' && <BattleTab />}
        {tab === 'discussions' && <DiscussionsTab />}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] backdrop-blur-xl" style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', paddingBottom: 'max(var(--sab), 8px)' }}>
        <div className="flex items-center justify-around max-w-lg mx-auto py-1.5">
          {TAB_CONFIG.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex flex-col items-center gap-0.5 py-2 px-5 rounded-xl min-w-[64px] active:scale-90 transition-transform">
              <span className={`text-xl ${tab === t.id ? 'scale-110' : ''}`}>{t.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: tab === t.id ? 'var(--accent-blue)' : 'var(--text-muted)' }}>{t.label}</span>
              {tab === t.id && <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent-blue)' }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
