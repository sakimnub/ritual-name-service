"use client";

import { useState, useCallback } from "react";

interface HexAddressProps {
  address: `0x${string}`;
  truncate?: boolean;
  className?: string;
}

export function HexAddress({
  address,
  truncate = true,
  className = "",
}: HexAddressProps) {
  const [copied, setCopied] = useState(false);

  const displayAddress = truncate
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [address]);

  return (
    <button
      onClick={handleCopy}
      className={`hex-address inline-flex items-center gap-1.5 hover:text-ritual-green transition-colors cursor-pointer ${className}`}
      title={`${address} — Click to copy`}
    >
      <span>{displayAddress}</span>
      <span className="text-[10px] opacity-60">
        {copied ? "✓" : "⎘"}
      </span>
    </button>
  );
}
