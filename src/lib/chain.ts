import { defineChain } from "viem";

// ─── Ritual Chain Definition ─────────────────────────────────────────────────
export const ritualChain = defineChain({
  id: 1979,
  name: "Ritual",
  nativeCurrency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc.ritualfoundation.org",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Ritual Explorer",
      url: "https://explorer.ritualfoundation.org",
    },
  },
});

// ─── Precompile Addresses ────────────────────────────────────────────────────
export const PRECOMPILES = {
  HTTP_CALL: "0x0000000000000000000000000000000000000801" as const,
  LLM: "0x0000000000000000000000000000000000000802" as const,
  LONG_RUNNING_HTTP: "0x0000000000000000000000000000000000000805" as const,
  ZK_TWO_PHASE: "0x0000000000000000000000000000000000000806" as const,
  SOVEREIGN_AGENT: "0x000000000000000000000000000000000000080C" as const,
  IMAGE_CALL: "0x0000000000000000000000000000000000000818" as const,
  AUDIO_CALL: "0x0000000000000000000000000000000000000819" as const,
  VIDEO_CALL: "0x000000000000000000000000000000000000081A" as const,
} as const;

// ─── System Contract Addresses ───────────────────────────────────────────────
export const SYSTEM_CONTRACTS = {
  RITUAL_WALLET: "0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948" as const,
  ASYNC_JOB_TRACKER: "0xC069FFCa0389f44eCA2C626e55491b0ab045AEF5" as const,
  ASYNC_DELIVERY: "0x5A16214fF555848411544b005f7Ac063742f39F6" as const,
  TEE_SERVICE_REGISTRY:
    "0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F" as const,
  SCHEDULER: "0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B" as const,
  SECRETS_ACCESS_CTRL:
    "0xf9BF1BC8A3e79B9EBeD0fa2Db70D0513fecE32FD" as const,
  MODEL_PRICING: "0x7A85F48b971ceBb75491b61abe279728F4c4384f" as const,
} as const;

// ─── Capability Enum ─────────────────────────────────────────────────────────
export const Capability = {
  HTTP_CALL: 0,
  LLM: 1,
  STREAMING: 3,
  IMAGE_CALL: 7,
  AUDIO_CALL: 8,
  VIDEO_CALL: 9,
} as const;
