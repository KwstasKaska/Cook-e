import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useMeQuery,
} from '../generated/graphql';
import { Form, Formik } from 'formik';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import InputField from '../components/InputField';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import LanguageSwitcher from '../components/Helper/LanguageSwitcher';
import ForgotPasswordModal from '../components/Helper/ForgotPasswordModal';

interface MyLoginFormValues {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const { t } = useTranslation('common');
  const { data, loading } = useMeQuery();
  const [forgotOpen, setForgotOpen] = useState(false);

  useEffect(() => {
    if (!loading && data?.me) {
      router.replace(`/${data.me.role.toLowerCase()}`);
    }
  }, [data, loading]);

  if (loading || data?.me) return null;

  const initialValues: MyLoginFormValues = {
    email: '',
    password: '',
  };

  return (
    <main className="flex bg-myGrey-200 min-h-screen w-full items-center justify-center px-4 py-12">
      <section
        aria-labelledby="login-heading"
        className="w-full max-w-md rounded-3xl bg-white px-8 py-8"
      >
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center  gap-1.5 text-xs font-semibold transition hover:opacity-70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            {t('nav.home')}
          </Link>

          <LanguageSwitcher dark />
        </div>

        <div className="mb-6 text-center">
          <h1 id="login-heading" className="mb-1 text-2xl font-bold ">
            {t('login.title')}
          </h1>
          <p className="text-sm opacity-75 ">{t('login.subtitle')}</p>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={async (values: MyLoginFormValues, { setErrors }) => {
            const { email, password } = values;
            const response = await login({
              variables: { email, password },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: { __typename: 'Query', me: data?.login.user },
                });
              },
            });
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data?.login.errors));
            } else if (response.data?.login.user) {
              if (typeof router.query.next === 'string') {
                router.push(router.query.next);
              } else {
                router.push(`/${response.data.login.user.role.toLowerCase()}`);
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form
              id="login-form"
              noValidate
              className="flex flex-col gap-3"
              aria-label={t('login.title')}
            >
              <InputField
                type="email"
                name="email"
                aria-label={t('login.username_placeholder')}
                autoComplete="email"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 placeholder:italic placeholder:text-myBlue-200 focus:outline-none"
                placeholder={t('login.username_placeholder')}
              />
              <InputField
                type="password"
                name="password"
                aria-label={t('login.password_placeholder')}
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 placeholder:italic placeholder:text-myBlue-200 focus:outline-none"
                placeholder={t('login.password_placeholder')}
              />

              <button
                className="mt-1 w-full bg-myBlue-200 rounded-xl py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting
                  ? t('common.saving', 'Submitting…')
                  : t('login.submit')}
              </button>

              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-center opacity-75 text-sm font-normal underline "
              >
                {t('login.forgot_password')}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-8 text-center text-sm">
          {t('login.no_account')}{' '}
          <Link
            className="font-semibold  opacity-75 underline transition hover:opacity-80"
            href="/register"
          >
            {t('login.create_account')}
          </Link>
        </p>
      </section>

      {forgotOpen && (
        <ForgotPasswordModal onClose={() => setForgotOpen(false)} />
      )}
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

export default Login;
