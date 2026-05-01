import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from '../../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../../utils/toErrorMap';
import { useState } from 'react';
import InputField from '../../components/InputField';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  const [serverError, setServerError] = useState('');
  const { t } = useTranslation('common');

  return (
    <main className="flex min-h-screen items-center justify-center bg-myBeige-100">
      <div className="grid gap-4 rounded-[1.5625em] border-[5px] border-myBlue-200 bg-myBlue-200 p-8">
        <h1 className="text-center  text-2xl font-bold text-white">
          {t('settings.changePassword')}
        </h1>

        <Formik
          initialValues={{ newPassword: '' }}
          onSubmit={async (values, { setErrors }) => {
            setServerError('');
            setTokenError('');
            try {
              const response = await changePassword({
                variables: {
                  token:
                    typeof router.query.token === 'string'
                      ? router.query.token
                      : '',
                  newPassword: values.newPassword,
                },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: 'Query',
                      me: data?.changePassword.user,
                    },
                  });
                },
              });

              if (response.data?.changePassword.errors) {
                const errorMap = toErrorMap(
                  response.data.changePassword.errors,
                );
                if ('token' in errorMap) {
                  setTokenError(errorMap.token);
                }
                setErrors(errorMap);
              } else if (response.data?.changePassword.user) {
                const role =
                  response.data.changePassword.user.role.toLowerCase();
                router.push(`/${role}`);
              } else {
                setServerError(t('change_password.server_error'));
              }
            } catch {
              setServerError(t('change_password.server_error'));
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="grid gap-4">
              <InputField
                type="password"
                name="newPassword"
                placeholder={t('settings.newPassword')}
                className="w-[17em] rounded-[0.5rem] text-black placeholder:text-base placeholder:italic placeholder:text-myBlue-200"
              />

              {tokenError && (
                <p className="text-center text-sm font-bold text-red-400">
                  {t('change_password.token_error')}{' '}
                  <Link href="/" className="underline">
                    {t('change_password.token_error_link')}
                  </Link>
                </p>
              )}

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
                {t('settings.changePassword')}
              </button>
            </Form>
          )}
        </Formik>
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

export default ChangePassword;
