import React from 'react';
import { useProviaStore } from '../roadmap/store/proviaStore';

export const TheLounge: React.FC = () => {
  const { duels, startDuel, resolveDuel, heroCredits } = useProviaStore();

  const handleDuel = (duel: any) => {
    if (heroCredits < duel.stake) {
      alert("Not enough Hero Credits to enter this duel!");
      return;
    }
    startDuel(duel.id);
    // Simulate immediate battle logic for now
    const score = Math.floor(Math.random() * 40) + 60; // Random score 60-100
    alert(`Battle! You scored ${score}%. ${duel.opponentName} scored ${duel.opponentScore}%.`);
    resolveDuel(duel.id, score);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <section>
        <h2 className="text-xl font-black text-blue-400 mb-4 tracking-tighter italic">⚔️ BATTLE DUELS</h2>
        <div className="grid gap-4">
          {duels.map(duel => (
            <div key={duel.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <p className="font-bold">{duel.opponentName} <span className="text-xs text-slate-500 font-normal">Lvl {duel.opponentLevel}</span></p>
                <p className="text-xs text-slate-400">Topic: {duel.topic}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <div className="text-xs font-bold text-amber-500">Stakes: {duel.stake} HC</div>
                {duel.status === 'available' ? (
                  <button 
                    onClick={() => handleDuel(duel)}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-black transition-colors"
                  >
                    CHALLENGE
                  </button>
                ) : (
                  <span className={`text-xs font-black uppercase ${duel.status === 'won' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {duel.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-black text-emerald-400 mb-4 tracking-tighter italic">💬 THE LOUNGE</h2>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center">
          <p className="text-slate-500 text-sm italic">"Day 16: Does anyone have a trick for remembering Emulsion vs Suspension stability?"</p>
          <div className="mt-4 text-xs text-slate-600">Join the discussion in your specific level lounge.</div>
        </div>
      </section>
    </div>
  );
};
