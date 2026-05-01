import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../Helper/LanguageSwitcher';
import { useLogoutMutation } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useChatContext } from '../Chat/ChatContext';
import { ChatIcon } from '../Helper/ChatIcon';
import { NavSettingsLink } from '../Helper/SettingsIcons';
import { HamburgerButton } from '../Helper/HamburgerButton';
import { NavCartLink } from '../Helper/CartIcon';
import Logo from '../Helper/Logo';

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const { openWidget, closeWidget } = useChatContext();

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
    closeWidget();
    router.push('/');
  };

  return (
    <nav
      style={{ backgroundColor: '#B3D5F8' }}
      className="w-full px-6 py-3 flex items-center justify-between relative z-50"
    >
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
        <NavCartLink
          ariaLabel={t('nav.cart')}
          className={`p-2 rounded transition-colors duration-150 ${
            router.pathname === '/user/cart'
              ? 'text-yellow-400'
              : 'text-myGrey-200 hover:text-myBlue-200'
          }`}
        />
        <button
          onClick={openWidget}
          className="p-2 rounded  hover:text-myBlue-200 transition-colors duration-150"
          aria-label={t('nav.messages', 'Messages')}
        >
          <ChatIcon />
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

      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="lg:hidden p-2 "
      />

      {menuOpen && (
        <div
          style={{ backgroundColor: '#3F4756' }}
          className="absolute top-full left-0 w-full flex flex-col items-start px-6 py-4 gap-4 lg:hidden shadow-lg z-50"
        >
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wide w-full py-1 transition-colors duration-150"
                style={{
                  color: isActive ? '#FBBF24' : 'white',
                  borderBottom: isActive
                    ? '2px solid #FBBF24'
                    : '2px solid transparent',
                  paddingBottom: '2px',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="flex items-center gap-4 pt-2 border-t border-gray-600 w-full">
            <LanguageSwitcher />
            <NavCartLink
              ariaLabel={t('nav.cart')}
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-yellow-300"
            />
            <button
              onClick={() => {
                openWidget();
                setMenuOpen(false);
              }}
              className="text-white hover:text-yellow-300"
              aria-label={t('nav.messages', 'Messages')}
            >
              <ChatIcon />
            </button>
            <NavSettingsLink
              ariaLabel={t('nav.settings')}
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-yellow-300 transition-colors duration-150"
            />
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
}
