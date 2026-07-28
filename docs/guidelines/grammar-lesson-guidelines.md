# Grammar Lesson UI/UX Guidelines

This document defines the standard design system, component hierarchy, visual equations, and interaction patterns for all grammar and syntax lessons in the UKC Learning App (based on [`EyoLesson.jsx`](file:///home/tamy/p/ukc-learning-app/src/lessons/eyo/EyoLesson.jsx)).

---

## 📌 1. Sticky Header & Control Bar

All grammar lessons MUST feature a clean sticky header that does not obstruct content:

```jsx
<div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xs flex items-center justify-between gap-3 py-3 border-b border-outline-variant/40">
  <div className="flex items-center gap-3">
    <button onClick={onFinishLesson} className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]">
      <span className="material-symbols-outlined text-xl">close</span>
    </button>
    <h1 className="text-sm sm:text-base font-bold text-on-surface font-headline">
      {/* Grammar Pattern Title, e.g. 입니다 / 이에요·예요 / 이야·야 */}
    </h1>
  </div>

  {/* Mode Switcher Pill (if applicable) & Done Button */}
  <div className="flex items-center gap-2">
    <div className="bg-surface-container-low p-1 rounded-xl border border-outline-variant flex items-center gap-1">
      {/* Mode Buttons */}
    </div>
    <button onClick={onFinishLesson} className="px-4 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant text-xs font-bold transition-colors cursor-pointer">
      Done
    </button>
  </div>
</div>
```

### Mode Switcher Pill Standard:
- **Button Order**: `Casual` $\rightarrow$ `Polite` $\rightarrow$ `Formal`
- **Default Active State**: `Polite` (`useState('polite')`)
- **Labeling**: Use concise English names (`Casual`, `Polite`, `Formal`) instead of verbose Korean grammatical names.

---

## 🎨 2. Visual Rule Graphic Cards ("Grammar Equations")

Grammar rules should be displayed as visual mathematical equations, avoiding walls of text:

### Color Coding Rules:
- **받침 O (Consonant Endings)**: Primary Blue tint (`bg-primary/10`, `text-primary`, `border-primary/40`).
- **받침 X (Vowel Endings)**: Emerald Green tint (`bg-emerald-500/10`, `text-emerald-700`, `border-emerald-500/40`).

### Anatomy of a Grammar Equation:
```jsx
{/* Card Layout */}
<div className="bg-surface-container-lowest p-5 rounded-3xl border-2 border-primary/40 shadow-xs space-y-3">
  <div className="flex items-center justify-between">
    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold font-headline">
      받침 O
    </span>
    <span className="text-xs font-semibold text-outline">{speechModeLabel}</span>
  </div>
  
  {/* Equation Line */}
  <div className="flex items-center justify-center gap-2 text-xl font-black text-on-surface font-headline py-1">
    <span className="bg-surface-container px-3 py-1.5 rounded-xl">가방</span>
    <span className="text-primary font-bold">+</span>
    <span className="bg-primary/15 text-primary px-3 py-1.5 rounded-xl border border-primary/30">
      이에요
    </span>
    <span className="text-outline font-bold font-headline">=</span>
    <span className="text-primary underline decoration-2 underline-offset-4">
      가방이에요
    </span>
  </div>
</div>
```

---

## 💬 3. Conversation & Example Cards Grid

Examples must be rendered in a responsive 2-column grid (`grid grid-cols-1 md:grid-cols-2 gap-4`).

### Card Structure:
1. **Illustration Container**: `w-24 h-24 rounded-2xl bg-surface-container-low p-2 border border-outline-variant/60` containing a flat vector SVG illustration (`/illustrations/...svg`).
2. **Grammar Status Badge & English Label**:
   - `받침 O (ㅇ)` / `받침 X` pill badge on the left.
   - Minimal lowercase English translation on the right (`bag`, `chair`).
3. **Question Bubble (`Q:`)**:
   - Background: `bg-surface-container-low`
   - Icon-only TTS audio button (`volume_up`).
4. **Answer Bubble (`A:`)**:
   - Background: `bg-primary-fixed/30` with primary border (`border-primary/20`).
   - Icon-only TTS audio button (`volume_up` in solid `bg-primary` circle).

```jsx
<div className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant shadow-xs flex items-center gap-4">
  <div className="w-24 h-24 rounded-2xl bg-surface-container-low p-2 border border-outline-variant/60 flex items-center justify-center shrink-0">
    <img src={item.svg} alt={item.noun} className="max-w-full max-h-full object-contain" />
  </div>
  <div className="flex-1 space-y-2.5">
    {/* Badges */}
    <div className="flex items-center justify-between">
      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${item.batchim ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-700'}`}>
        {item.batchim ? `받침 O (${item.batchimChar})` : '받침 X'}
      </span>
      <span className="text-[11px] font-semibold text-outline font-headline">{item.english}</span>
    </div>

    {/* Q Bubble */}
    <div className="flex items-center justify-between bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-outline uppercase font-headline">Q:</span>
        <span className="text-sm font-bold text-on-surface font-headline">{question}</span>
      </div>
      <button onClick={() => playSound(question)} className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
        <span className="material-symbols-outlined text-xs">volume_up</span>
      </button>
    </div>

    {/* A Bubble */}
    <div className="flex items-center justify-between bg-primary-fixed/30 px-3 py-1.5 rounded-xl border border-primary/20">
      <div className="flex items-center gap-2">
        <span className="text-xs font-extrabold text-primary uppercase font-headline">A:</span>
        <span className="text-base font-extrabold text-on-surface font-headline">{answer}</span>
      </div>
      <button onClick={() => playSound(answer)} className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
        <span className="material-symbols-outlined text-xs">volume_up</span>
      </button>
    </div>
  </div>
</div>
```

---

## 🔊 4. Audio Playback Helper

All grammar components should include the standard non-blocking Web Speech API helper:

```javascript
const playSound = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
};
```
