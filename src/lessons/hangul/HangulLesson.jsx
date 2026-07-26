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
    <div className="max-w-4xl mx-auto px-4 py-3 sm:py-5 space-y-5">
      {/* Full Screen Focus Header - Sticky Top */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xs flex items-center justify-between gap-3 py-3 border-b border-outline-variant/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onFinishLesson}
            className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
            title="Exit Lesson to Pathway"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          {/* Lesson Title in Low Contrast Color */}
          <h1 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-outline font-label">
            Introduction to Hangul & 음절 (Syllable Block) Formation
          </h1>
        </div>
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
          <span className="material-symbols-outlined text-base">font_download</span>
          3. Vowels (모음)
        </button>
        <button
          onClick={() => setActiveTab('eumjeol')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'eumjeol' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-base">schema</span>
          4. Block Rules (음절)
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'builder' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          <span className="material-symbols-outlined text-base">extension</span>
          5. Syllable Builder
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'quiz' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <span className="material-symbols-outlined text-base">quiz</span>
          6. Knowledge Quiz
        </button>
      </div>

      {/* Step Content */}
      <div className="transition-all">
        {activeTab === 'intro' && <HangulIntroStep onNext={() => setActiveTab('consonants')} />}
        {activeTab === 'consonants' && <HangulConsonantsStep onNext={() => setActiveTab('vowels')} />}
        {activeTab === 'vowels' && <HangulVowelsStep onNext={() => setActiveTab('eumjeol')} />}
        {activeTab === 'eumjeol' && <HangulEumjeolRulesStep onNext={() => setActiveTab('builder')} />}
        {activeTab === 'builder' && <HangulBuilderStep onNext={() => setActiveTab('quiz')} />}
        {activeTab === 'quiz' && <HangulQuizStep onFinish={onFinishLesson} />}
      </div>
    </div>
  );
}
