import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../Helper/LanguageSwitcher';

export default function NutrNavbar() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery();

  const navLinks = [
    { label: t('nutrnav.nutr_articles'), sectionId: 'section_1' },
    { label: t('nutrnav.nutr_calendar'), sectionId: 'section_2' },
    { label: t('nutrnav.nutr_appointments'), sectionId: 'section_3' },
    { label: t('nutrnav.nutr_scheduler'), sectionId: 'section_4' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    await apolloClient.clearStore();
    router.push('/login');
  };

  if (loading) return null;

  return (
    <nav
      style={{ backgroundColor: '#B3D5F8' }}
      className="w-full px-6 py-3 flex items-center justify-between relative z-50"
    >
      {/* Logo */}
      <Link
        href="/nutritionist"
        className="flex flex-col leading-tight select-none"
      >
        <span className="text-myGrey-200 font-bold text-2xl tracking-wide">
          <span className="text-yellow-400">🍪</span>ook-e
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <button
            key={link.sectionId}
            onClick={() => scrollToSection(link.sectionId)}
            className="text-sm font-semibold tracking-wide text-myGrey-200 hover:text-myBlue-200 transition-colors duration-150"
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div className="hidden md:flex items-center gap-4">
        {/* Settings */}
        <Link
          href="/settings"
          className="p-2 rounded text-myGrey-200 hover:text-myBlue-200 transition-colors duration-150"
          aria-label={t('nutrnav.nutr_settings')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
        <LanguageSwitcher />

        {/* Logout */}
        {data?.me && (
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="ml-2 border border-myGrey-200 text-myGrey-200 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-myRed hover:border-myRed hover:text-white transition-colors duration-150"
          >
            {t('nutrnav.nutr_logout')}
          </button>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-myGrey-200 p-2"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{ backgroundColor: '#B3D5F8' }}
          className="absolute top-full left-0 w-full flex flex-col items-start px-6 py-4 gap-4 md:hidden shadow-lg z-50"
        >
          {navLinks.map((link) => (
            <button
              key={link.sectionId}
              onClick={() => {
                scrollToSection(link.sectionId);
                setMenuOpen(false);
              }}
              className="text-sm font-semibold tracking-wide w-full text-left py-1 text-myGrey-200"
            >
              {link.label}
            </button>
          ))}

          <div className="flex items-center gap-4 pt-2 border-t border-gray-400 w-full">
            <LanguageSwitcher />
            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="text-myGrey-200 hover:text-myBlue-200"
              aria-label={t('nutrnav.nutr_settings')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
            {data?.me && (
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="ml-auto border border-myGrey-200 text-myGrey-200 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-myRed hover:border-myRed hover:text-white transition-colors"
              >
                {t('nutrnav.nutr_logout')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
