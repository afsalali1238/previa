import { useState, useCallback, useEffect } from 'react';
import './App.css';

// Local services (no Firebase)
// Firebase Services
import { authService } from './services/auth';
import { storeService } from './services/store';

// Auth
import { LoginPage } from './features/auth/components/LoginPage';

// Onboarding
import { AuthorityPicker } from './features/onboarding/pages/AuthorityPicker';
import type { Authority } from './features/onboarding/types/onboarding.types';

// Quiz
import { DailyQuestions } from './features/questions/pages/DailyQuestions';

// Progress
import { StreakCounter } from './features/progress/components/StreakCounter';
import { StatsCard } from './features/progress/components/StatsCard';

// Social
import { Leaderboard } from './features/social/pages/Leaderboard';
import { Achievements } from './features/social/pages/Achievements';
import { Referral } from './features/social/pages/Referral';
import { getLevelForXP, getXPProgress } from './features/social/data/social.data';

// Battle & Chat
import { OpponentSelect } from './features/battle/pages/OpponentSelect';
import { BattleArena } from './features/battle/pages/BattleArena';
import { ChatPage } from './features/battle/pages/ChatPage';
import type { Opponent } from './features/battle/data/battle.data';

type AppPage = 'login' | 'authority' | 'dashboard' | 'quiz'
  | 'leaderboard' | 'achievements' | 'referral'
  | 'battle_select' | 'battle_arena' | 'chat';

interface AppState {
  page: AppPage;
  userName: string;
  email: string;
  authority: Authority | null;
  currentDay: number;
  completedDays: number[];
  streak: number;
  xp: number;
  accuracy: number;
  quizDay: number;
  hearts: number;
  maxHearts: number;
  unlockedAchievements: string[];
  referralCount: number;
  battleOpponent: Opponent | null;
  battlesWon: number;
  battlesPlayed: number;
}

