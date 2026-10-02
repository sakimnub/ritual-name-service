"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NameSearch } from "@/components/search/NameSearch";
import { useAccount } from "wagmi";

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-hero-mesh" />

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(25, 209, 132, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(25, 209, 132, 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-800 bg-ritual-elevated/50 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ritual-green animate-pulse" />
            <span className="text-xs text-gray-400">
              Powered by Ritual Chain — TEE Verified
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-gray-100 leading-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}
          >
            Decentralized Names.
            <br />
            <span className="bg-gradient-to-r from-ritual-green via-ritual-lime to-ritual-pink bg-clip-text text-transparent">
              Ritual Intelligence.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Register your unique <span className="text-ritual-lime font-mono">.ritual</span> name
            — AI-validated, TEE-secured, and powered entirely by Ritual precompiles.
            Your identity on the intelligent blockchain.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <NameSearch />
          </motion.div>
        </div>

        {/* Floating decoration */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-10 w-20 h-20 rounded-xl border border-ritual-green/10 bg-ritual-green/5 opacity-40 hidden lg:block"
          style={{ transform: "rotate(45deg)" }}
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-16 w-12 h-12 rounded-lg border border-ritual-pink/10 bg-ritual-pink/5 opacity-30 hidden lg:block"
          style={{ transform: "rotate(30deg)" }}
        />
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="font-display text-gray-100 mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              Built on Ritual Infrastructure
            </h2>
            <div className="divider-ritual max-w-xs mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-ritual p-6 group hover:border-gray-700 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-lg ${feature.iconBg}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-gray-100 font-semibold mb-2 text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl font-mono font-bold mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-display text-gray-100 mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
            >
              Ready to claim your identity?
            </h2>
            <p className="text-gray-400 mb-8">
              Register your .ritual name in minutes with AI-powered validation and TEE security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <button className="btn-ritual px-8 py-3 text-base">
                  Search Names
                </button>
              </Link>
              {isConnected && (
                <Link href="/dashboard">
                  <button className="btn-ritual-ghost px-8 py-3 text-base">
                    View Dashboard
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: "◇",
    iconBg: "bg-ritual-pink/10 text-ritual-pink border border-ritual-pink/20",
    title: "Ritual LLM Validation",
    description:
      "Every name is validated by on-chain AI via the LLM precompile (0x0802). Phishing detection, impersonation checks, and smart suggestions.",
  },
  {
    icon: "▣",
    iconBg: "bg-ritual-green/10 text-ritual-green border border-ritual-green/20",
    title: "TEE Execution",
    description:
      "Sensitive validation and registration logic runs inside Trusted Execution Environments for confidential, verifiable computation.",
  },
  {
    icon: "⇄",
    iconBg: "bg-ritual-green/10 text-ritual-green border border-ritual-green/20",
    title: "Precompile Powered",
    description:
      "Every operation — register, renew, transfer — executes through native Ritual precompiles. No external oracles, no off-chain dependencies.",
  },
  {
    icon: "◈",
    iconBg: "bg-ritual-gold/10 text-ritual-gold border border-ritual-gold/20",
    title: "Stake & Secure",
    description:
      "Stake RITUAL tokens to activate your TEE session and fund precompile execution through the on-chain RitualWallet.",
  },
];

const stats = [
  { value: "1,979", label: "Chain ID", color: "text-ritual-green" },
  { value: "~350ms", label: "Block Time", color: "text-ritual-lime" },
  { value: "12+", label: "Precompiles", color: "text-ritual-pink" },
  { value: "∞", label: "Possibilities", color: "text-ritual-gold" },
];
