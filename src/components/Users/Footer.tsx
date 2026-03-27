import React from 'react';

const Footer: React.FC = ({}) => {
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
            Find Us on Social Media
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['', '', '', ''].map((icon, i) => (
              <button
                key={i}
                className="text-2xl hover:scale-110 transition-transform"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold text-white">
            Χρήσιμες Πληροφορίες
          </p>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2">
            {[
              'Ρυθμίσεις',
              'Επικοινωνία',
              'Συχνές ερωτήσεις',
              'Όροι Χρήσης',
              'Πολιτική Απορρήτου',
              'Ποιοί είμαστε',
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link}
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
