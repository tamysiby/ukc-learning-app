import React from 'react';
import { INITIAL_CONSONANTS, playSound } from './hangulData';

export default function HangulConsonantsStep({ onPrev, onNext }) {
  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-6 animate-in fade-in">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">grid_view</span>
            14 Basic Consonants (자음)
          </h2>
          <span className="text-xs text-outline">Click any card to hear audio</span>
        </div>
        <p className="text-xs text-on-surface-variant mt-1">Consonants represent the initial and final sounds in Korean syllable blocks.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {INITIAL_CONSONANTS.map((c) => (
          <div
            key={c.char}
            onClick={() => playSound(c.char)}
            className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/80 hover:border-primary hover:shadow-md transition-all cursor-pointer group text-center space-y-1.5"
          >
            <div className="text-3xl font-black text-primary font-headline group-hover:scale-110 transition-transform">
              {c.char}
            </div>
            <div className="text-xs font-bold text-on-surface">{c.name}</div>
            <div className="text-[11px] font-mono text-outline">[{c.rom}]</div>
            <p className="text-[10px] text-on-surface-variant line-clamp-2 italic">{c.hint}</p>
            <div className="pt-1 flex items-center justify-center gap-1 text-[10px] text-primary font-bold opacity-80 group-hover:opacity-100">
              <span className="material-symbols-outlined text-sm">volume_up</span>
              <span>Listen</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-between">
        <button
          onClick={onPrev}
          className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-low cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-xs hover:bg-primary-container transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Next: Learn Vowels (모음)</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
