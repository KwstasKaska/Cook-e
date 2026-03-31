import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../generated/graphql';
import InputField from '../components/InputField';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const { t } = useTranslation('common');

  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={async (values) => {
        await forgotPassword({ variables: values });
        setComplete(true);
      }}
    >
      {({ isSubmitting }) =>
        complete ? (
          <div>{t('forgot_password.success')}</div>
        ) : (
          <Form>
            <InputField
              className=""
              type="email"
              placeholder="Email"
              name="email"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[3em] cursor-pointer rounded-[0.56rem] bg-myBlue-200 px-[3em] py-[.5em] text-sm font-bold text-white lg:text-2xl"
            >
              {t('forgot_password.submit')}
            </button>
          </Form>
        )
      }
    </Formik>
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
