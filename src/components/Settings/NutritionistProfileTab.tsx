import { useEffect, useState } from 'react';
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
  SuccessBanner,
} from './SettingsUI';

export default function NutritionistProfileTab() {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const { data } = useMyNutritionistProfileQuery();
  const profile = data?.myNutritionistProfile;
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [updateNutritionistProfile, { loading }] =
    useUpdateNutritionistProfileMutation();

  useEffect(() => {
    if (!profile) return;
    setBio(
      lang === 'en'
        ? profile.bio_en || profile.bio_el || ''
        : profile.bio_el || '',
    );
    setCity(
      lang === 'en'
        ? profile.city_en || profile.city_el || ''
        : profile.city_el || '',
    );
    setPhone(profile.phone ?? '');
  }, [profile, lang]);

  const handleSave = async () => {
    if (loading) return;
    setFieldErrors({});
    setSuccess(null);

    const result = await updateNutritionistProfile({
      variables: { data: { bio_el: bio, city_el: city, phone } },
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
  };

  return (
    <div>
      <FieldGroup title={t('settings.nutritionistProfile')}>
        <TextArea
          label={t('settings.bio')}
          value={bio}
          onChange={setBio}
          placeholder={t('settings.bioPlaceholder')}
          error={fieldErrors.bio_el}
        />
        <Field
          label={t('settings.city')}
          value={city}
          onChange={setCity}
          placeholder="Αθήνα"
          error={fieldErrors.city_el}
        />
        <Field
          label={t('settings.phone')}
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="210 0000000"
          error={fieldErrors.phone}
        />
      </FieldGroup>
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}
