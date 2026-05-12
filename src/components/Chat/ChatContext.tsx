import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';

interface ChatContextValue {
  openConversation: (userId: number) => void;
  openWidget: () => void;
  closeWidget: () => void;
  isOpen: boolean;
  pendingUserId: number | null;
  clearPending: () => void;
}

const ChatContext = createContext<ChatContextValue>({
  openConversation: () => {},
  openWidget: () => {},
  closeWidget: () => {},
  isOpen: false,
  pendingUserId: null,
  clearPending: () => {},
});

const CHAT_ROUTES = ['/user', '/chef', '/nutritionist'];

export const ChatContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
      setPendingUserId(null);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  const openConversation = useCallback((userId: number) => {
    setPendingUserId(userId);
    setIsOpen(true);
  }, []);

  const openWidget = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeWidget = useCallback(() => {
    setIsOpen(false);
    setPendingUserId(null);
  }, []);

  const clearPending = useCallback(() => {
    setPendingUserId(null);
  }, []);

  const showBubble =
    !isOpen && CHAT_ROUTES.some((prefix) => router.pathname.startsWith(prefix));

  return (
    <ChatContext.Provider
      value={{
        openConversation,
        openWidget,
        closeWidget,
        isOpen,
        pendingUserId,
        clearPending,
      }}
    >
      {children}
      {showBubble && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-cookie-300 shadow-3xl hover:bg-cookie-400 transition-colors duration-150"
          aria-label="Open messages"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"
            />
          </svg>
        </button>
      )}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
