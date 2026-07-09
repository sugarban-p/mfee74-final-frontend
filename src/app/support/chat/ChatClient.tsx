'use client';

import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'next/navigation';
import { BriefcaseBusiness, Send, User } from 'lucide-react';
import type { ChatMessage } from '@/src/types';
import SupportSwitcher from '@/src/components/support-switcher';

const SANS_TC_BOLD: CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
  fontWeight: 700,
};

const SANS_TC_MEDIUM: CSSProperties = {
  fontFamily: "'Noto Sans TC', 'Noto Sans JP', 'DM Sans', sans-serif",
  fontWeight: 500,
};

const BOT_GREETING = '您好！這是前端示範客服模式，歡迎輸入問題。';

function botReply(text: string) {
  if (text.includes('運費')) return '滿 799 元免運，未滿酌收 80 元運費。';
  if (text.includes('退貨') || text.includes('換貨'))
    return '商品於 7 天內可申請退換貨，請保留完整包裝。';
  if (text.includes('付款')) return '目前支援信用卡、ATM 轉帳與超商取貨付款。';
  return '已收到你的問題，我們會盡快由客服人員協助你。';
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
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = () => {
    const text = input.trim();
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
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1
          className="text-[22px] leading-tight text-base-content"
          style={SANS_TC_BOLD}
        >
          客服中心
        </h1>
        <p
          className="text-[16px] leading-tight text-base-content/60 mt-1"
          style={SANS_TC_MEDIUM}
        >
          諮詢編號：{initialCaseId}（前端示範）
        </p>
      </div>

      <SupportSwitcher />

      <div
        className="card bg-base-100 border border-base-300 rounded-3xl overflow-hidden"
        style={{ height: '690px' }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-base-300 bg-base-100">
          <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center">
            <BriefcaseBusiness size={16} className="text-white" />
          </div>
          <div>
            <div
              className="text-[18px] leading-tight text-base-content"
              style={SANS_TC_BOLD}
            >
              PetFull 客服
            </div>
            <div className="text-[14px] text-green-600" style={SANS_TC_MEDIUM}>
              線上服務中
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'USER' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.sender === 'USER' ? 'bg-primary' : 'bg-base-200'}`}
              >
                {msg.sender === 'USER' ? (
                  <User size={14} className="text-white" />
                ) : (
                  <BriefcaseBusiness size={14} className="text-primary" />
                )}
              </div>
              <p
                className="text-[16px] leading-relaxed text-base-content whitespace-pre-wrap break-words"
                style={SANS_TC_MEDIUM}
              >
                {msg.content}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="px-5 py-4 border-t border-base-300 flex items-center gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') send();
            }}
            placeholder="輸入你的問題..."
            className="input input-bordered rounded-full flex-1"
          />
          <button
            className="btn btn-primary btn-circle"
            onClick={send}
            aria-label="送出"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
