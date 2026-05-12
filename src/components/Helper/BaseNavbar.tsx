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

export type NavLink =
  | { kind: 'href'; href: string; label: string }
  | { kind: 'scroll'; sectionId: string; label: string; scrollPage: string };

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

  const isActive = (link: NavLink) => {
    if (link.kind === 'href') return router.pathname === link.href;
    return (
      router.pathname === link.scrollPage &&
      router.asPath.includes(link.sectionId)
    );
  };

  const handleClick = (link: NavLink) => {
    if (link.kind === 'href') {
      router.push(link.href);
      return;
    }
    if (router.pathname !== link.scrollPage) {
      router.push(`${link.scrollPage}#${link.sectionId}`);
      return;
    }
    document
      .getElementById(link.sectionId)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

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
    <nav className="w-full bg-cookie-200 px-6 py-0 flex items-stretch justify-between relative z-50 h-14">
      <div className="flex items-center gap-4">
        <Logo />
        {me && (
          <div className="hidden xl:flex items-center gap-4">
            <span className="text-cookie-300 select-none leading-none">|</span>
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
              <span className="text-sm font-semibold text-myText-base">
                {me.username}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="hidden xl:flex text-myText-base items-center gap-6">
        {links.map((link) => {
          const active = isActive(link);
          const key = link.kind === 'href' ? link.href : link.sectionId;
          if (link.kind === 'href') {
            return (
              <Link
                key={key}
                href={link.href}
                className="text-sm font-semibold tracking-wide transition-colors duration-150"
                style={linkStyle(active)}
              >
                {link.label}
              </Link>
            );
          }
          return (
            <button
              key={key}
              onClick={() => handleClick(link)}
              className=" tracking-wide transition-colors duration-150"
              style={linkStyle(active)}
            >
              {link.label}
            </button>
          );
        })}
      </div>

      <div className="hidden xl:flex items-center gap-4">
        <LanguageSwitcher dark />
        <NavSettingsLink />
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="rounded-full border border-myText-base px-4 text-sm font-semibold leading-7 transition-colors duration-150 hover:bg-myRed hover:border-myRed hover:text-white disabled:opacity-50"
        >
          {t('nav.logout')}
        </button>
      </div>

      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="xl:hidden p-2 self-center"
      />

      {menuOpen && (
        <div className="absolute bg-cookie-200 top-full left-0 w-full flex flex-col items-start px-6 py-4 gap-4 xl:hidden shadow-lg z-50">
          {me && (
            <div className="flex items-center gap-2 pb-3 w-full">
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
              <span className="text-sm font-semibold text-myText-base">
                {me.username}
              </span>
            </div>
          )}
          {links.map((link) => {
            const active = isActive(link);
            const key = link.kind === 'href' ? link.href : link.sectionId;
            if (link.kind === 'href') {
              return (
                <Link
                  key={key}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold tracking-wide w-full py-1 transition-colors duration-150"
                  style={linkStyle(active)}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <button
                key={key}
                onClick={() => {
                  handleClick(link);
                  setMenuOpen(false);
                }}
                className="text-sm font-semibold tracking-wide w-full text-left py-1 transition-colors duration-150"
                style={linkStyle(active)}
              >
                {link.label}
              </button>
            );
          })}
          <div className="w-full pt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <NavSettingsLink onClick={() => setMenuOpen(false)} />
              <LanguageSwitcher dark />
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="rounded-full border border-myText-base px-4 text-sm font-semibold leading-7 transition-colors hover:bg-myRed hover:border-myRed hover:text-white disabled:opacity-50"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default BaseNavbar;
