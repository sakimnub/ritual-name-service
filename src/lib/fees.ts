// ─── Fee Constants (verified from chain) ─────────────────────────────────────

export const HTTP_FEE_CONSTANTS = {
  BASE_FEE_WEI: 2_500_000_000_000n,
  PER_INPUT_BYTE_WEI: 350_000_000n,
  PER_OUTPUT_BYTE_WEI: 350_000_000n,
  DEFAULT_LOCK_DURATION: 5000n,
} as const;

// ─── HTTP Fee Estimation ─────────────────────────────────────────────────────

export function estimateHTTPFee(
  estimatedInputBytes = 256,
  estimatedOutputBytes = 4096
) {
  const baseFee = HTTP_FEE_CONSTANTS.BASE_FEE_WEI;
  const inputFee =
    BigInt(estimatedInputBytes) * HTTP_FEE_CONSTANTS.PER_INPUT_BYTE_WEI;
  const outputFee =
    BigInt(estimatedOutputBytes) * HTTP_FEE_CONSTANTS.PER_OUTPUT_BYTE_WEI;
  const totalFee = baseFee + inputFee + outputFee;
  return {
    baseFee,
    inputFee,
    outputFee,
    totalFee,
    lockDuration: HTTP_FEE_CONSTANTS.DEFAULT_LOCK_DURATION,
    depositRecommendation: totalFee * 2n,
  };
}

// ─── LLM Fee Estimation ─────────────────────────────────────────────────────
// LLM fees use a gas-based model. Conservative estimate for deposit sizing.

export function estimateLLMFee() {
  // Conservative: 0.05 RITUAL covers most single GLM-4.7-FP8 calls
  const estimatedFee = 50_000_000_000_000_000n; // 0.05 RITUAL
  return {
    estimatedFee,
    lockDuration: 10_000n,
    depositRecommendation: 100_000_000_000_000_000n, // 0.1 RITUAL
  };
}

// ─── Name Registration Fee ───────────────────────────────────────────────────
// Combines LLM validation + registration precompile cost

export function estimateRegistrationFee(durationYears: number) {
  const llmFee = estimateLLMFee();
  const baseCost = 10_000_000_000_000_000n; // 0.01 RITUAL base
  const yearlyRate = 5_000_000_000_000_000n; // 0.005 RITUAL per year
  const registrationFee = baseCost + yearlyRate * BigInt(durationYears);
  const totalFee = llmFee.estimatedFee + registrationFee;
  return {
    llmValidationFee: llmFee.estimatedFee,
    registrationFee,
    totalFee,
    depositRecommendation: totalFee * 2n,
  };
}

// ─── Format Helpers ──────────────────────────────────────────────────────────

export function formatRitual(wei: bigint, decimals = 4): string {
  const value = Number(wei) / 1e18;
  return value.toFixed(decimals);
}

export function parseRitual(amount: string): bigint {
  const [whole, fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(18, "0").slice(0, 18);
  return BigInt(whole + paddedFraction);
}
