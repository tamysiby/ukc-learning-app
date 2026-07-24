import React from 'react';

export default function HangulIntroStep({ onNext }) {
  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs space-y-6 animate-in fade-in">
      <div className="flex items-center gap-3 text-primary">
        <span className="material-symbols-outlined text-3xl">auto_stories</span>
        <h2 className="text-xl font-bold text-on-surface font-headline">What is Hangul (한글)?</h2>
      </div>

      <div className="prose prose-sm text-on-surface-variant leading-relaxed space-y-4 font-body">
        <p>
          <strong>Hangul (한글)</strong> is the official writing system of Korea. It was created in <strong>1443 by King Sejong the Great</strong> to increase literacy among all people. Before Hangul, Koreans used complex Chinese characters (Hanja), which were difficult for ordinary citizens to learn.
        </p>

        <div className="p-4 bg-primary-fixed/30 rounded-2xl border border-primary/20 space-y-2">
          <h3 className="font-bold text-primary font-headline text-base flex items-center gap-2">
            <span className="material-symbols-outlined">lightbulb</span>
            Why Hangul is Considered Scientific & Logical:
          </h3>
          <ul className="list-disc list-inside text-xs space-y-1 text-on-surface">
            <li><strong>Consonants (자음)</strong> mimic the physical shape of the mouth, tongue, and throat when making the sound.</li>
            <li><strong>Vowels (모음)</strong> are based on three philosophical elements: Heaven (•), Earth (ㅡ), and Man (ㅣ).</li>
            <li>Instead of writing letters in a long linear row (like English), Hangul letters are combined into square <strong>Syllable Blocks (음절 - Eumjeol)</strong>.</li>
          </ul>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          onClick={onNext}
          className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-xs hover:bg-primary-container transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Next: Learn Consonants (자음)</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
