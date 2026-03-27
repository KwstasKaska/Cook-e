import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RecipeSummaryData {
  id: number;
  title: string;
  image: string;
  description: string;
  duration: number; // minutes
  ingredientsCount: number;
  calories: number;
  tags: string[];
}

interface Props {
  recipe: RecipeSummaryData;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RecipeSummaryModal({ recipe, onClose }: Props) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/chef/recipes/${recipe.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Hero image + title overlay */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
          />
          {/* Title overlay — bottom-left */}
          <div className="absolute bottom-0 left-0 p-4">
            <h2
              className="text-xl font-black leading-tight"
              style={{
                color: '#3F4756',
                textShadow: '0 1px 4px rgba(255,255,255,0.8)',
              }}
            >
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Περιγραφή label + text */}
          <h3 className="mb-2 text-lg font-black" style={{ color: '#3F4756' }}>
            Περιγραφή
          </h3>
          <p className="mb-5 text-sm leading-relaxed text-gray-600">
            {recipe.description}
          </p>

          {/* Stats box */}
          <div
            className="mb-5 rounded-2xl p-4"
            style={{ backgroundColor: '#F5F5F5' }}
          >
            <p className="mb-3 text-sm font-bold" style={{ color: '#3F4756' }}>
              Περιγραφή
            </p>
            <div className="flex items-center justify-around text-center">
              <div>
                <p className="text-xs text-gray-500">Χρόνος</p>
                <p
                  className="text-base font-black"
                  style={{ color: '#3F4756' }}
                >
                  {recipe.duration} Λεπτά
                </p>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <p className="text-xs text-gray-500">Υλικά</p>
                <p
                  className="text-base font-black"
                  style={{ color: '#3F4756' }}
                >
                  {recipe.ingredientsCount}
                </p>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <p className="text-xs text-gray-500">Θερμίδες</p>
                <p
                  className="text-base font-black"
                  style={{ color: '#3F4756' }}
                >
                  {recipe.calories}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <p className="mb-2 text-sm font-bold" style={{ color: '#3F4756' }}>
              Tags συνταγής
            </p>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full border px-3 py-1 text-xs"
                  style={{ borderColor: '#3F4756', color: '#3F4756' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={handleEdit}
            className="flex w-full items-center justify-between rounded-2xl px-6 py-4 text-base font-black transition hover:opacity-90"
            style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
          >
            <span>Δείτε ή επεξεργαστείτε την συνταγή</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-5 w-5 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
