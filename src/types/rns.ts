// ─── RNS Domain Types ────────────────────────────────────────────────────────

export interface NameRecord {
  avatar: string;
  description: string;
  website: string;
  twitter: string;
  github: string;
  discord: string;
  email: string;
}

export interface RNSName {
  name: string;
  owner: `0x${string}`;
  registeredAt: number;
  expiresAt: number;
  records: NameRecord;
  teeVerified: boolean;
  registrationTxHash?: `0x${string}`;
}

export interface TEESession {
  id: string;
  status: "inactive" | "activating" | "active" | "error";
  executorAddress?: `0x${string}`;
  activatedAt?: number;
  lastHealthCheck?: number;
  uptime: number;
  capabilities: number[];
}

export interface LLMValidationResult {
  valid: boolean;
  reason: string;
  suggestions: string[];
  riskLevel: "safe" | "warning" | "danger";
  phishingDetected: boolean;
  impersonationDetected: boolean;
}

export interface StakingInfo {
  balance: bigint;
  balanceFormatted: string;
  lockUntilBlock: bigint;
  isLocked: boolean;
  blocksRemaining: number;
}

export interface TransactionRecord {
  id: string;
  type: "register" | "renew" | "transfer" | "update" | "deposit" | "withdraw";
  name?: string;
  txHash: `0x${string}`;
  status: "pending" | "settled" | "failed";
  timestamp: number;
  precompileType?: string;
  fee?: string;
}

export const DEFAULT_RECORDS: NameRecord = {
  avatar: "",
  description: "",
  website: "",
  twitter: "",
  github: "",
  discord: "",
  email: "",
};
