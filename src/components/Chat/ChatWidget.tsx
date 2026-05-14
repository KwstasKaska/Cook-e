import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useApolloClient } from '@apollo/client';
import {
  useMyConversationsQuery,
  useConversationQuery,
  useSendMessageMutation,
  useStartConversationMutation,
} from '../../generated/graphql';
import { useChatContext } from './ChatContext';

interface ChatWidgetProps {
  currentUserId: number;
}

type View = 'inbox' | 'thread';

export default function ChatWidget({ currentUserId }: ChatWidgetProps) {
  const { t } = useTranslation('common');
  const { isOpen, closeWidget, pendingUserId, clearPending } = useChatContext();
  const client = useApolloClient();

  const [view, setView] = useState<View>('inbox');
  const [activeConvoId, setActiveConvoId] = useState<number | null>(null);
  const [body, setBody] = useState('');
  const [sendError, setSendError] = useState('');
  const [startError, setStartError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pendingFiredRef = useRef(false);
  const wasOpenRef = useRef(false);

  const { data: inboxData, loading: inboxLoading } = useMyConversationsQuery({
    variables: { limit: 20, offset: 0 },
    skip: !isOpen,
    pollInterval: 12000,
    fetchPolicy: 'network-only',
  });

  const { data: threadData, loading: threadLoading } = useConversationQuery({
    variables: { id: activeConvoId! },
    skip: view !== 'thread' || activeConvoId === null || !isOpen,
    pollInterval: 12000,
    fetchPolicy: 'network-only',
  });

  const [sendMessage, { loading: sending }] = useSendMessageMutation();
  const [startConversation, { loading: starting }] =
    useStartConversationMutation();

  useEffect(() => {
    if (isOpen && view === 'thread') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadData, view, isOpen]);

  useEffect(() => {
    if (!isOpen && wasOpenRef.current) {
      setView('inbox');
      setActiveConvoId(null);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (pendingUserId === null) {
      pendingFiredRef.current = false;
      return;
    }
    if (pendingFiredRef.current) return;
    pendingFiredRef.current = true;

    const initConversation = async () => {
      setStartError('');
      const result = await startConversation({
        variables: { participantId: pendingUserId! },
      });
      clearPending();

      if (result.data?.startConversation?.errors?.length) {
        setStartError(result.data.startConversation.errors[0].message);
        setView('inbox');
        return;
      }

      const convo = result.data?.startConversation?.conversation;
      if (convo) {
        client.cache.evict({ id: `Conversation:${convo.id}` });
        client.cache.gc();
        setActiveConvoId(convo.id);
        setView('thread');
        setSendError('');
        setBody('');
      }
    };

    initConversation();
  }, [pendingUserId]);

  const getOtherParticipant = (convo: {
    participant1Id: number;
    participant2Id: number;
    participant1: { id: number; username: string; image?: string | null };
    participant2: { id: number; username: string; image?: string | null };
  }) =>
    convo.participant1Id === currentUserId
      ? convo.participant2
      : convo.participant1;

  const openThread = (convoId: number) => {
    client.cache.evict({ id: `Conversation:${convoId}` });
    client.cache.gc();
    setActiveConvoId(convoId);
    setView('thread');
    setSendError('');
    setStartError('');
    setBody('');
  };

  const handleSend = async () => {
    if (!body.trim()) return;
    setSendError('');

    const result = await sendMessage({
      variables: { conversationId: activeConvoId!, body: body.trim() },
    });
    if (result.data?.sendMessage?.errors?.length) {
      setSendError(result.data.sendMessage.errors[0].message);
      return;
    }
    setBody('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  const thread = threadData?.conversation;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-surface sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[420px] sm:w-80 sm:rounded-2xl sm:border sm:border-cookie-200 sm:shadow-xl">
      <div className="flex flex-shrink-0 items-center justify-between bg-cookie-300 px-3 py-2 text-white">
        <div className="flex items-center gap-2">
          {view === 'thread' && (
            <button
              onClick={() => setView('inbox')}
              className="mr-1 hover:opacity-70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <span>
            {view === 'inbox'
              ? t('messages', 'Messages')
              : thread && !threadLoading
                ? getOtherParticipant(thread).username
                : '...'}
          </span>
        </div>
        <button onClick={closeWidget} className="hover:opacity-70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {view === 'inbox' && (
        <div className="flex-1 divide-y divide-cookie-100 overflow-y-auto">
          {startError && (
            <p className="px-3 py-2 text-center text-myRed">{startError}</p>
          )}
          {inboxLoading && (
            <p className="py-6 text-center text-myText-muted">
              {t('common.loading')}
            </p>
          )}
          {!inboxLoading &&
            !inboxData?.myConversations?.length &&
            !startError && (
              <p className="py-6 text-center text-myText-muted">
                {t('no_conversations', 'No conversations yet.')}
              </p>
            )}
          {inboxData?.myConversations?.map((convo) => {
            const other = getOtherParticipant(convo);
            return (
              <button
                key={convo.id}
                onClick={() => openThread(convo.id)}
                className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-cookie-100"
              >
                <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-cookie-200">
                  {other.image ? (
                    <img
                      src={other.image}
                      alt={other.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-myText-heading">
                      {other.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="truncate text-myText-base">{other.username}</p>
              </button>
            );
          })}
        </div>
      )}

      {view === 'thread' && starting && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-myText-muted">Άνοιγμα συνομιλίας...</p>
        </div>
      )}

      {view === 'thread' && !starting && (
        <>
          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-2">
            {threadLoading && (
              <p className="py-4 text-center text-myText-muted">
                {t('common.loading')}
              </p>
            )}
            {thread?.messages?.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] break-words rounded-2xl px-3 py-2 ${
                      isMine
                        ? 'rounded-br-sm bg-cookie-300 text-white'
                        : 'rounded-bl-sm bg-cookie-100 text-myText-base'
                    }`}
                  >
                    {msg.body}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {sendError && <p className="px-3 pb-1 text-myRed">{sendError}</p>}

          <div className="flex flex-shrink-0 items-end gap-2 border-t border-cookie-200 px-3 py-2">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-cookie-200 px-2 py-1.5 focus:outline-none focus:border-cookie-400"
            />
            <button
              onClick={handleSend}
              disabled={sending || !body.trim()}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cookie-300 text-white transition-colors hover:bg-cookie-400 disabled:opacity-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
