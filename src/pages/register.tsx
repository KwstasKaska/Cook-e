import { NextPage, GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRegisterMutation, useMeQuery } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import LanguageSwitcher from '../components/Helper/LanguageSwitcher';
import Logo from '../components/Helper/Logo';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  role: string;
}

const initialValues: RegisterFormValues = {
  username: '',
  email: '',
  password: '',
  role: '',
};

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

  return (
    <main className="flex min-h-screen items-center justify-center  px-4 py-12">
      <section className="w-full max-w-xl  rounded-3xl bg-surface px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <LanguageSwitcher dark />
        </div>

        <div className="mb-6 text-center">
          <h1 className="mb-1">{t('register.title')}</h1>
          <p className="">{t('register.subtitle')}</p>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ variables: { options: values } });
            if (response.data?.register.errors) {
              const errorMap = toErrorMap(response.data.register.errors);
              setErrors(
                Object.fromEntries(
                  Object.entries(errorMap).map(([k, v]) => [k, t(v)]),
                ),
              );
            } else if (response.data?.register.user) {
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <Field
                type="text"
                name="username"
                placeholder={t('register.username_plc')}
                className="w-full rounded-xl border border-cookie-200 px-4 py-1.5   "
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-center   text-myRed"
              />

              <Field
                type="email"
                name="email"
                placeholder={t('register.email_placeholder')}
                className="w-full rounded-xl border border-cookie-200 px-4 py-1.5   "
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-center   text-myRed"
              />

              <Field
                type="password"
                name="password"
                placeholder={t('register.password_placeholder')}
                className="w-full rounded-xl border border-cookie-200 px-4 py-1.5   "
              />
              <ErrorMessage
                name="password"
                component="div"
                className="whitespace-pre-line text-center   text-myRed"
              />

              <div className="mt-2">
                <p className="mb-2 font-bold ">{t('register.role_label')}</p>
                <div role="group" className="flex flex-col gap-1.5">
                  <p className="flex cursor-pointer items-center gap-2">
                    <Field type="radio" name="role" value="user" />
                    {t('register.role_user')}
                  </p>
                  <p className="flex cursor-pointer items-center gap-2">
                    <Field type="radio" name="role" value="chef" />
                    {t('register.role_chef')}
                  </p>
                  <p className="flex cursor-pointer items-center gap-2">
                    <Field type="radio" name="role" value="nutritionist" />
                    {t('register.role_nutritionist')}
                  </p>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-center   text-myRed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full rounded-xl bg-cookie-300 py-2.5   text-white transition hover:bg-cookie-400 disabled:cursor-not-allowed"
              >
                {t('register.submit')}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center ">
          {t('login.account')}{' '}
          <button onClick={() => router.push('/login')} className="underline">
            {t('login.submit')}
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

export default Register;
