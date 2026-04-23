import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useUpdateUserMutation } from '../../generated/graphql';
import {
  Field,
  FieldGroup,
  SaveButton,
  ServerError,
  SuccessBanner,
} from './SettingsUI';

export default function PersonalTab({
  username,
  email,
}: {
  username: string;
  email: string;
}) {
  const { t } = useTranslation('common');
  const [usernameVal, setUsernameVal] = useState(username);
  const [emailVal, setEmailVal] = useState(email);
  const [phoneVal, setPhoneVal] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateUser, { loading }] = useUpdateUserMutation();

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
      const result = await updateUser({
        variables: {
          data: {
            username: usernameVal,
            email: emailVal,
            phoneNumber: phoneVal || undefined,
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

      setSuccess(t('settings.saveSuccess'));
    } catch {
      setServerError(t('settings.saveError'));
    }
  };

  return (
    <div>
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
