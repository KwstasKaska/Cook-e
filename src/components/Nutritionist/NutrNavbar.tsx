import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '/public/images/logo.png';
import Link from 'next/link';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { useApolloClient } from '@apollo/client';
import useIsAuth from '../../utils/useIsAuth';

const NutrNavbar: React.FC = () => {
  const [isToggle, setIsToggle] = useState<boolean>(true);

  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();

  const { data, loading } = useMeQuery();
  let body = null;
  if (loading) {
    body = <div>Παρακαλώ περιμένετε εώς ότου φορτώσει η σελίδα</div>;
  } else if (data?.me) {
    body = (
      <button
        onClick={() => {
          logout();
          apolloClient.resetStore();
        }}
        disabled={logoutLoading}
        className={` ${
          isToggle ? 'hidden ' : ''
        } rounded-[1.4rem] border-2  border-myGrey-200 bg-transparent px-4 py-1  text-sm font-bold text-myGrey-200 hover:bg-myRed hover:text-white md:block`}
      >
        Αποσύνδεση
      </button>
    );
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 767) {
        setIsToggle(true);
      } else {
        return;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  const handleNavbarClick = () => {
    setIsToggle(!isToggle);
  };

  const handleLinkClick = (sectionId: string) => {
    setIsToggle(true);
    scrollToSection(sectionId);
  };

  useIsAuth();
  return (
    <div className="">
      <header
        className={` ${
          isToggle ? ' flex w-full  bg-myBlue-100  ' : 'relative '
        }  `}
      >
        <div
          className={` ${
            isToggle
              ? 'flex w-full justify-between py-[1em] md:block md:w-fit'
              : 'absolute z-[1]  grid w-full grid-flow-col items-start justify-between   pb-[22em] pt-4'
          } bg-myBlue-100 px-[.4em] `}
        >
          <Link href="/" className="cursor-pointer">
            <Image src={logo} alt={'Cook-e logo'} className=" "></Image>
          </Link>
          <button
            onClick={handleNavbarClick}
            className="cursor-pointer md:hidden"
          >
            {isToggle ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className=" h-8 w-8"
              >
                <path d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className=" h-8 w-8"
              >
                <path d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" />
              </svg>
            )}
          </button>
        </div>

        <nav
          className={` ${
            isToggle
              ? 'hidden md:grid md:w-full md:grid-flow-col md:justify-center '
              : 'absolute z-[2] mx-auto mt-24 w-full'
          }`}
        >
          <ul
            className={` ${
              isToggle ? 'flex max-w-[1268px] ' : 'flex flex-col  '
            } cursor-pointer items-center gap-4 text-sm font-semibold text-myGrey-200 lg:gap-12`}
          >
            <li className="">
              <a onClick={() => handleLinkClick('section_1')}>Άρθρα</a>
            </li>
            <li>
              <a onClick={() => handleLinkClick('section_2')}>Ημερολόγιο</a>
            </li>
            <li>
              <a onClick={() => handleLinkClick('section_3')}>
                Διαχείριση ραντεβού
              </a>
            </li>
            <li>
              <a onClick={() => handleLinkClick('section_4')} className="">
                Προγραμματισμός διατροφών
              </a>
            </li>

            {/* Settings icon */}
            <li>
              <Link
                href="/settings"
                className="flex items-center justify-center hover:text-myBlue-200 transition-colors"
                title="Ρυθμίσεις"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
            </li>

            {body}
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default NutrNavbar;
