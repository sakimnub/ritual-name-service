"use client";

import { useBlockNumber } from "wagmi";
import { ritualChain } from "@/lib/chain";

export function Footer() {
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    query: { refetchInterval: 4_000 },
  });

  return (
    <footer className="border-t border-gray-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left — branding */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-ritual-green/20 border border-ritual-green/30 flex items-center justify-center">
              <span className="text-ritual-green text-xs font-bold">R</span>
            </div>
            <span className="text-sm text-gray-500">
              Ritual Name Service — Decentralized Identity on Ritual Chain
            </span>
          </div>

          {/* Center — links */}
          <div className="flex items-center gap-4">
            <a
              href="https://ritual.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-ritual-green transition-colors"
            >
              Ritual Protocol
            </a>
            <a
              href={`https://explorer.ritualfoundation.org`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-ritual-green transition-colors"
            >
              Explorer
            </a>
            <a
              href="https://docs.ritual.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-ritual-green transition-colors"
            >
              Docs
            </a>
          </div>

          {/* Right — chain status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-ritual-elevated border border-gray-800">
              <span className="w-1.5 h-1.5 rounded-full bg-ritual-green animate-pulse" />
              <span className="text-xs font-mono text-gray-500">
                {ritualChain.name} #{ritualChain.id}
              </span>
            </div>
            {blockNumber && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-ritual-elevated border border-gray-800">
                <span className="text-xs text-gray-500">Block</span>
                <span className="text-xs font-mono text-ritual-lime">
                  {blockNumber.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
