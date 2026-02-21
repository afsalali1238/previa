export interface Question {
    id: string;
    day: number;
    text: string;
    options: string[];
    correctAnswer: number; // index 0-3
    explanation: string;
    category?: string;
}

export interface Answer {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
    timeSpent: number; // seconds
}

export interface QuizState {
    questions: Question[];
    currentIndex: number;
    answers: Answer[];
    showExplanation: boolean;
    selectedAnswer: number | null;
    isComplete: boolean;
    score: number;
}

export interface SetResult {
    setNumber: number;
    total: number;
    correct: number;
    percentage: number;
    answers: Answer[];
}
