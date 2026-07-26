import React, { useState } from 'react';

/**
 * Reusable Vocab Overview Component
 * Reference: Student: Vocab Overview (Vowels)
 */
export default function VocabOverview({
  title = '한글 Vowels Vocab',
  description = 'Learn fundamental Korean vowel characters and simple vowel vocabulary.',
  words = [],
  onStartFlashcards,
  onBackToPathway
}) {
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const handleSpeech = (wordId, text) => {
    setPlayingAudioId(wordId);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudioId(null), 800);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 sm:py-5 space-y-4">
      {/* Full Screen Focus Header - Sticky Top */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xs flex items-center justify-between gap-3 py-3 border-b border-outline-variant/40">
        <div className="flex items-center gap-3">
          {onBackToPathway && (
            <button
              onClick={onBackToPathway}
              className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
              title="Exit Lesson to Pathway"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}

          {/* Lesson Title in Low Contrast Color */}
          <h1 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-outline font-label">
            {title}
          </h1>
        </div>

        {onStartFlashcards && (
          <button
            onClick={onStartFlashcards}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl border border-primary/20 transition-colors cursor-pointer min-h-[36px]"
            title="Practice 3D Flashcards"
          >
            <span className="material-symbols-outlined text-base">style</span>
            <span className="hidden sm:inline">Practice Flashcards</span>
          </button>
        )}
      </div>

      {/* Vocab Items Grid Matrix - Responsive Centered Tile Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {words.length === 0 ? (
          <div className="col-span-full bg-surface-container-lowest p-8 text-center text-xs sm:text-sm text-on-surface-variant rounded-2xl border border-outline-variant space-y-2">
            <span className="material-symbols-outlined text-3xl text-outline">auto_stories</span>
            <p className="font-bold">No vocabulary words configured for this lesson yet.</p>
          </div>
        ) : (
          words.map((word) => {
            const isAudioPlaying = playingAudioId === word.id;

            return (
              <div
                key={word.id}
                className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col items-center justify-between text-center relative group min-h-[140px] sm:min-h-[160px]"
              >
                {/* Speaker Pronounce Button - Top Right Corner */}
                <button
                  onClick={() => handleSpeech(word.id, word.korean)}
                  title={`Pronounce ${word.korean}`}
                  className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${isAudioPlaying
                      ? 'bg-secondary text-on-secondary border-secondary animate-pulse'
                      : 'bg-surface-container-low hover:bg-surface-container text-primary border-outline-variant/80'
                    }`}
                >
                  <span className="material-symbols-outlined text-base select-none">volume_up</span>
                </button>

                {/* Main Tile Content - Centered Grid Presentation */}
                <div className="my-auto space-y-1.5 pt-2">
                  <h3 className="text-3xl sm:text-4xl font-black text-on-surface font-headline tracking-wide leading-none">
                    {word.korean}
                  </h3>

                  {word.romanization && (
                    <div>
                      <span className="px-2 py-0.5 bg-primary-fixed/50 text-primary text-[11px] font-mono font-bold rounded-md inline-block">
                        [{word.romanization}]
                      </span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm font-bold text-on-surface-variant line-clamp-2 mt-1">
                    {word.english}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
