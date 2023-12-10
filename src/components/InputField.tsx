import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  textarea,
  size: _,
  ...props
}) => {
  const InputOrTextArea = textarea ? 'textarea' : 'input';
  const [field, meta] = useField(props);

  return (
    <>
      {InputOrTextArea === 'input' ? (
        <input className="text-input" {...field} {...props} id={field.name} />
      ) : (
        <textarea
          className="text-input resize-y"
          {...(field as any)}
          {...(props as any)}
          id={field.name}
        />
      )}
      {meta.touched && meta.error ? (
        <div className="text-center text-sm font-bold text-myRed  md:text-base lg:max-w-[26em] lg:text-lg">
          {meta.error}
        </div>
      ) : null}
    </>
  );
};

export default InputField;
