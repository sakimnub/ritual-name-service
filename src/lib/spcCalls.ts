// ─── spcCalls Receipt Parsing ────────────────────────────────────────────────
// Ritual transaction receipts include spcCalls — precompile input/output pairs.

export interface RitualReceipt {
  spcCalls?: Array<{ input: `0x${string}`; output: `0x${string}` }>;
}

export function extractSpcResult(receipt: unknown): `0x${string}` | null {
  const spcCalls = (receipt as RitualReceipt).spcCalls;
  if (!spcCalls || spcCalls.length === 0) return null;
  return spcCalls[0].output;
}

export function hasSpcCalls(receipt: unknown): boolean {
  const spcCalls = (receipt as RitualReceipt).spcCalls;
  return !!spcCalls && spcCalls.length > 0;
}
