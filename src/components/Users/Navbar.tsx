import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../Helper/LanguageSwitcher';
import { useLogoutMutation } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation('common');

  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();

  const navLinks = [
    { label: t('nav.home'), href: '/user' },
    { label: t('nav.recipes'), href: '/user/recipes' },
    { label: t('nav.nutritionists'), href: '/user/nutritionists' },
  ];

  const handleLogout = async () => {
    await logout();
    await apolloClient.clearStore();
    router.push('/login');
  };
  return (
    <nav
      style={{ backgroundColor: '#3F4756' }}
      className="w-full px-6 py-3 flex items-center justify-between relative z-50"
    >
      {/* Logo */}
      <Link href="/user" className="flex flex-col leading-tight select-none">
        <span className="text-white font-bold text-2xl tracking-wide">
          <span className="text-yellow-400">🍪</span>ook-e
        </span>
        <span className="text-gray-400 text-[10px] tracking-widest uppercase">
          {t('nav.tagline')}
        </span>
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = router.pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold tracking-wide transition-colors duration-150 ${
                isActive
                  ? 'text-yellow-400'
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="hidden md:flex items-center gap-4">
        {/* Cart */}
        <Link
          href="/user/cart"
          className={`p-2 rounded transition-colors duration-150 ${
            router.pathname === '/user/cart'
              ? 'text-yellow-400'
              : 'text-white hover:text-yellow-300'
          }`}
          aria-label={t('nav.cart')}
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21h6"
            />
          </svg>
        </Link>

        {/* Language switcher */}

        {/* Settings */}
        <Link
          href="/settings"
          className={`p-2 rounded transition-colors duration-150 ${
            router.pathname === '/user/settings'
              ? 'text-yellow-400'
              : 'text-white hover:text-yellow-300'
          }`}
          aria-label={t('nav.settings')}
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
        <button
          onClick={handleLogout}
          className="ml-2 border border-white text-white text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-white hover:text-myGrey-200 transition-colors duration-150"
        >
          {t('nav.logout')}
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-white p-2"
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
          style={{ backgroundColor: '#3F4756' }}
          className="absolute top-full left-0 w-full flex flex-col items-start px-6 py-4 gap-4 md:hidden shadow-lg z-50"
        >
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold tracking-wide w-full py-1 ${
                  isActive ? 'text-yellow-400' : 'text-white'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="flex items-center gap-4 pt-2 border-t border-gray-600 w-full">
            <LanguageSwitcher />
            <Link
              href="/user/cart"
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-yellow-300"
              aria-label={t('nav.cart')}
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21h6"
                />
              </svg>
            </Link>
            <Link
              href="/user/settings"
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-yellow-300"
              aria-label={t('nav.settings')}
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
            <button
              onClick={handleLogout}
              className="ml-auto border border-white text-white text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-white hover:text-gray-800 transition-colors"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
