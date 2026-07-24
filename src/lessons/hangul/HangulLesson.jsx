import React, { useState } from 'react';
import HangulIntroStep from './HangulIntroStep';
import HangulConsonantsStep from './HangulConsonantsStep';
import HangulVowelsStep from './HangulVowelsStep';
import HangulEumjeolRulesStep from './HangulEumjeolRulesStep';
import HangulBuilderStep from './HangulBuilderStep';
import HangulQuizStep from './HangulQuizStep';

export default function HangulLesson({ onFinishLesson }) {
  const [activeTab, setActiveTab] = useState('intro'); // 'intro' | 'consonants' | 'vowels' | 'eumjeol' | 'builder' | 'quiz'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="px-3 py-1 bg-primary-fixed/60 text-primary text-xs font-bold rounded-full">
              Lesson 1 • Introductory Korean
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
              Hangul Basics (한글)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-headline">
            Introduction to Hangul & 음절 (Syllable Block) Formation
          </h1>
          <p className="text-sm text-on-surface-variant max-w-xl font-label">
            Learn the Korean alphabet (한글), master each consonant and vowel character, and build syllable blocks (음절) step-by-step.
          </p>
        </div>

        <button
          onClick={onFinishLesson}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-outline hover:text-on-surface px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Pathway
        </button>
      </div>

      {/* Navigation Step Tabs */}
      <div className="bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant shadow-xs flex flex-wrap gap-1.5 justify-center sm:justify-start overflow-x-auto">
        <button
          onClick={() => setActiveTab('intro')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'intro' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-base">auto_stories</span>
          1. Intro & Origin
        </button>
        <button
          onClick={() => setActiveTab('consonants')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'consonants' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-base">grid_view</span>
          2. Consonants (자음)
        </button>
        <button
          onClick={() => setActiveTab('vowels')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'vowels' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-base">spellcheck</span>
          3. Vowels (모음)
        </button>
        <button
          onClick={() => setActiveTab('eumjeol')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'eumjeol' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-base">category</span>
          4. Syllable (음절) Rules
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'builder' ? 'bg-secondary text-on-secondary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-base">build</span>
          5. Interactive Builder
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'quiz' ? 'bg-tertiary text-on-tertiary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-base">task_alt</span>
          6. Knowledge Check
        </button>
      </div>

      {/* Step Views */}
      {activeTab === 'intro' && <HangulIntroStep onNext={() => setActiveTab('consonants')} />}
      {activeTab === 'consonants' && <HangulConsonantsStep onPrev={() => setActiveTab('intro')} onNext={() => setActiveTab('vowels')} />}
      {activeTab === 'vowels' && <HangulVowelsStep onPrev={() => setActiveTab('consonants')} onNext={() => setActiveTab('eumjeol')} />}
      {activeTab === 'eumjeol' && <HangulEumjeolRulesStep onPrev={() => setActiveTab('vowels')} onNext={() => setActiveTab('builder')} />}
      {activeTab === 'builder' && <HangulBuilderStep onPrev={() => setActiveTab('eumjeol')} onNext={() => setActiveTab('quiz')} />}
      {activeTab === 'quiz' && <HangulQuizStep onPrev={() => setActiveTab('builder')} onFinishLesson={onFinishLesson} />}
    </div>
  );
}
