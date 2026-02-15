import { FirestoreService } from './firestore.service';
import type { DocumentData } from 'firebase/firestore';

export interface Question extends DocumentData {
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    day: number;
}

class QuestionsDBClass extends FirestoreService<Question> {
    constructor() {
        super('questions');
    }

    // Future methods for fetching questions by day, etc.
}

export const QuestionsDB = new QuestionsDBClass();
