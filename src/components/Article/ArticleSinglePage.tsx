import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  useArticleQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useMeQuery,
} from '../../generated/graphql';
import { pick } from '../../utils/pick';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import DeleteConfirm from '../Helper/DeleteConfirm';

type Props = {
  Navbar: React.ComponentType;
  listCacheField: string;
  deleteRedirect: string;
  backHref: string;
  showDate?: boolean;
};

const ArticleSinglePage = ({
  Navbar,
  listCacheField,
  deleteRedirect,
  backHref,
}: Props) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const router = useRouter();
  const id = router.query.id ? parseInt(router.query.id as string) : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editError, setEditError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { data: meData, loading: meLoading } = useMeQuery();
  const myUserId = meData?.me?.id;

  const { data, loading } = useArticleQuery({
    variables: { id: id! },
    skip: !id || !myUserId,
  });

  useEffect(() => {
    if (data?.article) {
      setEditTitle(
        pick(data.article.title_el, data.article.title_en, lang) ?? '',
      );
      setEditText(pick(data.article.text_el, data.article.text_en, lang) ?? '');
    }
  }, [data, lang]);

  const [updateArticle] = useUpdateArticleMutation({
    onCompleted: () => {
      setIsEditing(false);
      setEditImageFile(null);
      setEditImagePreview(null);
      setEditError('');
    },
    onError: (err) => setEditError(err.message),
  });

  const [deleteArticle, { loading: deleteLoading }] = useDeleteArticleMutation({
    onCompleted: () => router.push(deleteRedirect),
    onError: (err) => setEditError(err.message),
  });

  const article = data?.article;

  if (article && myUserId && article.creatorId !== myUserId) {
    router.replace(backHref);
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setEditImageFile(file);
    setEditImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUpdate = async () => {
    if (!id || isSaving) return;
    if (!editTitle.trim() || !editText.trim()) {
      setEditError(t('chef.article.validation_required'));
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl: string | undefined;
      if (editImageFile) {
        imageUrl = await uploadToCloudinary(editImageFile);
      }

      await updateArticle({
        variables: {
          data: {
            id,
            title: editTitle.trim(),
            text: editText.trim(),
            ...(imageUrl && { image: imageUrl }),
          },
        },
        update: (cache) => {
          cache.evict({ fieldName: listCacheField });
          cache.evict({ fieldName: 'article' });
        },
      });
    } catch {
      setEditError(t('nutr.create_article.error_upload'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteArticle({
      variables: { id },
      update: (cache) => {
        cache.evict({ fieldName: listCacheField });
      },
    });
  };

  if (loading || meLoading || !id) {
    return (
      <div className="flex min-h-screen flex-col ">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col ">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="">{t('chef.article.not_found')}</p>
        </div>
      </div>
    );
  }

  const heroSrc = editImagePreview ?? article.image;

  return (
    <div className="flex min-h-screen flex-col ">
      <Navbar />

      {showDeleteModal && (
        <DeleteConfirm
          title={t('chef.article.delete_confirm')}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-3xl">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2  transition"
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

          <div className="w-full overflow-hidden rounded-2xl bg-surface shadow-xl">
            <div className="relative h-56 w-full">
              <Image
                src={heroSrc}
                alt={pick(article.title_el, article.title_en, lang)}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
              />
              {!isEditing && (
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 rounded-xl bg-myYellow px-4 py-0.5 shadow transition"
                  >
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-1 rounded-xl bg-myRed px-4 py-0.5 text-white"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              {isEditing ? (
                <>
                  <div className="mb-4">
                    <label className="mb-1 block">
                      {t('chef.article.title_label')}
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-xl border border-cookie-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cookie-300"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-1 block">
                      {t('chef.article.text_label')}
                    </label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={8}
                      className="w-full resize-none rounded-xl border border-cookie-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cookie-300"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="mb-1 block">
                      {t('chef.article.image_label')}
                    </label>
                    <label
                      htmlFor="edit-image"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-cookie-400 px-4 py-0.5 transition hover:bg-cookie-400 hover:text-white"
                    >
                      {t('chef.article.image_label')}
                    </label>
                    <input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {editImageFile && (
                      <p className="mt-1 ">{editImageFile.name}</p>
                    )}
                  </div>

                  {editError && (
                    <p className="mb-4 text-center text-myRed">{editError}</p>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      onClick={handleUpdate}
                      disabled={isSaving}
                      className="w-full rounded-xl border-2 border-cookie-400 px-4 py-0.5 transition hover:bg-cookie-400 hover:text-white disabled:opacity-50 sm:w-auto"
                    >
                      {!isSaving && t('common.save')}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditTitle(
                          pick(article.title_el, article.title_en, lang) ?? '',
                        );
                        setEditText(
                          pick(article.text_el, article.text_en, lang) ?? '',
                        );
                        setEditImageFile(null);
                        setEditImagePreview(null);
                        setEditError('');
                      }}
                      className="w-full rounded-xl border-2 border-myRed px-4 py-0.5 text-myRed transition hover:bg-myRed hover:text-white sm:w-auto"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mb-4">
                    {pick(article.title_el, article.title_en, lang)}
                  </h2>
                  <p className="whitespace-pre-line">
                    {pick(article.text_el, article.text_en, lang)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleSinglePage;
