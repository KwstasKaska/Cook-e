import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { FormData, inputClass, labelClass } from './types';

// ─── Step 1: Title + Image ────────────────────────────────────────────────────

interface StepOneProps {
  form: FormData;
  fieldErrors: Record<string, string>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onUpdate: (field: keyof FormData, value: unknown) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function StepOne({
  form,
  fieldErrors,
  fileInputRef,
  onUpdate,
  onImageUpload,
  onDrop,
}: StepOneProps) {
  const { t } = useTranslation('common');

  return (
    <div>
      <h2 className="mb-5 text-2xl font-black" style={{ color: '#EAB308' }}>
        {t('chef.create_recipe.step1_title')}
      </h2>

      <label className={labelClass} style={{ color: '#3F4756' }}>
        {t('chef.create_recipe.recipe_name_label')}
      </label>
      <input
        type="text"
        placeholder={t('chef.create_recipe.recipe_name_placeholder')}
        value={form.title}
        onChange={(e) => onUpdate('title', e.target.value)}
        className={inputClass}
        style={{ color: '#3F4756' }}
      />
      {fieldErrors.title && (
        <p className="mt-1 text-xs text-red-500">{fieldErrors.title}</p>
      )}

      <label className={`${labelClass} mt-6`} style={{ color: '#3F4756' }}>
        {t('chef.create_recipe.photo_label')}
      </label>
      <div
        className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center transition hover:border-gray-400"
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {form.image ? (
          <div className="relative h-32 w-full overflow-hidden rounded-xl">
            <Image
              src={form.image}
              alt="preview"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.2}
              stroke="#3F4756"
              className="h-12 w-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('chef.create_recipe.photo_upload_hint')}
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
        />
      </div>
    </div>
  );
}
