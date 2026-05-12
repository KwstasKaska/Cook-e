import { useTranslation } from 'next-i18next';

export const FieldGroup = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <h3 className="tracking-widest mb-4">{title}</h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

export const Field = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  error?: string | null;
}) => (
  <div>
    <label className="block mb-1">{label}</label>
    <input
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full rounded-xl border-2 border-cookie-400 px-4 py-0.5  focus:outline-none transition"
      style={{ borderColor: error ? '#ED5B5B' : '#A0652A' }}
    />
    {error && <p className="mt-1  text-myRed">{error}</p>}
  </div>
);

export const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string | null;
}) => (
  <div>
    <label className="block    mb-1">{label}</label>
    <textarea
      value={value}
      placeholder={placeholder}
      rows={4}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border-2 px-4 py-2.5  focus:outline-none transition resize-none"
      style={{ borderColor: error ? '#ED5B5B' : '#3D3529' }}
    />
    {error && <p className="mt-1  text-myRed">{error}</p>}
  </div>
);

export const SaveButton = ({
  onClick,
  loading,
}: {
  onClick?: () => void;
  loading?: boolean;
}) => {
  const { t } = useTranslation('common');
  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={onClick}
        disabled={loading}
        className="mt-1 rounded-xl border-2 border-cookie-400 px-4 py-1.5   transition-colors hover:bg-cookie-400 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? '...' : t('settings.save')}
      </button>
    </div>
  );
};

export const SuccessBanner = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return <p className="mt-3  text-center text-herb-200">{message}</p>;
};
