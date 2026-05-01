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
import Logo from '../Helper/Logo';

const ChefNavbar = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [menuOpen, setMenuOpen] = useState(false);
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { openWidget, closeWidget } = useChatContext();

  const navLinks = [
    { href: '/chef', label: t('nav.home') },
    { href: '/chef/profile', label: t('chefnav.chef_profile') },
    { href: '/chef/recipes', label: t('chefnav.chef_recipes') },
    { href: '/chef/create-recipe', label: t('chefnav.chef_create') },
  ];

  const handleLogout = async () => {
    await logout();
    await apolloClient.clearStore();
    closeWidget();
    router.push('/');
  };

  return (
    <nav className="w-full px-6 py-3 bg-myBlue-100 flex items-center justify-between relative z-50">
      <Logo />

      <div className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = router.pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold tracking-wide transition-colors duration-150"
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

      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={openWidget}
          className="p-2 rounded  hover:text-myBlue-200 transition-colors duration-150"
          aria-label={t('nav.messages')}
        >
          <ChatIcon className="w-6 h-6" />
        </button>
        <NavSettingsLink ariaLabel={t('nav.settings')} />
        <LanguageSwitcher dark />
        <button
          onClick={handleLogout}
          className="rounded-full border border-myGrey-200  text-sm font-semibold px-4 py-1.5 hover:bg-myRed hover:border-myRed hover:text-white transition-colors duration-150"
        >
          {t('nav.logout')}
        </button>
      </div>

      {/* Hamburger */}
      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="lg:hidden p-2 "
      />

      {menuOpen && (
        <div className="absolute bg-myBlue-100 top-full left-0 w-full flex flex-col items-start px-6 py-4 gap-4 lg:hidden shadow-lg z-50">
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wide w-full py-1 transition-colors duration-150"
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

          <div className="flex items-center border-myBlue-200 gap-4 pt-2 border-t w-full">
            <button
              onClick={() => {
                openWidget();
                setMenuOpen(false);
              }}
              className=" hover:text-myBlue-200 transition-opacity"
              aria-label={t('nav.messages')}
            >
              <ChatIcon className="w-6 h-6" />
            </button>
            <NavSettingsLink
              ariaLabel={t('nav.settings')}
              onClick={() => setMenuOpen(false)}
            />
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="ml-auto rounded-full border border-myGrey-200  text-sm font-semibold px-4 py-1.5 hover:bg-myRed hover:border-myRed hover:text-white transition-colors"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ChefNavbar;
