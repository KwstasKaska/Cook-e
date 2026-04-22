import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useCreateArticleMutation } from '../../generated/graphql';

interface ArticleCreateFormProps {
  /** The chef's user.id — used to evict the correct Apollo cache field */
  chefUserId: number;
  onClose: () => void;
}

export default function ArticleCreateForm({
  chefUserId,
  onClose,
}: ArticleCreateFormProps) {
  const { t } = useTranslation('common');

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  const [createArticle, { loading }] = useCreateArticleMutation();

  const handleSubmit = async () => {
    if (!title.trim() || !text.trim()) {
      setError(t('chef.article.validation_required'));
      return;
    }
    if (!image) {
      setError(t('chef.profile.article_image_required'));
      return;
    }
    await createArticle({
      variables: {
        data: { title: title.trim(), text: text.trim() },
        picture: image,
      },
      update: (cache) => {
        cache.evict({ fieldName: 'articlesByChef' });
      },
    });
    onClose();
  };

  const handleCancel = () => {
    setTitle('');
    setText('');
    setImage(null);
    setError('');
    onClose();
  };

  return (
    <div
      className="mb-4 rounded-2xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: '#B3D5F8' }}
    >
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: '#3F4756' }}
        >
          {t('chef.profile.article_title')}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          style={{ color: '#3F4756' }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: '#3F4756' }}
        >
          {t('chef.profile.article_text')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          style={{ color: '#3F4756' }}
        />
      </div>

      {/* Image */}
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: '#3F4756' }}
        >
          {t('chef.profile.article_image_label')}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1 file:text-xs file:font-semibold file:cursor-pointer"
          style={{ color: '#3F4756' }}
        />
        {image && <p className="text-xs text-gray-600">{image.name}</p>}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-full px-6 py-2 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#EAB308', color: '#3F4756' }}
        >
          {loading ? t('common.loading') : t('chef.profile.article_submit')}
        </button>
        <button
          onClick={handleCancel}
          className="rounded-full border border-gray-400 px-6 py-2 text-sm font-semibold transition hover:bg-white/40"
          style={{ color: '#3F4756' }}
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
}
