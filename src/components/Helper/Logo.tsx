import { useRouter } from 'next/router';

const Logo = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="flex items-center gap-1 leading-none"
    >
      <span className="text-xl leading-none">🍪</span>
      <span className="text-lg font-bold text-cookie-300 leading-none">
        ook-<span className="text-cookie-300">e</span>
      </span>
    </button>
  );
};

export default Logo;
