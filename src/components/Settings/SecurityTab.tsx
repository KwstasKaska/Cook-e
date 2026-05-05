import { useTranslation } from 'next-i18next';
import { Formik } from 'formik';
import { useUpdateUserMutation } from '../../generated/graphql';
import { Field, FieldGroup, SaveButton, SuccessBanner } from './SettingsUI';

export default function SecurityTab() {
  const { t } = useTranslation('common');
  const [updateUser] = useUpdateUserMutation();

  const validate = (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const errors: Record<string, string> = {};

    if (!values.currentPassword)
      errors.currentPassword = t('settings.currentPasswordRequired');
    if (!values.newPassword)
      errors.newPassword = t('settings.newPasswordRequired');
    if (!values.confirmPassword)
      errors.confirmPassword = t('settings.confirmPasswordRequired');
    if (
      values.newPassword &&
      values.confirmPassword &&
      values.newPassword !== values.confirmPassword
    )
      errors.confirmPassword = t('settings.passwordMismatch');
    if (values.newPassword && values.newPassword.length <= 4)
      errors.newPassword = t('settings.passwordTooShort');
    if (values.newPassword && !values.newPassword.match(/[A-Z]/))
      errors.newPassword = t('settings.passwordNeedsUppercase');
    if (
      values.newPassword &&
      !values.newPassword.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)
    )
      errors.newPassword = t('settings.passwordNeedsSpecial');

    return errors;
  };

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      validate={validate}
      onSubmit={async (values, { setErrors, setStatus, resetForm }) => {
        setStatus(null);

        const result = await updateUser({
          variables: {
            data: {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            },
          },
        });

        if (result.data?.updateUser.errors) {
          const errs: Record<string, string> = {};
          for (const e of result.data.updateUser.errors) {
            errs[e.field] = t(e.message);
          }
          setErrors(errs);
          return;
        }

        resetForm();
        setStatus(t('settings.saveSuccess'));
      }}
    >
      {({
        values,
        errors,
        handleSubmit,
        setFieldValue,
        isSubmitting,
        status,
      }) => (
        <div>
          <FieldGroup title={t('settings.changePassword')}>
            <Field
              label={t('settings.currentPassword')}
              type="password"
              value={values.currentPassword}
              onChange={(v) => setFieldValue('currentPassword', v)}
              placeholder="••••••••"
              error={errors.currentPassword}
            />
            <Field
              label={t('settings.newPassword')}
              type="password"
              value={values.newPassword}
              onChange={(v) => setFieldValue('newPassword', v)}
              placeholder="••••••••"
              error={errors.newPassword}
            />
            <Field
              label={t('settings.confirmPassword')}
              type="password"
              value={values.confirmPassword}
              onChange={(v) => setFieldValue('confirmPassword', v)}
              placeholder="••••••••"
              error={errors.confirmPassword}
            />
          </FieldGroup>
          <SuccessBanner message={status} />
          <SaveButton onClick={() => handleSubmit()} loading={isSubmitting} />
        </div>
      )}
    </Formik>
  );
}
