import React, { useState } from 'react';
import { mockFlashcards } from '../../services/supabaseClient';

export default function VocabLesson({ words = [], title = 'Vocabulary Practice Flashcards', onFinishLesson }) {
  const flashcards = words.length > 0 ? words : mockFlashcards;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentCard = flashcards[currentIndex] || flashcards[0];

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

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < flashcards.length) {
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
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 font-label">
              You reviewed all {flashcards.length} flashcards in this deck.
            </p>
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
    <div className="max-w-xl mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Full Screen Focus Header - Sticky Top */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xs flex items-center justify-between gap-3 py-3 border-b border-outline-variant/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onFinishLesson}
            className="p-2 text-outline hover:text-on-surface rounded-xl hover:bg-surface-container-low min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            title="Exit Lesson to Pathway"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-outline font-label">
            {title}
          </span>
        </div>

        {/* Progress indicator */}
        <div className="text-[11px] font-mono font-bold text-outline">
          {currentIndex + 1} / {flashcards.length}
        </div>
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
            <h2 className="text-4xl sm:text-5xl font-black text-on-surface font-headline tracking-wide">
              {currentCard?.korean}
            </h2>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeech(currentCard?.korean);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container text-primary font-bold text-xs rounded-xl border border-outline-variant transition-colors min-h-[40px] cursor-pointer"
            >
              <span className={`material-symbols-outlined text-lg ${isPlayingAudio ? 'animate-pulse text-secondary' : ''}`}>
                volume_up
              </span>
            </button>
            <span className="text-[10px] sm:text-xs font-bold py-2 uppercase tracking-wider text-outline font-label">
              Tap to flip
            </span>
          </div>

          {/* Back Side */}
          <div className={`space-y-4 flex flex-col items-center justify-center flex-1 rotate-y-180 ${isFlipped ? 'block' : 'hidden'}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface font-headline text-center">
              {currentCard?.english}
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation Buttons (Previous / Next) */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`py-3.5 font-bold text-xs sm:text-sm rounded-2xl border flex items-center justify-center gap-2 transition-colors min-h-[48px] ${
            currentIndex === 0
              ? 'bg-surface-container text-outline border-outline-variant cursor-not-allowed opacity-50'
              : 'bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant cursor-pointer'
          }`}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          className="py-3.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[48px]"
        >
          <span>{currentIndex === flashcards.length - 1 ? 'Finish Lesson' : 'Next'}</span>
          <span className="material-symbols-outlined text-lg">
            {currentIndex === flashcards.length - 1 ? 'check_circle' : 'arrow_forward'}
          </span>
        </button>
      </div>
    </div>
  );
}
