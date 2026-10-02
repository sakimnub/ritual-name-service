"use client";

import { motion } from "framer-motion";
import { useRNSStore } from "@/stores/rnsStore";
import { useLLMValidation } from "@/hooks/useLLMValidation";

interface LLMValidationProps {
  name: string;
}

export function LLMValidation({ name }: LLMValidationProps) {
  const validationResult = useRNSStore((s) => s.validationResult);
  const validationLoading = useRNSStore((s) => s.validationLoading);
  const { streamingText, isStreaming, executorAvailable } = useLLMValidation();
  const checkAvailability = useRNSStore((s) => s.checkAvailability);

  if (!validationResult && !validationLoading && !isStreaming) return null;

  const riskColors = {
    safe: "border-ritual-green/30 bg-ritual-green/5",
    warning: "border-ritual-gold/30 bg-ritual-gold/5",
    danger: "border-red-500/30 bg-red-500/5",
  };

  const riskIcons = {
    safe: "✓",
    warning: "⚠",
    danger: "⛔",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      {/* AI Output Header */}
      <div className="card-ritual overflow-hidden">
        <div className="border-b border-ritual-pink/20 bg-ritual-pink/5 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-ritual-pink">◇</span>
            <span className="text-xs font-medium text-ritual-pink">
              AI Validation
            </span>
          </div>
          <div className="flex items-center gap-2">
            {executorAvailable && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ritual-green/10 text-ritual-green border border-ritual-green/20">
                TEE Verified
              </span>
            )}
            <span className="text-[10px] font-mono text-gray-600 italic">
              zai-org/GLM-4.7-FP8
            </span>
          </div>
        </div>

        <div className="p-4">
          {/* Loading / Streaming State */}
          {(validationLoading || isStreaming) && !validationResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-ritual-pink border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-400">
                  Analyzing &quot;{name}.ritual&quot; through Ritual LLM...
                </span>
              </div>
              {streamingText && (
                <pre className="text-xs font-mono text-gray-500 bg-ritual-surface rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                  {streamingText}
                  <span className="animate-pulse text-ritual-pink">▋</span>
                </pre>
              )}
            </div>
          )}

          {/* Results */}
          {validationResult && (
            <div className="space-y-4">
              {/* Risk Assessment */}
              <div
                className={`rounded-lg p-3 border ${
                  riskColors[validationResult.riskLevel]
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">
                    {riskIcons[validationResult.riskLevel]}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      validationResult.riskLevel === "safe"
                        ? "text-ritual-green"
                        : validationResult.riskLevel === "warning"
                        ? "text-ritual-gold"
                        : "text-red-400"
                    }`}
                  >
                    {validationResult.valid ? "Valid" : "Invalid"} —{" "}
                    {validationResult.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {validationResult.reason}
                </p>
              </div>

              {/* Alerts */}
              {validationResult.phishingDetected && (
                <div className="rounded-lg p-3 border border-red-500/30 bg-red-500/5 flex items-center gap-2">
                  <span className="text-red-400">⚠</span>
                  <span className="text-sm text-red-400">
                    Phishing attempt detected — name is similar to a known
                    protocol
                  </span>
                </div>
              )}
              {validationResult.impersonationDetected && (
                <div className="rounded-lg p-3 border border-red-500/30 bg-red-500/5 flex items-center gap-2">
                  <span className="text-red-400">⛔</span>
                  <span className="text-sm text-red-400">
                    Impersonation risk — this name may be confused with a
                    well-known brand
                  </span>
                </div>
              )}

              {/* Suggestions */}
              {validationResult.suggestions.length > 0 && (
                <div>
                  <span className="label-ritual block mb-2">
                    {validationResult.valid
                      ? "You might also like"
                      : "Suggested Alternatives"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {validationResult.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          const cleanName = suggestion.replace(/\.ritual$/, "");
                          checkAvailability(cleanName);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-ritual-green/50 hover:text-ritual-green transition-colors font-mono"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
