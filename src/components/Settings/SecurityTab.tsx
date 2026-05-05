import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useUpdateUserMutation } from '../../generated/graphql';
import { Field, FieldGroup, SaveButton, SuccessBanner } from './SettingsUI';

export default function SecurityTab() {
  const { t } = useTranslation('common');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [updateUser, { loading }] = useUpdateUserMutation();

  const handleSave = async () => {
    setFieldErrors({});
    setSuccess(null);

    if (!currentPassword) {
      setFieldErrors((p) => ({
        ...p,
        currentPassword: t('settings.currentPasswordRequired'),
      }));
      return;
    }
    if (!newPassword) {
      setFieldErrors((p) => ({
        ...p,
        newPassword: t('settings.newPasswordRequired'),
      }));
      return;
    }
    if (!confirmPassword) {
      setFieldErrors((p) => ({
        ...p,
        confirmPassword: t('settings.confirmPasswordRequired'),
      }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setFieldErrors((p) => ({
        ...p,
        confirmPassword: t('settings.passwordMismatch'),
      }));
      return;
    }
    if (newPassword.length <= 4) {
      setFieldErrors((p) => ({
        ...p,
        newPassword: t('settings.passwordTooShort'),
      }));
      return;
    }
    if (!newPassword.match(/[A-Z]/)) {
      setFieldErrors((p) => ({
        ...p,
        newPassword: t('settings.passwordNeedsUppercase'),
      }));
      return;
    }
    if (!newPassword.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)) {
      setFieldErrors((p) => ({
        ...p,
        newPassword: t('settings.passwordNeedsSpecial'),
      }));
      return;
    }

    const result = await updateUser({
      variables: { data: { currentPassword, newPassword } },
    });

    if (result.data?.updateUser.errors) {
      const errs: Record<string, string> = {};
      for (const e of result.data.updateUser.errors) {
        errs[e.field] = e.message;
      }
      setFieldErrors(errs);
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccess(t('settings.saveSuccess'));
  };

  return (
    <div>
      <FieldGroup title={t('settings.changePassword')}>
        <Field
          label={t('settings.currentPassword')}
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="••••••••"
          error={fieldErrors.currentPassword}
        />
        <Field
          label={t('settings.newPassword')}
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="••••••••"
          error={fieldErrors.newPassword}
        />
        <Field
          label={t('settings.confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="••••••••"
          error={fieldErrors.confirmPassword}
        />
      </FieldGroup>
      <SuccessBanner message={success} />
      <SaveButton onClick={handleSave} loading={loading} />
    </div>
  );
}
