"use client";

import { useAccount, useReadContract } from "wagmi";
import { SYSTEM_CONTRACTS } from "@/lib/chain";

const asyncJobTrackerAbi = [
  {
    type: "function",
    name: "hasPendingJobForSender",
    inputs: [{ name: "sender", type: "address" }],
    outputs: [{ type: "bool" }],
    stateMutability: "view",
  },
] as const;

/**
 * useSenderLock — check if the connected wallet has a pending async job.
 * The Ritual chain rejects new async submissions when the sender already
 * has a pending job (one-async-per-EOA constraint).
 */
export function useSenderLock() {
  const { address } = useAccount();

  const { data: isLocked, refetch } = useReadContract({
    address: SYSTEM_CONTRACTS.ASYNC_JOB_TRACKER,
    abi: asyncJobTrackerAbi,
    functionName: "hasPendingJobForSender",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 5_000 },
  });

  return {
    isLocked: isLocked ?? false,
    refetch,
    message: isLocked
      ? "You have a pending async job — wait for settlement before submitting another."
      : null,
  };
}
