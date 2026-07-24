import React, { useState } from 'react';
import { mockFlashcards } from '../../services/supabaseClient';

export default function VocabLesson({ onFinishLesson }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scores, setScores] = useState({ easy: 0, hard: 0 });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentCard = mockFlashcards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeech = (text) => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 800);
    }
  };

  const handleAnswer = (rating) => {
    const updatedScores = {
      ...scores,
      [rating]: scores[rating] + 1
    };
    setScores(updatedScores);

    if (currentIndex + 1 < mockFlashcards.length) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 sm:py-12 text-center space-y-6">
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-lg space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl sm:text-5xl">verified</span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface font-headline">Lesson Completed!</h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 font-label">You reviewed all 5 flashcards in Unit 3 deck.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
              <p className="text-xl sm:text-2xl font-black text-emerald-700">{scores.easy}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800">Mastered (Easy)</p>
            </div>
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
              <p className="text-xl sm:text-2xl font-black text-amber-700">{scores.hard}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800">Need Practice</p>
            </div>
          </div>

          <button
            onClick={onFinishLesson}
            className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors min-h-[48px] cursor-pointer"
          >
            Return to Lesson Pathway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onFinishLesson}
          className="p-2 text-outline hover:text-on-surface rounded-full hover:bg-surface-container-low min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Progress indicators */}
        <div className="flex-1 max-w-xs mx-2 space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-outline">
            <span>Card {currentIndex + 1} of {mockFlashcards.length}</span>
            <span>{Math.round(((currentIndex + 1) / mockFlashcards.length) * 100)}%</span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / mockFlashcards.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-surface-container-low text-xs font-bold text-on-surface-variant rounded-lg border border-outline-variant">
          {currentCard.category}
        </span>
      </div>

      {/* 3D Flashcard Container */}
      <div
        data-testid="flashcard-container"
        className="perspective-1000 min-h-[300px] sm:min-h-[360px] cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full min-h-[300px] sm:min-h-[360px] rounded-3xl border-2 border-outline-variant/80 bg-surface-container-lowest p-6 sm:p-8 shadow-xl flex flex-col justify-between transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side */}
          <div className={`space-y-4 flex flex-col items-center justify-center flex-1 ${isFlipped ? 'hidden' : 'block'}`}>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-outline font-label">
              Korean Flashcard • Tap to flip
            </span>

            <h2 className="text-4xl sm:text-5xl font-black text-on-surface font-headline tracking-wide">
              {currentCard.korean}
            </h2>

            <p className="text-sm font-semibold text-primary font-mono bg-primary-fixed/40 px-3 py-1 rounded-full">
              [{currentCard.romanization}]
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeech(currentCard.korean);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container text-primary font-bold text-xs rounded-xl border border-outline-variant transition-colors min-h-[40px] cursor-pointer"
            >
              <span className={`material-symbols-outlined text-lg ${isPlayingAudio ? 'animate-pulse text-secondary' : ''}`}>
                volume_up
              </span>
              <span>Listen Pronunciation</span>
            </button>
          </div>

          {/* Back Side */}
          <div className={`space-y-4 flex flex-col items-center justify-center flex-1 rotate-y-180 ${isFlipped ? 'block' : 'hidden'}`}>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 font-label">
              English Translation & Meaning
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface font-headline text-center">
              {currentCard.english}
            </h2>

            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant text-center max-w-sm space-y-1">
              <p className="text-xs font-bold text-on-surface font-headline">"{currentCard.exampleSentence}"</p>
              <p className="text-[11px] text-on-surface-variant italic font-label">{currentCard.exampleTranslation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Rating Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => handleAnswer('hard')}
          className="py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-bold text-xs sm:text-sm rounded-2xl border border-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[48px]"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Hard (Needs Review)
        </button>

        <button
          onClick={() => handleAnswer('easy')}
          className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[48px]"
        >
          <span className="material-symbols-outlined text-lg">check_circle</span>
          Easy (Got It!)
        </button>
      </div>
    </div>
  );
}
