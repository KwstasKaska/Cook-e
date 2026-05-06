import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useCreateArticleMutation } from '../../generated/graphql';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

interface ArticleFormProps {
  rows?: number;
  onSuccess: () => void;
  onCancel: () => void;
  cacheEvictFields: string[];
}

export default function ArticleForm({
  rows = 8,
  onSuccess,
  onCancel,
  cacheEvictFields,
}: ArticleFormProps) {
  const { t } = useTranslation('common');

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');

  const [createArticle, { loading }] = useCreateArticleMutation();

  const handleSubmit = async () => {
    setError('');

    if (!image) {
      setError(t('nutr.create_article.error_image'));
      return;
    }

    const imageUrl = await uploadToCloudinary(image);

    const response = await createArticle({
      variables: {
        data: { title: title.trim(), text: text.trim(), image: imageUrl },
      },
      update: (cache) => {
        cacheEvictFields.forEach((field) => cache.evict({ fieldName: field }));
      },
    });

    if (response.data?.createArticle.errors?.length) {
      setError(t(response.data.createArticle.errors[0].message));
      return;
    }

    onSuccess();
  };

  const handleCancel = () => {
    setTitle('');
    setText('');
    setImage(null);
    setError('');
    onCancel();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold tracking-wide">
          {t('nutr.create_article.label_title')}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('nutr.create_article.placeholder_title')}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold tracking-wide">
          {t('nutr.create_article.label_text')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('nutr.create_article.placeholder_text')}
          rows={rows}
          className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold tracking-wide">
          {t('nutr.create_article.upload_image')}
        </label>
        <div>
          <label
            htmlFor="article-image"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-myYellow px-4 py-1.5 text-xs font-bold transition hover:opacity-90"
          >
            {t('nutr.create_article.upload_image')}
          </label>
          <input
            id="article-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </div>
        {image && <p className="text-xs text-gray-500">{image.name}</p>}
      </div>

      {error && (
        <p className="text-center text-xs font-semibold text-red-500">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:justify-center gap-3 sm:flex-row">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto rounded-full bg-myYellow px-6 py-2 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? t('common.loading') : t('nutr.create_article.submit')}
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full sm:w-auto rounded-full border border-gray-400 px-6 py-2 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-50"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
}
