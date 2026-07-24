import React from 'react';

export default function HangulEumjeolRulesStep({ onPrev, onNext }) {
  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl font-bold text-on-surface font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">category</span>
          How an 음절 (Syllable Block) is Formed
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">
          Every Korean word is built from individual syllable blocks (음절). Each block consists of 2 or 3 parts.
        </p>
      </div>

      {/* 3 Components Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-low p-4 rounded-2xl border border-primary/30 space-y-1.5 text-center">
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase">1. Initial (초성)</span>
          <h3 className="font-bold text-sm text-on-surface font-headline">First Consonant</h3>
          <p className="text-xs text-on-surface-variant">The starting sound of the syllable (e.g. <strong>ㅎ</strong> in 한).</p>
          <div className="p-2 bg-surface-container-lowest rounded-xl text-xs font-mono text-primary font-bold">
            If vowel starts first, use silent "ㅇ" (e.g. ㅇ + ㅏ = 아)
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-2xl border border-secondary/30 space-y-1.5 text-center">
          <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-md uppercase">2. Medial (중성)</span>
          <h3 className="font-bold text-sm text-on-surface font-headline">Middle Vowel</h3>
          <p className="text-xs text-on-surface-variant">The core vowel sound (e.g. <strong>ㅏ</strong> in 한).</p>
          <div className="p-2 bg-surface-container-lowest rounded-xl text-xs font-mono text-secondary font-bold">
            Placing depends on Vertical (right) vs Horizontal (below)
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-2xl border border-tertiary/30 space-y-1.5 text-center">
          <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded-md uppercase">3. Final (종성 / 받침)</span>
          <h3 className="font-bold text-sm text-on-surface font-headline">Bottom Consonant (Optional)</h3>
          <p className="text-xs text-on-surface-variant">The ending sound placed at the bottom (e.g. <strong>ㄴ</strong> in 한).</p>
          <div className="p-2 bg-surface-container-lowest rounded-xl text-xs font-mono text-tertiary font-bold">
            Called "Batchim" (받침)
          </div>
        </div>
      </div>

      {/* Block Examples */}
      <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant space-y-4">
        <h3 className="font-bold text-sm text-on-surface font-headline">Examples of Syllable Block Layouts:</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
            <div className="text-4xl font-black text-primary font-headline w-16 text-center border-r border-outline-variant pr-4">
              가
            </div>
            <div>
              <p className="font-bold text-on-surface">Consonant + Vertical Vowel</p>
              <p className="text-on-surface-variant">ㄱ (g) + ㅏ (a) = <strong>가</strong> (ga)</p>
              <p className="text-[11px] text-outline mt-1">Vowel is placed to the RIGHT.</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4">
            <div className="text-4xl font-black text-secondary font-headline w-16 text-center border-r border-outline-variant pr-4">
              고
            </div>
            <div>
              <p className="font-bold text-on-surface">Consonant + Horizontal Vowel</p>
              <p className="text-on-surface-variant">ㄱ (g) + ㅗ (o) = <strong>고</strong> (go)</p>
              <p className="text-[11px] text-outline mt-1">Vowel is placed BELOW.</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4 sm:col-span-2">
            <div className="text-4xl font-black text-emerald-700 font-headline w-20 text-center border-r border-outline-variant pr-4">
              한글
            </div>
            <div>
              <p className="font-bold text-on-surface">With Final Consonant (받침 - Batchim)</p>
              <p className="text-on-surface-variant">ㅎ (h) + ㅏ (a) + ㄴ (n) = <strong>한</strong> (han)</p>
              <p className="text-on-surface-variant">ㄱ (g) + ㅡ (eu) + ㄹ (l) = <strong>글</strong> (geul)</p>
              <p className="text-[11px] text-emerald-700 font-bold mt-1">Combined = "한글" (Hangul!)</p>
            </div>
          </div>
        </div>
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
          className="px-5 py-2.5 bg-secondary text-on-secondary font-bold text-xs rounded-xl shadow-xs hover:bg-secondary-container transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Try Interactive Builder!</span>
          <span className="material-symbols-outlined text-base">build</span>
        </button>
      </div>
    </div>
  );
}
