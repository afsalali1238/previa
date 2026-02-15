

export interface LeaderboardEntry {
    rank: number;
    name: string;
    avatar: string;
    authority: 'DHA' | 'MOH' | 'SLE' | 'HAAD' | 'SC' | string;
    level: number;
    xp: number;
    streak: number;
    daysCompleted: number;
    isCurrentUser?: boolean;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    category: 'streak' | 'quiz' | 'social' | 'milestone';
}

export interface UserLevel {
    level: number;
    title: string;
    minXP: number;
    maxXP: number;
    badge: string;
}

export const LEVELS: UserLevel[] = [
    { level: 1, title: 'Intern', minXP: 0, maxXP: 100, badge: '🌱' },
    { level: 2, title: 'Trainee', minXP: 100, maxXP: 300, badge: '📚' },
    { level: 3, title: 'Pharmacist', minXP: 300, maxXP: 600, badge: '💊' },
    { level: 4, title: 'Senior RPh', minXP: 600, maxXP: 1000, badge: '⚡' },
    { level: 5, title: 'Specialist', minXP: 1000, maxXP: 1500, badge: '🏅' },
    { level: 6, title: 'Expert', minXP: 1500, maxXP: 2200, badge: '🏆' },
    { level: 7, title: 'Master', minXP: 2200, maxXP: 3000, badge: '👑' },
    { level: 8, title: 'Pharma Hero', minXP: 3000, maxXP: 99999, badge: '💎' },
];

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'first_day', name: 'First Dose', description: 'Complete Day 1', icon: '💊', unlocked: false, category: 'milestone' },
    { id: 'streak_3', name: 'On Script', description: '3-day streak', icon: '🔥', unlocked: false, category: 'streak' },
    { id: 'streak_7', name: 'Weekly Warrior', description: '7-day streak', icon: '⚡', unlocked: false, category: 'streak' },
    { id: 'streak_14', name: 'Fortnight Pharma', description: '14-day streak', icon: '💪', unlocked: false, category: 'streak' },
    { id: 'perfect_10', name: 'Perfect Rx', description: 'Score 100% on a quiz', icon: '💯', unlocked: false, category: 'quiz' },
    { id: 'halfway', name: 'Halfway Hero', description: 'Complete 22 days', icon: '🎯', unlocked: false, category: 'milestone' },
    { id: 'referral_1', name: 'Recruiter', description: 'Refer 1 friend', icon: '🤝', unlocked: false, category: 'social' },
    { id: 'level_5', name: 'Specialist', description: 'Reach Level 5', icon: '🌟', unlocked: false, category: 'milestone' },
    { id: 'battle_win', name: 'Duelist', description: 'Win a 1v1 battle', icon: '⚔️', unlocked: false, category: 'quiz' },
    { id: 'complete_45', name: 'Pharma Hero', description: 'Complete all 45 days', icon: '👑', unlocked: false, category: 'milestone' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: 'Sara Al-Rashid', avatar: '👩‍⚕️', authority: 'DHA', level: 7, xp: 2450, streak: 22, daysCompleted: 25 },
    { rank: 2, name: 'Omar Hassan', avatar: '💊', authority: 'MOH', level: 6, xp: 1820, streak: 18, daysCompleted: 20 },
    { rank: 3, name: 'Fatima Khan', avatar: '💊', authority: 'HAAD', level: 5, xp: 1350, streak: 15, daysCompleted: 17 },
    { rank: 4, name: 'Ahmed Mahmoud', avatar: '💊', authority: 'DHA', level: 5, xp: 1100, streak: 12, daysCompleted: 14 },
    { rank: 5, name: 'Layla Noor', avatar: '👩‍⚕️', authority: 'MOH', level: 4, xp: 890, streak: 10, daysCompleted: 12 },
    { rank: 6, name: 'Khalid Ibrahim', avatar: '💊', authority: 'HAAD', level: 4, xp: 750, streak: 8, daysCompleted: 10 },
    { rank: 7, name: 'Noura Saeed', avatar: '💊', authority: 'DHA', level: 3, xp: 520, streak: 6, daysCompleted: 8 },
    { rank: 8, name: 'Yusuf Ali', avatar: '💊', authority: 'MOH', level: 3, xp: 410, streak: 5, daysCompleted: 6 },
];

export const getLevelForXP = (xp: number): UserLevel => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].minXP) return LEVELS[i];
    }
    return LEVELS[0];
};

export const getXPProgress = (xp: number): number => {
    const level = getLevelForXP(xp);
    return ((xp - level.minXP) / (level.maxXP - level.minXP)) * 100;
};
