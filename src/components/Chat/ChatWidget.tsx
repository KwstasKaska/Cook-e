import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import {
  useMyConversationsQuery,
  useConversationQuery,
  useSendMessageMutation,
  useStartConversationMutation,
} from '../../generated/graphql';
import { useChatContext } from './ChatContext';

// ── Types

interface ChatWidgetProps {
  currentUserId: number;
}

type View = 'closed' | 'inbox' | 'thread';

// ── Component

export default function ChatWidget({ currentUserId }: ChatWidgetProps) {
  const { t } = useTranslation('common');
  const { pendingUserId, clearPending } = useChatContext();

  const [view, setView] = useState<View>('closed');
  const [activeConvoId, setActiveConvoId] = useState<number | null>(null);
  const [body, setBody] = useState('');
  const [sendError, setSendError] = useState('');
  const [startError, setStartError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Guard: prevents the effect from firing twice for the same pendingUserId
  const pendingFiredRef = useRef(false);

  // ── Queries

  const { data: inboxData, loading: inboxLoading } = useMyConversationsQuery({
    variables: { limit: 20, offset: 0 },
    skip: view === 'closed',
    pollInterval: 12000,
    fetchPolicy: 'network-only',
  });

  const { data: threadData, loading: threadLoading } = useConversationQuery({
    variables: { id: activeConvoId! },
    skip: view !== 'thread' || activeConvoId === null,
    pollInterval: 12000,
    fetchPolicy: 'network-only',
  });

  // ── Mutations

  const [sendMessage, { loading: sending }] = useSendMessageMutation();
  const [startConversation, { loading: starting }] =
    useStartConversationMutation();

  // ── Effects

  // Scroll to bottom when thread updates
  useEffect(() => {
    if (view === 'thread') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadData, view]);

  // Handle openConversation(userId) calls from anywhere in the app
  useEffect(() => {
    if (pendingUserId === null) {
      pendingFiredRef.current = false;
      return;
    }
    console.log(
      'effect fired, pendingUserId:',
      pendingUserId,
      'alreadyFired:',
      pendingFiredRef.current,
    );
    if (pendingFiredRef.current) return;
    pendingFiredRef.current = true;
    async function initConversation() {
      setStartError('');
      try {
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
          setActiveConvoId(convo.id);
          setView('thread');
          setSendError('');
          setBody('');
        }
      } catch {
        clearPending();
        setStartError('Κάτι πήγε λάθος. Δοκιμάστε ξανά.');
        setView('inbox');
      }
    }

    initConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingUserId]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function getOtherParticipant(convo: {
    participant1Id: number;
    participant2Id: number;
    participant1: { id: number; username: string; image?: string | null };
    participant2: { id: number; username: string; image?: string | null };
  }) {
    return convo.participant1Id === currentUserId
      ? convo.participant2
      : convo.participant1;
  }

  function openThread(convoId: number) {
    setActiveConvoId(convoId);
    setView('thread');
    setSendError('');
    setStartError('');
    setBody('');
  }

  async function handleSend() {
    if (!body.trim()) return;
    setSendError('');

    try {
      const result = await sendMessage({
        variables: { conversationId: activeConvoId!, body: body.trim() },
      });
      if (result.data?.sendMessage?.errors?.length) {
        setSendError(result.data.sendMessage.errors[0].message);
        return;
      }
      setBody('');
    } catch {
      setSendError('Κάτι πήγε λάθος. Δοκιμάστε ξανά.');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ── FAB ───────────────────────────────────────────────────────────────────

  if (view === 'closed' && pendingUserId === null) {
    return (
      <button
        onClick={() => setView('inbox')}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label="Open messages"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
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
    );
  }

  // ── Popup shell ───────────────────────────────────────────────────────────

  const thread = threadData?.conversation;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-80 rounded-lg shadow-xl border border-gray-200 bg-white flex flex-col overflow-hidden"
      style={{ height: '420px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-blue-600 text-white flex-shrink-0">
        <div className="flex items-center gap-2">
          {view === 'thread' && (
            <button
              onClick={() => setView('inbox')}
              className="hover:opacity-70 mr-1"
              aria-label="Back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
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
          <span className="text-sm font-medium">
            {view === 'inbox'
              ? t('messages', 'Messages')
              : thread
                ? getOtherParticipant(thread).username
                : starting
                  ? '...'
                  : t('messages', 'Messages')}
          </span>
        </div>
        <button
          onClick={() => {
            setView('closed');
            clearPending();
          }}
          className="hover:opacity-70"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
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

      {/* Inbox */}
      {view === 'inbox' && (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {startError && (
            <p className="text-xs text-red-500 text-center px-3 py-2">
              {startError}
            </p>
          )}
          {inboxLoading && (
            <p className="text-xs text-gray-400 text-center py-6">Loading...</p>
          )}
          {!inboxLoading &&
            !inboxData?.myConversations?.length &&
            !startError && (
              <p className="text-xs text-gray-400 text-center py-6">
                {t('no_conversations', 'No conversations yet.')}
              </p>
            )}
          {inboxData?.myConversations?.map((convo) => {
            const other = getOtherParticipant(convo);
            return (
              <button
                key={convo.id}
                onClick={() => openThread(convo.id)}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {other.image ? (
                    <img
                      src={other.image}
                      alt={other.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-500">
                      {other.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {other.username}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Thread — loading state while startConversation is in flight */}
      {view === 'thread' && starting && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-gray-400">Άνοιγμα συνομιλίας...</p>
        </div>
      )}

      {/* Thread */}
      {view === 'thread' && !starting && (
        <>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            {threadLoading && (
              <p className="text-xs text-gray-400 text-center py-4">
                Loading...
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
                    className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm break-words ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.body}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {sendError && (
            <p className="text-xs text-red-500 px-3 pb-1">{sendError}</p>
          )}

          <div className="border-t border-gray-200 px-3 py-2 flex items-end gap-2 flex-shrink-0">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('type_message', 'Type a message…')}
              rows={1}
              className="flex-1 resize-none text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleSend}
              disabled={sending || !body.trim()}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-blue-700 transition-colors"
              aria-label="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
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
