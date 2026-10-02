"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useRitualWallet } from "@/hooks/useRitualWallet";
import { useRNSStore } from "@/stores/rnsStore";
import { GlowButton } from "@/components/ui/GlowButton";
import { formatRitual } from "@/lib/fees";

export function StakingPanel() {
  const { isConnected } = useAccount();
  const { balance, balanceFormatted, lockUntilBlock, deposit, withdraw, isConfirming } =
    useRitualWallet();
  const addTransaction = useRNSStore((s) => s.addTransaction);

  const [depositAmount, setDepositAmount] = useState("0.1");
  const [lockDuration, setLockDuration] = useState("10000");
  const [showDeposit, setShowDeposit] = useState(false);

  const handleDeposit = async () => {
    try {
      const hash = await deposit(depositAmount, BigInt(lockDuration));
      addTransaction({
        id: `deposit-${Date.now()}`,
        type: "deposit",
        txHash: hash,
        status: "settled",
        timestamp: Date.now(),
        fee: depositAmount,
      });
    } catch (e) {
      console.error("Deposit failed:", e);
    }
  };

  const handleWithdraw = async () => {
    try {
      const hash = await withdraw(balanceFormatted);
      addTransaction({
        id: `withdraw-${Date.now()}`,
        type: "withdraw",
        txHash: hash,
        status: "settled",
        timestamp: Date.now(),
      });
    } catch (e) {
      console.error("Withdraw failed:", e);
    }
  };

  if (!isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-ritual p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src="/ritual-logo.png" alt="Ritual" className="w-5 h-5 rounded-sm object-contain" />
          <h3 className="text-gray-100 font-semibold">Ritual Wallet</h3>
        </div>
        <span className="label-ritual">Staking</span>
      </div>

      {/* Balance Display */}
      <div className="bg-ritual-surface rounded-lg p-4 mb-4">
        <div className="label-ritual mb-1">Deposited Balance</div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono text-ritual-lime font-semibold">
            {balance ? formatRitual(balance) : "0.0000"}
          </span>
          <span className="text-sm text-gray-500">RITUAL</span>
        </div>
        {lockUntilBlock && (
          <div className="mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ritual-gold" />
            <span className="text-xs text-gray-500">
              Locked until block{" "}
              <span className="font-mono text-ritual-gold">
                {lockUntilBlock.toString()}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4">
        <GlowButton
          variant="green"
          size="sm"
          onClick={() => setShowDeposit(!showDeposit)}
          className="flex-1"
        >
          {showDeposit ? "Cancel" : "Deposit"}
        </GlowButton>
        <GlowButton
          variant="ghost"
          size="sm"
          onClick={handleWithdraw}
          disabled={!balance || balance === 0n}
          className="flex-1"
        >
          Withdraw
        </GlowButton>
      </div>

      {/* Deposit Form */}
      {showDeposit && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="space-y-3"
        >
          <div>
            <label className="label-ritual block mb-1">Amount (RITUAL)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="input-ritual w-full font-mono"
              step="0.01"
              min="0.01"
            />
          </div>
          <div>
            <label className="label-ritual block mb-1">
              Lock Duration (blocks)
            </label>
            <div className="flex gap-2">
              {["5000", "10000", "50000"].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setLockDuration(dur)}
                  className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${
                    lockDuration === dur
                      ? "border-ritual-green text-ritual-green bg-ritual-green/10"
                      : "border-gray-700 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  {Number(dur).toLocaleString()}
                </button>
              ))}
            </div>
          </div>
          <GlowButton
            variant="green"
            size="md"
            loading={isConfirming}
            onClick={handleDeposit}
            className="w-full"
          >
            Deposit {depositAmount} RITUAL
          </GlowButton>
        </motion.div>
      )}
    </motion.div>
  );
}
