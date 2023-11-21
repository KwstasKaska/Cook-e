import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
};

const InputField: React.FC<InputFieldProps> = ({ size: _, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <input className="text-input" {...field} {...props} id={field.name} />
      {meta.touched && meta.error ? (
        <div className="text-center text-sm font-bold text-myRed  md:text-base lg:max-w-[26em] lg:text-lg">
          {meta.error}
        </div>
      ) : null}
    </>
  );
};

export default InputField;
