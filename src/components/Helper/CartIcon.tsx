// src/components/Helper/NavCartLink.tsx
import Link from 'next/link';

export const NavCartLink = ({
  ariaLabel,
  className,
  onClick,
}: {
  ariaLabel: string;
  className?: string;
  onClick?: () => void;
}) => (
  <Link
    href="/user/cart"
    aria-label={ariaLabel}
    onClick={onClick}
    className={
      className ??
      'p-2 rounded text-myGrey-200 hover:text-myBlue-200 transition-colors duration-150'
    }
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21h6"
      />
    </svg>
  </Link>
);
