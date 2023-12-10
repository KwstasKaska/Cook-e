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
  const [createArticle] = useCreateArticleMutation();

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
          const response = await createArticle({
            variables: { data: values },
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
          <Form>
            <InputField name="title" placeholder="Τίτλος άρθρου"></InputField>
            <InputField
              textarea
              name="text"
              placeholder="Περιεχόμενο άρθρου"
            ></InputField>
            <InputField name="image" placeholder="Εικόνα άρθρου"></InputField>
            <button type="submit" disabled={isSubmitting}>
              Δημιουργία Άρθρου
            </button>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default CreateArticle;
