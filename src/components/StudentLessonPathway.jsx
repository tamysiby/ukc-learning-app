import React from 'react';

export default function StudentLessonPathway({ onStartHangulLesson, onStartVocabLesson }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Info Card */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/60 text-primary rounded-full text-xs font-bold tracking-wide">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            KOREAN FOUNDATIONS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-headline">Unit 1: Hangul & Korean Basics</h1>
          <p className="text-sm text-on-surface-variant max-w-lg font-label">
            Master the Korean alphabet (한글), consonants, vowels, and how to form syllable blocks (음절).
          </p>
        </div>

        {/* Streak Counter Widget */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100/60 p-4 rounded-2xl border border-amber-200/80 text-center min-w-36 space-y-1 shadow-xs">
          <div className="flex items-center justify-center gap-1 text-amber-600 font-bold">
            <span className="material-symbols-outlined fill-1 text-2xl">local_fire_department</span>
            <span className="text-2xl font-black font-headline">14</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Day Streak!</p>
        </div>
      </div>

      {/* Interactive Visual Roadmap Pathway */}
      <div className="relative py-6 flex flex-col items-center space-y-12">
        {/* Curving Pathway Background Line */}
        <div className="absolute top-10 bottom-10 w-1 bg-surface-container-high rounded-full z-0"></div>

        {/* Node 1: Primary Active Lesson - Introduction to Hangul */}
        <div className="relative z-10 flex flex-col items-center space-y-3 group">
          <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg ring-8 ring-primary/20 transition-transform group-hover:scale-105 animate-pulse">
            <span className="material-symbols-outlined text-4xl">menu_book</span>
          </div>
          <div className="text-center bg-surface-container-lowest px-6 py-4 rounded-2xl border-2 border-primary shadow-md space-y-3 max-w-sm">
            <div>
              <span className="px-2 py-0.5 bg-primary-fixed/60 text-primary text-[10px] font-bold rounded-md uppercase">Lesson 1 • Primary Target</span>
              <h3 className="text-base font-bold text-on-surface font-headline mt-1">Introduction to Hangul (한글)</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Learn each consonant & vowel character and master how an 음절 (syllable block) is formed with interactive builder.</p>
            </div>
            <button
              onClick={onStartHangulLesson}
              className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">play_circle</span>
              Start Lesson 1: Hangul Basics
            </button>
          </div>
        </div>

        {/* Node 2: Lesson 2 - Vocab Flashcard Deck */}
        <div className="relative z-10 flex flex-col items-center space-y-3 group">
          <div className="w-16 h-16 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md ring-4 ring-secondary/20 transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-3xl">style</span>
          </div>
          <div className="text-center bg-surface-container-lowest px-6 py-4 rounded-2xl border border-outline-variant shadow-xs space-y-3 max-w-xs">
            <div>
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-md uppercase">Lesson 2</span>
              <h3 className="text-sm font-bold text-on-surface font-headline mt-1">Vocab Flashcard Deck</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Practice 5 essential daily phrases with audio & 3D interactive flip deck.</p>
            </div>
            <button
              onClick={onStartVocabLesson}
              className="w-full py-2 bg-secondary text-on-secondary hover:bg-secondary-container font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">style</span>
              Practice Vocab Deck
            </button>
          </div>
        </div>

        {/* Node 3: Locked */}
        <div className="relative z-10 flex flex-col items-center space-y-2 opacity-60">
          <div className="w-14 h-14 rounded-full bg-surface-container-high text-outline flex items-center justify-center border border-outline-variant">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <div className="text-center bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant">
            <p className="text-xs font-bold text-outline">Lesson 3: Daily Expressions & Greetings</p>
            <p className="text-[10px] text-outline font-semibold uppercase">Locked</p>
          </div>
        </div>

        {/* Node 4: Quiz Challenge */}
        <div className="relative z-10 flex flex-col items-center space-y-2 opacity-60">
          <div className="w-14 h-14 rounded-full bg-surface-container-high text-outline flex items-center justify-center border border-outline-variant">
            <span className="material-symbols-outlined text-2xl">trophy</span>
          </div>
          <div className="text-center bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant">
            <p className="text-xs font-bold text-outline">Unit 1 Final Master Quiz</p>
            <p className="text-[10px] text-outline font-semibold uppercase">Locked</p>
          </div>
        </div>
      </div>
    </div>
  );
}
