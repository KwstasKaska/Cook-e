import { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface ShareButtonProps {
  url: string;
  dark?: boolean;
}

export default function ShareButton({ url, dark = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation('common');

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const color = dark
    ? 'text-gray-300 hover:text-white'
    : 'text-myBlue-200 hover:text-myBlue-200/70';

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 text-sm transition-colors ${color}`}
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
      {t('recipes.copy')}
    </button>
  );
}
