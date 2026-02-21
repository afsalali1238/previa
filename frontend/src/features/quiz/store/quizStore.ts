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

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
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
        // Note: cooldowns and daily limits are tracked for UI notifications
        // but do NOT block the user from retesting

        // Build quiz: 10 review + 50 current
        const pastQuestions = allQuestions
          .filter(q => q.dayId < dayId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);

        const currentQuestions = allQuestions
          .filter(q => q.dayId === dayId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 50);

        if (currentQuestions.length === 0 && dayId > 0) {
          set({
            questions: pastQuestions.concat(
              Array.from({ length: 50 }, (_, i) => ({
                id: `mock-${dayId}-${i}`,
                question: `Daily Topic Question ${i + 1} for Day ${dayId}?`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 0,
                explanation: 'Placeholder',
                topic: 'General',
                dayId
              }))
            ),
            currentIndex: 0,
            answers: [],
          });
        } else {
          set({
            questions: [...pastQuestions, ...currentQuestions],
            currentIndex: 0,
            answers: [],
          });
        }
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
