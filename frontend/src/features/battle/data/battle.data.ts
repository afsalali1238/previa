import type { Question } from '../../questions/types/question.types';

export interface Opponent {
    id: string;
    name: string;
    avatar: string;
    level: number;
    authority: 'DHA' | 'MOH' | 'SLE' | 'HAAD' | 'SC' | string;
    winRate: number;
    status: 'online' | 'busy' | 'offline';
}

export interface BattleState {
    opponent: Opponent;
    questions: Question[];
    currentIndex: number;
    playerScore: number;
    opponentScore: number;
    isComplete: boolean;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    text: string;
    timestamp: Date;
    isCurrentUser: boolean;
}

export interface ChatRoom {
    id: string;
    name: string;
    icon: string;
    lastMessage: string;
    unreadCount: number;
    memberCount: number;
}

export const OPPONENTS: Opponent[] = [
    { id: 'o1', name: 'Sara Al-Rashid', avatar: '👩‍⚕️', level: 7, authority: 'DHA', winRate: 78, status: 'online' },
    { id: 'o2', name: 'Omar Hassan', avatar: '💊', level: 6, authority: 'MOH', winRate: 65, status: 'online' },
    { id: 'o3', name: 'Fatima Khan', avatar: '💊', level: 5, authority: 'HAAD', winRate: 72, status: 'busy' },
    { id: 'o4', name: 'Ahmed Mahmoud', avatar: '💊', level: 5, authority: 'DHA', winRate: 60, status: 'online' },
    { id: 'o5', name: 'Layla Noor', avatar: '👩‍⚕️', level: 4, authority: 'MOH', winRate: 55, status: 'offline' },
    { id: 'o6', name: 'Khalid Ibrahim', avatar: '💊', level: 4, authority: 'HAAD', winRate: 68, status: 'online' },
];

export const CHAT_ROOMS: ChatRoom[] = [
    { id: 'general', name: 'Pharmacists UAE', icon: '💊', lastMessage: 'Good luck everyone!', unreadCount: 3, memberCount: 142 },
    { id: 'dha', name: 'DHA Prep', icon: '🏙️', lastMessage: 'Any tips for drug interactions?', unreadCount: 1, memberCount: 45 },
    { id: 'moh', name: 'MOH Group', icon: '🇦🇪', lastMessage: 'Day 12 dosing questions were tough!', unreadCount: 0, memberCount: 38 },
    { id: 'tips', name: 'Study Tips', icon: '📚', lastMessage: 'Spaced repetition works great for pharmacology', unreadCount: 5, memberCount: 89 },
];

export const MOCK_MESSAGES: ChatMessage[] = [
    { id: 'm1', senderId: 'o1', senderName: 'Sara', senderAvatar: '👩‍⚕️', text: 'Just finished the drug interactions module 💪', timestamp: new Date(Date.now() - 3600000), isCurrentUser: false },
    { id: 'm2', senderId: 'o2', senderName: 'Omar', senderAvatar: '💊', text: 'Any tips for remembering CYP450 inhibitors?', timestamp: new Date(Date.now() - 3000000), isCurrentUser: false },
    { id: 'm3', senderId: 'o1', senderName: 'Sara', senderAvatar: '👩‍⚕️', text: 'Use mnemonics! "SICK FACES.COM" is great for CYP inhibitors 😅', timestamp: new Date(Date.now() - 2400000), isCurrentUser: false },
    { id: 'm4', senderId: 'me', senderName: 'You', senderAvatar: '💊', text: 'Starting Day 1 today, any advice?', timestamp: new Date(Date.now() - 1800000), isCurrentUser: true },
    { id: 'm5', senderId: 'o4', senderName: 'Ahmed', senderAvatar: '💊', text: 'Focus on the explanations, even for correct answers!', timestamp: new Date(Date.now() - 1200000), isCurrentUser: false },
    { id: 'm6', senderId: 'o3', senderName: 'Fatima', senderAvatar: '💊', text: 'BNF dosing guidelines come up a lot in the exam 📖', timestamp: new Date(Date.now() - 600000), isCurrentUser: false },
    { id: 'm7', senderId: 'o6', senderName: 'Khalid', senderAvatar: '💊', text: 'Don\'t skip drug storage questions — easy marks! 🎯', timestamp: new Date(Date.now() - 300000), isCurrentUser: false },
    { id: 'm8', senderId: 'o2', senderName: 'Omar', senderAvatar: '💊', text: 'Anyone up for a 1v1 battle? 🔥', timestamp: new Date(Date.now() - 60000), isCurrentUser: false },
];

export const BATTLE_QUESTIONS: Question[] = [
    {
        id: 'b1', day: 0, text: 'Which drug is the antidote for heparin overdose?',
        options: ['Vitamin K', 'Protamine sulfate', 'N-Acetylcysteine', 'Naloxone'],
        correctAnswer: 1, explanation: 'Protamine sulfate binds to heparin and neutralizes its anticoagulant effect.', category: 'Toxicology',
    },
    {
        id: 'b2', day: 0, text: 'What is the therapeutic INR range for patients on Warfarin with atrial fibrillation?',
        options: ['1.0-1.5', '1.5-2.0', '2.0-3.0', '3.0-4.5'],
        correctAnswer: 2, explanation: 'For most indications including AF, the target INR is 2.0-3.0.', category: 'Lab Monitoring',
    },
    {
        id: 'b3', day: 0, text: 'Ciprofloxacin absorption is reduced by which supplement?',
        options: ['Vitamin C', 'Iron supplements', 'Vitamin D', 'Folic acid'],
        correctAnswer: 1, explanation: 'Divalent/trivalent cations (Iron, Calcium, Magnesium, Aluminum) chelate with fluoroquinolones and reduce their absorption.', category: 'Drug Interactions',
    },
    {
        id: 'b4', day: 0, text: 'What is the pregnancy category of Isotretinoin?',
        options: ['Category A', 'Category B', 'Category C', 'Category X'],
        correctAnswer: 3, explanation: 'Isotretinoin is Category X — absolutely contraindicated in pregnancy due to severe teratogenic effects.', category: 'Safety',
    },
    {
        id: 'b5', day: 0, text: 'Which class of antibiotics can cause tendon rupture?',
        options: ['Penicillins', 'Macrolides', 'Fluoroquinolones', 'Cephalosporins'],
        correctAnswer: 2, explanation: 'Fluoroquinolones (e.g., Ciprofloxacin, Levofloxacin) carry a black box warning for tendon rupture, especially in elderly patients.', category: 'Adverse Effects',
    },
];
