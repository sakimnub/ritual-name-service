"use client";

import { useSendTransaction } from "wagmi";
import { encodeFunctionData, type Abi } from "viem";

/**
 * useRitualWrite — bypass broken eth_call simulation for async precompiles.
 *
 * wagmi's writeContractAsync runs simulateContract first, which fails for
 * async precompiles ("call to non-contract address"). Use sendTransaction
 * with encodeFunctionData instead.
 */
export function useRitualWrite() {
  const { sendTransactionAsync, isPending } = useSendTransaction();

  async function write({
    address,
    abi,
    functionName,
    args = [],
    value,
    gas = 300_000n,
    nonce,
  }: {
    address: `0x${string}`;
    abi: Abi;
    functionName: string;
    args?: unknown[];
    value?: bigint;
    gas?: bigint;
    nonce?: number;
  }) {
    const data = encodeFunctionData({ abi, functionName, args });
    return sendTransactionAsync({ to: address, data, value, gas, nonce });
  }

  return { write, isPending };
}
