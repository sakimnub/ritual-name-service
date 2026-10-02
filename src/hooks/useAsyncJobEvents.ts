"use client";

import { useWatchContractEvent, useAccount } from "wagmi";
import { useAsyncTxStore } from "@/stores/asyncTxStore";
import { SYSTEM_CONTRACTS } from "@/lib/chain";

const asyncJobTrackerAbi = [
  {
    type: "event",
    name: "JobAdded",
    inputs: [
      { name: "executor", type: "address", indexed: true },
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "precompileAddress", type: "address", indexed: true },
      { name: "commitBlock", type: "uint256", indexed: false },
      { name: "precompileInput", type: "bytes", indexed: false },
      { name: "senderAddress", type: "address", indexed: false },
      { name: "previousBlockHash", type: "bytes32", indexed: false },
      { name: "previousBlockNumber", type: "uint256", indexed: false },
      { name: "previousBlockTimestamp", type: "uint256", indexed: false },
      { name: "ttl", type: "uint256", indexed: false },
      { name: "createdAt", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Phase1Settled",
    inputs: [
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "executor", type: "address", indexed: true },
      { name: "settledBlock", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ResultDelivered",
    inputs: [
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "target", type: "address", indexed: true },
      { name: "success", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "JobRemoved",
    inputs: [
      { name: "executor", type: "address", indexed: true },
      { name: "jobId", type: "bytes32", indexed: true },
      { name: "completed", type: "bool", indexed: true },
    ],
  },
] as const;

/**
 * useAsyncJobEvents — watch AsyncJobTracker events to track
 * the 9-state lifecycle of a Ritual async transaction.
 */
export function useAsyncJobEvents({
  txId,
  enabled = true,
}: {
  txId: string;
  enabled?: boolean;
}) {
  const { address } = useAccount();
  const updateState = useAsyncTxStore((s) => s.updateState);
  const getTransaction = useAsyncTxStore((s) => s.getTransaction);

  useWatchContractEvent({
    address: SYSTEM_CONTRACTS.ASYNC_JOB_TRACKER,
    abi: asyncJobTrackerAbi,
    eventName: "JobAdded",
    enabled: enabled && !!address,
    onLogs: (logs) => {
      for (const log of logs) {
        const args = log.args as Record<string, unknown>;
        if (
          (args.senderAddress as string)?.toLowerCase() !==
          address?.toLowerCase()
        )
          continue;
        const tx = getTransaction(txId);
        if (!tx || tx.state.status !== "PENDING_COMMITMENT") continue;
        updateState(txId, {
          status: "COMMITTED",
          txHash: tx.state.txHash,
          jobId: args.jobId as `0x${string}`,
          executor: args.executor as `0x${string}`,
          committedBlock: Number(args.commitBlock),
        });
      }
    },
  });

  useWatchContractEvent({
    address: SYSTEM_CONTRACTS.ASYNC_JOB_TRACKER,
    abi: asyncJobTrackerAbi,
    eventName: "JobRemoved",
    enabled: enabled && !!address,
    onLogs: (logs) => {
      for (const log of logs) {
        const args = log.args as Record<string, unknown>;
        const tx = getTransaction(txId);
        if (!tx) continue;
        const completed = args.completed as boolean;
        if (completed) {
          const txHash = ("txHash" in tx.state ? tx.state.txHash : undefined) ?? ("0x" as `0x${string}`);
          updateState(txId, {
            status: "SETTLED",
            txHash,
            jobId: args.jobId as `0x${string}`,
            result: null,
            settlementTxHash: log.transactionHash || ("0x" as `0x${string}`),
            settledBlock: Number(log.blockNumber),
            gasUsed: 0n,
          });
        }
      }
    },
  });
}
