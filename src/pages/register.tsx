import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRegisterMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../utils/toErrorMap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import LanguageSwitcher from '../components/Helper/LanguageSwitcher';

interface MyFormValues {
  username: string;
  password: string;
  email: string;
  role: string;
}

const Register: NextPage = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  const { t } = useTranslation('common');
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (!loading && data?.me) {
      router.replace(`/${data.me.role.toLowerCase()}`);
    }
  }, [data, loading]);

  if (loading || data?.me) return null;

  const initialValues: MyFormValues = {
    username: '',
    email: '',
    password: '',
    role: '',
  };

  return (
    <main className="flex bg-myGrey-200 min-h-screen w-full items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-3xl bg-white px-8 py-8 ">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 "
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
          <h1 className="mb-1 text-2xl font-bold ">{t('register.title')}</h1>
          <p className="text-sm text-gray-400">{t('register.subtitle')}</p>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={async (values: MyFormValues, { setErrors }) => {
            try {
              const response = await register({
                variables: { options: values },
              });
              if (response.data?.register.errors) {
                setErrors(toErrorMap(response.data.register.errors));
              } else if (response.data?.register.user) {
                router.push('/');
              } else {
                setErrors({ username: t('change_password.server_error') });
              }
            } catch {
              setErrors({ username: t('change_password.server_error') });
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3 text-sm text-black">
              <Field
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 placeholder:italic placeholder:text-myBlue-200 focus:outline-none"
                type="text"
                placeholder={t('register.username_placeholder')}
                name="username"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-center text-xs font-bold text-red-500"
              />

              <Field
                type="email"
                placeholder={t('register.email_placeholder')}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 placeholder:italic placeholder:text-myBlue-200 focus:outline-none"
                name="email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-center text-xs font-bold text-red-500"
              />

              <Field
                type="password"
                placeholder={t('register.password_placeholder')}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 placeholder:italic placeholder:text-myBlue-200 focus:outline-none"
                name="password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="whitespace-pre-line text-center text-xs font-bold text-red-500"
              />

              <div className="mt-2">
                <p className="mb-2 text-sm font-bold ">
                  {t('register.role_label')}
                </p>
                <div
                  role="group"
                  className="flex flex-col gap-1.5 text-sm "
                  aria-labelledby="my-radio-group"
                >
                  <label className="flex cursor-pointer items-center gap-2">
                    <Field type="radio" name="role" value="user" />
                    {t('register.role_user')}
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <Field type="radio" name="role" value="chef" />
                    Chef
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <Field type="radio" name="role" value="nutritionist" />
                    {t('register.role_nutritionist')}
                  </label>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-center text-xs font-bold text-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full cursor-pointer rounded-xl bg-myBlue-200 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t('register.submit')}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-400">
          {t('login.no_account')}{' '}
          <Link
            className="font-semibold  underline transition hover:opacity-80"
            href="/login"
          >
            {t('login.submit')}
          </Link>
        </p>
      </section>
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

export default Register;
