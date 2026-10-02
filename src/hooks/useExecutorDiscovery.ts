"use client";

import { useReadContract } from "wagmi";
import { SYSTEM_CONTRACTS, Capability } from "@/lib/chain";

const teeServiceRegistryAbi = [
  {
    type: "function",
    name: "getCapabilityIndexStatus",
    inputs: [],
    outputs: [
      { type: "uint256" },
      { type: "uint256" },
      { type: "bool" },
      { type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pickServiceByCapability",
    inputs: [
      { name: "capability", type: "uint8" },
      { name: "checkValidity", type: "bool" },
      { name: "seed", type: "uint256" },
      { name: "maxProbes", type: "uint256" },
    ],
    outputs: [
      { name: "teeAddress", type: "address" },
      { name: "found", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getIndexedServiceCountByCapability",
    inputs: [{ name: "capability", type: "uint8" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
  },
] as const;

/**
 * useExecutorDiscovery — discover a TEE executor with LLM capability
 * from the on-chain TEEServiceRegistry.
 */
export function useExecutorDiscovery(
  capability: number = Capability.LLM
) {
  // Random seed for executor selection
  const seed = BigInt(Math.floor(Math.random() * 1_000_000));

  const { data: indexStatus } = useReadContract({
    address: SYSTEM_CONTRACTS.TEE_SERVICE_REGISTRY,
    abi: teeServiceRegistryAbi,
    functionName: "getCapabilityIndexStatus",
    query: { refetchInterval: 30_000 },
  });

  const isFinalized = indexStatus ? (indexStatus as unknown as unknown[])[3] : false;

  const { data: pickedService, refetch: refetchExecutor } = useReadContract({
    address: SYSTEM_CONTRACTS.TEE_SERVICE_REGISTRY,
    abi: teeServiceRegistryAbi,
    functionName: "pickServiceByCapability",
    args: [capability, true, seed, 10n],
    query: {
      enabled: !!isFinalized,
      refetchInterval: 60_000,
    },
  });

  const { data: executorCount } = useReadContract({
    address: SYSTEM_CONTRACTS.TEE_SERVICE_REGISTRY,
    abi: teeServiceRegistryAbi,
    functionName: "getIndexedServiceCountByCapability",
    args: [capability],
    query: { enabled: !!isFinalized },
  });

  const executorAddress = pickedService
    ? ((pickedService as unknown as unknown[])[0] as `0x${string}`)
    : undefined;
  const found = pickedService
    ? ((pickedService as unknown as unknown[])[1] as boolean)
    : false;

  return {
    executorAddress: found ? executorAddress : undefined,
    found,
    executorCount: executorCount ? Number(executorCount) : 0,
    isIndexFinalized: !!isFinalized,
    refetchExecutor,
  };
}
