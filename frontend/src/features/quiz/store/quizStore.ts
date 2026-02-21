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
  cooldowns: Record<number, number>; // dayId -> timestamp
  attempts: Record<number, number>;  // dayId -> count
  
  startQuiz: (dayId: number, allQuestions: Question[]) => void;
  submitAnswer: (answerIndex: number) => void;
  finishQuiz: (dayId: number) => { score: number; passed: boolean; cooldownMins: number };
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      currentIndex: 0,
      answers: [],
      cooldowns: {},
      attempts: {},

      startQuiz: (dayId, allQuestions) => {
        const now = Date.now();
        const cooldown = get().cooldowns[dayId];
        if (cooldown && now < cooldown) {
            throw new Error(`Cooldown active until ${new Date(cooldown).toLocaleTimeString()}`);
        }

        // Logic Update: 10 Review Questions + 50 Topic Questions (Total 60)
        const pastQuestions = allQuestions
          .filter(q => q.dayId < dayId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
          
        const currentQuestions = allQuestions
          .filter(q => q.dayId === dayId)
          .sort(() => 0.5 - Math.random())
          .slice(0, 50); // Updated to 50 as per request
        
        if (currentQuestions.length === 0 && dayId > 0) {
            // Fallback for testing if specific day data isn't loaded yet
            set({
                questions: pastQuestions.concat(
                    Array.from({length: 50}, (_, i) => ({
                        id: `mock-${dayId}-${i}`,
                        question: `Daily Topic Question ${i+1} for Day ${dayId}?`,
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
        const { questions, answers, attempts } = get();
        const correctCount = answers.reduce((acc, ans, i) => 
          ans === questions[i].correctAnswer ? acc + 1 : acc
        , 0);
        
        const score = (correctCount / questions.length) * 100;
        const passed = score >= 80;
        const attemptCount = (attempts[dayId] || 0) + 1;
        
        let cooldownMins = 0;
        if (!passed) {
            cooldownMins = attemptCount >= 3 ? 180 : 30;
            const cooldownUntil = Date.now() + (cooldownMins * 60 * 1000);
            set((state) => ({
                cooldowns: { ...state.cooldowns, [dayId]: cooldownUntil },
                attempts: { ...state.attempts, [dayId]: attemptCount }
            }));
        } else {
            set((state) => ({
                attempts: { ...state.attempts, [dayId]: 0 }
            }));
        }

        return { score, passed, cooldownMins };
      }
    }),
    { name: 'provia-quiz-storage' }
  )
);
