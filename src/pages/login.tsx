import Image from 'next/image';
import { NextPage } from 'next';
import chef from '/public/images/chef.png';
import logo from '/public/images/5.png';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

interface MyLoginFormValues {
  usernameOrEmail: string;
  password: string;
}

const Login: NextPage = ({}) => {
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [login] = useLoginMutation();

  const initialValues: MyLoginFormValues = {
    usernameOrEmail: '',
    password: '',
  };

  useEffect(() => {
    const div1Height = div1Ref.current?.offsetHeight;
    if (div1Height != null) {
      div2Ref.current!.style.height = `${div1Height}px`;
    }
  }, []);

  return (
    <main className=" flex min-h-screen  w-full  items-center justify-center bg-myBeige-100 text-white md:flex-row md:items-stretch md:justify-items-stretch">
      {/* Εδώ βρίσκεται το section με τις δύο εικόνες, δηλαδή το αριστερό section */}
      <section className=" hidden md:flex md:flex-1 md:flex-col  md:items-end  md:justify-center md:bg-myBeige-100">
        <div
          ref={div2Ref}
          className="rounded-l-[3.125rem]  border-[5px] border-myBlue-200 bg-myBeige-100  md:relative    md:w-full md:max-w-[600px]  "
        >
          <Image
            src={logo}
            alt={'logo image'}
            priority
            className="h-auto max-h-[76px] w-auto max-w-[200px] md:absolute md:left-0 md:top-0"
          ></Image>
          <div className="flex h-full items-end justify-center">
            <Image
              src={chef}
              alt={'chef image'}
              priority
              className="h-auto max-h-[400px] w-auto max-w-[330px] md:rounded-[3.125rem]"
            ></Image>
          </div>
        </div>
      </section>

      {/* Εδώ βρίσκεται το section με την φόρμα εισαγωγής στοιχείων και τα κέιμενα, δηλαδή το δεξιά section. */}

      <section className="md:flex md:flex-1 md:flex-col md:justify-center  md:bg-myBlue-100">
        <div
          ref={div1Ref}
          className="relative grid h-fit  max-w-[350px]  grid-flow-row  justify-items-center gap-[1.5em] rounded-[1.5625em] border-[5px] border-myBlue-200 bg-myBlue-200 py-6 md:w-full md:max-w-[600px]  md:rounded-r-[3.125rem] md:rounded-l-[0px] lg:border-none"
        >
          <Image
            src={logo}
            alt={'logo image'}
            className="absolute h-auto max-h-[55px] w-auto max-w-[140px] justify-self-start md:hidden"
            priority
          ></Image>
          <h1 className="mt-[2.5em] font-exo text-xl font-bold md:mt-0 md:text-3xl lg:text-4xl">
            Καλωσήρθες πίσω!
          </h1>

          <span className="-mt-[1em] font-source text-base font-normal md:text-xl  ">
            Έτοιμος για μαγειρική;
          </span>
          <Formik
            initialValues={initialValues}
            onSubmit={async (values: MyLoginFormValues, { setErrors }) => {
              const { usernameOrEmail, password } = values;
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
                  // worked
                  router.push('/');
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-flow-row justify-items-center gap-[.8em]">
                <span className=" mb-[.25em] text-xl font-bold md:text-3xl lg:text-4xl">
                  Είσοδος
                </span>
                <Field
                  type="text"
                  name="usernameOrEmail"
                  className="mx-[1em] w-[17em]  rounded-[0.5rem] text-black placeholder:text-base placeholder:italic placeholder:text-myBlue-200  "
                  placeholder="Διεύθυνση email ή Όνομα χρήστη"
                />
                <ErrorMessage
                  name="usernameOrEmail"
                  component="div"
                  className="  text-center text-sm font-bold text-myRed  md:text-base lg:max-w-[26em] lg:text-lg"
                />

                <Field
                  type="password"
                  name="password"
                  className="w-[17em] rounded-[0.5rem] text-black  placeholder:text-base placeholder:italic placeholder:text-myBlue-200 "
                  placeholder="Κωδικός Πρόσβασης"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className=" text-center text-sm font-bold text-myRed  md:text-base lg:max-w-[26em] lg:text-lg"
                />

                <button
                  className="  w-[14em] rounded-[.5rem] bg-myRed py-1 text-base font-normal  lg:text-xl"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Είσοδος
                </button>
                <Link
                  className="justify-self-center font-source text-base font-normal underline md:text-xl "
                  href="/forgot-password"
                >
                  Ξέχασες τον κωδικό;
                </Link>
              </Form>
            )}
          </Formik>

          <p className="mt-[2em]  font-source text-base md:text-xl  ">
            Δεν έχεις ακόμα λογαριασμό;
            <Link
              className=" block text-center font-source text-base font-bold underline md:text-xl "
              href="/register"
            >
              Δημιούργησε έναν
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
