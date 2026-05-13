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

const ArticleForm = ({
  rows = 8,
  onSuccess,
  onCancel,
  cacheEvictFields,
}: ArticleFormProps) => {
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
        <label className=" tracking-wide">
          {t('nutr.create_article.label_title')}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('nutr.create_article.placeholder_title')}
          className="w-full rounded-xl border-2 border-cookie-400 bg-white px-4 py-0.5 focus:outline-none focus:ring-2 focus:ring-cookie-300"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className=" tracking-wide">
          {t('nutr.create_article.label_text')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('nutr.create_article.placeholder_text')}
          rows={rows}
          className="w-full resize-none rounded-xl border-2 border-cookie-400 bg-white px-4 py-0.5  focus:outline-none focus:ring-2 focus:ring-cookie-300"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className=" tracking-wide">
          {t('nutr.create_article.upload_image')}
        </label>
        <div>
          <label
            htmlFor="article-image"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full hover:text-white border-2 border-cookie-400 px-4 py-0.5   transition hover:bg-cookie-400"
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
        {image && <p className=" text-myText-muted">{image.name}</p>}
      </div>

      {error && <p className="text-center  text-myRed">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-full hover:text-white border-2 border-cookie-400 px-4 py-0.5 hover:bg-cookie-400    disabled:opacity-50 sm:w-auto"
        >
          {loading ? t('common.loading') : t('nutr.create_article.submit')}
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full rounded-full border-2 text-myRed border-myRed hover:text-white hover:bg-myRed px-4 py-0.5   disabled:opacity-50 sm:w-auto"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
};

export default ArticleForm;
