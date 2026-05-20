import { NextPage, GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useMeQuery,
} from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import InputField from '../components/InputField';
import LanguageSwitcher from '../components/Helper/LanguageSwitcher';
import Logo from '../components/Helper/Logo';

interface LoginFormValues {
  email: string;
  password: string;
}

const initialValues: LoginFormValues = { email: '', password: '' };

const Login: NextPage = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const { t } = useTranslation('common');
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (!loading && data?.me) {
      router.replace(`/${data.me.role.toLowerCase()}`);
    }
  }, [data, loading]);

  if (loading || data?.me) return null;

  return (
    <main className="flex min-h-screen  items-center justify-center   px-4 py-12">
      <section className="w-full  max-w-xl  rounded-3xl bg-surface px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <LanguageSwitcher dark />
        </div>

        <h1 className="mb-6 text-center">{t('login.title')}</h1>

        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setErrors }) => {
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
              const errorMap = toErrorMap(response.data.login.errors);
              setErrors(
                Object.fromEntries(
                  Object.entries(errorMap).map(([k, v]) => [k, t(v)]),
                ),
              );
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
            <Form className="flex flex-col gap-3">
              <InputField
                type="email"
                name="email"
                autoComplete="email"
                className="w-full rounded-xl border border-cookie-200 px-4 py-1.5 text-myText-base placeholder:text-myText-muted focus:outline-none"
                placeholder={t('login.email_placeholder')}
              />
              <InputField
                type="password"
                name="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-cookie-200 px-4 py-1.5 text-myText-base placeholder:text-myText-muted focus:outline-none"
                placeholder={t('login.password_placeholder')}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full rounded-xl bg-cookie-300 py-2.5 text-white transition hover:bg-cookie-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {!isSubmitting && t('login.submit')}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-8 text-center text-myText-muted">
          {t('login.no_account')}{' '}
          <button
            onClick={() => router.push('register')}
            className=" text-myText-base underline transition hover:opacity-80"
          >
            {t('login.create_account')}
          </button>
        </p>
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'el', ['common'])),
  },
});

export default Login;
