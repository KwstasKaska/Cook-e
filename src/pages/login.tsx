import Image from 'next/image';
import { NextPage } from 'next';
import chef from '../../public/images/chef.png';
import logo from '../../public/images/5.png';
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
    /*
      <main> as the top-level landmark.
      The two <section> elements give screen readers named regions to
      navigate between.
    */
    <main className="flex min-h-screen w-full items-center justify-center bg-myBeige-100 text-white md:flex-row md:items-stretch md:justify-items-stretch">
      {/* Skip-to-content link */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded focus:bg-myBlue-200 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-bold"
      >
        {t('skip_to_content', 'Skip to content')}
      </a>

      {/* ── Decorative branding panel (desktop only) ─────────────────────
          aria-hidden because this panel is purely visual — the logo and
          chef image carry no information that isn't conveyed elsewhere.
      ──────────────────────────────────────────────────────────────────── */}
      <section
        aria-hidden="true"
        className="hidden md:flex md:flex-1 md:flex-col md:items-end md:justify-center md:bg-myBeige-100"
      >
        <div
          ref={div2Ref}
          className="rounded-l-[3.125rem] border-[5px] border-myBlue-200 bg-myBeige-100 md:relative md:w-full md:max-w-[600px]"
        >
          <Image
            src={logo}
            alt=""
            priority
            className="h-auto max-h-[76px] w-auto max-w-[200px] md:absolute md:left-0 md:top-0"
          />
          <div className="flex h-full items-end justify-center">
            <Image
              src={chef}
              alt=""
              priority
              className="h-auto max-h-[400px] w-auto max-w-[330px] md:rounded-[3.125rem]"
            />
          </div>
        </div>
      </section>

      {/* ── Login form section ───────────────────────────────────────────── */}
      <section
        aria-labelledby="login-heading"
        className="flex flex-1 flex-col items-center justify-center bg-myBlue-100 md:items-start"
      >
        <div
          ref={div1Ref}
          className="relative grid h-fit max-w-[350px] grid-flow-row justify-items-center gap-[1.5em] rounded-[1.5625em] border-[5px] border-myBlue-200 bg-myBlue-200 py-6 md:w-full md:max-w-[600px] md:rounded-l-[0px] md:rounded-r-[3.125rem] lg:border-none"
        >
          {/*
            Logo shown only on mobile — decorative duplicate, so alt="".
            The meaningful logo is in the desktop panel (also aria-hidden).
          */}
          <Image
            src={logo}
            alt=""
            className="absolute h-auto max-h-[55px] w-auto max-w-[140px] justify-self-start md:hidden"
            priority
          />

          <LanguageSwitcher />

          {/* ── Heading ────────────────────────────────────────────────── */}
          <h1
            id="login-heading"
            className="mt-[2.5em] font-exo text-xl font-bold md:mt-0 md:text-3xl lg:text-4xl"
          >
            {t('login.title')}
          </h1>

          <p className="-mt-[1em] font-source text-base font-normal md:text-xl">
            {t('login.subtitle')}
          </p>

          {/* ── Form ───────────────────────────────────────────────────── */}
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
                  setErrors(toErrorMap(response.data?.login.errors));
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
              <Form
                id="login-form"
                noValidate
                className="grid grid-flow-row justify-items-center gap-[.8em]"
                aria-label={t('login.title')}
              >
                {/*
                  Sub-heading inside the form — using <h2> keeps the
                  document outline logical (h1 = page, h2 = form section).
                */}
                <h2 className="mb-[.25em] text-xl font-bold md:text-3xl lg:text-4xl">
                  {t('login.form_title')}
                </h2>

                {/*
                  InputField is a custom component. Assuming it already
                  renders an <input> — it needs an accessible label.
                  If InputField accepts a `label` prop, pass one; otherwise
                  use aria-label here. Passing both placeholder and
                  aria-label for maximum compatibility.
                */}
                <InputField
                  type="text"
                  name="usernameOrEmail"
                  aria-label={t('login.username_placeholder')}
                  autoComplete="username"
                  className="mx-[1em] w-[17em] rounded-[0.5rem] text-black placeholder:text-base placeholder:italic placeholder:text-myBlue-200"
                  placeholder={t('login.username_placeholder')}
                />
                <InputField
                  type="password"
                  name="password"
                  aria-label={t('login.password_placeholder')}
                  autoComplete="current-password"
                  className="w-[17em] rounded-[0.5rem] text-black placeholder:text-base placeholder:italic placeholder:text-myBlue-200"
                  placeholder={t('login.password_placeholder')}
                />

                <button
                  className="w-[14em] rounded-[.5rem] bg-myRed py-1 text-base font-normal lg:text-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting
                    ? t('common.saving', 'Submitting…')
                    : t('login.submit')}
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
