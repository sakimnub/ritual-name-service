import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AsyncTxState, AsyncTxStatus } from "@/types/asyncTx";
import { isTerminalState } from "@/types/asyncTx";

interface TrackedTransaction {
  id: string;
  precompileType:
    | "http"
    | "llm"
    | "agent"
    | "longhttp"
    | "image"
    | "audio"
    | "video"
    | "registration";
  state: AsyncTxState;
  createdAt: number;
  updatedAt: number;
  label?: string;
}

interface AsyncTxStore {
  transactions: Record<string, TrackedTransaction>;
  addTransaction: (
    id: string,
    precompileType: TrackedTransaction["precompileType"],
    label?: string
  ) => void;
  updateState: (id: string, newState: AsyncTxState) => void;
  getTransaction: (id: string) => TrackedTransaction | undefined;
  getActiveTransactions: () => TrackedTransaction[];
  getAllTransactions: () => TrackedTransaction[];
  clearSettled: () => void;
}

export const useAsyncTxStore = create<AsyncTxStore>()(
  persist(
    (set, get) => ({
      transactions: {},

      addTransaction: (id, precompileType, label) =>
        set((s) => ({
          transactions: {
            ...s.transactions,
            [id]: {
              id,
              precompileType,
              state: { status: "SUBMITTING" } as const,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              label,
            },
          },
        })),

      updateState: (id, newState) =>
        set((s) => {
          const existing = s.transactions[id];
          if (!existing) return s;
          return {
            transactions: {
              ...s.transactions,
              [id]: {
                ...existing,
                state: newState,
                updatedAt: Date.now(),
              },
            },
          };
        }),

      getTransaction: (id) => get().transactions[id],

      getActiveTransactions: () =>
        Object.values(get().transactions).filter(
          (tx) => !isTerminalState(tx.state.status)
        ),

      getAllTransactions: () =>
        Object.values(get().transactions).sort(
          (a, b) => b.createdAt - a.createdAt
        ),

      clearSettled: () =>
        set((s) => ({
          transactions: Object.fromEntries(
            Object.entries(s.transactions).filter(
              ([, tx]) => !isTerminalState(tx.state.status)
            )
          ),
        })),
    }),
    { name: "ritual-rns-async-tx" }
  )
);
