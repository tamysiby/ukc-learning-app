import React, { useState } from 'react';
import { INITIAL_CONSONANTS, MEDIAL_VOWELS, FINAL_CONSONANTS, composeSyllable, playSound } from './hangulData';

export default function HangulBuilderStep({ onPrev, onNext }) {
  const [selectedInitial, setSelectedInitial] = useState(INITIAL_CONSONANTS[0]); // ㄱ
  const [selectedVowel, setSelectedVowel] = useState(MEDIAL_VOWELS[0]); // ㅏ
  const [selectedFinal, setSelectedFinal] = useState(FINAL_CONSONANTS[0]); // None

  const currentSyllable = composeSyllable(selectedInitial, selectedVowel, selectedFinal);

  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-6 animate-in fade-in">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-on-surface font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">build</span>
            Interactive Syllable Block Builder (음절 조합기)
          </h2>
          <span className="text-xs px-2.5 py-0.5 bg-secondary/10 text-secondary font-bold rounded-full">Hands-On Practice</span>
        </div>
        <p className="text-xs text-on-surface-variant mt-1">
          Select an Initial Consonant, Medial Vowel, and optional Final Consonant (Batchim) to generate the formatted Hangul block in real-time!
        </p>
      </div>

      {/* Builder Workspace Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Controls: Selectors */}
        <div className="md:col-span-7 space-y-4">
          {/* 1. Initial Consonant */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary uppercase tracking-wider block font-label">
              1. Select Initial Consonant (초성)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INITIAL_CONSONANTS.map((c) => (
                <button
                  key={c.char}
                  onClick={() => setSelectedInitial(c)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    selectedInitial.char === c.char
                      ? 'bg-primary text-on-primary shadow-xs scale-105 ring-2 ring-primary/30'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {c.char}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Medial Vowel */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider block font-label">
              2. Select Medial Vowel (중성)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MEDIAL_VOWELS.map((v) => (
                <button
                  key={v.char}
                  onClick={() => setSelectedVowel(v)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    selectedVowel.char === v.char
                      ? 'bg-secondary text-on-secondary shadow-xs scale-105 ring-2 ring-secondary/30'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {v.char}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Final Consonant */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-tertiary uppercase tracking-wider block font-label">
              3. Select Final Consonant / Batchim (종성)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FINAL_CONSONANTS.map((f) => (
                <button
                  key={f.char}
                  onClick={() => setSelectedFinal(f)}
                  className={`px-2.5 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedFinal.char === f.char
                      ? 'bg-tertiary text-on-tertiary shadow-xs scale-105 ring-2 ring-tertiary/30'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {f.char}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Resulting Composed Syllable Block */}
        <div className="md:col-span-5 bg-gradient-to-br from-primary/5 via-secondary/5 to-tertiary/5 p-6 rounded-3xl border-2 border-primary/30 flex flex-col items-center justify-center text-center space-y-4 shadow-sm min-h-[260px]">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-outline font-label">Formed Syllable Block (음절)</span>

          {/* Display Big Block */}
          <div className="relative group">
            <div className="w-28 h-28 bg-surface-container-lowest rounded-3xl border-2 border-primary shadow-lg flex items-center justify-center text-6xl font-black text-on-surface font-headline transition-transform group-hover:scale-105">
              {currentSyllable}
            </div>
          </div>

          {/* Character Formula */}
          <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md">{selectedInitial.char}</span>
            <span>+</span>
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-md">{selectedVowel.char}</span>
            {selectedFinal.index > 0 && (
              <>
                <span>+</span>
                <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded-md">{selectedFinal.char}</span>
              </>
            )}
            <span>=</span>
            <span className="text-base text-on-surface font-bold">{currentSyllable}</span>
          </div>

          {/* Listen Pronunciation Button */}
          <button
            onClick={() => playSound(currentSyllable)}
            className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">volume_up</span>
            <span>Pronounce "{currentSyllable}"</span>
          </button>
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
          className="px-5 py-2.5 bg-tertiary text-on-tertiary font-bold text-xs rounded-xl shadow-xs hover:bg-tertiary-container transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Take Quick Quiz</span>
          <span className="material-symbols-outlined text-base">task_alt</span>
        </button>
      </div>
    </div>
  );
}
