import { useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useUpdateUserMutation } from '../../generated/graphql';
import {
  Field,
  FieldGroup,
  SaveButton,
  ServerError,
  SuccessBanner,
} from './SettingsUI';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

export default function PersonalTab({
  username,
  email,
  image,
}: {
  username: string;
  email: string;
  image?: string | null;
}) {
  const { t } = useTranslation('common');
  const [usernameVal, setUsernameVal] = useState(username);
  const [emailVal, setEmailVal] = useState(email);
  const [phoneVal, setPhoneVal] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
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
    setServerError(null);
    setSuccess(null);

    if (!usernameVal.trim()) {
      setFieldErrors((p) => ({
        ...p,
        username: t('settings.usernameRequired'),
      }));
      return;
    }
    if (!emailVal.trim()) {
      setFieldErrors((p) => ({ ...p, email: t('settings.emailRequired') }));
      return;
    }

    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const result = await updateUser({
        variables: {
          data: {
            username: usernameVal,
            email: emailVal,
            phoneNumber: phoneVal || undefined,
            ...(imageUrl && { image: imageUrl }),
          },
        },
      });

      if (result.data?.updateUser.errors) {
        const errs: Record<string, string> = {};
        for (const e of result.data.updateUser.errors) {
          errs[e.field] = e.message;
        }
        setFieldErrors(errs);
        return;
      }

      setImageFile(null);
      setSuccess(t('settings.saveSuccess'));
    } catch {
      setServerError(t('settings.saveError'));
    }
  };

  const avatarSrc = imagePreview ?? image ?? null;

  return (
    <div>
      <FieldGroup title={t('settings.profilePicture')}>
        <div className="flex items-center gap-5">
          {/* Avatar preview */}
          <div
            className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2"
            style={{ borderColor: '#EAEAEA' }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ backgroundColor: '#E8EEF5' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#377CC3"
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

          {/* Upload button */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border-2 px-5 py-2 text-xs font-bold transition hover:opacity-80"
              style={{ borderColor: '#377CC3', color: '#377CC3' }}
            >
              {t('settings.changePhoto')}
            </button>
            {imageFile && (
              <p className="text-xs text-gray-400">{imageFile.name}</p>
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

      {/* ── Basic info ──────────────────────────────────────────── */}
      <FieldGroup title={t('settings.basicInfo')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={t('settings.fullName')}
            value={usernameVal}
            onChange={setUsernameVal}
            error={fieldErrors.username}
          />
          <Field
            label="Email"
            type="email"
            value={emailVal}
            onChange={setEmailVal}
            error={fieldErrors.email}
          />
        </div>
        <Field
          label={t('settings.phone')}
          type="tel"
          value={phoneVal}
          onChange={setPhoneVal}
          placeholder="+30 210 0000000"
        />
      </FieldGroup>

      <ServerError message={serverError} />
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}
