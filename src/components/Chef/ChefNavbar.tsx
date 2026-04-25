import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../Helper/LanguageSwitcher';
import { useLogoutMutation } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useChatContext } from '../Chat/ChatContext';

const ChefNavbar = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [menuOpen, setMenuOpen] = useState(false);
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { openWidget } = useChatContext();

  const navLinks = [
    { href: '/chef', label: t('chefnav.chef_home') },
    { href: '/chef/profile', label: t('chefnav.chef_profile') },
    { href: '/chef/recipes', label: t('chefnav.chef_recipes') },
    { href: '/chef/create-recipe', label: t('chefnav.chef_create') },
  ];

  const handleLogout = async () => {
    await logout();
    await apolloClient.clearStore();
    router.push('/login');
  };

  // Reusable chat icon SVG
  const ChatIcon = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'w-6 h-6'}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"
      />
    </svg>
  );

  return (
    <nav
      className="w-full px-6 py-3 flex items-center justify-between relative z-50"
      style={{ backgroundColor: '#B3D5F8' }}
    >
      {/* Logo */}
      <Link href="/chef" className="flex items-center gap-1">
        <span className="text-2xl">🍪</span>
        <span
          className="text-xl font-bold italic"
          style={{ fontFamily: 'Georgia, serif', color: '#3F4756' }}
        >
          ook-<span style={{ color: '#377CC3' }}>e</span>
        </span>
      </Link>

      {/* Desktop nav links — lg+ only */}
      <div className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-semibold tracking-wide transition-colors"
            style={{
              color: router.pathname === link.href ? '#377CC3' : '#3F4756',
              borderBottom:
                router.pathname === link.href
                  ? '2px solid #377CC3'
                  : '2px solid transparent',
              paddingBottom: '2px',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Desktop right actions — lg+ only */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Messages */}
        <button
          onClick={openWidget}
          className="hover:opacity-70 transition-opacity p-1"
          aria-label={t('chefnav.messages', 'Messages')}
        >
          <ChatIcon className="w-6 h-6" />
        </button>

        <Link
          href="/settings"
          aria-label={t('chefnav.settings')}
          className="hover:opacity-70 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#3F4756"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
        <LanguageSwitcher />
        <button
          onClick={handleLogout}
          className="rounded-full px-5 py-2 text-sm font-bold tracking-wide transition-colors"
          style={{ backgroundColor: '#3F4756', color: 'white' }}
        >
          {t('chefnav.logout')}
        </button>
      </div>

      {/* Hamburger — visible on mobile + tablet (below lg) */}
      <button
        className="lg:hidden p-2"
        style={{ color: '#3F4756' }}
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

      {/* Mobile + tablet dropdown */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full flex flex-col items-start px-6 py-4 gap-4 lg:hidden shadow-lg z-50"
          style={{ backgroundColor: '#B3D5F8' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold tracking-wide w-full py-1"
              style={{
                color: router.pathname === link.href ? '#377CC3' : '#3F4756',
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div
            className="flex items-center gap-4 pt-2 border-t w-full"
            style={{ borderColor: '#377CC3' }}
          >
            {/* Messages — mobile */}
            <button
              onClick={() => {
                openWidget();
                setMenuOpen(false);
              }}
              className="hover:opacity-70 transition-opacity"
              aria-label={t('chefnav.messages', 'Messages')}
              style={{ color: '#3F4756' }}
            >
              <ChatIcon className="w-6 h-6" />
            </button>

            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              aria-label={t('chefnav.settings')}
              className="hover:opacity-70 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#3F4756"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="ml-auto rounded-full px-5 py-1.5 text-sm font-bold transition-colors"
              style={{ backgroundColor: '#3F4756', color: 'white' }}
            >
              {t('chefnav.logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ChefNavbar;
