import { useState } from 'react';
import { Formik, Form } from 'formik';
import { useForgotPasswordMutation } from '../../generated/graphql';
import InputField from '../InputField';
import { useTranslation } from 'next-i18next';

interface Props {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ onClose }) => {
  const [complete, setComplete] = useState(false);
  const [serverError, setServerError] = useState('');
  const [forgotPassword] = useForgotPasswordMutation();
  const { t } = useTranslation('common');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative grid gap-4 rounded-3xl bg-white p-8 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {complete ? (
          <p className="text-center text-sm text-gray-500">
            {t('forgot_password.success')}
          </p>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            onSubmit={async (values) => {
              setServerError('');
              try {
                await forgotPassword({ variables: values });
                setComplete(true);
              } catch {
                setServerError(t('change_password.server_error'));
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-3">
                <InputField
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-gray-200 text-black placeholder:italic placeholder:text-myBlue-200 focus:outline-none"
                />

                {serverError && (
                  <p className="text-center text-xs font-bold text-red-500">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-xl bg-myBlue-200 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {t('forgot_password.submit')}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-center text-sm text-gray-400 underline hover:text-myGrey-200 transition"
                >
                  {t('common.back')}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
