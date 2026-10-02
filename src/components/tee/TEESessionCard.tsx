"use client";

import { motion } from "framer-motion";
import { useRNSStore } from "@/stores/rnsStore";
import { useExecutorDiscovery } from "@/hooks/useExecutorDiscovery";
import { HexAddress } from "@/components/ui/HexAddress";
import { GlowButton } from "@/components/ui/GlowButton";
import { Capability } from "@/lib/chain";
import { useEffect, useState } from "react";

export function TEESessionCard() {
  const teeSession = useRNSStore((s) => s.teeSession);
  const activateTEESession = useRNSStore((s) => s.activateTEESession);
  const deactivateTEESession = useRNSStore((s) => s.deactivateTEESession);
  const { executorAddress, found, executorCount } = useExecutorDiscovery(
    Capability.LLM
  );

  const [uptime, setUptime] = useState("00:00:00");

  // Update uptime counter
  useEffect(() => {
    if (teeSession.status !== "active" || !teeSession.activatedAt) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - teeSession.activatedAt!) / 1000
      );
      const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [teeSession.status, teeSession.activatedAt]);

  const statusColors = {
    inactive: "text-gray-500",
    activating: "text-ritual-gold",
    active: "text-ritual-green",
    error: "text-red-400",
  };

  const statusDots = {
    inactive: "bg-gray-500",
    activating: "bg-ritual-gold animate-pulse",
    active: "bg-ritual-green animate-pulse",
    error: "bg-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-ritual p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-ritual-green text-lg">▣</span>
          <h3 className="text-gray-100 font-semibold">TEE Session</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusDots[teeSession.status]}`} />
          <span className={`text-xs font-medium ${statusColors[teeSession.status]}`}>
            {teeSession.status.charAt(0).toUpperCase() + teeSession.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Session Info */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="label-ritual">Executor</span>
          {teeSession.executorAddress ? (
            <HexAddress address={teeSession.executorAddress} />
          ) : (
            <span className="text-xs text-gray-600">Not assigned</span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="label-ritual">Available Executors</span>
          <span className="text-sm font-mono text-gray-400">
            {executorCount}
          </span>
        </div>
        {teeSession.status === "active" && (
          <>
            <div className="flex justify-between items-center">
              <span className="label-ritual">Uptime</span>
              <span className="text-sm font-mono text-ritual-lime">{uptime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="label-ritual">Capabilities</span>
              <div className="flex gap-1">
                {["HTTP", "LLM", "SSE"].map((cap) => (
                  <span
                    key={cap}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-ritual-green/10 text-ritual-green border border-ritual-green/20"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* TEE Verified Badge */}
      {teeSession.status === "active" && (
        <div className="bg-ritual-green/10 border border-ritual-green/20 rounded-lg p-3 mb-4 flex items-center gap-2">
          <span className="text-ritual-green">◇</span>
          <span className="text-xs text-ritual-green font-medium">
            TEE Verified — Confidential computation active
          </span>
        </div>
      )}

      {/* Action */}
      {teeSession.status === "inactive" ? (
        <GlowButton
          variant="green"
          size="md"
          className="w-full"
          disabled={!found}
          onClick={() => {
            if (executorAddress) {
              activateTEESession(executorAddress);
            }
          }}
        >
          {found ? "Activate TEE Session" : "No Executors Available"}
        </GlowButton>
      ) : teeSession.status === "active" ? (
        <GlowButton
          variant="danger"
          size="sm"
          className="w-full"
          onClick={deactivateTEESession}
        >
          Terminate Session
        </GlowButton>
      ) : null}
    </motion.div>
  );
}
