import { Formik, Form, ErrorMessage, Field } from 'formik';
import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../generated/graphql';

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Formik //this is the children of the wrapper
      initialValues={{ email: '' }}
      onSubmit={async (values) => {
        await forgotPassword({ variables: values });
        setComplete(true);
      }}
    >
      {({ isSubmitting }) =>
        complete ? (
          <div>
            Αν υπάρχει λογαριασμός με αυτό το email, θα ειδοποιηθείτε μέσω
            μηνύματος στο email σας.{' '}
          </div>
        ) : (
          <Form>
            <Field
              className=""
              label="Email"
              type="email"
              placeholder="Email"
              name="email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="max-w-[23em] text-center text-sm font-bold text-red-500 md:max-w-[20em] md:text-base lg:max-w-[26em] lg:text-lg"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-[3em] cursor-pointer rounded-[0.56rem] bg-myBlue-200 px-[3em] py-[.5em] text-sm font-bold text-white lg:text-2xl"
            >
              Ξέχασα τον κωδικό μου
            </button>
          </Form>
        )
      }
    </Formik>
  );
};

export default ForgotPassword;
