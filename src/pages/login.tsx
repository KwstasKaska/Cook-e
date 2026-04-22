import Image from 'next/image';
import { NextPage } from 'next';
import chef from '/public/images/chef.png';
import logo from '/public/images/5.png';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
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

interface MyLoginFormValues {
  usernameOrEmail: string;
  password: string;
}

const Login: NextPage = () => {
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [login] = useLoginMutation();
  const { t } = useTranslation('common');
  const { data, loading } = useMeQuery();

  useEffect(() => {
    if (!loading && data?.me) {
      router.replace(`/${data.me.role.toLowerCase()}`);
    }
  }, [data, loading]);

  useEffect(() => {
    const div1Height = div1Ref.current?.offsetHeight;
    if (div1Height != null) {
      div2Ref.current!.style.height = `${div1Height}px`;
    }
  }, []);

  if (loading || data?.me) return null;

  const initialValues: MyLoginFormValues = {
    usernameOrEmail: '',
    password: '',
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-myBeige-100 text-white md:flex-row md:items-stretch md:justify-items-stretch">
      <section className="hidden md:flex md:flex-1 md:flex-col md:items-end md:justify-center md:bg-myBeige-100">
        <div
          ref={div2Ref}
          className="rounded-l-[3.125rem] border-[5px] border-myBlue-200 bg-myBeige-100 md:relative md:w-full md:max-w-[600px]"
        >
          <Image
            src={logo}
            alt={'logo image'}
            priority
            className="h-auto max-h-[76px] w-auto max-w-[200px] md:absolute md:left-0 md:top-0"
          />
          <div className="flex h-full items-end justify-center">
            <Image
              src={chef}
              alt={'chef image'}
              priority
              className="h-auto max-h-[400px] w-auto max-w-[330px] md:rounded-[3.125rem]"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center bg-myBlue-100 md:items-start">
        <div
          ref={div1Ref}
          className="relative grid h-fit max-w-[350px] grid-flow-row justify-items-center gap-[1.5em] rounded-[1.5625em] border-[5px] border-myBlue-200 bg-myBlue-200 py-6 md:w-full md:max-w-[600px] md:rounded-l-[0px] md:rounded-r-[3.125rem] lg:border-none"
        >
          <Image
            src={logo}
            alt={'logo image'}
            className="absolute h-auto max-h-[55px] w-auto max-w-[140px] justify-self-start md:hidden"
            priority
          />
          <LanguageSwitcher />

          <h1 className="mt-[2.5em] font-exo text-xl font-bold md:mt-0 md:text-3xl lg:text-4xl">
            {t('login.title')}
          </h1>

          <span className="-mt-[1em] font-source text-base font-normal md:text-xl">
            {t('login.subtitle')}
          </span>

          <Formik
            initialValues={initialValues}
            onSubmit={async (values: MyLoginFormValues, { setErrors }) => {
              const { usernameOrEmail, password } = values;
              try {
                const response = await login({
                  variables: { usernameOrEmail, password },
                  update: (cache, { data }) => {
                    cache.writeQuery<MeQuery>({
                      query: MeDocument,
                      data: {
                        __typename: 'Query',
                        me: data?.login.user,
                      },
                    });
                  },
                });
                if (response.data?.login.errors) {
                  setErrors(toErrorMap(response.data.login.errors));
                } else if (response.data?.login.user) {
                  if (typeof router.query.next === 'string') {
                    router.push(router.query.next);
                  } else {
                    router.push(
                      `/${response.data.login.user.role.toLowerCase()}`,
                    );
                  }
                }
              } catch {
                setErrors({
                  usernameOrEmail: t('change_password.server_error'),
                });
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-flow-row justify-items-center gap-[.8em]">
                <span className="mb-[.25em] text-xl font-bold md:text-3xl lg:text-4xl">
                  {t('login.form_title')}
                </span>
                <InputField
                  type="text"
                  name="usernameOrEmail"
                  className="mx-[1em] w-[17em] rounded-[0.5rem] text-black placeholder:text-base placeholder:italic placeholder:text-myBlue-200"
                  placeholder={t('login.username_placeholder')}
                />
                <InputField
                  type="password"
                  name="password"
                  className="w-[17em] rounded-[0.5rem] text-black placeholder:text-base placeholder:italic placeholder:text-myBlue-200"
                  placeholder={t('login.password_placeholder')}
                />
                <button
                  className="w-[14em] rounded-[.5rem] bg-myRed py-1 text-base font-normal lg:text-xl"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {t('login.submit')}
                </button>
                <Link
                  className="justify-self-center font-source text-sm font-normal underline md:text-xl"
                  href="/forgot-password"
                >
                  {t('login.forgot_password')}
                </Link>
              </Form>
            )}
          </Formik>

          <p className="mt-[2em] text-center font-source text-base md:text-xl">
            {t('login.no_account')}{' '}
            <Link
              className="font-source text-base font-bold underline"
              href="/register"
            >
              {t('login.create_account')}
            </Link>
          </p>
        </div>
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
