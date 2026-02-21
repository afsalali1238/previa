import React from 'react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black italic">P</div>
          <span className="text-xl font-black tracking-tighter italic bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">PROVIA</span>
        </div>
        <a href="/login" className="text-sm font-bold hover:text-blue-400 transition-colors">LOGIN</a>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-20 text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-blue-400 uppercase">
          🚀 The 45-Day Pharmacy Mastery Challenge
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] italic">
          ACE YOUR GULF EXAM <br/>
          <span className="bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 bg-clip-text text-transparent">IN 45 DAYS.</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
          <span className="text-white">50 Questions per topic daily.</span> Built for Pharmacists who need <span className="text-white">Pattern Recognition</span> to pass DHA, MOH, and DOH exams.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
          <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm tracking-widest transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95">
            START YOUR JOURNEY
          </button>
          <button className="px-10 py-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl font-black text-sm tracking-widest transition-all">
            VIEW ROADMAP
          </button>
        </div>
        
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Currently Open & Free · No credit card required · DHA / MOH / DOH / SLE
        </p>
      </header>

      {/* Features Grid */}
      <section className="px-6 py-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "50 Qs Per Topic", desc: "Intense daily focus sessions. 50 high-yield questions every single day to ensure total coverage of the syllabus.", icon: "📚" },
          { title: "The Ghost Rule", desc: "Our testing engine injects 10 review questions from previous worlds daily to combat memory decay automatically.", icon: "👻" },
          { title: "Async Duels", desc: "Challenge peers in real-time battles to earn Hero Credits and climb the UAE leaderboard.", icon: "⚔️" }
        ].map((feat, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feat.icon}</div>
            <h3 className="text-xl font-black mb-3 italic tracking-tight">{feat.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer / Trust */}
      <footer className="px-6 py-20 text-center border-t border-slate-900">
        <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 mb-8">
            <span className="font-black text-xl italic tracking-tighter">DHA</span>
            <span className="font-black text-xl italic tracking-tighter">MOH</span>
            <span className="font-black text-xl italic tracking-tighter">DOH</span>
            <span className="font-black text-xl italic tracking-tighter">SLE</span>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Full Access Enabled · 45-Day Clinical Roadmap</div>
      </footer>
    </div>
  );
};
