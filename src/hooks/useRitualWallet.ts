"use client";

import { useAccount, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useRitualWrite } from "./useRitualWrite";
import { useState, useCallback } from "react";
import { SYSTEM_CONTRACTS } from "@/lib/chain";

const ritualWalletAbi = [
  {
    name: "deposit",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "lockDuration", type: "uint256" }],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "lockUntil",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

export function useRitualWallet() {
  const { address } = useAccount();
  const { write } = useRitualWrite();

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: SYSTEM_CONTRACTS.RITUAL_WALLET,
    abi: ritualWalletAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 12_000 },
  });

  const { data: lockUntilBlock } = useReadContract({
    address: SYSTEM_CONTRACTS.RITUAL_WALLET,
    abi: ritualWalletAbi,
    functionName: "lockUntil",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const [pendingTxHash, setPendingTxHash] = useState<
    `0x${string}` | undefined
  >();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: pendingTxHash,
    query: { enabled: !!pendingTxHash },
  });

  const deposit = useCallback(
    async (amountEther: string, lockDurationBlocks: bigint = 5000n) => {
      const hash = await write({
        address: SYSTEM_CONTRACTS.RITUAL_WALLET,
        abi: ritualWalletAbi,
        functionName: "deposit",
        args: [lockDurationBlocks],
        value: parseEther(amountEther),
      });
      setPendingTxHash(hash);
      return hash;
    },
    [write]
  );

  const withdraw = useCallback(
    async (amountEther: string) => {
      const hash = await write({
        address: SYSTEM_CONTRACTS.RITUAL_WALLET,
        abi: ritualWalletAbi,
        functionName: "withdraw",
        args: [parseEther(amountEther)],
      });
      setPendingTxHash(hash);
      return hash;
    },
    [write]
  );

  return {
    balance,
    balanceFormatted: balance ? formatEther(balance) : "0",
    lockUntilBlock,
    deposit,
    withdraw,
    isConfirming,
    refetchBalance,
  };
}
