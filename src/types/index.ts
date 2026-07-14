// ── Auth ──────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  userNo: string | null;
  email: string;
  name: string | null;
  nickname: string | null;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  emailVerified: boolean;
  googleLinked: boolean;
  createdAt: Date | string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  nickname: string | null;
  avatar: string | null;
  emailVerified: boolean;
  googleId: string | null;
  createdAt: Date;
  loginAttempts: number;
  lockedUntil: Date | null;
};

// ── Dashboard ─────────────────────────────────────────────────────────────

export type DashboardStats = {
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  favorites: number;
  pets: number;
  coupons: { available: number; used: number; expired: number };
};

// ── Security ──────────────────────────────────────────────────────────────

export type LoginLogEntry = {
  id: string;
  time: string;
  browser: string | null;
  os: string | null;
  device: string | null;
  ip: string | null;
  success: boolean;
};

export type SecurityInfo = {
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  googleLinked: boolean;
  lockedUntil: string | null;
  loginLogs: LoginLogEntry[];
};

// ── Chat ──────────────────────────────────────────────────────────────────

export type ChatMessage = {
  id: string;
  content: string;
  sender: 'USER' | 'BOT' | 'AGENT';
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'FAQ';
  createdAt: string;
};

export type ChatCaseSummary = {
  caseId: string;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
  closedAt: string | null;
  lastMessageAt: string;
  messageCount: number;
  preview: string;
};

// ── API Response ──────────────────────────────────────────────────────────

export type APIResponse<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: unknown };
