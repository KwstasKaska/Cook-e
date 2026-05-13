import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
  useUpdateChefProfileMutation,
  useMyChefProfileQuery,
} from '../../generated/graphql';
import { FieldGroup, TextArea, SaveButton, SuccessBanner } from './SettingsUI';

export default function ChefProfileTab() {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const { data } = useMyChefProfileQuery();
  const [bio, setBio] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [updateChefProfile, { loading }] = useUpdateChefProfileMutation();

  useEffect(() => {
    const profile = data?.myChefProfile;
    if (!profile) return;
    setBio(
      lang === 'en'
        ? profile.bio_en || profile.bio_el || ''
        : profile.bio_el || '',
    );
  }, [data, lang]);

  const handleSave = async () => {
    setFieldErrors({});
    setSuccess(null);

    const result = await updateChefProfile({
      variables: { data: { bio_el: bio } },
    });

    if (result.data?.updateChefProfile.errors) {
      const errs: Record<string, string> = {};
      for (const e of result.data.updateChefProfile.errors) {
        errs[e.field] = e.message;
      }
      setFieldErrors(errs);
      return;
    }

    setSuccess(t('settings.saveSuccess'));
  };

  return (
    <div>
      <FieldGroup title={t('settings.chefPublicProfile')}>
        <TextArea
          label=""
          value={bio}
          onChange={setBio}
          placeholder={t('settings.chefBioPlaceholder')}
          error={fieldErrors.bio_el}
        />
      </FieldGroup>
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}
