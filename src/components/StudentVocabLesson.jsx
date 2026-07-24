import React, { useState } from 'react';
import { mockFlashcards } from '../services/supabaseClient';

export default function StudentVocabLesson({ onFinishLesson }) {
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
            className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors min-h-[48px]"
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
          className="p-2 text-outline hover:text-on-surface rounded-full hover:bg-surface-container-low min-w-[40px] min-h-[40px] flex items-center justify-center"
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

        <span className="px-2.5 py-1 bg-surface-container-low border border-outline-variant text-[10px] sm:text-xs font-bold text-on-surface rounded-full shrink-0">
          {currentCard.category}
        </span>
      </div>

      {/* 3D Flashcard Container */}
      <div
        data-testid="flashcard-container"
        onClick={handleFlip}
        className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer select-none"
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Card FRONT */}
          <div className="absolute inset-0 w-full h-full bg-surface-container-lowest rounded-3xl border-2 border-outline-variant p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-md backface-hidden">
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleSpeech(currentCard.korean); }}
                className={`p-3 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center ${isPlayingAudio ? 'bg-primary/20 text-primary' : 'bg-surface-container-low hover:bg-surface-container text-primary'} transition-colors`}
                title="Listen to audio pronunciation"
              >
                <span className="material-symbols-outlined text-2xl">volume_up</span>
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-on-surface tracking-wide font-headline">{currentCard.korean}</h2>
              <p className="text-xs sm:text-sm font-semibold text-primary font-label">{currentCard.romanization}</p>
            </div>

            <div className="text-[11px] sm:text-xs font-bold text-outline flex items-center gap-1">
              <span className="material-symbols-outlined text-base">touch_app</span>
              Tap card to flip definition
            </div>
          </div>

          {/* Card BACK */}
          <div className="absolute inset-0 w-full h-full bg-surface-container-lowest rounded-3xl border-2 border-primary p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-md rotate-y-180 backface-hidden">
            <div className="w-full flex justify-between items-center">
              <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-wider">Definition</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleSpeech(currentCard.korean); }}
                className="p-2.5 rounded-full bg-surface-container-low text-primary min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-xl">volume_up</span>
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 w-full">
              <h3 className="text-xl sm:text-3xl font-extrabold text-on-surface font-headline">{currentCard.english}</h3>
              <div className="bg-surface-container-low p-3 sm:p-3.5 rounded-2xl border border-outline-variant/60 text-xs text-on-surface-variant space-y-1">
                <p className="font-semibold text-on-surface">{currentCard.exampleSentence}</p>
                <p className="italic text-outline">{currentCard.exampleTranslation}</p>
              </div>
            </div>

            <div className="text-[11px] sm:text-xs font-bold text-primary">Tap to flip back</div>
          </div>
        </div>
      </div>

      {/* Touch-Friendly Mobile Rating Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => handleAnswer('hard')}
          className="py-3 sm:py-3.5 px-3 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-1.5 min-h-[48px]"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">sync_problem</span>
          Need Practice
        </button>

        <button
          onClick={() => handleAnswer('easy')}
          className="py-3 sm:py-3.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-1.5 min-h-[48px]"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">sentiment_very_satisfied</span>
          Got It Easy
        </button>
      </div>
    </div>
  );
}
