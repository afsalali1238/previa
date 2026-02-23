import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import { MessageCircle, Rocket, BookOpen, Ghost, Swords, Target, Trophy, Brain, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login } = useAuthStore();

  return (
    <div className="min-h-screen min-h-[100dvh] font-sans overflow-x-hidden" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo-provia.png" alt="Provia" className="w-8 h-8 rounded-lg object-contain logo-dark-bg" />
          <span className="text-xl font-black tracking-tighter italic bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">PROVIA</span>
        </div>
        <button
          onClick={() => login()}
          className="text-xs font-bold hover:text-blue-400 transition-colors uppercase tracking-widest"
        >
          Enter App →
        </button>
      </nav>

      {/* WhatsApp Data Flow Banner */}
      <a
        href="https://wa.me/+919037347340"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-center py-3 px-4 shadow-lg hover:opacity-95 transition-opacity"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 cursor-pointer">
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-sm font-bold tracking-wide">Need Data Flow Assistance? Click here to chat with us on WhatsApp!</span>
        </div>
      </a>

      {/* Hero Section */}
      <header className="px-5 py-16 sm:py-20 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-blue-500 uppercase">
          <Rocket className="w-3.5 h-3.5" /> 45-Day Pharmacy Mastery
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] italic">
          THE ULTIMATE<br />GULF EXAM<br />
          <span className="bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 bg-clip-text text-transparent">COMPANION.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-md mx-auto leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Rated the #1 preparation app.</strong> Currently live for DHA (Pharmacy), with quick expansion to all healthcare fields and authorities.
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

      {/* Coming Soon Section */}
      <section className="px-5 py-8 max-w-6xl mx-auto text-center border-t mt-12" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--accent-blue)' }}>More Professions Coming Soon</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {["Physicians", "Dental", "Nursing", "Allied Health", "Technical & Support", "Alternative & Aesthetic"].map((field) => (
            <span key={field} className="px-4 py-2 rounded-full border text-xs font-medium" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              {field}
            </span>
          ))}
        </div>
      </section>

      {/* Features Grid — 6 cards */}
      <section className="px-5 py-12 max-w-6xl mx-auto">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 text-center" style={{ color: 'var(--accent-blue)' }}>What Makes PROVIA Different</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "2,000+ Real MCQs", desc: "Questions mapped directly from the Prometric exam syllabus — no fluff, no filler.", icon: <Brain className="w-7 h-7" />, color: '#8b5cf6' },
            { title: "The Ghost Rule", desc: "10 review questions from past days mixed into every quiz to combat memory decay.", icon: <Ghost className="w-7 h-7" />, color: '#06b6d4' },
            { title: "Daily Quiz Engine", desc: "20–50 questions per day, randomized order, 80% pass mark, 3 attempts allowed.", icon: <BookOpen className="w-7 h-7" />, color: '#3b82f6' },
            { title: "Milestone Checkpoints", desc: "Checkpoint exams at Days 10, 20, 30, 40 and a Final Mock covering all 45 days.", icon: <Target className="w-7 h-7" />, color: '#f43f5e' },
            { title: "Hero Credits & Streaks", desc: "Earn credits for passing quizzes. Maintain daily streaks. Climb the leaderboard.", icon: <Trophy className="w-7 h-7" />, color: '#f59e0b' },
            { title: "Battle Arena", desc: "Challenge peers in head-to-head quiz duels. Stake 20 Hero Credits — winner takes all.", icon: <Swords className="w-7 h-7" />, color: '#6366f1' },
          ].map((feat, i) => (
            <div key={i} className="border p-5 rounded-2xl transition-all group hover:border-blue-500/30" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: feat.color + '15', color: feat.color }}>
                {feat.icon}
              </div>
              <h3 className="text-sm font-black mb-1.5 tracking-tight" style={{ color: 'var(--text-primary)' }}>{feat.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works CTA */}
      <section className="px-5 py-8 max-w-xl mx-auto text-center">
        <Link
          to="/how-it-works"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm tracking-widest transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          HOW IT WORKS
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-widest mt-3" style={{ color: 'var(--text-muted)' }}>
          Full guide · Install as app · FAQ
        </p>
      </section>

      {/* Footer / Authorities */}
      <footer className="px-5 py-16 text-center border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Supported Authorities</h3>

        <div className="flex flex-col items-center gap-6">
          {/* Active */}
          <div className="flex flex-wrap justify-center gap-6 text-lg font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>
            <span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">DHA (Live)</span>
          </div>

          {/* Coming Soon */}
          <div className="flex flex-wrap justify-center gap-6 opacity-60 text-sm font-bold italic tracking-tighter mt-2">
            <span>HAAD</span>
            <span>MOHAP</span>
            <span>SCFHS</span>
            <span>QCHP</span>
            <span>OMSB</span>
          </div>
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Coming Soon</div>
        </div>
      </footer>
    </div>
  );
};
