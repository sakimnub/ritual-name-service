"use client";

import { motion } from "framer-motion";
import { NameSearch } from "@/components/search/NameSearch";
import { RegisterForm } from "@/components/registration/RegisterForm";
import { StakingPanel } from "@/components/wallet/StakingPanel";
import { TEESessionCard } from "@/components/tee/TEESessionCard";
import { useRNSStore } from "@/stores/rnsStore";
import { useAccount } from "wagmi";

export default function SearchPage() {
  const searchResults = useRNSStore((s) => s.searchResults);
  const { isConnected } = useAccount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1
          className="font-display text-gray-100 mb-3"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
        >
          Find Your <span className="text-ritual-green">.ritual</span> Name
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Search, validate, and register your decentralized identity.
          Every name is AI-validated and TEE-secured.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Search Area */}
        <div className="lg:col-span-2">
          <NameSearch />

          {/* Registration Form */}
          {searchResults?.name && (
            <RegisterForm name={searchResults.name} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {isConnected && (
            <>
              <StakingPanel />
              <TEESessionCard />
            </>
          )}

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-ritual p-6"
          >
            <h3 className="text-gray-100 font-semibold mb-4 text-sm">
              How It Works
            </h3>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={step.title} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-ritual-surface border border-gray-700 flex items-center justify-center">
                    <span className="text-[10px] text-ritual-green font-mono">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-300 font-medium">
                      {step.title}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Connect & Stake",
    description: "Connect your wallet and deposit RITUAL to fund operations.",
  },
  {
    title: "Activate TEE Session",
    description: "Start a secure TEE execution session with a verified executor.",
  },
  {
    title: "Search & Validate",
    description: "Find available names. Ritual LLM checks for phishing and impersonation.",
  },
  {
    title: "Register via Precompile",
    description: "Register through Ritual precompiles with TEE-verified execution.",
  },
  {
    title: "Manage from Dashboard",
    description: "Renew, transfer, and update profile records from your dashboard.",
  },
];
