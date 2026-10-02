"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRNSStore } from "@/stores/rnsStore";
import { useLLMValidation } from "@/hooks/useLLMValidation";
import { GlowButton } from "@/components/ui/GlowButton";
import { LLMValidation } from "./LLMValidation";

export function NameSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchResults = useRNSStore((s) => s.searchResults);
  const checkAvailability = useRNSStore((s) => s.checkAvailability);
  const validationLoading = useRNSStore((s) => s.validationLoading);
  const { validate, reset } = useLLMValidation();

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("rns-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    reset();

    const normalized = query.toLowerCase().replace(/\.ritual$/, "").trim();
    checkAvailability(normalized);

    // Run LLM validation
    await validate(normalized);
    setIsSearching(false);
  }, [query, checkAvailability, validate, reset]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-ritual-green/30 via-ritual-pink/20 to-ritual-lime/30 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
          <div className="relative flex items-center bg-ritual-elevated border border-gray-800 rounded-xl overflow-hidden group-focus-within:border-ritual-green/40 transition-colors">
            <span className="pl-4 text-gray-600 text-lg">◇</span>
            <input
              id="rns-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for a name..."
              className="flex-1 bg-transparent px-4 py-4 text-lg text-gray-200 placeholder:text-gray-600 focus:outline-none font-body"
            />
            <span className="pr-2 text-sm text-gray-600 font-mono">.ritual</span>
            <GlowButton
              variant="green"
              size="md"
              loading={isSearching || validationLoading}
              onClick={handleSearch}
              disabled={!query.trim()}
              className="m-2 rounded-lg"
            >
              Search
            </GlowButton>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-xs text-gray-600">
            3-63 characters, alphanumeric and hyphens
          </span>
          <span className="text-xs text-gray-700 hidden sm:inline">
            <kbd className="px-1.5 py-0.5 rounded bg-ritual-surface border border-gray-700 text-[10px]">
              Ctrl
            </kbd>
            {" + "}
            <kbd className="px-1.5 py-0.5 rounded bg-ritual-surface border border-gray-700 text-[10px]">
              K
            </kbd>
            {" to focus"}
          </span>
        </div>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6"
          >
            {/* Availability Badge */}
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border ${
                searchResults.available
                  ? "bg-ritual-green/5 border-ritual-green/30"
                  : "bg-red-500/5 border-red-500/30"
              }`}
            >
              <span
                className={`text-2xl ${
                  searchResults.available
                    ? "text-ritual-green"
                    : "text-red-400"
                }`}
              >
                {searchResults.available ? "✓" : "✗"}
              </span>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-100 font-mono">
                      {searchResults.name}.ritual
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      searchResults.available
                        ? "text-ritual-green"
                        : "text-red-400"
                    }`}
                  >
                    {searchResults.available
                      ? "Available for registration"
                      : "Already registered"}
                  </span>
                </div>
                {searchResults.available && (
                  <Link href="/search">
                    <GlowButton variant="green" size="md">
                      Claim Name
                    </GlowButton>
                  </Link>
                )}
              </div>
            </div>

            {/* LLM Validation */}
            <LLMValidation name={searchResults.name} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
