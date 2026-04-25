import React, { createContext, useContext, useState, useCallback } from 'react';

// ── Types

interface ChatContextValue {
  /** Call from any "Message" button to open a specific conversation */
  openConversation: (userId: number) => void;
  /** Call from navbar icon to open the widget to inbox view */
  openWidget: () => void;
  /** Close the widget */
  closeWidget: () => void;
  /** Whether the widget panel is visible */
  isOpen: boolean;
  /** Internal — consumed only by ChatWidget */
  pendingUserId: number | null;
  clearPending: () => void;
}

// ── Context

const ChatContext = createContext<ChatContextValue>({
  openConversation: () => {},
  openWidget: () => {},
  closeWidget: () => {},
  isOpen: false,
  pendingUserId: null,
  clearPending: () => {},
});

// ── Provider

export function ChatContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
    </ChatContext.Provider>
  );
}

// ── Hook

export function useChatContext() {
  return useContext(ChatContext);
}
