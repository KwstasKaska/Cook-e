import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../Helper/LanguageSwitcher';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useChatContext } from '../Chat/ChatContext';
import { NavSettingsLink } from '../Helper/SettingsIcons';
import { HamburgerButton } from '../Helper/HamburgerButton';
import { NavCartLink } from '../Helper/CartIcon';
import { ChatIcon } from '../Helper/ChatIcon';
import Logo from '../Helper/Logo';

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const { openWidget, closeWidget } = useChatContext();

  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data: meData } = useMeQuery();

  const me = meData?.me;

  const navLinks = [
    { label: t('nav.home'), href: '/user' },
    { label: t('nav.recipes'), href: '/user/recipes' },
    { label: t('nav.nutritionists'), href: '/user/nutritionists' },
    { label: t('nav.chat'), href: '/user/chat' },
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

      <div className="hidden xl:flex items-center gap-8">
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

      <div className="hidden xl:flex items-center gap-3">
        <NavCartLink
          className={`p-2 rounded transition-colors duration-150 ${
            router.pathname === '/user/cart'
              ? 'text-yellow-400'
              : 'text-myGrey-200 hover:text-myBlue-200'
          }`}
        />
        <button
          onClick={openWidget}
          className="p-2 rounded hover:text-myBlue-200 transition-colors duration-150"
        >
          <ChatIcon />
        </button>
        <NavSettingsLink />
        {me && (
          <div className="flex items-center gap-2">
            {me.image ? (
              <img
                src={me.image}
                alt={me.username}
                className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 bg-myBlue-200 border-white text-xs font-bold shadow-sm"
                style={{ color: '#fff' }}
              >
                {me.username?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <span className="text-sm font-semibold">{me.username}</span>
          </div>
        )}
        <LanguageSwitcher dark />
        <button
          onClick={handleLogout}
          className="rounded-full border border-myGrey-200 text-sm font-semibold px-4 py-1.5 hover:bg-myRed hover:border-myRed hover:text-white transition-colors duration-150"
        >
          {t('nav.logout')}
        </button>
      </div>

      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="xl:hidden p-2"
      />

      {menuOpen && (
        <div className="absolute top-full bg-myBlue-100 left-0 w-full flex flex-col items-start px-6 py-4 gap-4 xl:hidden shadow-lg z-50">
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wide w-full py-1 transition-colors duration-150"
                style={{
                  color: isActive ? '#377CC3' : '#3f4756',
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

          <div className="w-full border-t border-gray-600 pt-3 flex flex-col gap-3">
            {me && (
              <div className="flex items-center gap-2">
                {me.image ? (
                  <img
                    src={me.image}
                    alt={me.username}
                    className="h-8 w-8 rounded-full object-cover border-2 border-myGrey-200 shadow-sm"
                  />
                ) : (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 bg-myBlue-200 border-myGrey-200 text-xs font-bold shadow-sm"
                    style={{ color: '#fff' }}
                  >
                    {me.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <span className="text-sm font-semibold">{me.username}</span>
              </div>
            )}

            {/* Row 1: icons */}
            <div className="flex items-center gap-4">
              <NavCartLink
                onClick={() => setMenuOpen(false)}
                className="hover:text-myBlue-200 transition-colors duration-150"
              />
              <button
                onClick={() => {
                  openWidget();
                  setMenuOpen(false);
                }}
                className="hover:text-myBlue-200 transition-colors duration-150"
              >
                <ChatIcon />
              </button>
              <NavSettingsLink
                onClick={() => setMenuOpen(false)}
                className="hover:text-myBlue-200 transition-colors duration-150"
              />
            </div>

            {/* Row 2: language + logout */}
            <div className="flex items-center justify-between">
              <LanguageSwitcher dark />
              <button
                onClick={handleLogout}
                className="rounded-full border border-myGrey-200 text-sm font-semibold px-4 py-1.5 hover:bg-myRed hover:border-myRed hover:text-white transition-colors"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
