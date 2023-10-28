import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import logo from '/public/images/6.png';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { toErrorMap } from '../utils/toErrorMap';
import { Formik, Form, Field, ErrorMessage } from 'formik';

interface MyFormValues {
  username: string;
  password: string;
  email: string;
  role: string;
}

const Register: NextPage = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  const initialValues: MyFormValues = {
    username: '',
    email: '',
    password: '',
    role: '',
  };

  return (
    <main className=" h-screen w-full bg-myGrey-100">
      <div className="customImg container  h-full bg-auto bg-fixed  bg-center  bg-no-repeat pt-[3em] md:mt-0 md:flex  md:flex-row    md:content-center md:justify-center md:gap-[2em] md:bg-none xl:gap-[4rem]">
        <section className="md:chefImg flex flex-row justify-center  gap-[5em]   md:order-2 md:grid md:grid-cols-2  md:grid-rows-none md:content-center    md:bg-contain md:bg-center md:bg-no-repeat md:px-[1em]">
          <Image
            src={logo}
            alt={'Cook-e'}
            width="116"
            height="39.77"
            className="md:h-fit md:pb-[29em] "
          ></Image>
          <button
            type="submit"
            className=" cursor-pointer rounded-registerLogin bg-myBlue-200 px-[2.3em]  font-exo text-sm font-bold text-white  md:h-fit md:py-[.75em] "
          >
            <Link href="/login">Login</Link>
          </button>
        </section>

        <section className="mt-[9em]  grid grid-flow-row place-content-center place-items-center gap-3 md:mt-0">
          <h1 className=" font-exo text-2xl font-bold text-myBlue-200 lg:text-4xl">
            Δημιουργία λογαριασμού
          </h1>
          <p className="mb-3 w-[20em] text-center text-sm font-normal lg:text-xl">
            Μια μαγειρική απόλαυση σε περιμένει! Ολοκλήρωσε την εγγραφή σου
          </p>

          <Formik
            initialValues={initialValues}
            onSubmit={async (values: MyFormValues, { setErrors }) => {
              const response = await register({
                variables: {
                  options: values,
                },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: 'Query',
                      me: data?.register.user,
                    },
                  });
                },
              });
              if (response.data?.register.errors) {
                setErrors(toErrorMap(response.data.register.errors));
              } else if (response.data?.register.user) {
                router.push('/');
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className=" grid grid-cols-1 justify-items-center   gap-5 text-xs font-normal text-black lg:text-xl">
                <Field
                  className="w-[88%] border-none shadow-xl   "
                  type="text"
                  placeholder="Όνομα Χρήστη"
                  name="username"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-center text-sm text-red-500"
                />

                <Field
                  type="email"
                  placeholder="Email"
                  className="w-[88%] border-none shadow-xl  "
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-center text-sm text-red-500"
                />

                <Field
                  type="password"
                  placeholder="Kωδικός Πρόσβασης"
                  className="w-[88%] border-none shadow-xl "
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-center text-sm text-red-500"
                />

                <div id="my-radio-group" className="text-base font-normal">
                  Ιδιότητα:
                </div>
                <div role="group" aria-labelledby="my-radio-group">
                  <label>
                    <Field type="radio" name="role" value="user" />
                    Χρήστης
                  </label>
                  <label>
                    <Field type="radio" name="role" value="chef" />
                    Chef
                  </label>
                  <label>
                    <Field type="radio" name="role" value="nutritionist" />
                    Διατροφολόγος
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-[3em] cursor-pointer rounded-[0.56rem] bg-myBlue-200 px-[3em] py-[.5em] text-sm font-bold text-white lg:text-2xl"
                >
                  Δημιουργία λογαριασμού
                </button>
              </Form>
            )}
          </Formik>
        </section>
      </div>
    </main>
  );
};

export default Register;
