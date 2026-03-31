import React from 'react';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  const links = [
    { key: 'settings', label: t('footer.settings') },
    { key: 'contact', label: t('footer.contact') },
    { key: 'faq', label: t('footer.faq') },
    { key: 'terms', label: t('footer.terms') },
    { key: 'privacy', label: t('footer.privacy') },
    { key: 'aboutUs', label: t('footer.aboutUs') },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#3F4756',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
      className="px-8 py-10 md:px-16"
    >
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <p className="mb-4 text-sm font-semibold text-white">
            {t('footer.socialMedia')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['', '', '', ''].map((icon, i) => (
              <button
                key={i}
                className="text-2xl transition-transform hover:scale-110"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold text-white">
            {t('footer.usefulInfo')}
          </p>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2">
            {links.map(({ key, label }) => (
              <a
                key={key}
                href="#"
                className="text-sm text-gray-300 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-gray-400"></p>
    </footer>
  );
};

export default Footer;
