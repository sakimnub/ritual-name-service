"use client";

import { motion } from "framer-motion";
import { useRNSStore } from "@/stores/rnsStore";
import { GlowButton } from "@/components/ui/GlowButton";
import { HexAddress } from "@/components/ui/HexAddress";

export function OwnedDomains() {
  const userNames = useRNSStore((s) => s.userNames);
  const renewName = useRNSStore((s) => s.renewName);

  if (userNames.length === 0) {
    return (
      <div className="card-ritual p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-ritual-lime text-lg">⬡</span>
          <h3 className="text-gray-100 font-semibold">My Domains</h3>
        </div>
        <div className="text-center py-8">
          <span className="text-4xl mb-3 block opacity-20">◇</span>
          <p className="text-sm text-gray-500">No domains registered yet</p>
          <p className="text-xs text-gray-600 mt-1">
            Search and register your first .ritual name
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-ritual p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-ritual-lime text-lg">⬡</span>
          <h3 className="text-gray-100 font-semibold">My Domains</h3>
        </div>
        <span className="text-xs text-gray-500">
          {userNames.length} registered
        </span>
      </div>

      <div className="space-y-3">
        {userNames.map((domain, i) => {
          const daysRemaining = Math.floor(
            (domain.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)
          );
          const isExpiringSoon = daysRemaining < 30;

          return (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-ritual-surface rounded-lg p-4 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-100 font-semibold">
                    {domain.name}.ritual
                  </span>
                  {domain.teeVerified && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-ritual-green/10 text-ritual-green border border-ritual-green/20">
                      TEE ✓
                    </span>
                  )}
                </div>
                <GlowButton
                  variant={isExpiringSoon ? "gold" : "ghost"}
                  size="sm"
                  onClick={() => renewName(domain.name, 1)}
                >
                  Renew
                </GlowButton>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-gray-600">Owner: </span>
                  <HexAddress address={domain.owner} />
                </div>
                <div>
                  <span className="text-gray-600">Expires: </span>
                  <span
                    className={`font-mono ${
                      isExpiringSoon ? "text-ritual-gold" : "text-gray-400"
                    }`}
                  >
                    {daysRemaining}d
                  </span>
                </div>
              </div>

              {domain.records.description && (
                <p className="text-xs text-gray-500 mt-2 truncate">
                  {domain.records.description}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
