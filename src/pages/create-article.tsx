import { NextPage } from 'next';
import useIsAuth from '../utils/useIsAuth';
import useIsNutr from '../utils/useIsNutr';
import { useCreateArticleMutation } from '../generated/graphql';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import InputField from '../components/InputField';
import { toErrorMap } from '../utils/toErrorMap';

interface MyArticleFormValues {
  title: string;
  text: string;
  image: string;
}

const CreateArticle: NextPage = ({}) => {
  const [createArticle] = useCreateArticleMutation({
    onCompleted: (data) => console.log(data),
  });

  const initialValues: MyArticleFormValues = {
    title: '',
    text: '',
    image: '',
  };

  const router = useRouter();

  useIsAuth();
  useIsNutr();

  return (
    <main>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: MyArticleFormValues, { setErrors }) => {
          const fileInput = document.getElementById(
            'image'
          ) as HTMLInputElement;
          const picture = fileInput.files?.[0];

          if (!picture) {
            // Handle the case where no file is selected
            setErrors(
              toErrorMap([
                {
                  field: 'image',
                  message: 'Προσθέστε μια εικόνα για το άρθρο σας.',
                },
              ])
            );
            return;
          }
          const response = await createArticle({
            variables: { data: values, picture },
            update: (cache) => {
              cache.evict({ fieldName: 'articles' });
            },
          });

          if (response.data?.createArticle.errors) {
            setErrors(toErrorMap(response.data.createArticle.errors));
          } else {
            router.push('/nutritionist');
          }
        }}
      >
        {({ isSubmitting }) => (
          <div className="border-2 border-red-500 flex flex-col min-h-screen w-full">
            <div className="container flex flex-1 items-center justify-center">
              <Form className="flex flex-col gap-16  border-2 border-green-400">
                <label htmlFor="image" className="text-center ">
                  Επιλογή Εικόνας Άρθρου
                  <InputField name="image" type="file" id="image" />
                </label>
                <InputField
                  name="title"
                  placeholder="Τίτλος άρθρου"
                  className="placeholder:text-center"
                ></InputField>
                <InputField
                  textarea
                  name="text"
                  placeholder="Περιεχόμενο άρθρου"
                  className="placeholder:text-center"
                ></InputField>

                <button
                  className="rounded-md border-2 border-myRed   font-bold   text-black hover:scale-110 hover:bg-myRed hover:font-bold  hover:text-white hover:shadow-3xl     "
                  type="submit"
                  disabled={isSubmitting}
                >
                  Δημιουργία Άρθρου
                </button>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </main>
  );
};

export default CreateArticle;
