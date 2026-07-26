export function hasVocabIllustration(word) {
  if (!word) return false;
  if (word.imageUrl) return true;
  const key = typeof word === 'string' ? word : word.id;
  const availableIds = [
    'vp1-1', 'vp1-2', 'vp1-3', 'vp1-4', 'vp1-5', 'vp1-6', 'vp1-7', 'vp1-8', 'vp1-9', 'vp1-10',
    'vp1-11', 'vp1-12', 'vp1-13', 'vp1-14', 'vp1-15', 'vp1-16', 'vp1-17', 'vp1-18', 'vp1-19', 'vp1-20',
    'vp1-21', 'vp1-22', 'vp1-23', 'vp1-24', 'vp1-25', 'vp1-26', 'vp1-27', 'vp1-28', 'vp1-29', 'vp1-30', 'vp1-31'
  ];
  return availableIds.includes(key);
}

/**
 * Pure SVG / Vector Illustration Renderer for Vocab Words
 * Loads SVG vector files asynchronously from /public/illustrations/
 */
export default function VocabIllustration({ word, size = 'md' }) {
  if (!word) return null;

  const key = typeof word === 'string' ? word : word.id;
  const src = word.imageUrl || (hasVocabIllustration(word) ? `/illustrations/${key}.svg` : null);

  if (!src) return null;

  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28 sm:w-36 sm:h-36',
    lg: 'w-40 h-40 sm:w-48 sm:h-48'
  }[size] || 'w-28 h-28 sm:w-36 sm:h-36';

  return (
    <img
      src={src}
      alt={word.english || word.korean || 'Vocab illustration'}
      className={`${dimensions} object-contain animate-in fade-in select-none`}
      loading="lazy"
    />
  );
}
