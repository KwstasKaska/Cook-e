import Link from 'next/link';

const Logo = () => (
  <Link href="/" className="flex items-center gap-1">
    <span className="text-2xl">🍪</span>
    <span
      className="text-xl font-bold italic"
      style={{ fontFamily: 'Georgia, serif', color: '#3F4756' }}
    >
      ook-<span style={{ color: '#377CC3' }}>e</span>
    </span>
  </Link>
);

export default Logo;
