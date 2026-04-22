import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useForgotPasswordMutation, useMeQuery } from '../generated/graphql';
import InputField from '../components/InputField';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import LanguageSwitcher from '../components/Helper/LanguageSwitcher';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ForgotPassword: React.FC = () => {
  const [complete, setComplete] = useState(false);
  const [serverError, setServerError] = useState('');
  const [forgotPassword] = useForgotPasswordMutation();
  const { t } = useTranslation('common');
  const { data, loading } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && data?.me) {
      router.replace(`/${data.me.role.toLowerCase()}`);
    }
  }, [data, loading]);

  if (loading || data?.me) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-myBeige-100">
      <div className="relative grid gap-4 rounded-[1.5625em] border-[5px] border-myBlue-200 bg-myBlue-200 p-8">
        <LanguageSwitcher />

        {complete ? (
          <p className="text-center font-source text-base text-white">
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
              <Form className="grid gap-4">
                <InputField
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-[17em] rounded-[0.5rem] text-black placeholder:text-base placeholder:italic placeholder:text-myBlue-200"
                />

                {serverError && (
                  <p className="text-center text-sm font-bold text-red-400">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-[0.56rem] bg-myRed py-2 text-sm font-bold text-white lg:text-base"
                >
                  {t('forgot_password.submit')}
                </button>

                <Link
                  href="/login"
                  className="text-center font-source text-sm text-white underline"
                >
                  {t('common.back')}
                </Link>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'el', ['common'])),
    },
  };
};

export default ForgotPassword;
