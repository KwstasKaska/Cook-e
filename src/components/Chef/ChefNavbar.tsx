import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ChefNavbar = () => {
  const router = useRouter();

  const navLinks = [
    { href: '/chef', label: 'ΑΡΧΙΚΗ' },
    { href: '/chef/profile', label: 'ΠΡΟΦΙΛ' },
    { href: '/chef/recipes', label: 'ΟΙ ΣΥΝΤΑΓΕΣ ΜΟΥ' },
    { href: '/chef/create-recipe', label: 'ΔΗΜΙΟΥΡΓΙΑ ΣΥΝΤΑΓΗΣ' },
  ];

  const handleLogout = () => {
    // TODO: Apollo resetStore + redirect
    router.push('/login');
  };

  return (
    <nav
      className="flex items-center justify-between px-6 py-3"
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

      {/* Nav links */}
      <div className="hidden items-center gap-8 md:flex">
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

      {/* Right: settings + logout */}
      <div className="flex items-center gap-4">
        <Link href="/settings" aria-label="Ρυθμίσεις">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#3F4756"
            className="h-7 w-7 transition-colors hover:stroke-myBlue-200"
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

        <button
          onClick={handleLogout}
          className="rounded-full px-5 py-2 text-sm font-bold tracking-wide transition-colors"
          style={{
            backgroundColor: '#3F4756',
            color: 'white',
          }}
        >
          ΕΞΟΔΟΣ
        </button>
      </div>
    </nav>
  );
};

export default ChefNavbar;
