import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../Helper/LanguageSwitcher';
import { useLogoutMutation } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useChatContext } from '../Chat/ChatContext';
import { ChatIcon } from '../Helper/ChatIcon';
import { NavSettingsLink } from '../Helper/SettingsIcons';
import { HamburgerButton } from '../Helper/HamburgerButton';

const ChefNavbar = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [menuOpen, setMenuOpen] = useState(false);
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { openWidget, closeWidget } = useChatContext();

  const navLinks = [
    { href: '/', label: t('chefnav.chef_home') },
    { href: '/chef/profile', label: t('chefnav.chef_profile') },
    { href: '/chef/recipes', label: t('chefnav.chef_recipes') },
    { href: '/chef/create-recipe', label: t('chefnav.chef_create') },
  ];

  const handleLogout = async () => {
    await logout();
    await apolloClient.clearStore();
    closeWidget();
    router.push('/login');
  };

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
        {navLinks.map((link) => {
          const isActive = router.pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold tracking-wide transition-colors"
              style={{
                color: isActive ? '#377CC3' : '#3F4756',
                borderBottom: isActive
                  ? '2px solid #377CC3'
                  : '2px solid transparent',
                paddingBottom: '2px',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Desktop right actions — lg+ only */}
      <div className="hidden lg:flex items-center gap-4">
        <button
          onClick={openWidget}
          className="hover:opacity-70 transition-opacity p-1"
          aria-label={t('chefnav.messages', 'Messages')}
        >
          <ChatIcon className="w-6 h-6" />
        </button>
        <NavSettingsLink ariaLabel={t('chefnav.settings')} />
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
      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="lg:hidden p-2 text-myGrey-200"
      />

      {/* Mobile + tablet dropdown */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full flex flex-col items-start px-6 py-4 gap-4 lg:hidden shadow-lg z-50"
          style={{ backgroundColor: '#B3D5F8' }}
        >
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wide w-full py-1"
                style={{
                  color: isActive ? '#377CC3' : '#3F4756',
                  borderBottom: isActive
                    ? '2px solid #377CC3'
                    : '2px solid transparent',
                  paddingBottom: '2px',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          <div
            className="flex items-center gap-4 pt-2 border-t w-full"
            style={{ borderColor: '#377CC3' }}
          >
            <button
              onClick={() => {
                openWidget();
                setMenuOpen(false);
              }}
              className="hover:opacity-70 transition-opacity"
              aria-label={t('chefnav.messages', 'Messages')}
            >
              <ChatIcon className="w-6 h-6" />
            </button>
            <NavSettingsLink
              ariaLabel={t('chefnav.settings')}
              onClick={() => setMenuOpen(false)}
            />
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
