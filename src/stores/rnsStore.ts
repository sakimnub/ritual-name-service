import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  RNSName,
  TEESession,
  TransactionRecord,
  LLMValidationResult,
  NameRecord,
} from "@/types/rns";
import { DEFAULT_RECORDS } from "@/types/rns";

// ─── Simulated Registry ─────────────────────────────────────────────────────
// Pre-populated names for demonstration. In production, this would be on-chain.

const DEMO_NAMES: RNSName[] = [
  {
    name: "ritual",
    owner: "0x0000000000000000000000000000000000000001",
    registeredAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    expiresAt: Date.now() + 275 * 24 * 60 * 60 * 1000,
    records: { ...DEFAULT_RECORDS, description: "Official Ritual Protocol" },
    teeVerified: true,
  },
  {
    name: "vitalik",
    owner: "0x0000000000000000000000000000000000000002",
    registeredAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    expiresAt: Date.now() + 305 * 24 * 60 * 60 * 1000,
    records: { ...DEFAULT_RECORDS },
    teeVerified: true,
  },
  {
    name: "ethereum",
    owner: "0x0000000000000000000000000000000000000003",
    registeredAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    expiresAt: Date.now() + 245 * 24 * 60 * 60 * 1000,
    records: { ...DEFAULT_RECORDS },
    teeVerified: true,
  },
];

// ─── Store Interface ─────────────────────────────────────────────────────────

interface RNSStore {
  // Registry
  registry: Record<string, RNSName>;
  searchQuery: string;
  searchResults: { available: boolean; name: string } | null;
  validationResult: LLMValidationResult | null;
  validationLoading: boolean;

  // User's names
  userNames: RNSName[];

  // TEE Session
  teeSession: TEESession;

  // Transaction history
  transactionHistory: TransactionRecord[];

  // Actions
  setSearchQuery: (query: string) => void;
  checkAvailability: (name: string) => { available: boolean; name: string };
  setValidationResult: (result: LLMValidationResult | null) => void;
  setValidationLoading: (loading: boolean) => void;
  registerName: (
    name: string,
    owner: `0x${string}`,
    durationYears: number,
    records?: Partial<NameRecord>,
    txHash?: `0x${string}`
  ) => void;
  renewName: (name: string, additionalYears: number) => void;
  transferName: (name: string, newOwner: `0x${string}`) => void;
  updateRecords: (name: string, records: Partial<NameRecord>) => void;
  getUserNames: (owner: `0x${string}`) => RNSName[];

  // TEE Session
  setTEESession: (session: Partial<TEESession>) => void;
  activateTEESession: (executorAddress: `0x${string}`) => void;
  deactivateTEESession: () => void;

  // Transaction history
  addTransaction: (tx: TransactionRecord) => void;
}

export const useRNSStore = create<RNSStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ────────────────────────────────────────────────────
      registry: Object.fromEntries(DEMO_NAMES.map((n) => [n.name, n])),
      searchQuery: "",
      searchResults: null,
      validationResult: null,
      validationLoading: false,
      userNames: [],
      teeSession: {
        id: "",
        status: "inactive",
        uptime: 0,
        capabilities: [],
      },
      transactionHistory: [],

      // ── Search ────────────────────────────────────────────────────────────
      setSearchQuery: (query) => set({ searchQuery: query }),

      checkAvailability: (name) => {
        const normalized = name.toLowerCase().replace(/\.ritual$/, "").trim();
        const available = !get().registry[normalized];
        const result = { available, name: normalized };
        set({ searchResults: result });
        return result;
      },

      setValidationResult: (result) => set({ validationResult: result }),
      setValidationLoading: (loading) => set({ validationLoading: loading }),

      // ── Registration ──────────────────────────────────────────────────────
      registerName: (name, owner, durationYears, records, txHash) => {
        const normalized = name.toLowerCase().replace(/\.ritual$/, "").trim();
        const newName: RNSName = {
          name: normalized,
          owner,
          registeredAt: Date.now(),
          expiresAt:
            Date.now() + durationYears * 365 * 24 * 60 * 60 * 1000,
          records: { ...DEFAULT_RECORDS, ...records },
          teeVerified: true,
          registrationTxHash: txHash,
        };
        set((s) => ({
          registry: { ...s.registry, [normalized]: newName },
          userNames: [...s.userNames, newName],
          searchResults: { available: false, name: normalized },
        }));
      },

      renewName: (name, additionalYears) => {
        const normalized = name.toLowerCase();
        set((s) => {
          const existing = s.registry[normalized];
          if (!existing) return s;
          const updated = {
            ...existing,
            expiresAt:
              existing.expiresAt +
              additionalYears * 365 * 24 * 60 * 60 * 1000,
          };
          return {
            registry: { ...s.registry, [normalized]: updated },
            userNames: s.userNames.map((n) =>
              n.name === normalized ? updated : n
            ),
          };
        });
      },

      transferName: (name, newOwner) => {
        const normalized = name.toLowerCase();
        set((s) => {
          const existing = s.registry[normalized];
          if (!existing) return s;
          const updated = { ...existing, owner: newOwner };
          return {
            registry: { ...s.registry, [normalized]: updated },
            userNames: s.userNames.filter((n) => n.name !== normalized),
          };
        });
      },

      updateRecords: (name, records) => {
        const normalized = name.toLowerCase();
        set((s) => {
          const existing = s.registry[normalized];
          if (!existing) return s;
          const updated = {
            ...existing,
            records: { ...existing.records, ...records },
          };
          return {
            registry: { ...s.registry, [normalized]: updated },
            userNames: s.userNames.map((n) =>
              n.name === normalized ? updated : n
            ),
          };
        });
      },

      getUserNames: (owner) => {
        return Object.values(get().registry).filter(
          (n) => n.owner.toLowerCase() === owner.toLowerCase()
        );
      },

      // ── TEE Session ───────────────────────────────────────────────────────
      setTEESession: (session) =>
        set((s) => ({
          teeSession: { ...s.teeSession, ...session },
        })),

      activateTEESession: (executorAddress) =>
        set((s) => ({
          teeSession: {
            ...s.teeSession,
            id: `tee-${Date.now()}`,
            status: "active",
            executorAddress,
            activatedAt: Date.now(),
            lastHealthCheck: Date.now(),
            uptime: 0,
            capabilities: [0, 1, 3],
          },
        })),

      deactivateTEESession: () =>
        set((s) => ({
          teeSession: {
            ...s.teeSession,
            status: "inactive",
            uptime: s.teeSession.activatedAt
              ? Date.now() - s.teeSession.activatedAt
              : 0,
          },
        })),

      // ── Transaction History ────────────────────────────────────────────────
      addTransaction: (tx) =>
        set((s) => ({
          transactionHistory: [tx, ...s.transactionHistory].slice(0, 50),
        })),
    }),
    { name: "ritual-rns-store" }
  )
);
