import React from 'react';
import { useAuthStore } from '../features/auth/store/authStore';

export const LandingPage: React.FC = () => {
  const { login } = useAuthStore();

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo-provia.png" alt="Provia" className="w-8 h-8 rounded-lg object-cover" />
          <span className="text-xl font-black tracking-tighter italic bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">PROVIA</span>
        </div>
        <button
          onClick={() => login()}
          className="text-xs font-bold hover:text-blue-400 transition-colors uppercase tracking-widest"
        >
          Enter App →
        </button>
      </nav>

      {/* Hero Section */}
      <header className="px-5 py-16 sm:py-20 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-blue-400 uppercase">
          🚀 45-Day Pharmacy Mastery
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] italic">
          ACE YOUR<br />GULF EXAM<br />
          <span className="bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 bg-clip-text text-transparent">IN 45 DAYS.</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed font-medium">
          <span className="text-white">50 Questions per topic daily.</span> Built for Pharmacists to pass DHA, MOH, and DOH exams.
        </p>

        <div className="flex flex-col gap-3 justify-center pt-4 max-w-xs mx-auto sm:max-w-none sm:flex-row">
          <button
            onClick={() => login()}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm tracking-widest transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95"
          >
            START YOUR JOURNEY
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            onClick={() => login()}
            className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Testing Mode: Instant Access · No Sign-up
          </p>
        </div>
      </header>

      {/* Features Grid */}
      <section className="px-5 py-16 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "50 Qs Per Topic", desc: "Intense daily focus sessions. 50 high-yield questions every day to ensure total syllabus coverage.", icon: "📚" },
          { title: "The Ghost Rule", desc: "10 review questions from previous worlds daily to combat memory decay automatically.", icon: "👻" },
          { title: "Battle Duels", desc: "Challenge peers in battles to earn Hero Credits and climb the leaderboard.", icon: "⚔️" }
        ].map((feat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl hover:border-blue-500/30 transition-all group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{feat.icon}</div>
            <h3 className="text-lg font-black mb-2 italic tracking-tight">{feat.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="px-5 py-16 text-center border-t border-slate-900">
        <div className="flex flex-wrap justify-center gap-8 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 mb-6">
          <span className="font-black text-lg italic tracking-tighter">DHA</span>
          <span className="font-black text-lg italic tracking-tighter">MOH</span>
          <span className="font-black text-lg italic tracking-tighter">DOH</span>
          <span className="font-black text-lg italic tracking-tighter">SLE</span>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Full Access · 45-Day Clinical Roadmap</div>
      </footer>
    </div>
  );
};
