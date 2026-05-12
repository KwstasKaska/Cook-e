import { useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useUpdateUserMutation } from '../../generated/graphql';
import { Field, FieldGroup, SaveButton, SuccessBanner } from './SettingsUI';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

export default function PersonalTab({
  username,
  image,
}: {
  username: string;
  image?: string | null;
}) {
  const { t } = useTranslation('common');
  const [usernameVal, setUsernameVal] = useState(username);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateUser, { loading }] = useUpdateUserMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setFieldErrors({});
    setSuccess(null);

    if (!usernameVal.trim()) {
      setFieldErrors({ username: t('settings.usernameRequired') });
      return;
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile);
    }

    const result = await updateUser({
      variables: {
        data: {
          username: usernameVal,
          ...(imageUrl && { image: imageUrl }),
        },
      },
    });

    if (result.data?.updateUser.errors) {
      const errs: Record<string, string> = {};
      for (const e of result.data.updateUser.errors) {
        errs[e.field] = t(e.message);
      }
      setFieldErrors(errs);
      return;
    }

    setImageFile(null);
    setSuccess(t('settings.saveSuccess'));
  };

  const avatarSrc = imagePreview ?? image ?? null;

  return (
    <div>
      <FieldGroup title={t('settings.profilePicture')}>
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-cookie-400">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-cookie-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#C9955A"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-cookie-400 text-cookie-400 px-4 py-0.5  font-bold transition hover:bg-cookie-400 hover:text-white"
            >
              {t('settings.changePhoto')}
            </button>
            {imageFile && (
              <p className=" text-myText-muted">{imageFile.name}</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </FieldGroup>

      <FieldGroup title={t('settings.basicInfo')}>
        <Field
          label={t('settings.fullName')}
          value={usernameVal}
          onChange={setUsernameVal}
          error={fieldErrors.username}
        />
      </FieldGroup>

      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}
