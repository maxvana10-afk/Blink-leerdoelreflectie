import React from 'react';
import { StarRating } from '../types';
import { STAR_DESCRIPTIONS } from '../constants';

interface StarSelectorProps {
  value: StarRating;
  onChange: (value: StarRating) => void;
}

export const StarSelector: React.FC<StarSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border-2 border-yellow-100">
      <div className="flex gap-4 mb-3">
        {[1, 2, 3].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star as StarRating)}
            className={`
              w-16 h-16 text-3xl flex items-center justify-center rounded-full transition-all transform hover:scale-110
              ${value && value >= star ? 'bg-yellow-400 text-white shadow-md' : 'bg-gray-200 text-gray-400'}
            `}
            aria-label={`${star} sterren`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="text-sm font-semibold text-slate-600 h-6">
        {value ? STAR_DESCRIPTIONS[value] : "Kies een aantal sterren"}
      </p>
    </div>
  );
};
