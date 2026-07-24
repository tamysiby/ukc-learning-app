import React from 'react';
import { MEDIAL_VOWELS, playSound } from './hangulData';

export default function HangulVowelsStep({ onPrev, onNext }) {
  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl font-bold text-on-surface font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">spellcheck</span>
          10 Basic Vowels (모음)
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Vowels determine the layout position in the syllable block (Vertical vs Horizontal).
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {MEDIAL_VOWELS.map((v) => (
          <div
            key={v.char}
            onClick={() => playSound(v.char)}
            className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/80 hover:border-primary hover:shadow-md transition-all cursor-pointer group text-center space-y-1.5"
          >
            <div className="text-3xl font-black text-secondary font-headline group-hover:scale-110 transition-transform">
              {v.char}
            </div>
            <div className="text-xs font-bold text-on-surface">{v.name}</div>
            <div className="text-[11px] font-mono text-outline">[{v.rom}]</div>
            <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
              v.type === 'vertical' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {v.type} layout
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant text-xs space-y-2">
        <h4 className="font-bold text-on-surface">💡 Layout Classification Tip:</h4>
        <p className="text-on-surface-variant">
          • <strong>Vertical Vowels (ㅏ, ㅑ, ㅓ, ㅕ, ㅣ)</strong> sit to the <strong>RIGHT</strong> of the consonant. E.g., ㄱ + ㅏ = <strong>가</strong>.<br />
          • <strong>Horizontal Vowels (ㅗ, ㅛ, ㅜ, ㅠ, ㅡ)</strong> sit <strong>BELOW</strong> the consonant. E.g., ㄱ + ㅗ = <strong>고</strong>.
        </p>
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
          <span>Next: Syllable (음절) Rules</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
