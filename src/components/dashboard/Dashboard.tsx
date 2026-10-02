"use client";

import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { OwnedDomains } from "./OwnedDomains";
import { TransactionHistory } from "./TransactionHistory";
import { StakingPanel } from "@/components/wallet/StakingPanel";
import { TEESessionCard } from "@/components/tee/TEESessionCard";

export function Dashboard() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-6xl mb-4 block opacity-20">◈</span>
          <h2 className="text-xl font-display text-gray-300 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-sm text-gray-500">
            Connect your wallet to access your RNS dashboard
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StakingPanel />
        <TEESessionCard />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OwnedDomains />
        </div>
        <div>
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}
