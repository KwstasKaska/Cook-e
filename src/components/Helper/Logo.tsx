import Link from 'next/link';

const Logo = () => (
  <Link href="/" className="flex items-center gap-1">
    <span className="text-2xl">🍪</span>
    <span className="text-xl font-bold italic">
      ook-<span className="text-cookie-300">e</span>
    </span>
  </Link>
);

export default Logo;
