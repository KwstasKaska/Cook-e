import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
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
import Logo from '../components/Helper/Logo';

interface MyLoginFormValues {
  email: string;
  password: string;
}

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

  const initialValues: MyLoginFormValues = {
    email: '',
    password: '',
  };

  return (
    <main className="flex bg-myText-base min-h-screen w-full items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-3xl bg-surface px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <LanguageSwitcher dark />
        </div>

        <div className="mb-6 text-center">
          <h1 className="mb-1 text-2xl font-bold text-myText-heading">
            {t('login.title')}
          </h1>
        </div>

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
                className="w-full rounded-xl border border-cookie-200 px-4 py-2.5 placeholder:text-cookie-300 text-myText-base focus:outline-none"
                placeholder={t('login.username_placeholder')}
              />
              <InputField
                type="password"
                name="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-cookie-200 px-4 py-2.5 placeholder:text-cookie-300 text-myText-base focus:outline-none"
                placeholder={t('login.password_placeholder')}
              />

              <button
                className="mt-1 w-full bg-cookie-300 rounded-xl py-2.5 text-sm font-semibold text-white transition hover:bg-cookie-400 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.loading') : t('login.submit')}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-8 text-center text-sm text-myText-muted">
          {t('login.no_account')}{' '}
          <Link
            className="font-semibold text-myText-base underline transition hover:opacity-80"
            href="/register"
          >
            {t('login.create_account')}
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

export default Login;
