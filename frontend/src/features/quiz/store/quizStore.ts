import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  dayId: number;
}

interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number>;
  bookmarked: Record<number, boolean>;
  mode: 'daily' | 'mock';
  cooldowns: Record<number, number>;       // dayId -> cooldown-until timestamp
  dailyAttempts: Record<number, { count: number; date: number }>; // dayId -> { count, timestamp of last attempt }

  startQuiz: (dayId: number, allQuestions: Question[], options?: { mode?: 'daily' | 'mock'; dayRange?: [number, number]; questionCount?: number }) => void;
  submitAnswer: (answerIndex: number) => void;
  setAnswer: (qIndex: number, answerIndex: number) => void;
  toggleBookmark: (qIndex: number) => void;
  setCurrentIndex: (index: number) => void;
  finishQuiz: (dayId: number) => { score: number; passed: boolean; cooldownMins: number; attemptsLeft: number; lockedUntilTomorrow: boolean };
  getAttemptInfo: (dayId: number) => { attemptsUsed: number; attemptsLeft: number; isLockedToday: boolean; cooldownUntil: number | null };
}

const PASS_THRESHOLD = 80;
const MAX_DAILY_ATTEMPTS = 3;
const FAIL_COOLDOWN_MINS = 30; // 30 minutes for 1st/2nd fail
const EXHAUSTED_COOLDOWN_MINS = 240; // 4 hours for 3rd fail
const MAX_QUESTIONS_PER_DAY = 50;
const MIN_QUESTIONS_PER_DAY = 20;
const REVIEW_QUESTIONS_COUNT = 10;

/** Fisher-Yates shuffle — unbiased random reorder */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      currentIndex: 0,
      answers: {},
      bookmarked: {},
      mode: 'daily',
      cooldowns: {},
      dailyAttempts: {},

      getAttemptInfo: (dayId: number) => {
        const { dailyAttempts, cooldowns } = get();
        const entry = dailyAttempts[dayId];
        const now = Date.now();

        let attemptsUsed = 0;
        let cooldownUntil = cooldowns[dayId] && now < cooldowns[dayId] ? cooldowns[dayId] : null;

        if (entry) {
          // If a cooldown was active but has now expired, reset attempts
          if (cooldowns[dayId] && now >= cooldowns[dayId]) {
            attemptsUsed = 0;
            cooldownUntil = null;
          } else {
            attemptsUsed = entry.count;
          }
        }

        const attemptsLeft = MAX_DAILY_ATTEMPTS - attemptsUsed;
        const isLockedToday = attemptsLeft <= 0; // It acts as a 4-hour lock now, not full day

        return { attemptsUsed, attemptsLeft, isLockedToday, cooldownUntil };
      },

      startQuiz: (dayId, allQuestions, options = {}) => {
        const mode = options.mode || 'daily';

        // Deduplicate questions by their text to avoid repeats
        const seen = new Set<string>();
        const uniqueQuestions = allQuestions.filter(q => {
          const key = q.question.trim().toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        let combined: Question[] = [];

        if (mode === 'mock' && options.dayRange) {
          const [start, end] = options.dayRange;
          const pool = uniqueQuestions.filter(q => q.dayId >= start && q.dayId <= end);
          // Limit to specific count or 100 for mock exams
          combined = shuffle(pool).slice(0, options.questionCount || 100);
        } else {
          // Pick up to 10 random review questions from earlier days
          const pastQuestions = shuffle(
            uniqueQuestions.filter(q => q.dayId < dayId)
          ).slice(0, REVIEW_QUESTIONS_COUNT);

          // Pick current-day questions: use all if ≤50, random 50 if more
          const dayPool = uniqueQuestions.filter(q => q.dayId === dayId);
          let currentQuestions = dayPool.length <= MAX_QUESTIONS_PER_DAY
            ? shuffle(dayPool)
            : shuffle(dayPool).slice(0, MAX_QUESTIONS_PER_DAY);

          // If fewer than 20 questions for this day, pad with random questions from other days
          if (currentQuestions.length < MIN_QUESTIONS_PER_DAY) {
            const usedIds = new Set([...currentQuestions, ...pastQuestions].map(q => q.id));
            const filler = shuffle(
              uniqueQuestions.filter(q => q.dayId !== dayId && !usedIds.has(q.id))
            ).slice(0, MIN_QUESTIONS_PER_DAY - currentQuestions.length);
            currentQuestions = [...currentQuestions, ...filler];
          }

          // Final dedup: ensure no overlap between past and current
          const currentIds = new Set(currentQuestions.map(q => q.id));
          const dedupedPast = pastQuestions.filter(q => !currentIds.has(q.id));

          // Combine and shuffle everything together for a truly random order
          combined = shuffle([...dedupedPast, ...currentQuestions]);
        }

        set({
          questions: combined,
          currentIndex: 0,
          answers: {},
          bookmarked: {},
          mode,
        });
      },

      submitAnswer: (answerIndex) => set((state) => ({
        answers: { ...state.answers, [state.currentIndex]: answerIndex },
        currentIndex: state.currentIndex + 1
      })),

      setAnswer: (qIndex, answerIndex) => set((state) => ({
        answers: { ...state.answers, [qIndex]: answerIndex }
      })),

      toggleBookmark: (qIndex) => set((state) => ({
        bookmarked: { ...state.bookmarked, [qIndex]: !state.bookmarked[qIndex] }
      })),

      setCurrentIndex: (index) => set({ currentIndex: index }),

      finishQuiz: (dayId) => {
        const { questions, answers, mode } = get();
        const correctCount = questions.reduce((acc, q, i) =>
          answers[i] === q.correctAnswer ? acc + 1 : acc
          , 0);

        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= PASS_THRESHOLD;
        const now = Date.now();

        let cooldownMins = 0;
        let lockedUntilTomorrow = false;
        let attemptsLeft = MAX_DAILY_ATTEMPTS;

        if (mode === 'daily') {
          // Update daily attempts
          const { attemptsUsed } = get().getAttemptInfo(dayId);
          const newCount = passed ? 0 : attemptsUsed + 1;

          if (!passed) {
            if (newCount >= MAX_DAILY_ATTEMPTS) {
              // 3 fails — 4-hour cooldown
              cooldownMins = EXHAUSTED_COOLDOWN_MINS;
              lockedUntilTomorrow = true; // Kept for UI compat, but means "Locked 4 hours"
            } else {
              // failed but attempts remain — 30-min cooldown
              cooldownMins = FAIL_COOLDOWN_MINS;
            }

            const cooldownUntil = now + (cooldownMins * 60 * 1000);
            set((state) => ({
              cooldowns: { ...state.cooldowns, [dayId]: cooldownUntil },
            }));
          }

          // Always record the attempt
          set((state) => ({
            dailyAttempts: {
              ...state.dailyAttempts,
              [dayId]: { count: newCount, date: now }
            },
            // Clear cooldown on pass
            ...(passed ? { cooldowns: { ...state.cooldowns, [dayId]: 0 } } : {}),
          }));

          attemptsLeft = MAX_DAILY_ATTEMPTS - newCount;
        }

        return { score, passed, cooldownMins, attemptsLeft, lockedUntilTomorrow };
      }
    }),
    { name: 'provia-quiz-storage' }
  )
);
