import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
  useUpdateChefProfileMutation,
  useMyChefProfileQuery,
} from '../../generated/graphql';
import {
  FieldGroup,
  TextArea,
  SaveButton,
  ServerError,
  SuccessBanner,
} from './SettingsUI';

export default function ChefProfileTab() {
  const { t } = useTranslation('common');
  const { data } = useMyChefProfileQuery();
  const [bio, setBio] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateChefProfile, { loading }] = useUpdateChefProfileMutation();

  useEffect(() => {
    if (data?.myChefProfile?.bio_el) {
      setBio(data.myChefProfile.bio_el);
    }
  }, [data]);

  const handleSave = async () => {
    setFieldErrors({});
    setServerError(null);
    setSuccess(null);

    try {
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
    } catch {
      setServerError(t('settings.saveError'));
    }
  };

  return (
    <div>
      <FieldGroup title={t('settings.chefPublicProfile')}>
        <TextArea
          label={t('settings.chefBio')}
          value={bio}
          onChange={setBio}
          placeholder={t('settings.chefBioPlaceholder')}
          error={fieldErrors.bio_el}
        />
      </FieldGroup>
      <ServerError message={serverError} />
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}
