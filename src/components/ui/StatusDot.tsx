"use client";

import type { AsyncTxStatus } from "@/types/asyncTx";

interface StatusDotProps {
  status: AsyncTxStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorMap: Record<string, string> = {
  gray: "bg-gray-500",
  gold: "bg-ritual-gold",
  green: "bg-ritual-green",
  red: "bg-red-500",
};

const statusToColor: Record<AsyncTxStatus, string> = {
  SUBMITTING: "gray",
  PENDING_COMMITMENT: "gold",
  COMMITTED: "gold",
  EXECUTOR_PROCESSING: "green",
  RESULT_READY: "green",
  PENDING_SETTLEMENT: "gold",
  SETTLED: "green",
  FAILED: "red",
  EXPIRED: "gray",
};

const pulseStatuses: AsyncTxStatus[] = [
  "SUBMITTING",
  "PENDING_COMMITMENT",
  "EXECUTOR_PROCESSING",
];

const sizeMap = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export function StatusDot({
  status,
  size = "md",
  className = "",
}: StatusDotProps) {
  const color = statusToColor[status];
  const isPulsing = pulseStatuses.includes(status);

  return (
    <span className={`relative inline-flex ${className}`}>
      {isPulsing && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${colorMap[color]} opacity-40 animate-ping`}
        />
      )}
      <span
        className={`relative inline-flex rounded-full ${sizeMap[size]} ${colorMap[color]}`}
      />
    </span>
  );
}
