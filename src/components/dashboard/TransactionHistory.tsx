"use client";

import { motion } from "framer-motion";
import { useRNSStore } from "@/stores/rnsStore";
import { HexAddress } from "@/components/ui/HexAddress";

export function TransactionHistory() {
  const transactionHistory = useRNSStore((s) => s.transactionHistory);

  const typeIcons: Record<string, string> = {
    register: "⬡",
    renew: "⟳",
    transfer: "⇄",
    update: "✎",
    deposit: "↓",
    withdraw: "↑",
  };

  const statusStyles: Record<string, { dot: string; text: string }> = {
    pending: { dot: "bg-ritual-gold animate-pulse", text: "text-ritual-gold" },
    settled: { dot: "bg-ritual-green", text: "text-ritual-green" },
    failed: { dot: "bg-red-500", text: "text-red-400" },
  };

  return (
    <div className="card-ritual p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-lg">⏱</span>
          <h3 className="text-gray-100 font-semibold">Transaction History</h3>
        </div>
        <span className="text-xs text-gray-500">
          {transactionHistory.length} transactions
        </span>
      </div>

      {transactionHistory.length === 0 ? (
        <div className="text-center py-6">
          <span className="text-3xl mb-2 block opacity-20">⏱</span>
          <p className="text-sm text-gray-500">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactionHistory.slice(0, 10).map((tx, i) => {
            const style = statusStyles[tx.status];
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-ritual-surface/50 transition-colors"
              >
                <span className="text-gray-500 text-sm">
                  {typeIcons[tx.type] || "·"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300 capitalize font-medium">
                      {tx.type}
                    </span>
                    {tx.name && (
                      <span className="text-xs font-mono text-gray-500">
                        {tx.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <HexAddress address={tx.txHash} className="text-[10px]" />
                    <span className="text-[10px] text-gray-600">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tx.fee && (
                    <span className="text-xs font-mono text-gray-500">
                      {tx.fee} R
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    <span className={`text-[10px] ${style.text}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
