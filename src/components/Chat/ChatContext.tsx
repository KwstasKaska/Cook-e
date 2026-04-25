import React, { createContext, useContext, useState, useCallback } from 'react';

// Types

interface ChatContextValue {
  /**
   * Call this from any "Message" button anywhere in the app.
   * The ChatWidget will pick it up, call startConversation, and open the thread.
   */
  openConversation: (userId: number) => void;
  /** Internal — consumed only by ChatWidget */
  pendingUserId: number | null;
  clearPending: () => void;
}

//  Context

const ChatContext = createContext<ChatContextValue>({
  openConversation: () => {},
  pendingUserId: null,
  clearPending: () => {},
});

//  Provider

export function ChatContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const openConversation = useCallback((userId: number) => {
    setPendingUserId(userId);
  }, []);

  const clearPending = useCallback(() => {
    setPendingUserId(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{ openConversation, pendingUserId, clearPending }}
    >
      {children}
    </ChatContext.Provider>
  );
}

//  Hook

export function useChatContext() {
  return useContext(ChatContext);
}
