import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../features/auth/store/authStore';
import { Roadmap } from '../features/roadmap/Roadmap';
import { TheLounge } from '../features/social/TheLounge';
import { useProviaStore } from '../features/roadmap/store/proviaStore';

export const Dashboard: React.FC = () => {
    const { logout } = useAuthStore();
    const { updateStreak } = useProviaStore();
    const [tab, setTab] = useState<'journey' | 'social'>('journey');

    useEffect(() => {
        updateStreak();
    }, [updateStreak]);

    return (
        <div className="relative min-h-screen bg-slate-950 pb-24">
            {/* Bottom Nav */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-full border border-slate-800 shadow-2xl">
                <button 
                  onClick={() => setTab('journey')}
                  className={`px-6 py-3 rounded-full text-xs font-black transition-all ${tab === 'journey' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                >
                  JOURNEY
                </button>
                <button 
                  onClick={() => setTab('social')}
                  className={`px-6 py-3 rounded-full text-xs font-black transition-all ${tab === 'social' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
                >
                  LOUNGE
                </button>
                <button
                    onClick={() => logout()}
                    className="p-3 text-slate-500 hover:text-rose-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>

            {tab === 'journey' ? <Roadmap /> : <TheLounge />}
        </div>
    );
};
