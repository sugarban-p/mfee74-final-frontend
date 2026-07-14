'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, Headphones, Paperclip, Plus, Send } from 'lucide-react';

import type { ChatMessage } from '@/src/types';
import SupportSwitcher from '@/src/components/support-switcher';

const QUICK_REPLIES = [
  '運費說明',
  '退換貨政策',
  '付款方式',
  '配送時程',
  '會員優惠',
];

const BOT_GREETING = '您好！這是前端示範客服模式，歡迎輸入問題。';

function botReply(text: string) {
  if (text.includes('運費')) return '滿 799 元免運，未滿酌收 80 元運費。';
  if (text.includes('退貨') || text.includes('換貨'))
    return '商品於 7 天內可申請退換貨，請保留完整包裝。';
  if (text.includes('付款')) return '目前支援信用卡、ATM 轉帳與超商取貨付款。';
  if (text.includes('配送') || text.includes('時程'))
    return '現貨商品約 1-3 個工作天出貨，預購商品依頁面標示為主。';
  if (text.includes('會員'))
    return '會員註冊免費，完成註冊可享點數回饋與不定期專屬折扣。';
  return '已收到你的問題，我們會盡快由客服人員協助你。';
}

function formatMessageTime(isoTime: string) {
  return new Date(isoTime).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function ChatClient() {
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get('q')?.trim() ?? '';
  const initialCaseId = searchParams.get('caseId') ?? 'CASE-DEMO-001';

  const initialMessages = useMemo<ChatMessage[]>(() => {
    const greeting: ChatMessage = {
      id: 'welcome',
      sender: 'BOT',
      type: 'TEXT',
      content: BOT_GREETING,
      createdAt: new Date().toISOString(),
    };

    if (!initialQuestion) return [greeting];

    return [
      greeting,
      {
        id: 'initial-user',
        sender: 'USER',
        type: 'TEXT',
        content: initialQuestion,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'initial-bot',
        sender: 'BOT',
        type: 'TEXT',
        content: botReply(initialQuestion),
        createdAt: new Date().toISOString(),
      },
    ];
  }, [initialQuestion]);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const chatCardRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  const send = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const now = new Date().toISOString();
    const userMessage: ChatMessage = {
      id: `u-${now}`,
      sender: 'USER',
      type: 'TEXT',
      content: text,
      createdAt: now,
    };
    const replyMessage: ChatMessage = {
      id: `b-${now}`,
      sender: 'BOT',
      type: 'TEXT',
      content: botReply(text),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage, replyMessage]);
    setInput('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] leading-tight text-base-content font-bold">
          客服中心
        </h1>
        <p className="text-[16px] leading-tight text-base-content/60 mt-1">
          諮詢編號：{initialCaseId}（前端示範）
        </p>
      </div>

      <SupportSwitcher />

      <div
        ref={chatCardRef}
        className="bg-white rounded-3xl border border-[#ece3d9] shadow-lg overflow-hidden flex flex-col max-w-5xl"
        style={{ height: '690px' }}
      >
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-white">
          <div className="flex items-start justify-between mb-3 gap-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-orange-400 flex items-center justify-center shadow-sm">
                  <Headphones
                    size={20}
                    className="text-white"
                    strokeWidth={2}
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900 leading-tight">
                  MOFU AI 客服
                </h2>
                <p className="text-[11px] text-emerald-500 font-medium mt-0.5">
                  ● 線上服務中
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 bg-orange-400 hover:bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors shadow-sm">
                <Plus size={12} strokeWidth={2.5} />
                新問題
              </button>
              <button className="flex items-center gap-1.5 border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
                <AlertCircle size={12} strokeWidth={2} />
                未解決
              </button>
            </div>
          </div>

          <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium tracking-wide">
            FAQ + AI 混合回覆
          </span>
        </div>

        <div className="relative flex-1 min-h-0 bg-[#fdfaf7]">
          <PawWatermarks />
          <div
            ref={messagesContainerRef}
            className="relative z-10 h-full min-h-0 overflow-y-auto px-5 py-4 space-y-4"
          >
            {messages.map((msg) =>
              msg.sender === 'USER' ? (
                <UserMessage key={msg.id} msg={msg} />
              ) : (
                <AiMessage key={msg.id} msg={msg} />
              )
            )}
          </div>
        </div>

        <div className="px-5 py-2.5 border-t border-gray-50 bg-white">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_REPLIES.map((quickReply) => (
              <button
                key={quickReply}
                onClick={() => send(quickReply)}
                className="shrink-0 text-xs text-orange-500 border border-orange-200 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full font-medium transition-colors"
              >
                {quickReply}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4 pt-1 bg-white">
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100 focus-within:border-orange-200 focus-within:bg-white transition-colors">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') send(input);
              }}
              placeholder="請輸入訊息..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-300 outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-gray-300 hover:text-gray-400 transition-colors"
                aria-label="附件"
              >
                <Paperclip size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => send(input)}
                aria-label="送出訊息"
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  input.trim()
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
    <div className="pointer-events-none select-none absolute inset-0 overflow-hidden text-orange-200">
      <PawPrintSvg
        size={96}
        className="absolute bottom-6 right-4 opacity-40 rotate-[-15deg]"
      />
      <PawPrintSvg
        size={56}
        className="absolute bottom-28 right-16 opacity-25 rotate-10"
      />
      <PawPrintSvg
        size={40}
        className="absolute top-8 right-8 opacity-20 rotate-25"
      />
      <PawPrintSvg
        size={32}
        className="absolute top-24 left-4 opacity-15 rotate-[-10deg]"
      />
    </div>
  );
}

interface ChatMessageProps {
  msg: ChatMessage;
}

function AiMessage({ msg }: ChatMessageProps) {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 mb-0.5">
        <Headphones size={13} className="text-orange-400" strokeWidth={2} />
      </div>
      <div className="max-w-[78%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-gray-600">
            AI 客服
          </span>
          <span className="text-[10px] text-gray-300">
            {formatMessageTime(msg.createdAt)}
          </span>
        </div>
        <div className="bg-[#F4EEE8] border border-gray-100 text-gray-700 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
          {msg.content}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ msg }: ChatMessageProps) {
  return (
    <div className="flex items-end gap-2.5 justify-end">
      <div className="max-w-[68%]">
        <div className="flex items-center justify-end gap-2 mb-1">
          <span className="text-[10px] text-gray-300">
            {formatMessageTime(msg.createdAt)}
          </span>
          <span className="text-[11px] font-semibold text-gray-600">我</span>
        </div>
        <div className="bg-orange-400 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm leading-relaxed shadow-sm whitespace-pre-wrap wrap-break-word">
          {msg.content}
        </div>
      </div>
      <div className="w-7 h-7 rounded-xl bg-orange-400 flex items-center justify-center shrink-0 mb-0.5 shadow-sm">
        <span className="text-white text-[10px] font-bold">我</span>
      </div>
    </div>
  );
}
