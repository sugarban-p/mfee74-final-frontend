'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Download,
  ExternalLink,
  FileText,
  Headphones,
  Image as ImageIcon,
  Paperclip,
  Plus,
  Send,
} from 'lucide-react';
// @ts-ignore -- editor language service may intermittently fail to resolve pnpm workspace deps.
import { io, type Socket } from 'socket.io-client';

import SupportSwitcher from '@/src/components/support-switcher';

type ChatSender = 'USER' | 'BOT' | 'AGENT';

type UIMessage = {
  id: string;
  sender: ChatSender;
  type: 'TEXT';
  content: string;
  createdAt: string;
};

type MemberHistoryResponse = {
  case?: {
    caseId: string;
    status: 'OPEN' | 'CLOSED';
  };
  messages?: Array<{
    id: string;
    content: string;
    sender: 'USER' | 'AI' | 'SYSTEM';
    type: string;
    createdAt: string;
  }>;
};

type SupportCase = {
  caseId: string;
  status: 'OPEN' | 'CLOSED';
  preview: string;
  user?: {
    name: string | null;
    email: string;
  };
};

type SupportCasesResponse = {
  cases?: SupportCase[];
};

type CaseMessageEvent = {
  caseId?: string;
  message?: unknown;
};

type CaseUpdatedEvent = {
  caseId?: string;
  status?: 'OPEN' | 'CLOSED';
};

const MEMBER_QUICK_REPLIES = [
  '運費說明',
  '退換貨政策',
  '付款方式',
  '配送時程',
  '會員優惠',
];

const SUPPORT_QUICK_REPLIES = [
  '您好，這邊是客服，已收到您的問題。',
  '請提供訂單編號，這邊幫您查詢。',
  '請提供收件人姓名與電話末三碼。',
  '已為您確認處理中，請稍候。',
  '此案已協助處理完成，若有其他問題歡迎再詢問。',
];

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function toSender(sender: 'USER' | 'AI' | 'SYSTEM'): ChatSender {
  if (sender === 'USER') return 'USER';
  if (sender === 'AI') return 'BOT';
  return 'AGENT';
}

function normalizeApiMessage(value: unknown): UIMessage | null {
  const row = asRecord(value);
  if (!row) return null;

  const id = typeof row.id === 'string' ? row.id : null;
  const content = typeof row.content === 'string' ? row.content : null;
  const senderRaw = typeof row.sender === 'string' ? row.sender : null;
  const createdAt = typeof row.createdAt === 'string' ? row.createdAt : null;

  if (!id || !content || !senderRaw || !createdAt) return null;
  if (senderRaw !== 'USER' && senderRaw !== 'AI' && senderRaw !== 'SYSTEM') {
    return null;
  }

  return {
    id,
    sender: toSender(senderRaw),
    type: 'TEXT',
    content,
    createdAt,
  };
}

function formatMessageTime(isoTime: string) {
  return new Date(isoTime).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

type AttachmentMessage = {
  fileName: string;
  fileUrl: string;
  isImage: boolean;
};

function getFileLabel(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extension)) return '圖片';
  if (extension === 'pdf') return 'PDF';
  if (extension === 'txt') return '文字檔';
  return '附件';
}

function parseAttachmentMessage(content: string): AttachmentMessage | null {
  const imageExtRegex = /\.(png|jpe?g|webp|gif)(\?.*)?$/i;
  const attachmentMatch = content.match(/^附件：(.+)\n(https?:\/\/\S+)$/);
  if (!attachmentMatch) return null;

  const fileName = attachmentMatch[1];
  const fileUrl = attachmentMatch[2];
  return {
    fileName,
    fileUrl,
    isImage: imageExtRegex.test(fileName) || imageExtRegex.test(fileUrl),
  };
}

const BOT_GREETING = '您好！歡迎使用客服中心，請輸入您的問題。';

function appendUniqueMessage(prev: UIMessage[], next: UIMessage): UIMessage[] {
  return prev.some((item) => item.id === next.id) ? prev : [...prev, next];
}

function appendUniqueMessages(
  prev: UIMessage[],
  nextMessages: UIMessage[]
): UIMessage[] {
  const seen = new Set(prev.map((item) => item.id));
  const uniqueNext = nextMessages.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return uniqueNext.length > 0 ? [...prev, ...uniqueNext] : prev;
}

