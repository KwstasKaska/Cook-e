import { ErrorMessage, Field, Form, Formik } from 'formik';
import { NextPage } from 'next';
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from '../../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../../utils/toErrorMap';
import { useState } from 'react';

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');

  return (
    <div>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
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
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            // worked
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              className="w-[88%] border-none shadow-xl   "
              type="password"
              placeholder="Νέος κωδικός πρόσβασης"
              name="newPassword"
            />
            <ErrorMessage
              name="newPassword"
              component="div"
              className="max-w-[23em] text-center text-sm font-bold text-red-500 md:max-w-[20em] md:text-base lg:max-w-[26em] lg:text-lg"
            />
            {tokenError ? <div>Go forget it again</div> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[3em] cursor-pointer rounded-[0.56rem] bg-myBlue-200 px-[3em] py-[.5em] text-sm font-bold text-white lg:text-2xl"
            >
              Αλλαγή κωδικού πρόσβασης
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
