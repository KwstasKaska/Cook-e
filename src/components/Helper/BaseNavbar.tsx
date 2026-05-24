import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useApolloClient } from '@apollo/client';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { useChatContext } from '../Chat/ChatContext';
import { NavSettingsLink } from '../Helper/SettingsIcons';
import { HamburgerButton } from '../Helper/HamburgerButton';
import LanguageSwitcher from '../Helper/LanguageSwitcher';
import Logo from '../Helper/Logo';

export type NavLink = { href: string; label: string };

interface BaseNavbarProps {
  links: NavLink[];
}

const BaseNavbar = ({ links }: BaseNavbarProps) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [menuOpen, setMenuOpen] = useState(false);

  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { closeWidget } = useChatContext();
  const { data: meData, loading } = useMeQuery();

  const me = meData?.me;

  const isActive = (link: NavLink) => router.pathname === link.href;

  const handleLogout = async () => {
    await logout();
    await apolloClient.clearStore();
    closeWidget();
    router.push('/');
  };

  const linkStyle = (active: boolean) => ({
    color: active ? '#C9955A' : '#3D3529',
    borderBottom: active ? '2px solid #C9955A' : '2px solid transparent',
    paddingBottom: '2px',
  });

  if (loading) return null;

  return (
    <nav className="relative z-50 flex h-14 w-full items-stretch justify-between bg-cookie-200 px-6 py-0">
      <div className="flex items-center gap-4">
        <Logo />
        {me && (
          <div className="hidden items-center gap-3 xl:flex">
            <span className="select-none leading-none text-cookie-300">|</span>
            <div className="flex items-center gap-2">
              {me.image ? (
                <img
                  src={me.image}
                  alt={me.username}
                  className="h-7 w-7 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-300 text-xs font-bold text-white shadow-sm">
                  {me.username?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <span className="text-sm font-semibold ">{me.username}</span>
              <NavSettingsLink />
            </div>
          </div>
        )}
      </div>

      <div className="hidden items-center gap-6  xl:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-semibold tracking-wide transition-colors duration-150"
            style={linkStyle(isActive(link))}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="hidden items-center gap-4 xl:flex">
        <LanguageSwitcher dark />
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="rounded-full border border-myText-base px-4 text-sm font-semibold leading-7 transition-colors duration-150 hover:border-myRed hover:bg-myRed hover:text-white disabled:opacity-50"
        >
          {t('nav.logout')}
        </button>
      </div>

      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="p-2 self-center xl:hidden"
      />

      {menuOpen && (
        <div className="absolute left-0 top-full z-50 flex w-full flex-col bg-cookie-200 px-6 py-4 shadow-lg xl:hidden">
          <div className="flex items-center justify-between pb-4">
            <LanguageSwitcher dark />
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="rounded-full border border-myText-base px-4 text-sm font-semibold leading-7 transition-colors hover:border-myRed hover:bg-myRed hover:text-white disabled:opacity-50"
            >
              {t('nav.logout')}
            </button>
          </div>

          {me && (
            <div className="flex items-center gap-2 pb-4 border-b border-cookie-300">
              {me.image ? (
                <img
                  src={me.image}
                  alt={me.username}
                  className="h-7 w-7 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-300 text-xs font-bold text-white shadow-sm">
                  {me.username?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <span className="text-sm font-semibold ">{me.username}</span>
              <NavSettingsLink onClick={() => setMenuOpen(false)} />
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="w-full py-1 text-sm font-semibold tracking-wide transition-colors duration-150"
                style={linkStyle(isActive(link))}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default BaseNavbar;