export default function ChatClient() {
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get('q')?.trim() ?? '';
  const queryCaseId = searchParams.get('caseId')?.trim() ?? '';

  const greetingMessage = useMemo<UIMessage>(
    () => ({
      id: 'welcome',
      sender: 'BOT',
      type: 'TEXT',
      content: BOT_GREETING,
      createdAt: new Date().toISOString(),
    }),
    []
  );

  const [messages, setMessages] = useState<UIMessage[]>([greetingMessage]);
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState(queryCaseId);
  const [supportCases, setSupportCases] = useState<SupportCase[]>([]);
  const [isSupport, setIsSupport] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [supportUnreadCounts, setSupportUnreadCounts] = useState<
    Record<string, number>
  >({});
  const [memberCaseStatus, setMemberCaseStatus] = useState<
    'OPEN' | 'CLOSED' | null
  >(null);
  const [isClosingCase, setIsClosingCase] = useState(false);

  const chatCardRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const selectedCaseIdRef = useRef(selectedCaseId);
  const isSupportRef = useRef(isSupport);
  const supportCasesRef = useRef<SupportCase[]>(supportCases);

  const backendSocketOrigin =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    selectedCaseIdRef.current = selectedCaseId;
  }, [selectedCaseId]);

  useEffect(() => {
    isSupportRef.current = isSupport;
  }, [isSupport]);

  useEffect(() => {
    supportCasesRef.current = supportCases;
  }, [supportCases]);

  const refreshSupportCases = async () => {
    try {
      const response = await fetch(
        '/api/chat/support/cases?status=ALL&handoff=ALL',
        {
          credentials: 'include',
          cache: 'no-store',
        }
      );

      if (!response.ok) return;

      const payload: unknown = await response.json();
      const parsed = asRecord(payload) as SupportCasesResponse | null;
      const cases = Array.isArray(parsed?.cases)
        ? parsed.cases.filter(
            (item): item is SupportCase =>
              Boolean(item) &&
              typeof item.caseId === 'string' &&
              (item.status === 'OPEN' || item.status === 'CLOSED') &&
              typeof item.preview === 'string'
          )
        : [];

      setSupportCases(cases);

      const openCase = cases.find((item) => item.status === 'OPEN');
      const activeCaseId = selectedCaseIdRef.current;

      if (!activeCaseId && cases.length > 0) {
        setSelectedCaseId(openCase?.caseId || cases[0].caseId);
      } else if (
        activeCaseId &&
        !cases.some((item) => item.caseId === activeCaseId) &&
        cases.length > 0
      ) {
        setSelectedCaseId(openCase?.caseId || cases[0].caseId);
      }
    } catch {
      // Keep current UI state if refresh fails.
    }
  };

  useEffect(() => {
    const scrollToChatCard = () => {
      chatCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    };

    const id = requestAnimationFrame(scrollToChatCard);
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    const detectRole = async () => {
      setErrorMessage('');
      try {
        const response = await fetch(
          '/api/chat/support/cases?status=ALL&handoff=ALL',
          {
            credentials: 'include',
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          setIsSupport(false);
          setSupportCases([]);
          return;
        }

        const payload: unknown = await response.json();
        const parsed = asRecord(payload) as SupportCasesResponse | null;
        const cases = Array.isArray(parsed?.cases)
          ? parsed.cases.filter(
              (item): item is SupportCase =>
                Boolean(item) &&
                typeof item.caseId === 'string' &&
                (item.status === 'OPEN' || item.status === 'CLOSED') &&
                typeof item.preview === 'string'
            )
          : [];

        setIsSupport(true);
        setSupportCases(cases);

        const openCase = cases.find((item) => item.status === 'OPEN');

        if (!selectedCaseId && cases.length > 0) {
          setSelectedCaseId(openCase?.caseId || cases[0].caseId);
        } else if (
          selectedCaseId &&
          !cases.some((item) => item.caseId === selectedCaseId) &&
          cases.length > 0
        ) {
          setSelectedCaseId(openCase?.caseId || cases[0].caseId);
        }
      } catch {
        setIsSupport(false);
        setSupportCases([]);
      } finally {
        setIsReady(true);
      }
    };

    void detectRole();
  }, []);

  const selectedSupportCase = useMemo(
    () => supportCases.find((item) => item.caseId === selectedCaseId) || null,
    [selectedCaseId, supportCases]
  );

  useEffect(() => {
    if (!isReady || isSupport) return;

    const loadHistory = async () => {
      setIsLoadingMessages(true);
      setErrorMessage('');

      if (!selectedCaseId) {
        setMemberCaseStatus(null);
        const base = [greetingMessage];
        if (initialQuestion) {
          base.push({
            id: `q-${Date.now()}`,
            sender: 'USER',
            type: 'TEXT',
            content: initialQuestion,
            createdAt: new Date().toISOString(),
          });
        }
        setMessages(base);
        setIsLoadingMessages(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/chat/history?caseId=${encodeURIComponent(selectedCaseId)}`,
          {
            credentials: 'include',
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          setMessages([greetingMessage]);
          setErrorMessage('目前無法讀取該案件紀錄。');
          return;
        }

        const payload: unknown = await response.json();
        const parsed = asRecord(payload) as MemberHistoryResponse | null;
        const status = parsed?.case?.status;
        setMemberCaseStatus(
          status === 'OPEN' || status === 'CLOSED' ? status : null
        );
        const rawMessages = Array.isArray(parsed?.messages)
          ? parsed.messages
          : [];
        const normalized = rawMessages
          .map((item) => normalizeApiMessage(item))
          .filter((item): item is UIMessage => item !== null);

        setMessages(normalized.length > 0 ? normalized : [greetingMessage]);
      } catch {
        setErrorMessage('讀取聊天紀錄失敗，請稍後再試。');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    void loadHistory();
  }, [greetingMessage, initialQuestion, isReady, isSupport, selectedCaseId]);

  useEffect(() => {
    if (!isReady || !isSupport) return;

    const loadSupportHistory = async () => {
      setIsLoadingMessages(true);
      setErrorMessage('');

      if (!selectedCaseId) {
        setMessages([greetingMessage]);
        setIsLoadingMessages(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/chat/support/history?caseId=${encodeURIComponent(selectedCaseId)}`,
          {
            credentials: 'include',
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          setMessages([greetingMessage]);
          setErrorMessage('目前無法讀取該案件紀錄。');
          return;
        }

        const payload: unknown = await response.json();
        const parsed = asRecord(payload) as MemberHistoryResponse | null;
        const rawMessages = Array.isArray(parsed?.messages)
          ? parsed.messages
          : [];
        const normalized = rawMessages
          .map((item) => normalizeApiMessage(item))
          .filter((item): item is UIMessage => item !== null);

        setMessages(normalized.length > 0 ? normalized : [greetingMessage]);
      } catch {
        setErrorMessage('讀取聊天紀錄失敗，請稍後再試。');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    void loadSupportHistory();
  }, [greetingMessage, isReady, isSupport, selectedCaseId]);

  useEffect(() => {
    if (!isReady) return;

    const socket = io(backendSocketOrigin, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    const joinCaseRoom = (caseId: string) => {
      socket.emit('chat:join-case', { caseId });
    };

    socket.on('connect', () => {
      const caseId = selectedCaseIdRef.current;
      if (caseId) {
        joinCaseRoom(caseId);
      }
    });

    socket.on('chat:message', (payload: CaseMessageEvent) => {
      const caseId = typeof payload?.caseId === 'string' ? payload.caseId : '';
      const normalized = normalizeApiMessage(payload?.message);
      if (!caseId || !normalized) return;

      const activeCaseId = selectedCaseIdRef.current;
      const supportMode = isSupportRef.current;

      if (!supportMode && !activeCaseId) {
        setSelectedCaseId(caseId);
      }

      if (caseId === selectedCaseIdRef.current) {
        setMessages((prev) => appendUniqueMessage(prev, normalized));
      }

      if (supportMode) {
        if (caseId !== selectedCaseIdRef.current) {
          setSupportUnreadCounts((prev) => ({
            ...prev,
            [caseId]: (prev[caseId] || 0) + 1,
          }));
        }

        if (!supportCasesRef.current.some((item) => item.caseId === caseId)) {
          void refreshSupportCases();
          return;
        }

        setSupportCases((prev) => {
          const target = prev.find((item) => item.caseId === caseId);
          if (!target) return prev;

          const updatedTarget: SupportCase = {
            ...target,
            status: 'OPEN',
            preview: normalized.content,
          };

          return [
            updatedTarget,
            ...prev.filter((item) => item.caseId !== caseId),
          ];
        });
      }
    });

    socket.on('chat:case-updated', (payload: CaseUpdatedEvent) => {
      const caseId = typeof payload?.caseId === 'string' ? payload.caseId : '';
      const status = payload?.status;

      if (!caseId || (status !== 'OPEN' && status !== 'CLOSED')) return;

      if (isSupportRef.current) {
        if (!supportCasesRef.current.some((item) => item.caseId === caseId)) {
          void refreshSupportCases();
          return;
        }

        setSupportCases((prev) =>
          prev.map((item) =>
            item.caseId === caseId ? { ...item, status } : item
          )
        );
      } else if (selectedCaseIdRef.current === caseId) {
        setMemberCaseStatus(status);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [backendSocketOrigin, isReady]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || !selectedCaseId) return;

    socket.emit('chat:join-case', { caseId: selectedCaseId });
  }, [selectedCaseId]);

  useEffect(() => {
    if (!isSupport || !selectedCaseId) return;

    setSupportUnreadCounts((prev) => {
      if (!prev[selectedCaseId]) return prev;
      const next = { ...prev };
      delete next[selectedCaseId];
      return next;
    });
  }, [isSupport, selectedCaseId]);

  const send = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isSending) return;

    const optimisticUserMessageId = `tmp-user-${Date.now()}`;

    setIsSending(true);
    setErrorMessage('');

    try {
      if (isSupport) {
        if (!selectedCaseId) {
          setErrorMessage('請先從右側選擇一筆案件。');
          return;
        }

        if (selectedSupportCase?.status === 'CLOSED') {
          setErrorMessage('此案件已結案，送出後將自動重新開案。');
        }

        const response = await fetch('/api/chat/support/send', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            caseId: selectedCaseId,
            content: text,
          }),
        });

        if (!response.ok) {
          setErrorMessage('客服回覆失敗，請稍後再試。');
          return;
        }

        const payload: unknown = await response.json();
        const parsed = asRecord(payload);
        const created = normalizeApiMessage(parsed?.message);

        if (created) {
          setMessages((prev) => appendUniqueMessage(prev, created));
        }

        setSupportCases((prev) => {
          const targetCaseId = selectedCaseId;
          if (!targetCaseId) return prev;

          const target = prev.find((item) => item.caseId === targetCaseId);
          if (!target) return prev;

          const nextPreview = created?.content || text;
          const updatedTarget: SupportCase = {
            ...target,
            status: 'OPEN',
            preview: nextPreview,
          };

          return [
            updatedTarget,
            ...prev.filter((item) => item.caseId !== targetCaseId),
          ];
        });

        setInput('');
        return;
      }

      const optimisticUserMessage: UIMessage = {
        id: optimisticUserMessageId,
        sender: 'USER',
        type: 'TEXT',
        content: text,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => appendUniqueMessage(prev, optimisticUserMessage));
      setInput('');

      const response = await fetch('/api/chat/send', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: text,
          ...(selectedCaseId ? { caseId: selectedCaseId } : {}),
        }),
      });

      if (!response.ok) {
        setMessages((prev) =>
          prev.filter((item) => item.id !== optimisticUserMessageId)
        );
        setInput(text);
        setErrorMessage('訊息送出失敗，請稍後再試。');
        return;
      }

      const payload: unknown = await response.json();
      const parsed = asRecord(payload);

      const newCaseId =
        typeof parsed?.caseId === 'string' ? parsed.caseId : null;
      const newCaseStatus =
        parsed?.caseStatus === 'OPEN' || parsed?.caseStatus === 'CLOSED'
          ? parsed.caseStatus
          : null;
      const userMessage = normalizeApiMessage(parsed?.userMessage);
      const botMessage = normalizeApiMessage(parsed?.botMessage);

      if (newCaseId && !selectedCaseId) {
        setSelectedCaseId(newCaseId);
      }

      const nextMessages = [userMessage, botMessage].filter(
        (item): item is UIMessage => item !== null
      );

      if (nextMessages.length > 0) {
        setMessages((prev) => {
          const withoutOptimistic = prev.filter(
            (item) => item.id !== optimisticUserMessageId
          );
          return appendUniqueMessages(withoutOptimistic, nextMessages);
        });
      } else {
        setMessages((prev) =>
          prev.filter((item) => item.id !== optimisticUserMessageId)
        );
      }

      if (newCaseStatus) {
        setMemberCaseStatus(newCaseStatus);
      }
    } catch {
      setMessages((prev) =>
        prev.filter((item) => item.id !== optimisticUserMessageId)
      );
      setInput(text);
      setErrorMessage('網路異常，請稍後再試。');
    } finally {
      setIsSending(false);
    }
  };

  const modeTitle = isSupport ? '客服工作台' : '會員客服';
  const canSendAsSupport = !isSupport || Boolean(selectedCaseId);
  const isMemberCaseClosed = !isSupport && memberCaseStatus === 'CLOSED';
  const isSupportCaseClosed =
    isSupport && selectedSupportCase?.status === 'CLOSED';
  const quickReplies = isSupport ? SUPPORT_QUICK_REPLIES : MEMBER_QUICK_REPLIES;
  const userMessageLabel = isSupport
    ? selectedSupportCase?.user?.name ||
      selectedSupportCase?.user?.email ||
      '會員'
    : '我';

  const startNewConsultation = () => {
    setMessages([greetingMessage]);
    setSelectedCaseId('');
    setMemberCaseStatus(null);
    setErrorMessage('');
    setInput('');
  };

  const closeCase = async () => {
    if (!isSupport || !selectedCaseId || isClosingCase) return;

    setIsClosingCase(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/chat/case/close', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId: selectedCaseId,
        }),
      });

      if (!response.ok) {
        setErrorMessage('結束諮詢失敗，請稍後再試。');
        return;
      }

      const payload: unknown = await response.json();
      const parsed = asRecord(payload);
      const closedMessage = normalizeApiMessage(parsed?.message);

      if (closedMessage) {
        setMessages((prev) => appendUniqueMessage(prev, closedMessage));
      }

      setSupportCases((prev) =>
        prev.map((item) =>
          item.caseId === selectedCaseId
            ? {
                ...item,
                status: 'CLOSED',
                preview:
                  closedMessage?.content ||
                  '客服已將此諮詢標記為已解決，對話已結案。',
              }
            : item
        )
      );
    } catch {
      setErrorMessage('網路異常，請稍後再試。');
    } finally {
      setIsClosingCase(false);
    }
  };

  const uploadAttachment = async (file: File) => {
    const maxSize = 8 * 1024 * 1024;
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain',
    ];

    if (file.size > maxSize) {
      setErrorMessage('附件大小不可超過 8MB。');
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('附件格式僅支援 JPG、PNG、WEBP、GIF、PDF、TXT。');
      return;
    }

    if (isSupport && !selectedCaseId) {
      setErrorMessage('請先從右側選擇一筆案件。');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('attachment', file);
      if (selectedCaseId) {
        formData.append('caseId', selectedCaseId);
      }

      const endpoint = isSupport
        ? '/api/chat/support/upload'
        : '/api/chat/upload';
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const parsed = asRecord(payload);
        setErrorMessage(
          typeof parsed?.message === 'string'
            ? parsed.message
            : '附件上傳失敗，請稍後再試。'
        );
        return;
      }

      const payload: unknown = await response.json();
      const parsed = asRecord(payload);
      const created = normalizeApiMessage(parsed?.message);
      const newCaseId =
        typeof parsed?.caseId === 'string' ? parsed.caseId : null;
      const newCaseStatus =
        parsed?.caseStatus === 'OPEN' || parsed?.caseStatus === 'CLOSED'
          ? parsed.caseStatus
          : null;

      if (created) {
        setMessages((prev) => appendUniqueMessage(prev, created));
      }

      if (!isSupport) {
        if (newCaseId && !selectedCaseId) {
          setSelectedCaseId(newCaseId);
        }
        if (newCaseStatus) {
          setMemberCaseStatus(newCaseStatus);
        }
      } else {
        setSupportCases((prev) => {
          const targetCaseId = selectedCaseId;
          if (!targetCaseId) return prev;

          const target = prev.find((item) => item.caseId === targetCaseId);
          if (!target) return prev;

          const nextPreview = `附件：${file.name}`;
          const updatedTarget: SupportCase = {
            ...target,
            status: 'OPEN',
            preview: nextPreview,
          };

          return [
            updatedTarget,
            ...prev.filter((item) => item.caseId !== targetCaseId),
          ];
        });
      }
    } catch {
      setErrorMessage('網路異常，請稍後再試。');
    } finally {
      setIsUploading(false);
    }
  };

  const onAttachmentInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await uploadAttachment(file);
  };

  const selectSupportCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setSupportUnreadCounts((prev) => {
      if (!prev[caseId]) return prev;
      const next = { ...prev };
      delete next[caseId];
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] leading-tight font-bold text-text-primary">
          客服中心
        </h1>
        {isSupport ? (
          <p className="mt-1 text-[16px] leading-tight text-text-primary/60">
            目前身份：客服人員
            {selectedCaseId ? ` / 案件：${selectedCaseId}` : ''}
          </p>
        ) : selectedCaseId ? (
          <p className="mt-1 text-[14px] leading-tight text-text-primary/60">
            案件編號：{selectedCaseId}
          </p>
        ) : null}
      </div>

      <SupportSwitcher />

      <div
        className={`grid max-w-6xl grid-cols-1 gap-4 ${
          isSupport ? 'xl:grid-cols-[minmax(0,1fr)_320px]' : ''
        }`}
      >
        <div
          ref={chatCardRef}
          className="flex flex-col overflow-hidden rounded-3xl border border-[#ece3d9] bg-white shadow-lg"
          style={{ height: '690px' }}
        >
          <div className="border-b border-gray-100 bg-white px-5 pt-5 pb-4">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-400 shadow-sm">
                    <Headphones
                      size={20}
                      className="text-white"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                </div>
                <div>
                  <h2 className="text-[15px] leading-tight font-bold text-gray-900">
                    {modeTitle}
                  </h2>
                  <p className="mt-0.5 text-[11px] font-medium text-emerald-500">
                    ● 線上服務中
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isSupport ? (
                  <button
                    type="button"
                    onClick={startNewConsultation}
                    className="flex items-center gap-1.5 rounded-full bg-orange-400 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-orange-500"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                    新諮詢
                  </button>
                ) : null}
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
                >
                  <AlertCircle size={12} strokeWidth={2} />
                  {isSupport ? '客服模式' : '即時聊天'}
                </button>
                {isSupport && selectedCaseId ? (
                  <button
                    type="button"
                    onClick={() => void closeCase()}
                    disabled={isClosingCase || isSupportCaseClosed}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSupportCaseClosed
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {isSupportCaseClosed
                      ? '已結案'
                      : isClosingCase
                        ? '結案中...'
                        : '結束諮詢'}
                  </button>
                ) : null}
              </div>
            </div>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium tracking-wide text-gray-400">
              {isSupport
                ? '支援 /api/chat/support/* API'
                : '支援 /api/chat/send API'}
            </span>
            {errorMessage ? (
              <p className="mt-2 text-[12px] text-red-500">{errorMessage}</p>
            ) : null}
            {!isSupport && isMemberCaseClosed ? (
              <p className="mt-2 text-[12px] text-amber-600">
                此諮詢已結案，若要繼續提問請點「新諮詢」。
              </p>
            ) : null}
          </div>

          <div className="relative min-h-0 flex-1 bg-[#fdfaf7]">
            <PawWatermarks />
            <div
              ref={messagesContainerRef}
              className="relative z-10 h-full min-h-0 space-y-4 overflow-y-auto px-5 py-4"
            >
              {isLoadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <span className="loading loading-md loading-spinner text-primary" />
                </div>
              ) : (
                messages.map((msg) =>
                  msg.sender === 'USER' ? (
                    <UserMessage
                      key={msg.id}
                      msg={msg}
                      label={userMessageLabel}
                    />
                  ) : (
                    <AgentMessage key={msg.id} msg={msg} />
                  )
                )
              )}
            </div>
          </div>

          <div className="border-t border-gray-50 bg-white px-5 py-2.5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickReplies.map((quickReply) => (
                <button
                  key={quickReply}
                  onClick={() => void send(quickReply)}
                  className="shrink-0 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-500 transition-colors hover:bg-orange-100"
                >
                  {quickReply}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white px-4 pt-1 pb-4">
            <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2.5 transition-colors focus-within:border-orange-200 focus-within:bg-white">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  const isComposing =
                    event.nativeEvent.isComposing || event.keyCode === 229;
                  if (event.key === 'Enter' && !isComposing) {
                    void send(input);
                  }
                }}
                placeholder={isSupport ? '輸入客服回覆...' : '請輸入訊息...'}
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-300"
              />
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.txt"
                  onChange={(event) => {
                    void onAttachmentInputChange(event);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={
                    isUploading ||
                    isSending ||
                    (isSupport && !selectedCaseId) ||
                    isMemberCaseClosed
                  }
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    isUploading ||
                    isSending ||
                    (isSupport && !selectedCaseId) ||
                    isMemberCaseClosed
                      ? 'border-gray-200 bg-gray-100 text-gray-400'
                      : 'border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100'
                  }`}
                  aria-label="附件"
                >
                  <Paperclip size={16} strokeWidth={2} />
                  <span>{isUploading ? '上傳中...' : '上傳附件'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => void send(input)}
                  aria-label="送出訊息"
                  disabled={
                    (isSupport && !selectedCaseId) || isMemberCaseClosed
                  }
                  className={`flex h-7 w-7 items-center justify-center rounded-xl transition-colors ${
                    input.trim() &&
                    !isSending &&
                    (!isSupport || Boolean(selectedCaseId)) &&
                    !isMemberCaseClosed
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Send size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSupport ? (
          <aside className="h-172.5 overflow-y-auto rounded-3xl border border-[#ece3d9] bg-white p-4 shadow-lg">
            <h3 className="text-[16px] font-bold text-gray-900">
              客服案件列表
            </h3>
            <p className="mt-1 mb-3 text-xs text-gray-500">
              已偵測為客服身份，可查看待處理案件。
            </p>

            {supportCases.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 px-3 py-4 text-sm text-gray-400">
                目前沒有待處理案件。
              </div>
            ) : (
              <div className="space-y-2">
                {supportCases.map((item) => {
                  const active = selectedCaseId === item.caseId;
                  const unreadCount = supportUnreadCounts[item.caseId] || 0;
                  return (
                    <button
                      key={item.caseId}
                      type="button"
                      onClick={() => selectSupportCase(item.caseId)}
                      className={`w-full rounded-2xl border px-3 py-2 text-left transition-colors ${
                        active
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-gray-800">
                          {item.caseId}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            item.status === 'OPEN'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.status}
                        </span>
                        {unreadCount > 0 ? (
                          <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate text-xs text-gray-600">
                        {item.preview || '（無預覽）'}
                      </p>
                      {item.user?.email ? (
                        <p className="mt-1 truncate text-[11px] text-gray-400">
                          {item.user.name || item.user.email}
                        </p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

interface PawPrintSvgProps {
  size?: number;
  className?: string;
}

function PawPrintSvg({ size = 40, className = '' }: PawPrintSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      <ellipse cx="32" cy="44" rx="13" ry="10" />
      <ellipse cx="16" cy="32" rx="6" ry="7.5" transform="rotate(-20 16 32)" />
      <ellipse cx="26" cy="26" rx="5.5" ry="7" transform="rotate(-5 26 26)" />
      <ellipse cx="38" cy="26" rx="5.5" ry="7" transform="rotate(5 38 26)" />
      <ellipse cx="48" cy="32" rx="6" ry="7.5" transform="rotate(20 48 32)" />
    </svg>
  );
}

function PawWatermarks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-orange-200 select-none">
      <PawPrintSvg
        size={96}
        className="absolute right-4 bottom-6 rotate-[-15deg] opacity-40"
      />
      <PawPrintSvg
        size={56}
        className="absolute right-16 bottom-28 rotate-10 opacity-25"
      />
      <PawPrintSvg
        size={40}
        className="absolute top-8 right-8 rotate-25 opacity-20"
      />
      <PawPrintSvg
        size={32}
        className="absolute top-24 left-4 rotate-[-10deg] opacity-15"
      />
    </div>
  );
}

interface ChatMessageProps {
  msg: UIMessage;
}

interface UserMessageProps extends ChatMessageProps {
  label: string;
}

function renderMessageContent(content: string, isUserMessage: boolean) {
  const attachment = parseAttachmentMessage(content);
  if (attachment) {
    const badgeLabel = getFileLabel(attachment.fileName);

    return (
      <div className="space-y-2">
        <div
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isUserMessage
              ? 'bg-white/15 text-white/90'
              : 'bg-orange-100 text-orange-600'
          }`}
        >
          {attachment.isImage ? (
            <ImageIcon size={12} />
          ) : (
            <FileText size={12} />
          )}
          <span>{badgeLabel}</span>
        </div>

        <div
          className={`overflow-hidden rounded-2xl border shadow-sm ${
            isUserMessage
              ? 'border-white/10 bg-white/10'
              : 'border-orange-100 bg-white'
          }`}
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isUserMessage ? 'bg-white/15' : 'bg-orange-50'
              }`}
            >
              {attachment.isImage ? (
                <ImageIcon
                  size={18}
                  className={isUserMessage ? 'text-white' : 'text-orange-500'}
                />
              ) : (
                <FileText
                  size={18}
                  className={isUserMessage ? 'text-white' : 'text-orange-500'}
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div
                className={`truncate text-sm font-medium ${
                  isUserMessage ? 'text-white' : 'text-gray-800'
                }`}
                title={attachment.fileName}
              >
                {attachment.fileName}
              </div>
              <div
                className={`text-xs ${
                  isUserMessage ? 'text-white/70' : 'text-gray-500'
                }`}
              >
                點擊下載或預覽
              </div>
            </div>

            <a
              href={attachment.fileUrl}
              download={attachment.fileName}
              aria-label={`下載 ${attachment.fileName}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                isUserMessage
                  ? 'bg-white/15 text-white hover:bg-white/25'
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              }`}
            >
              <Download size={14} />
            </a>
          </div>

          {attachment.isImage ? (
            <a href={attachment.fileUrl} target="_blank" rel="noreferrer">
              <img
                src={attachment.fileUrl}
                alt={attachment.fileName}
                className="max-h-60 w-full bg-black/5 object-contain"
                loading="lazy"
              />
            </a>
          ) : (
            <div
              className={`flex items-center justify-between border-t px-3 py-2 text-xs ${
                isUserMessage
                  ? 'border-white/10 text-white/75'
                  : 'border-orange-100 text-gray-500'
              }`}
            >
              <span>點擊下載查看內容</span>
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1 font-medium ${
                  isUserMessage
                    ? 'text-white/90'
                    : 'text-orange-600 hover:text-orange-500'
                }`}
              >
                <span>開啟</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  const urlRegex = /(https?:\/\/\S+)/g;
  const segments = content.split(urlRegex);
  if (segments.length === 1) {
    return content;
  }

  return segments.map((segment, index) => {
    if (/^https?:\/\//.test(segment)) {
      return (
        <a
          key={`${segment}-${index}`}
          href={segment}
          target="_blank"
          rel="noreferrer"
          className={`underline underline-offset-2 ${
            isUserMessage
              ? 'text-white/90'
              : 'text-orange-600 hover:text-orange-500'
          }`}
        >
          {segment}
        </a>
      );
    }

    return <span key={`text-${index}`}>{segment}</span>;
  });
}

function AgentMessage({ msg }: ChatMessageProps) {
  const label = msg.sender === 'AGENT' ? '客服人員' : 'AI 客服';

  return (
    <div className="flex items-end gap-2.5">
      <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-orange-100">
        <Headphones size={13} className="text-orange-400" strokeWidth={2} />
      </div>
      <div className="max-w-[78%]">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-600">
            {label}
          </span>
          <span className="text-[10px] text-gray-300">
            {formatMessageTime(msg.createdAt)}
          </span>
        </div>
        <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-[#F4EEE8] px-4 py-2.5 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-gray-700">
          {renderMessageContent(msg.content, false)}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ msg, label }: UserMessageProps) {
  const avatarText = label.length > 2 ? label.slice(0, 2) : label;

  return (
    <div className="flex items-end justify-end gap-2.5">
      <div className="max-w-[68%]">
        <div className="mb-1 flex items-center justify-end gap-2">
          <span className="text-[10px] text-gray-300">
            {formatMessageTime(msg.createdAt)}
          </span>
          <span className="text-[11px] font-semibold text-gray-600">
            {label}
          </span>
        </div>
        <div className="rounded-2xl rounded-br-sm bg-orange-400 px-4 py-2.5 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-white shadow-sm">
          {renderMessageContent(msg.content, true)}
        </div>
      </div>
      <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-orange-400 shadow-sm">
        <span className="text-[10px] font-bold text-white">{avatarText}</span>
      </div>
    </div>
  );
}
