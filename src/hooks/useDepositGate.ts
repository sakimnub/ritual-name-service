"use client";

import { useRitualWallet } from "./useRitualWallet";
import { useMemo } from "react";

/**
 * useDepositGate — block operations until RitualWallet has sufficient deposit.
 */
export function useDepositGate(estimatedFeeWei: bigint) {
  const { balance, deposit, isConfirming } = useRitualWallet();

  const hasSufficientDeposit = useMemo(() => {
    if (!balance) return false;
    return balance >= estimatedFeeWei;
  }, [balance, estimatedFeeWei]);

  return {
    hasSufficientDeposit,
    shortfall: balance
      ? estimatedFeeWei > balance
        ? estimatedFeeWei - balance
        : 0n
      : estimatedFeeWei,
    deposit,
    isConfirming,
    message: hasSufficientDeposit
      ? null
      : "Insufficient RitualWallet deposit. Deposit RITUAL before submitting.",
  };
}