function App() {
  const [state, setState] = useState<AppState>({
    page: 'login',
    userName: '',
    email: '',
    authority: null,
    currentDay: 1,
    completedDays: [],
    streak: 0,
    xp: 0,
    accuracy: 0,
    quizDay: 1,
    hearts: 5,
    maxHearts: 5,
    unlockedAchievements: [],
    referralCount: 0,
    battleOpponent: null,
    battlesWon: 0,
    battlesPlayed: 0,
  });

  const navigate = useCallback((page: AppPage) => setState(prev => ({ ...prev, page })), []);

  const checkAchievements = useCallback((s: AppState): string[] => {
    const u: string[] = [];
    if (s.completedDays.length >= 1 && !s.unlockedAchievements.includes('first_day')) u.push('first_day');
    if (s.streak >= 3 && !s.unlockedAchievements.includes('streak_3')) u.push('streak_3');
    if (s.streak >= 7 && !s.unlockedAchievements.includes('streak_7')) u.push('streak_7');
    if (s.streak >= 14 && !s.unlockedAchievements.includes('streak_14')) u.push('streak_14');
    if (s.completedDays.length >= 22 && !s.unlockedAchievements.includes('halfway')) u.push('halfway');
    if (s.completedDays.length >= 45 && !s.unlockedAchievements.includes('complete_45')) u.push('complete_45');
    if (getLevelForXP(s.xp).level >= 5 && !s.unlockedAchievements.includes('level_5')) u.push('level_5');
    return u;
  }, []);

  const level = getLevelForXP(state.xp);
  const xpProgress = getXPProgress(state.xp);

  // ─── AUTH (Firebase) ───
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = authService.onAuthChange(async (user) => {
      if (user) {
        // Load or create profile
        try {
          let profile = await storeService.loadProfile(user.uid);

          if (!profile) {
            // New user! Create default profile
            profile = await storeService.createProfile(user);
          }

          const territory = profile.territory;
          setState(prev => ({
            ...prev,
            page: territory ? 'dashboard' : 'authority',
            userName: profile!.displayName,
            email: profile!.email,
            authority: territory ? {
              id: territory,
              name: territory === 'DHA' ? 'Dubai Health Authority' :
                territory === 'MOH' ? 'Ministry of Health' :
                  territory === 'HAAD' ? 'Health Authority - Abu Dhabi' : 'Saudi Commission',
              flag: '🇦🇪',
              fullName: territory === 'DHA' ? 'Dubai Health Authority' :
                territory === 'MOH' ? 'Ministry of Health' :
                  territory === 'HAAD' ? 'Health Authority - Abu Dhabi' : 'Saudi Commission for Health Specialties',
              emoji: '🏥',
              color: territory === 'DHA' ? '#2563eb' :
                territory === 'MOH' ? '#22c55e' :
                  territory === 'HAAD' ? '#f59e0b' : '#64748b'
            } : null,
            xp: profile!.learningPoints || 0,
            streak: profile!.streakCount || 0,
            hearts: profile!.hearts || 5,
            currentDay: profile!.currentDay || 1,
            completedDays: profile!.completedDays || [],
            referralCount: profile!.referralCount || 0,
            unlockedAchievements: profile!.vaultItems || [],
          }));
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      } else {
        setState(prev => ({ ...prev, page: 'login', userName: '', email: '' }));
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ─── LOGIN ───
  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Provia...</div>;

  if (state.page === 'login') {
    return <LoginPage onLogin={() => { /* handled by auth listener */ }} />;
  }

  // ─── AUTHORITY PICKER ───
  if (state.page === 'authority') {
    return (
      <AuthorityPicker
        selected={state.authority}
        onSelect={(a) => setState(prev => ({ ...prev, authority: a }))}
        onContinue={() => {
          // Save authority to Firebase
          if (state.authority) {
            import('./lib/firebase/config').then(({ auth }) => {
              if (auth.currentUser) {
                storeService.updateProfile(auth.currentUser.uid, {
                  territory: state.authority!.id,
                  specialty: 'Pharmacist',
                });
              }
            });
          }
          navigate('dashboard');
        }}
      />
    );
  }

  // ─── QUIZ ───
  if (state.page === 'quiz') {
    return (
      <DailyQuestions
        day={state.quizDay}
        onComplete={(score, total) => {
          const pct = Math.round((score / total) * 100);
          const xpEarned = score * 10 + (pct === 100 ? 50 : 0);
          setState(prev => {
            const ns = {
              ...prev, page: 'dashboard' as AppPage,
              completedDays: [...new Set([...prev.completedDays, prev.quizDay])],
              currentDay: Math.max(prev.currentDay, prev.quizDay + 1),
              streak: prev.streak + 1, xp: prev.xp + xpEarned, accuracy: pct,
            };

            // Persist to DB
            import('./lib/firebase/config').then(({ auth }) => {
              if (auth.currentUser) {
                // Update main profile
                storeService.updateProfile(auth.currentUser.uid, {
                  learningPoints: ns.xp,
                  streakCount: ns.streak,
                  currentDay: ns.currentDay,
                  completedDays: ns.completedDays,
                });

                // Save detailed progress for this day
                storeService.saveDayProgress(auth.currentUser.uid, state.quizDay, {
                  checkpointScore: score,
                  setsCompleted: [true, true, true, true, true], // Simplified for now
                });
              }
            });

            const na = checkAchievements(ns);
            if (pct === 100) na.push('perfect_10');
            return { ...ns, unlockedAchievements: [...new Set([...prev.unlockedAchievements, ...na])] };
          });
        }}
        onBack={() => navigate('dashboard')}
      />
    );
  }

  // ─── LEADERBOARD ───
  if (state.page === 'leaderboard') {
    return (
      <Leaderboard currentUserXP={state.xp} currentUserName={state.userName}
        currentUserStreak={state.streak} currentUserDays={state.completedDays.length}
        currentUserLevel={level.level} onBack={() => navigate('dashboard')} />
    );
  }

  // ─── ACHIEVEMENTS ───
  if (state.page === 'achievements') {
    return <Achievements unlockedIds={state.unlockedAchievements} onBack={() => navigate('dashboard')} />;
  }

  // ─── REFERRAL ───
  if (state.page === 'referral') {
    return <Referral referralCount={state.referralCount} onBack={() => navigate('dashboard')} />;
  }

  // ─── BATTLE SELECT ───
  if (state.page === 'battle_select') {
    return (
      <OpponentSelect
        onSelect={(opp) => setState(prev => ({ ...prev, battleOpponent: opp, page: 'battle_arena' }))}
        onBack={() => navigate('dashboard')}
      />
    );
  }

  // ─── BATTLE ARENA ───
  if (state.page === 'battle_arena' && state.battleOpponent) {
    return (
      <BattleArena opponent={state.battleOpponent}
        onComplete={(won, xpEarned) => {
          setState(prev => {
            const na = won && !prev.unlockedAchievements.includes('battle_win') ? ['battle_win'] : [];
            return {
              ...prev, page: 'dashboard', xp: prev.xp + xpEarned,
              battlesWon: prev.battlesWon + (won ? 1 : 0),
              battlesPlayed: prev.battlesPlayed + 1, battleOpponent: null,
              unlockedAchievements: [...new Set([...prev.unlockedAchievements, ...na])],
            };
          });
        }}
        onBack={() => navigate('battle_select')}
      />
    );
  }

  // ─── CHAT ───
  if (state.page === 'chat') {
    return <ChatPage userName={state.userName} onBack={() => navigate('dashboard')} />;
  }

  // ─── DASHBOARD ───
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#1e293b',
      paddingBottom: '80px',
    }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{level.badge}</span>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Lv.{level.level}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{level.title}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            {Array.from({ length: state.maxHearts }, (_, i) => (
              <span key={i} style={{ fontSize: '1rem', opacity: i < state.hearts ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
        </div>

        {/* XP Bar */}
        <div style={{
          marginBottom: '1rem', padding: '0.4rem 0.6rem',
          backgroundColor: '#ffffff', borderRadius: '0.6rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{state.xp} XP</span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{level.maxXP} XP</span>
          </div>
          <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '3px' }}>
            <div style={{
              height: '100%', borderRadius: '3px',
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              width: `${xpProgress}%`, transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* Welcome */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{
              fontSize: '1.25rem', fontWeight: 800,
              color: '#0f172a',
              marginBottom: '0.1rem',
            }}>Hey, {state.userName}! 💊</h1>
            <p style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {state.authority?.emoji} {state.authority?.fullName} • Pharmacist
            </p>
          </div>
          <StreakCounter count={state.streak} />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <StatsCard label="XP" value={state.xp} icon="⭐" color="#fbbf24" />
          <StatsCard label="Accuracy" value={`${state.accuracy}%`} icon="🎯" color="#22c55e" />
          <StatsCard label="Battles" value={`${state.battlesWon}W`} icon="⚔️" color="#f87171" />
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.35rem', marginBottom: '1rem' }}>
          {[
            { label: 'Ranks', icon: '🏆', page: 'leaderboard' as AppPage },
            { label: 'Badges', icon: '🏅', page: 'achievements' as AppPage },
            { label: 'Battle', icon: '⚔️', page: 'battle_select' as AppPage },
            { label: 'Chat', icon: '💬', page: 'chat' as AppPage },
            { label: 'Invite', icon: '🤝', page: 'referral' as AppPage },
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.page)} style={{
              padding: '0.5rem 0.2rem', backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0', borderRadius: '0.6rem',
              cursor: 'pointer', textAlign: 'center', color: '#334155',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>{item.icon}</div>
              <div style={{ fontSize: '0.55rem', color: '#64748b' }}>{item.label}</div>
            </button>
          ))}
        </div>

        {/* 45-Day Grid */}
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '0.85rem',
          padding: '1rem', marginBottom: '1rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>45-Day Progress</h3>
            <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>{state.completedDays.length}/45</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
            {Array.from({ length: 45 }, (_, i) => {
              const day = i + 1;
              const done = state.completedDays.includes(day);
              const current = day === state.currentDay && !done;
              const locked = day > state.currentDay;

              let bg = '#f1f5f9';
              let border = 'none';
              let color = '#94a3b8';

              if (done) {
                bg = '#22c55e';
                color = '#ffffff';
              } else if (current) {
                bg = '#eff6ff'; // light blue
                border = '2px solid #2563eb';
                color = '#2563eb';
              }

              return (
                <button key={day} onClick={() => { if (!locked) setState(prev => ({ ...prev, quizDay: day, page: 'quiz' })); }}
                  style={{
                    width: '30px', height: '30px', borderRadius: '5px',
                    border: border,
                    background: bg,
                    color: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 700,
                    cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.5 : 1,
                  }}>
                  {done ? '✓' : day}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
          {!state.completedDays.includes(state.currentDay) && state.currentDay <= 45 && (
            <button onClick={() => setState(prev => ({ ...prev, quizDay: prev.currentDay, page: 'quiz' }))} style={{
              flex: 2, padding: '0.8rem',
              background: '#2563eb', // Solid blue
              color: '#fff', border: 'none', borderRadius: '0.7rem',
              fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
            }}>📝 Day {state.currentDay}</button>
          )}
          <button onClick={() => navigate('battle_select')} style={{
            flex: 1, padding: '0.8rem',
            background: '#ea580c', // Orange
            color: '#fff', border: 'none', borderRadius: '0.7rem',
            fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.2)',
          }}>⚔️ Battle</button>
        </div>

        {/* Logout */}
        <button onClick={() => {
          authService.logout();
        }} style={{
          width: '100%', padding: '0.5rem', background: 'transparent',
          color: '#ef4444', border: '1px solid #fecaca', borderRadius: '0.5rem', fontSize: '0.7rem', cursor: 'pointer',
        }}>🚪 Logout</button>


      </div>

      {/* Bottom Nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex', justifyContent: 'space-around',
        padding: '0.35rem 0 0.6rem', zIndex: 100,
        boxShadow: '0 -1px 3px rgba(0,0,0,0.05)',
      }}>
        {[
          { icon: '🏠', label: 'Home', page: 'dashboard' as AppPage },
          { icon: '⚔️', label: 'Battle', page: 'battle_select' as AppPage },
          { icon: '💬', label: 'Chat', page: 'chat' as AppPage },
          { icon: '🏆', label: 'Ranks', page: 'leaderboard' as AppPage },
          { icon: '🏅', label: 'Badges', page: 'achievements' as AppPage },
        ].map(item => {
          const active = state.page === item.page;
          return (
            <button key={item.label} onClick={() => navigate(item.page)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.05rem',
              color: active ? '#2563eb' : '#94a3b8', padding: '0.2rem 0.6rem',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.5rem', fontWeight: active ? 700 : 400 }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App;
