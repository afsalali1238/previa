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

export interface RoadmapDay {
  id: number;
  worldId: number;
  title: string;
  subTopics: string[];
  unlocked: boolean;
  completed: boolean;
  score: number;
}

export interface ProviaState {
  heroCredits: number;
  streak: number;
  lastLogin: string | null;
  roadmap: RoadmapDay[];
  duels: Duel[];

  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => void;
  unlockDay: (dayId: number) => void;
  completeDay: (dayId: number, score: number) => void;
  updateStreak: () => void;
  startDuel: (duelId: string) => void;
  resolveDuel: (duelId: string, playerScore: number) => void;
}

const SCHEDULE_DATA = [
  { days: [1, 2], topic: "Adrenergic agonist", subs: ["General Pharmacology"] },
  { days: [3, 4], topic: "Adrenergic antagonist", subs: ["Antidote & Pregnancy choices"] },
  { days: [5, 6], topic: "Cholinergic agonist", subs: ["Sources of drug information", "Hypolipidemic agents"] },
  { days: [7], topic: "Cholinergic antagonist", subs: ["Inventory control"] },
  { days: [8], topic: "Asthma", subs: ["NSAIDS", "Cough"] },
  { days: [9], topic: "CVS introduction", subs: ["Histamines & Antihistamines"] },
  { days: [10], topic: "Diuretics, CHF Intro", subs: ["Peptic ulcer (video)"] },
  { days: [11], topic: "Congestive heart failure", subs: ["Institutional review board"] },
  { days: [12], topic: "Angina", subs: ["Hypolipidemic agents (discussion)", "Regulations"] },
  { days: [13], topic: "Arrhythmia", subs: ["Statistics 1"] },
  { days: [14, 15], topic: "Blood drugs", subs: ["Pharmacoepidemiology", "Hypertension", "Emetics and antiemetics"] },
  { days: [16], topic: "Q&A Discussion", subs: ["Suspension vs Emulsion"] },
  { days: [17], topic: "Dose calculation", subs: ["Percentage type calculations"] },
  { days: [18], topic: "Molarity & Molar concentrations", subs: ["Milli-equivalence", "Osmolar concentration"] },
  { days: [19], topic: "Parts per million", subs: ["Pharmacokinetics - 1"] },
  { days: [20], topic: "Pharmacokinetic 2", subs: ["Dilution mixing"] },
  { days: [21], topic: "Bioavailability", subs: ["Infusion/Drop rate", "Insulin dose calculation"] },
  { days: [22], topic: "Q&A Discussion", subs: ["Androgens"] },
  { days: [23], topic: "Pituitary & Adrenal hormones", subs: ["ADR Classification"] },
  { days: [24], topic: "Thyroid hormones", subs: ["Immunosuppressants"] },
  { days: [25], topic: "Estrogens, Progestogens, OCP", subs: ["Medication error"] },
  { days: [26], topic: "Study designs", subs: ["Clinical trials", "Constipation & Diarrhea"] },
  { days: [27, 28], topic: "Insulin & OHA", subs: ["Insulin Dosing", "Pharmacogenomics"] },
  { days: [29], topic: "Sedatives & Antidepressants", subs: ["Efficacy, Potency", "Communication Skill"] },
  { days: [30], topic: "GA & LA", subs: ["Child Pugh", "CHA2DS2VASc Score"] },
  { days: [31], topic: "Opioids", subs: ["Herbal drugs", "RF value-chromatography"] },
  { days: [32], topic: "Antipsychotics & Antimanic", subs: ["Pharmacoeconomics", "Direct/Indirect cost"] },
  { days: [33], topic: "Neurodegenerative disorders", subs: ["Alcohol"] },
  { days: [34], topic: "Epilepsy", subs: ["Vitamins"] },
  { days: [35], topic: "RA, Osteoporosis, Gout", subs: ["Corrected phenytoin level"] },
  { days: [36, 37], topic: "Microbiology Intro", subs: ["Cell wall synthesis inhibitors", "Immunology"] },
  { days: [38], topic: "Protein synthesis inhibitor", subs: ["Transcription/Translation", "DNA vs RNA"] },
  { days: [39], topic: "Fluoroquinolones & Anti TB", subs: ["Antiprotozoal agents"] },
  { days: [40], topic: "Antileprotic & Antifungal", subs: ["Sulfonamides", "Bioequivalence"] },
  { days: [41], topic: "Antiviral & Anticancer", subs: ["Hydroxyl group of quinine"] },
  { days: [42], topic: "Vaccines", subs: ["SAR of drugs"] },
  { days: [43], topic: "Ethics in Clinical Trials", subs: ["Off-label drug use"] },
  { days: [44], topic: "Q&A Discussion", subs: ["Amino acids"] },
  { days: [45], topic: "Final Mastery Boss", subs: ["Full Comprehensive Review"] }
];

const INITIAL_ROADMAP: RoadmapDay[] = Array.from({ length: 45 }, (_, i) => {
  const dayNum = i + 1;
  const sched = SCHEDULE_DATA.find(s => s.days.includes(dayNum)) || { topic: `Day ${dayNum} Focus`, subs: [] };
  return {
    id: dayNum,
    worldId: Math.floor(i / 7) + 1,
    title: sched.topic,
    subTopics: sched.subs,
    unlocked: i === 0,
    completed: false,
    score: 0,
  };
});

export const useProviaStore = create<ProviaState>()(
  persist(
    (set, get) => ({
      heroCredits: 100,
      streak: 0,
      lastLogin: null,
      roadmap: INITIAL_ROADMAP,
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
    { name: 'provia-v2-store' } // Incremented version to refresh local storage
  )
);
