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
  answers: number[];
  cooldowns: Record<number, number>;       // dayId -> cooldown-until timestamp
  dailyAttempts: Record<number, { count: number; date: string }>; // dayId -> { count, date }

  startQuiz: (dayId: number, allQuestions: Question[]) => void;
  submitAnswer: (answerIndex: number) => void;
  finishQuiz: (dayId: number) => { score: number; passed: boolean; cooldownMins: number; attemptsLeft: number; lockedUntilTomorrow: boolean };
  getAttemptInfo: (dayId: number) => { attemptsUsed: number; attemptsLeft: number; isLockedToday: boolean; cooldownUntil: number | null };
}

const PASS_THRESHOLD = 80;
const MAX_DAILY_ATTEMPTS = 3;
const FAIL_COOLDOWN_MINS = 30;
const MAX_QUESTIONS_PER_DAY = 50;
const REVIEW_QUESTIONS_COUNT = 10;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

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
      answers: [],
      cooldowns: {},
      dailyAttempts: {},

      getAttemptInfo: (dayId: number) => {
        const { dailyAttempts, cooldowns } = get();
        const today = todayStr();
        const entry = dailyAttempts[dayId];
        const attemptsUsed = (entry && entry.date === today) ? entry.count : 0;
        const attemptsLeft = MAX_DAILY_ATTEMPTS - attemptsUsed;
        const isLockedToday = attemptsLeft <= 0;
        const cooldownUntil = cooldowns[dayId] && Date.now() < cooldowns[dayId] ? cooldowns[dayId] : null;
        return { attemptsUsed, attemptsLeft, isLockedToday, cooldownUntil };
      },

      startQuiz: (dayId, allQuestions) => {
        // Pick up to 10 random review questions from earlier days
        const pastQuestions = shuffle(
          allQuestions.filter(q => q.dayId < dayId)
        ).slice(0, REVIEW_QUESTIONS_COUNT);

        // Pick current-day questions: use all if ≤50, random 50 if more
        const dayPool = allQuestions.filter(q => q.dayId === dayId);
        const currentQuestions = dayPool.length <= MAX_QUESTIONS_PER_DAY
          ? shuffle(dayPool)                              // use all available, shuffled
          : shuffle(dayPool).slice(0, MAX_QUESTIONS_PER_DAY); // random 50

        // Combine and shuffle everything together for a truly random order
        const combined = shuffle([...pastQuestions, ...currentQuestions]);

        set({
          questions: combined,
          currentIndex: 0,
          answers: [],
        });
      },

      submitAnswer: (answerIndex) => set((state) => ({
        answers: [...state.answers, answerIndex],
        currentIndex: state.currentIndex + 1
      })),

      finishQuiz: (dayId) => {
        const { questions, answers, dailyAttempts } = get();
        const correctCount = answers.reduce((acc, ans, i) =>
          ans === questions[i]?.correctAnswer ? acc + 1 : acc
          , 0);

        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= PASS_THRESHOLD;
        const today = todayStr();

        // Update daily attempts
        const entry = dailyAttempts[dayId];
        const prevCount = (entry && entry.date === today) ? entry.count : 0;
        const newCount = prevCount + 1;

        let cooldownMins = 0;
        let lockedUntilTomorrow = false;

        if (!passed) {
          if (newCount >= MAX_DAILY_ATTEMPTS) {
            // 3 fails today — locked until tomorrow
            lockedUntilTomorrow = true;
            cooldownMins = 0; // no timed cooldown, just locked for the day
          } else {
            // failed but attempts remain — 30-min cooldown
            cooldownMins = FAIL_COOLDOWN_MINS;
            const cooldownUntil = Date.now() + (cooldownMins * 60 * 1000);
            set((state) => ({
              cooldowns: { ...state.cooldowns, [dayId]: cooldownUntil },
            }));
          }
        }

        // Always record the attempt
        set((state) => ({
          dailyAttempts: {
            ...state.dailyAttempts,
            [dayId]: { count: newCount, date: today }
          },
          // Clear cooldown on pass
          ...(passed ? { cooldowns: { ...state.cooldowns, [dayId]: 0 } } : {}),
        }));

        const attemptsLeft = MAX_DAILY_ATTEMPTS - newCount;
        return { score, passed, cooldownMins, attemptsLeft, lockedUntilTomorrow };
      }
    }),
    { name: 'provia-quiz-storage' }
  )
);
