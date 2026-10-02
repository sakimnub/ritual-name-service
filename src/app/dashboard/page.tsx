"use client";

import { motion } from "framer-motion";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="font-display text-gray-100 mb-2"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Manage your .ritual names, staking, and TEE sessions.
        </p>
        <div className="divider-ritual mt-4" />
      </motion.div>

      <Dashboard />
    </div>
  );
}
