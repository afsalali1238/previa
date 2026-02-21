import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Duel {
  id: string;
  opponentName: string;
  opponentLevel: number;
  topic: string;
  stake: number;
  opponentScore: number;
  status: 'available' | 'won' | 'lost';
}

interface ProviaState {
  // Economy
  heroCredits: number;
  streak: number;
  lastLogin: string | null;
  
  // Progress
  roadmap: Array<{
    id: number;
    worldId: number;
    unlocked: boolean;
    completed: boolean;
    score: number;
  }>;
  
  // Social/Battle
  duels: Duel[];

  // Actions
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => void;
  unlockDay: (dayId: number) => void;
  completeDay: (dayId: number, score: number) => void;
  updateStreak: () => void;
  startDuel: (duelId: string) => void;
  resolveDuel: (duelId: string, playerScore: number) => void;
}

export const useProviaStore = create<ProviaState>()(
  persist(
    (set, get) => ({
      heroCredits: 100,
      streak: 0,
      lastLogin: null,
      roadmap: Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        worldId: Math.floor(i / 7) + 1,
        unlocked: i === 0,
        completed: false,
        score: 0,
      })),
      duels: [
        { id: 'd1', opponentName: 'Dr. Sarah', opponentLevel: 5, topic: 'Diuretics', stake: 20, opponentScore: 85, status: 'available' },
        { id: 'd2', opponentName: 'Pharmacist Sam', opponentLevel: 12, topic: 'Antibiotics', stake: 50, opponentScore: 92, status: 'available' }
      ],

      addCredits: (amount) => set((s) => ({ heroCredits: s.heroCredits + amount })),
      spendCredits: (amount) => set((s) => ({ heroCredits: Math.max(0, s.heroCredits - amount) })),

      unlockDay: (dayId) => set((s) => ({
        roadmap: s.roadmap.map(d => d.id === dayId ? { ...d, unlocked: true } : d)
      })),

      completeDay: (dayId, score) => {
        set((s) => ({
          roadmap: s.roadmap.map(d => d.id === dayId ? { ...d, completed: true, score } : d)
        }));
        if (score >= 80) {
          get().unlockDay(dayId + 1);
          get().addCredits(10);
        }
      },

      updateStreak: () => {
        const now = new Date().toDateString();
        if (get().lastLogin === now) return;
        set((s) => ({ streak: (s.lastLogin ? s.streak + 1 : 1), lastLogin: now }));
      },

      startDuel: (duelId) => {
        const duel = get().duels.find(d => d.id === duelId);
        if (duel && get().heroCredits >= duel.stake) {
          get().spendCredits(duel.stake);
        }
      },

      resolveDuel: (duelId, playerScore) => {
        const duel = get().duels.find(d => d.id === duelId);
        if (!duel) return;
        const won = playerScore > duel.opponentScore;
        set((s) => ({
          duels: s.duels.map(d => d.id === duelId ? { ...d, status: won ? 'won' : 'lost' } : d)
        }));
        if (won) get().addCredits(duel.stake * 2);
      }
    }),
    { name: 'provia-v1-store' }
  )
);
