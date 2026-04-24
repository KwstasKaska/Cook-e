import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NutrNavbar from '../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../utils/useIsNutr';
import { useCreateArticleMutation } from '../../generated/graphql';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

const CreateArticle: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  useIsNutr();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [createArticle, { loading }] = useCreateArticleMutation({
    update: (cache) => {
      cache.evict({ fieldName: 'myArticles' });
      cache.evict({ fieldName: 'articles' });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPicture(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async () => {
    setError('');

    if (!title.trim()) {
      setError(t('nutr.create_article.error_title'));
      return;
    }
    if (!text.trim()) {
      setError(t('nutr.create_article.error_text'));
      return;
    }
    if (!picture) {
      setError(t('nutr.create_article.error_image'));
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(picture);

      const response = await createArticle({
        variables: {
          data: { title: title.trim(), text: text.trim(), image: imageUrl },
        },
      });

      if (response.data?.createArticle.errors) {
        setError(response.data.createArticle.errors[0].message);
        return;
      }

      router.push('/nutritionist');
    } catch {
      setError(t('nutr.create_article.error_upload'));
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <NutrNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-2xl">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            {t('common.back')}
          </button>

          {/* Card */}
          <div
            className="w-full overflow-hidden rounded-2xl shadow-xl"
            style={{ backgroundColor: '#E9DEC5' }}
          >
            {/* Hero image preview */}
            <div className="relative h-56 w-full bg-gray-200">
              {preview ? (
                <Image
                  src={preview}
                  alt="preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-12 w-12 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              )}

              {/* Image upload button overlay */}
              <label
                htmlFor="article-image"
                className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow transition hover:opacity-90"
                style={{ backgroundColor: '#EAB308', color: '#3F4756' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                {t('nutr.create_article.upload_image')}
              </label>
              <input
                id="article-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Form fields */}
            <div className="p-6 md:p-8">
              {/* Title */}
              <div className="mb-5">
                <label
                  htmlFor="article-title"
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: '#3F4756' }}
                >
                  {t('nutr.create_article.label_title')}
                </label>
                <input
                  id="article-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('nutr.create_article.placeholder_title')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  style={{ color: '#3F4756' }}
                />
              </div>

              {/* Body text */}
              <div className="mb-6">
                <label
                  htmlFor="article-text"
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: '#3F4756' }}
                >
                  {t('nutr.create_article.label_text')}
                </label>
                <textarea
                  id="article-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('nutr.create_article.placeholder_text')}
                  rows={10}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  style={{ color: '#3F4756' }}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="mb-4 text-sm font-semibold text-red-500">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="rounded-full px-8 py-2.5 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#EAB308', color: '#3F4756' }}
                >
                  {loading
                    ? t('common.saving')
                    : t('nutr.create_article.submit')}
                </button>
                <button
                  onClick={() => router.back()}
                  disabled={loading}
                  className="rounded-full border border-gray-400 px-8 py-2.5 text-sm font-semibold transition hover:bg-gray-100 disabled:opacity-50"
                  style={{ color: '#3F4756' }}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default CreateArticle;
