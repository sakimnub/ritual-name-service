"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { ritualChain } from "@/lib/chain";
import { HexAddress } from "@/components/ui/HexAddress";
import { GlowButton } from "@/components/ui/GlowButton";
import { motion } from "framer-motion";

export function Header() {
  const { address, isConnected, chain } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isWrongChain = isConnected && chain?.id !== ritualChain.id;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-gray-800/50 backdrop-blur-sm bg-black/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-ritual-green/20 border border-ritual-green/40 flex items-center justify-center group-hover:shadow-glow-green transition-shadow">
                <span className="text-ritual-green font-bold text-sm">R</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-ritual-green animate-pulse" />
            </div>
            <div>
              <span className="font-display text-lg text-gray-100 tracking-tight">
                RNS
              </span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-2">
                Ritual Name Service
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-ritual-green transition-colors"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="text-sm text-gray-400 hover:text-ritual-green transition-colors"
            >
              Search
            </Link>
            {isConnected && (
              <Link
                href="/dashboard"
                className="text-sm text-gray-400 hover:text-ritual-green transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Wallet */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <>
                {isWrongChain ? (
                  <GlowButton
                    variant="gold"
                    size="sm"
                    loading={isSwitching}
                    onClick={() =>
                      switchChain({ chainId: ritualChain.id })
                    }
                  >
                    Switch to Ritual
                  </GlowButton>
                ) : (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ritual-elevated border border-gray-800">
                    <span className="w-2 h-2 rounded-full bg-ritual-green animate-pulse" />
                    <span className="text-xs text-gray-500">Ritual</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ritual-elevated border border-gray-800">
                  <HexAddress address={address!} />
                </div>
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1"
                >
                  ✕
                </button>
              </>
            ) : (
              <GlowButton
                size="sm"
                loading={isConnecting}
                onClick={() => connect({ connector: injected() })}
                icon={<img src="/ritual-logo.png" alt="Ritual" className="w-4 h-4 object-contain" />}
              >
                Connect Wallet
              </GlowButton>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
