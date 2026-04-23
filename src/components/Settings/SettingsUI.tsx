import { useTranslation } from 'next-i18next';

export function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3
        className="text-sm font-bold uppercase tracking-widest mb-4"
        style={{ color: '#377CC3' }}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export function Field({
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
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border-2 px-4 py-2.5 text-sm focus:outline-none transition"
        style={{ borderColor: error ? '#ED5B5B' : '#EAEAEA' }}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#ED5B5B' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({
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
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 px-4 py-2.5 text-sm focus:outline-none transition resize-none"
        style={{ borderColor: error ? '#ED5B5B' : '#EAEAEA' }}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#ED5B5B' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function SaveButton({
  onClick,
  loading,
}: {
  onClick?: () => void;
  loading?: boolean;
}) {
  const { t } = useTranslation('common');
  return (
    <div className="mt-8 flex justify-end">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-8 py-2.5 rounded-full text-sm font-bold text-white transition hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#377CC3' }}
      >
        {loading ? '...' : t('settings.save')}
      </button>
    </div>
  );
}

export function ServerError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-3 text-sm text-center" style={{ color: '#ED5B5B' }}>
      {message}
    </p>
  );
}

export function SuccessBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="mt-3 text-sm text-center" style={{ color: '#377CC3' }}>
      {message}
    </p>
  );
}
