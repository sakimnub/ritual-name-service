"use client";

import { motion } from "framer-motion";
import type { AsyncTxState, AsyncTxStatus } from "@/types/asyncTx";
import { STATUS_CONFIG } from "@/types/asyncTx";
import { StatusDot } from "@/components/ui/StatusDot";
import { HexAddress } from "@/components/ui/HexAddress";

interface AsyncTransactionStatusProps {
  state: AsyncTxState;
  compact?: boolean;
}

const STEPS: AsyncTxStatus[] = [
  "SUBMITTING",
  "PENDING_COMMITMENT",
  "COMMITTED",
  "EXECUTOR_PROCESSING",
  "RESULT_READY",
  "PENDING_SETTLEMENT",
  "SETTLED",
];

export function AsyncTransactionStatus({
  state,
  compact = false,
}: AsyncTransactionStatusProps) {
  const config = STATUS_CONFIG[state.status];
  const currentIndex = STEPS.indexOf(state.status);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <StatusDot status={state.status} size="sm" />
        <span className={`text-xs ${getTextColor(config.color)}`}>
          {config.label}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-ritual p-4"
    >
      {/* Step Progress */}
      <div className="flex items-center gap-1 mb-4">
        {STEPS.map((step, i) => {
          const isActive = i === currentIndex;
          const isComplete = i < currentIndex;
          const isFailed =
            state.status === "FAILED" || state.status === "EXPIRED";

          return (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-full h-1 rounded-full transition-all ${
                  isComplete
                    ? "bg-ritual-green"
                    : isActive
                    ? isFailed
                      ? "bg-red-500"
                      : "bg-ritual-gold"
                    : "bg-gray-800"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Current Status */}
      <div className="flex items-center gap-3">
        <StatusDot status={state.status} size="lg" />
        <div>
          <span
            className={`text-sm font-semibold ${getTextColor(config.color)}`}
          >
            {config.icon} {config.label}
          </span>
          {"txHash" in state && state.txHash && (
            <div className="mt-0.5">
              <HexAddress address={state.txHash} className="text-[10px]" />
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {state.status === "FAILED" && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <div className="text-xs text-red-400">
            <span className="font-semibold">Error:</span>{" "}
            {state.error}
          </div>
          <div className="text-[10px] text-gray-600 mt-1">
            Category: {state.errorCategory} | Failed at: {state.failedAt}
          </div>
        </div>
      )}

      {/* Job ID */}
      {"jobId" in state && state.jobId && (
        <div className="mt-2 flex items-center gap-2">
          <span className="label-ritual">Job ID</span>
          <HexAddress address={state.jobId} className="text-[10px]" />
        </div>
      )}
    </motion.div>
  );
}

function getTextColor(color: string): string {
  switch (color) {
    case "green":
      return "text-ritual-green";
    case "gold":
      return "text-ritual-gold";
    case "red":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}
