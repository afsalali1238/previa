import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, CalendarDays, Brain, Timer, Trophy, Swords, Smartphone,
    Share, MoreVertical, Target, ShieldCheck, BookOpen, Ghost,
    Zap, MessageCircle
} from 'lucide-react';

const SECTIONS = [
    {
        id: 'plan',
        icon: <CalendarDays className="w-6 h-6" />,
        color: '#3b82f6',
        title: 'The 45-Day Plan',
        description: 'A structured, day-by-day roadmap covering the full Prometric exam syllabus.',
        details: [
            'Each day focuses on a specific topic from the real exam syllabus.',
            'Complete Day N by scoring ≥80% on the quiz to unlock Day N+1.',
            'Tap any day — even locked ones — to preview its topics.',
            'Finish all 45 days to complete your preparation journey.',
        ],
    },
    {
        id: 'quiz',
        icon: <Brain className="w-6 h-6" />,
        color: '#8b5cf6',
        title: 'Quiz System',
        description: '2,000+ real MCQs mapped directly from the Prometric exam syllabus.',
        details: [
            '20–50 questions per day, served in a random order every attempt.',
            '3 attempts per day — if you fail, a 30-minute cooldown applies.',
            'After 3 failed attempts, the topic locks until the next day.',
            '80% pass mark required to complete each day.',
        ],
    },
    {
        id: 'ghost',
        icon: <Ghost className="w-6 h-6" />,
        color: '#06b6d4',
        title: 'The Ghost Rule',
        description: 'Automatic spaced repetition built into every quiz session.',
        details: [
            '10 random review questions from previous days are mixed into each quiz.',
            'This combats memory decay without you needing to manually revise.',
            'Review questions are shuffled together with current-day questions.',
            'The further you progress, the larger your review pool becomes.',
        ],
    },
    {
        id: 'timer',
        icon: <Timer className="w-6 h-6" />,
        color: '#f59e0b',
        title: 'Built-in Quiz Timer',
        description: 'Train yourself to answer within the real exam time limits.',
        details: [
            'A live timer is always visible during quizzes.',
            'If you spend more than 1 minute 30 seconds on a question, the timer turns red.',
            'After the quiz, your average time per question is displayed on the results screen.',
            'Helps you build the speed needed for the actual exam.',
        ],
    },
    {
        id: 'credits',
        icon: <Trophy className="w-6 h-6" />,
        color: '#10b981',
        title: 'Hero Credits & Streaks',
        description: 'A gamification system that rewards consistency and mastery.',
        details: [
            'Earn 10 Hero Credits every time you pass a daily quiz.',
            'Maintain a daily streak by completing at least one quiz per day.',
            'Hero Credits are used as entry stakes in the Battle Arena.',
            'Track your credits, streak, and completed days on the Dashboard.',
        ],
    },
    {
        id: 'milestones',
        icon: <Target className="w-6 h-6" />,
        color: '#f43f5e',
        title: 'Milestone Checkpoints',
        description: 'Periodic checkpoint exams to validate your cumulative progress.',
        details: [
            'Checkpoint 1 — Day 10: Reviews Days 1–10.',
            'Checkpoint 2 — Day 20: Reviews Days 11–20.',
            'Checkpoint 3 — Day 30: Reviews Days 21–30.',
            'Checkpoint 4 — Day 40: Reviews Days 31–40.',
            'Final Mock Exam — Day 45: Covers all 45 days — the ultimate test.',
        ],
    },
    {
        id: 'battle',
        icon: <Swords className="w-6 h-6" />,
        color: '#6366f1',
        title: 'Battle Arena',
        description: 'Challenge peers in head-to-head quiz duels for Hero Credits.',
        details: [
            'Quick Match: Get paired with a random opponent instantly.',
            'Challenge by ID: Search for a specific player and issue a challenge.',
            'Each battle costs 20 Hero Credits to enter.',
            'The winner takes the full pot — sharpen your skills to win!',
        ],
    },
    {
        id: 'discussions',
        icon: <MessageCircle className="w-6 h-6" />,
        color: '#14b8a6',
        title: 'Discussions & Community',
        description: 'Connect with fellow candidates in topic-based discussion threads.',
        details: [
            'Study Materials: Share and discover useful resources.',
            'Doubts & Questions: Get answers from the community.',
            'Exam Tips: Share strategies that worked for you.',
            'General Chat: Connect with peers on your prep journey.',
        ],
    },
];

