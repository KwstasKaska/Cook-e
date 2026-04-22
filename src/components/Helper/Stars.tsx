import React from 'react';

const STAR_PATH =
  'M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z';

function StarIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? '#EAB308' : 'none'}
      stroke="#EAB308"
      strokeWidth={filled ? 0 : 1.5}
      className={className}
    >
      <path fillRule="evenodd" d={STAR_PATH} clipRule="evenodd" />
    </svg>
  );
}

// ── Default export: simple stars row used in chef pages
// Usage: <Stars rating={4.5} size="md" />
interface StarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function Stars({ rating, size = 'md' }: StarsProps) {
  const sz =
    size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < Math.round(rating)} className={sz} />
      ))}
    </div>
  );
}

// ── StarRow: stars + numeric label
// Usage: <StarRow rating={4.5} ratingCount={30} small />
export function StarRow({
  rating,
  ratingCount,
  small = false,
}: {
  rating: number;
  ratingCount: number;
  small?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            filled={i < Math.round(rating)}
            className={small ? 'h-3.5 w-3.5' : 'h-5 w-5'}
          />
        ))}
      </div>
      <span className={`text-yellow-400 ${small ? 'text-xs' : 'text-sm'}`}>
        {rating.toFixed(1)} / 5 ({ratingCount})
      </span>
    </div>
  );
}

// ── SmallStars: compact stars only, no label (used in review cards)
// Usage: <SmallStars rating={review.score} />
export function SmallStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          filled={i < Math.round(rating)}
          className="h-3.5 w-3.5"
        />
      ))}
    </div>
  );
}

// ── StarPicker: interactive star selector (used in rate forms)
// Usage: <StarPicker value={score} onChange={setScore} />
export function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (score: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className="transition hover:scale-110"
        >
          <StarIcon filled={s <= value} className="h-8 w-8" />
        </button>
      ))}
    </div>
  );
}
