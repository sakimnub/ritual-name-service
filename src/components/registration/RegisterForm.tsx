"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useWriteContract } from "wagmi";
import { useRNSStore } from "@/stores/rnsStore";
import { GlowButton } from "@/components/ui/GlowButton";
import { HexAddress } from "@/components/ui/HexAddress";
import { estimateRegistrationFee, formatRitual } from "@/lib/fees";
import { rnsAbi, RNS_CONTRACT_ADDRESS } from "@/config/contracts";

interface RegisterFormProps {
  name: string;
}

export function RegisterForm({ name }: RegisterFormProps) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const registerName = useRNSStore((s) => s.registerName);
  const searchResults = useRNSStore((s) => s.searchResults);
  const validationResult = useRNSStore((s) => s.validationResult);
  const addTransaction = useRNSStore((s) => s.addTransaction);

  const [durationYears, setDurationYears] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredTxHash, setRegisteredTxHash] = useState<`0x${string}` | null>(null);
  const [records, setRecords] = useState({
    website: "",
    twitter: "",
    github: "",
    description: "",
  });

  const canRegister =
    isConnected &&
    searchResults?.available &&
    validationResult?.valid &&
    address;

  const fees = estimateRegistrationFee(durationYears);

  const handleRegister = async () => {
    if (!canRegister || !address) return;
    setIsRegistering(true);

    try {
      // Send a real transaction to the RNS Smart Contract
      const realTxHash = await writeContractAsync({
        address: RNS_CONTRACT_ADDRESS,
        abi: rnsAbi,
        functionName: "register",
        args: [name, BigInt(durationYears)],
      });

      registerName(name, address, durationYears, records, realTxHash);

      addTransaction({
        id: `register-${Date.now()}`,
        type: "register",
        name: `${name}.ritual`,
        txHash: realTxHash,
        status: "settled",
        timestamp: Date.now(),
        precompileType: "RNS Smart Contract",
        fee: "0.0000",
      });

      setRegisteredTxHash(realTxHash);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  if (!searchResults?.available && !registeredTxHash) return null;

  if (registeredTxHash) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-ritual p-6 mt-4 border-ritual-green/30 bg-ritual-green/5"
      >
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-ritual-green/20 flex items-center justify-center mb-4">
            <span className="text-3xl text-ritual-green">✓</span>
          </div>
          <h3 className="text-xl text-gray-100 font-semibold mb-2">
            Successfully Registered!
          </h3>
          <p className="text-gray-400 mb-6">
            <span className="font-mono text-ritual-green">{name}.ritual</span> is now yours.
          </p>
          <div className="bg-black/50 rounded-lg p-4 w-full max-w-md border border-gray-800">
            <span className="text-xs text-gray-500 block mb-2">Transaction Hash</span>
            <HexAddress address={registeredTxHash} truncate={false} className="text-sm text-gray-300" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-ritual p-6 mt-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-ritual-green text-lg">⬡</span>
        <h3 className="text-gray-100 font-semibold">
          Register {name}.ritual
        </h3>
      </div>

      {/* Duration Selector */}
      <div className="mb-4">
        <span className="label-ritual block mb-2">Registration Period</span>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 5].map((years) => (
            <button
              key={years}
              onClick={() => setDurationYears(years)}
              className={`py-3 rounded-lg border text-center transition-all ${
                durationYears === years
                  ? "border-ritual-green text-ritual-green bg-ritual-green/10 shadow-glow-green"
                  : "border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              <div className="text-lg font-semibold">{years}</div>
              <div className="text-xs opacity-70">
                {years === 1 ? "year" : "years"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Records */}
      <div className="mb-4">
        <span className="label-ritual block mb-2">Profile Records (Optional)</span>
        <div className="space-y-2">
          {(["description", "website", "twitter", "github"] as const).map(
            (field) => (
              <div key={field} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-20 text-right capitalize">
                  {field}
                </span>
                <input
                  type="text"
                  value={records[field]}
                  onChange={(e) =>
                    setRecords({ ...records, [field]: e.target.value })
                  }
                  placeholder={
                    field === "description"
                      ? "A short description..."
                      : field === "website"
                      ? "https://..."
                      : field === "twitter"
                      ? "@handle"
                      : "username"
                  }
                  className="input-ritual flex-1 text-xs py-2"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-ritual-surface rounded-lg p-4 mb-4">
        <span className="label-ritual block mb-2">Fee Estimate</span>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">LLM Validation & Registration</span>
            <span className="font-mono text-gray-400">0.0000 RITUAL</span>
          </div>
          <div className="divider-ritual my-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-300 font-semibold">Total</span>
            <span className="font-mono text-ritual-lime font-semibold">
              0.0000 RITUAL
            </span>
          </div>
        </div>
      </div>

      {/* Register Button */}
      <GlowButton
        variant="green"
        size="lg"
        className="w-full"
        loading={isRegistering}
        disabled={!canRegister}
        onClick={handleRegister}
        icon={<span>◈</span>}
      >
        Register Name On-Chain
      </GlowButton>

      {!isConnected && (
        <p className="text-xs text-ritual-gold text-center mt-2">
          Connect your wallet to register
        </p>
      )}
      {isConnected && validationResult && !validationResult.valid && (
        <p className="text-xs text-red-400 text-center mt-2">
          Name validation failed — choose a different name
        </p>
      )}
    </motion.div>
  );
}
