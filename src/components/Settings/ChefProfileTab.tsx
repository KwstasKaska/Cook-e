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

  // Sync bio once the query resolves
  useEffect(() => {
    if (data?.myChefProfile?.bio) {
      setBio(data.myChefProfile.bio);
    }
  }, [data]);

  const handleSave = async () => {
    setFieldErrors({});
    setServerError(null);
    setSuccess(null);

    try {
      const result = await updateChefProfile({
        variables: { data: { bio } },
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
          error={fieldErrors.bio}
        />
      </FieldGroup>
      <ServerError message={serverError} />
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}
