import { useRouter } from 'next/router';
import { useMeQuery } from '../../generated/graphql';

const roleRoutes: Record<string, string> = {
  USER: '/user',
  CHEF: '/chef',
  NUTRITIONIST: '/nutritionist',
};

const Logo = () => {
  const router = useRouter();
  const { data } = useMeQuery({});

  const handleClick = () => {
    const role = data?.me?.role;
    router.push(role ? roleRoutes[role] ?? '/' : '/');
  };

  return (
    <button
      onClick={handleClick}
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