export const HowItWorksPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen min-h-[100dvh] font-sans overflow-x-hidden" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 active:scale-95 transition-transform">
                        <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Back</span>
                    </button>
                    <img src="/logo-provia.png" alt="Provia" className="w-7 h-7 rounded-lg object-contain logo-dark-bg" />
                </div>
            </header>

            {/* Hero */}
            <section className="px-5 pt-12 pb-8 text-center max-w-2xl mx-auto space-y-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter italic leading-tight">
                    How <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">PROVIA</span> Works
                </h1>
                <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    A complete 45-day preparation system designed to get you exam-ready with structured daily quizzes, spaced repetition, and competitive challenges.
                </p>
            </section>

            {/* Stats Bar */}
            <section className="px-5 max-w-2xl mx-auto">
                <div className="grid grid-cols-3 gap-3 mb-10">
                    {[
                        { value: '2,000+', label: 'MCQs', icon: <BookOpen className="w-4 h-4" /> },
                        { value: '45', label: 'Days', icon: <CalendarDays className="w-4 h-4" /> },
                        { value: '80%', label: 'Pass Mark', icon: <ShieldCheck className="w-4 h-4" /> },
                    ].map((stat, i) => (
                        <div key={i} className="rounded-2xl p-4 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            <div className="flex justify-center mb-1 text-blue-500">{stat.icon}</div>
                            <div className="text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Sections */}
            <section className="px-5 max-w-2xl mx-auto space-y-4 pb-8">
                {SECTIONS.map((section) => (
                    <details key={section.id} className="group rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none select-none active:scale-[0.99] transition-transform">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: section.color + '15', color: section.color }}>
                                {section.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{section.title}</h3>
                                <p className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--text-muted)' }}>{section.description}</p>
                            </div>
                            <Zap className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-90" style={{ color: 'var(--text-muted)' }} />
                        </summary>
                        <div className="px-5 pb-4 pt-1">
                            <ul className="space-y-2">
                                {section.details.map((detail, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: section.color }} />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </details>
                ))}
            </section>

            {/* Install as App */}
            <section className="px-5 py-8 max-w-2xl mx-auto">
                <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <Smartphone className="w-10 h-10 mx-auto mb-4 text-blue-500" />
                    <h2 className="text-lg font-black italic tracking-tight mb-1 text-center" style={{ color: 'var(--text-primary)' }}>Install as an App</h2>
                    <p className="text-xs mb-5 text-center" style={{ color: 'var(--text-muted)' }}>Add PROVIA to your Home Screen for a full-screen, app-like experience.</p>

                    <div className="space-y-4">
                        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-blue-500">iPhone / iPad (Safari)</p>
                            <ol className="text-xs leading-relaxed space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
                                <li className="flex items-start gap-2"><span className="font-bold" style={{ color: 'var(--text-primary)' }}>1.</span> Tap the <Share className="w-3.5 h-3.5 inline-block mx-0.5 -mt-0.5" /> <strong>Share</strong> button at the bottom of Safari</li>
                                <li className="flex items-start gap-2"><span className="font-bold" style={{ color: 'var(--text-primary)' }}>2.</span> Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                                <li className="flex items-start gap-2"><span className="font-bold" style={{ color: 'var(--text-primary)' }}>3.</span> Tap <strong>"Add"</strong> — Done!</li>
                            </ol>
                        </div>

                        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-emerald-500">Android (Chrome)</p>
                            <ol className="text-xs leading-relaxed space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
                                <li className="flex items-start gap-2"><span className="font-bold" style={{ color: 'var(--text-primary)' }}>1.</span> Tap the <MoreVertical className="w-3.5 h-3.5 inline-block mx-0.5 -mt-0.5" /> <strong>menu</strong> (three dots) in Chrome</li>
                                <li className="flex items-start gap-2"><span className="font-bold" style={{ color: 'var(--text-primary)' }}>2.</span> Tap <strong>"Add to Home screen"</strong></li>
                                <li className="flex items-start gap-2"><span className="font-bold" style={{ color: 'var(--text-primary)' }}>3.</span> Tap <strong>"Add"</strong> — Done!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* WhatsApp CTA */}
            <section className="px-5 pb-10 max-w-2xl mx-auto">
                <a
                    href="https://wa.me/+919037347340"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-center py-4 px-4 shadow-lg hover:opacity-95 transition-opacity active:scale-[0.98]"
                >
                    <div className="flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-bold tracking-wide">Need Help? Chat with us on WhatsApp</span>
                    </div>
                </a>
            </section>

            {/* Footer */}
            <footer className="px-5 py-8 text-center border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    PROVIA — Your Gulf Exam Companion
                </p>
            </footer>
        </div>
    );
};
