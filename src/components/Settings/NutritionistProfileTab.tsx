import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  useUpdateNutritionistProfileMutation,
  useMyNutritionistProfileQuery,
} from '../../generated/graphql';
import {
  Field,
  FieldGroup,
  TextArea,
  SaveButton,
  ServerError,
  SuccessBanner,
} from './SettingsUI';

export default function NutritionistProfileTab() {
  const { t } = useTranslation('common');
  const { data } = useMyNutritionistProfileQuery();
  const profile = data?.myNutritionistProfile;
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateNutritionistProfile, { loading }] =
    useUpdateNutritionistProfileMutation();

  const handleSave = async () => {
    setFieldErrors({});
    setServerError(null);
    setSuccess(null);

    try {
      const result = await updateNutritionistProfile({
        variables: { data: { bio, phone, city } },
      });

      if (result.data?.updateNutritionistProfile.errors) {
        const errs: Record<string, string> = {};
        for (const e of result.data.updateNutritionistProfile.errors) {
          errs[e.field] = e.message;
        }
        setFieldErrors(errs);
        return;
      }

      setSuccess(t('settings.saveSuccess'));
    } catch {
      setServerError(t('settings.saveError'));
    }
  };

  return (
    <div>
      <FieldGroup title={t('settings.nutritionistProfile')}>
        <TextArea
          label={t('settings.bio')}
          value={bio}
          onChange={setBio}
          placeholder={t('settings.bioPlaceholder')}
          error={fieldErrors.bio}
        />
        <Field
          label={t('settings.phone')}
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+30 210 0000000"
          error={fieldErrors.phone}
        />
        <Field
          label={t('settings.city')}
          value={city}
          onChange={setCity}
          placeholder="Αθήνα"
          error={fieldErrors.city}
        />
      </FieldGroup>
      <ServerError message={serverError} />
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}
