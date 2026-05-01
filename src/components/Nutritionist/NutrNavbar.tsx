import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../Helper/LanguageSwitcher';
import { useChatContext } from '../Chat/ChatContext';
import { ChatIcon } from '../Helper/ChatIcon';
import { NavSettingsLink } from '../Helper/SettingsIcons';
import { HamburgerButton } from '../Helper/HamburgerButton';
import Logo from '../Helper/Logo';

export default function NutrNavbar() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery();
  const { openWidget, closeWidget } = useChatContext();

  const navLinks = [
    { label: t('nav.articles'), sectionId: 'section_1' },
    { label: t('nutrnav.nutr_calendar'), sectionId: 'section_2' },
    { label: t('nutrnav.nutr_appointments'), sectionId: 'section_3' },
    { label: t('nutrnav.nutr_scheduler'), sectionId: 'section_4' },
  ];

  const scrollToSection = (sectionId: string) => {
    if (router.pathname !== '/nutritionist') {
      router.push(`/nutritionist#${sectionId}`);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    await apolloClient.clearStore();
    closeWidget();
    router.push('/');
  };

  if (loading) return null;

  return (
    <nav
      style={{ backgroundColor: '#B3D5F8' }}
      className="w-full px-6 py-3 flex items-center justify-between relative z-50"
    >
      <Logo />

      <div className="hidden xl:flex items-center gap-5">
        {navLinks.map((link) => {
          const isActive =
            router.pathname === '/nutritionist' &&
            router.asPath.includes(link.sectionId);
          return (
            <button
              key={link.sectionId}
              onClick={() => scrollToSection(link.sectionId)}
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
            </button>
          );
        })}
        <Link
          href="/nutritionist/recipes"
          className="text-sm font-semibold tracking-wide transition-colors duration-150"
          style={{
            color:
              router.pathname === '/nutritionist/recipes'
                ? '#377CC3'
                : '#3F4756',
            borderBottom:
              router.pathname === '/nutritionist/recipes'
                ? '2px solid #377CC3'
                : '2px solid transparent',
            paddingBottom: '2px',
          }}
        >
          {t('nav.recipes')}
        </Link>
      </div>

      <div className="hidden xl:flex items-center gap-3">
        <button
          onClick={openWidget}
          className="p-2 rounded text-myGrey-200 hover:text-myBlue-200 transition-colors duration-150"
          aria-label={t('nav.messages')}
        >
          <ChatIcon />
        </button>
        <NavSettingsLink ariaLabel={t('nav.settings')} />
        <LanguageSwitcher dark />
        {data?.me && (
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="rounded-full border border-myGrey-200 text-myGrey-200 text-sm font-semibold px-4 py-1.5 hover:bg-myRed hover:border-myRed hover:text-white transition-colors duration-150 disabled:opacity-50"
          >
            {t('nav.logout')}
          </button>
        )}
      </div>

      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="xl:hidden p-2 text-myGrey-200"
      />

      {menuOpen && (
        <div
          style={{ backgroundColor: '#B3D5F8' }}
          className="absolute top-full left-0 w-full flex flex-col items-start px-6 py-4 gap-4 xl:hidden shadow-lg z-50"
        >
          {navLinks.map((link) => {
            const isActive =
              router.pathname === '/nutritionist' &&
              router.asPath.includes(link.sectionId);
            return (
              <button
                key={link.sectionId}
                onClick={() => {
                  scrollToSection(link.sectionId);
                  setMenuOpen(false);
                }}
                className="text-sm font-semibold tracking-wide w-full text-left py-1 transition-colors duration-150"
                style={{
                  color: isActive ? '#377CC3' : '#3F4756',
                  borderBottom: isActive
                    ? '2px solid #377CC3'
                    : '2px solid transparent',
                  paddingBottom: '2px',
                }}
              >
                {link.label}
              </button>
            );
          })}
          <Link
            href="/nutritionist/recipes"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold tracking-wide w-full text-left py-1 transition-colors duration-150"
            style={{
              color:
                router.pathname === '/nutritionist/recipes'
                  ? '#377CC3'
                  : '#3F4756',
              borderBottom:
                router.pathname === '/nutritionist/recipes'
                  ? '2px solid #377CC3'
                  : '2px solid transparent',
              paddingBottom: '2px',
            }}
          >
            {t('nav.recipes')}
          </Link>

          <div className="flex items-center gap-4 pt-2 border-t border-gray-400 w-full">
            <LanguageSwitcher />
            <button
              onClick={() => {
                openWidget();
                setMenuOpen(false);
              }}
              className="text-myGrey-200 hover:text-myBlue-200"
              aria-label={t('nav.messages')}
            >
              <ChatIcon />
            </button>
            <NavSettingsLink
              ariaLabel={t('nav.settings')}
              onClick={() => setMenuOpen(false)}
            />
            {data?.me && (
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="ml-auto rounded-full border border-myGrey-200 text-myGrey-200 text-sm font-semibold px-4 py-1.5 hover:bg-myRed hover:border-myRed hover:text-white transition-colors disabled:opacity-50"
              >
                {t('nav.logout')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
