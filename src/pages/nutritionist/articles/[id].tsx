import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import Footer from '../../../components/Users/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  useArticleQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from '../../../generated/graphql';
import useIsNutr from '../../../utils/useIsNutr';
import { pick } from '../../../utils/pick';

// ─── Delete confirm modal ─────────────────────────────────────────────────────
const DeleteModal = ({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) => {
  const { t } = useTranslation('common');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl mx-4">
        <h2
          className="mb-4 text-center text-xl font-bold"
          style={{ color: '#3F4756' }}
        >
          {t('chef.article.delete_confirm')}
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          {t('chef.article.delete_confirm_text')}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full px-6 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#E53E3E' }}
          >
            {loading ? t('common.loading') : t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NutrArticleDetail() {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const router = useRouter();
  const id = router.query.id ? parseInt(router.query.id as string) : undefined;
  useIsNutr();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editError, setEditError] = useState('');

  const { data, loading } = useArticleQuery({
    variables: { id: id! },
    skip: !id,
    onCompleted: (data) => {
      if (data.article) {
        setEditTitle(data.article.title_el ?? '');
        setEditText(data.article.text_el ?? '');
      }
    },
  });

  const [updateArticle, { loading: updateLoading }] = useUpdateArticleMutation({
    onCompleted: () => {
      setIsEditing(false);
      setEditImage(null);
      setEditError('');
    },
    onError: (err) => setEditError(err.message),
  });

  const [deleteArticle, { loading: deleteLoading }] = useDeleteArticleMutation({
    onCompleted: () => router.push('/nutritionist'),
    onError: (err) => setEditError(err.message),
  });

  const article = data?.article;

  const handleUpdate = async () => {
    if (!id) return;
    if (!editTitle.trim() || !editText.trim()) {
      setEditError(t('chef.article.validation_required'));
      return;
    }
    await updateArticle({
      variables: {
        data: { id, title: editTitle.trim(), text: editText.trim() },
        picture: editImage ?? undefined,
      },
      update: (cache) => {
        cache.evict({ fieldName: 'myArticles' });
        cache.evict({ fieldName: 'article' });
      },
    });
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteArticle({
      variables: { id },
      update: (cache) => {
        cache.evict({ fieldName: 'myArticles' });
      },
    });
  };

  if (loading || !id) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center"
        style={{ backgroundColor: '#3F4756' }}
      >
        <NutrNavbar />
        <p className="text-white opacity-60 mt-20">{t('common.loading')}</p>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center"
        style={{ backgroundColor: '#3F4756' }}
      >
        <NutrNavbar />
        <p className="text-white opacity-60 mt-20">
          {t('chef.article.not_found')}
        </p>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <NutrNavbar />

      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleteLoading}
        />
      )}

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

          {/* Article card */}
          <div
            className="w-full rounded-2xl overflow-hidden shadow-xl"
            style={{ backgroundColor: '#E9DEC5' }}
          >
            {/* Hero image */}
            <div className="relative h-56 w-full">
              <Image
                src={
                  editImage
                    ? URL.createObjectURL(editImage)
                    : article.image ?? '/images/articleImg.jpg'
                }
                alt={pick(article.title_el, article.title_en, lang)}
                fill
                className="object-cover"
              />
              {/* Edit / Delete buttons */}
              {!isEditing && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold shadow transition hover:opacity-90"
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                      />
                    </svg>
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold shadow transition hover:opacity-90"
                    style={{ backgroundColor: '#E53E3E', color: 'white' }}
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    {t('common.delete')}
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {isEditing ? (
                <>
                  <div className="mb-4">
                    <label
                      className="mb-1 block text-xs font-semibold"
                      style={{ color: '#3F4756' }}
                    >
                      {t('chef.article.title_label')}
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      style={{ color: '#3F4756' }}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="mb-1 block text-xs font-semibold"
                      style={{ color: '#3F4756' }}
                    >
                      {t('chef.article.text_label')}
                    </label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={8}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                      style={{ color: '#3F4756' }}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className="mb-1 block text-xs font-semibold"
                      style={{ color: '#3F4756' }}
                    >
                      {t('chef.article.image_label')}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditImage(e.target.files?.[0] ?? null)
                      }
                      className="text-sm"
                    />
                    {editImage && (
                      <p className="mt-1 text-xs text-gray-500">
                        {editImage.name}
                      </p>
                    )}
                  </div>

                  {editError && (
                    <p className="mb-4 text-sm text-red-500">{editError}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdate}
                      disabled={updateLoading}
                      className="rounded-full px-8 py-2.5 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#EAB308', color: '#3F4756' }}
                    >
                      {updateLoading ? t('common.loading') : t('common.save')}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditTitle(article.title_el ?? '');
                        setEditText(article.text_el ?? '');
                        setEditImage(null);
                        setEditError('');
                      }}
                      className="rounded-full border border-gray-400 px-8 py-2.5 text-sm font-semibold transition hover:bg-gray-100"
                      style={{ color: '#3F4756' }}
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-2 text-xs text-gray-400">
                    {new Date(article.createdAt).toLocaleDateString(
                      lang === 'en' ? 'en-GB' : 'el-GR',
                      { day: 'numeric', month: 'long', year: 'numeric' },
                    )}
                  </p>
                  <h1
                    className="mb-4 text-2xl font-bold leading-snug"
                    style={{ fontFamily: 'Georgia, serif', color: '#3F4756' }}
                  >
                    {pick(article.title_el, article.title_en, lang)}
                  </h1>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: '#4A5568' }}
                  >
                    {pick(article.text_el, article.text_en, lang)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
