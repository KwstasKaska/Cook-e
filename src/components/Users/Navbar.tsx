import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import logo from '/public/images/6.png';
import shop from '/public/images/aspro 1.png';
import set from '/public/images/settings.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';

const Navbar: React.FC = () => {
  const [isToggle, setIsToggle] = useState<boolean>(true);
  const router = useRouter();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data } = useMeQuery();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 767) setIsToggle(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavbarClick = () => setIsToggle(!isToggle);

  const isActive = (href: string) => router.pathname === href;

  const linkClass = (href: string) =>
    `transition duration-200 hover:text-myBlue-100 ${
      isActive(href)
        ? 'text-myBlue-100 underline underline-offset-4'
        : 'text-white'
    }`;

  const navLinks = [
    { label: 'Αρχική', href: '/user' },
    { label: 'Συνταγές', href: '/user/recipes' },
    { label: 'Διατροφολόγοι', href: '/user/nutritionists' },
  ];

  return (
    <div>
      <header className="relative w-full bg-myGrey-200">
        <div
          className={`${
            isToggle
              ? 'container flex items-center justify-between py-[2em] md:relative'
              : 'absolute z-[1] grid w-full grid-flow-col justify-between bg-myGrey-200 pb-[26em] pt-8 md:relative md:z-0 md:items-center'
          }`}
        >
          {/* Logo */}
          <Link href="/user">
            <Image src={logo} alt="Cook-e logo" priority />
          </Link>

          {/* Hamburger */}
          <button
            onClick={handleNavbarClick}
            className="cursor-pointer md:hidden"
          >
            {isToggle ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="h-8 w-8"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="h-8 w-8 md:hidden"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Nav links */}
          <nav
            className={`${
              isToggle
                ? 'hidden max-w-[1268px] md:block'
                : 'absolute z-[2] mt-28 w-full md:max-w-[1268px]'
            } mx-auto text-xs font-bold lg:text-sm xl:text-lg`}
          >
            <ul
              className={`${
                isToggle
                  ? 'md:grid md:grid-flow-col md:items-center md:gap-[2em] lg:gap-[4em] 2xl:gap-[6.5em]'
                  : 'flex flex-col items-center gap-4 text-lg font-bold md:grid md:w-full md:grid-flow-col md:gap-[2em] lg:gap-[4em] 2xl:gap-[6.5em]'
              }`}
            >
              {/* Text links */}
              {navLinks.map(({ label, href }) => (
                <li key={href} onClick={() => setIsToggle(true)}>
                  <Link href={href} className={linkClass(href)}>
                    {label}
                  </Link>
                </li>
              ))}

              {/* Cart icon */}
              <li onClick={() => setIsToggle(true)}>
                <Link
                  href="/user/cart"
                  className="md:hidden text-white hover:text-myBlue-100"
                >
                  Καλάθι αγορών
                </Link>
                <Link
                  href="/user/cart"
                  className={`hidden md:block ${
                    isActive('/user/cart')
                      ? 'opacity-100'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={shop}
                    alt="Καλάθι Αγορών"
                    className="h-8 w-8 lg:h-[40px] lg:w-[40px]"
                  />
                </Link>
              </li>

              {/* Settings icon */}
              <li onClick={() => setIsToggle(true)}>
                <Link
                  href="/user/settings"
                  className="md:hidden text-white hover:text-myBlue-100"
                >
                  Ρυθμίσεις
                </Link>
                <Link
                  href="/user/settings"
                  className={`hidden md:block ${
                    isActive('/user/settings')
                      ? 'opacity-100'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={set}
                    alt="Ρυθμίσεις"
                    className="h-8 w-8 lg:h-[40px] lg:w-[40px]"
                  />
                </Link>
              </li>

              {/* Logout */}
              <li>
                <button
                  onClick={async () => {
                    await logout();
                    apolloClient.resetStore();
                  }}
                  disabled={logoutLoading}
                  className={`${
                    isToggle ? 'hidden' : ''
                  } rounded-[1.4rem] border-2 border-white bg-transparent px-4 py-1 font-bold text-white transition hover:bg-myRed hover:text-white md:block`}
                >
                  Έξοδος
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
