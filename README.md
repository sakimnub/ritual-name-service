# Ritual Name Service (RNS)

A modern Web3 Name Service dApp powered entirely by the Ritual ecosystem. Register unique `.ritual` names validated by AI (Ritual LLM), secured by TEE computation, and managed through Ritual Precompiles.

## Features

- 🔗 **Wallet Connection** — MetaMask integration with Ritual Chain (1979) auto-switch
- 💰 **Staking** — Deposit RITUAL tokens into RitualWallet to fund operations
- 🔒 **TEE Sessions** — Activate Trusted Execution Environment sessions for confidential computation
- 🤖 **AI Name Validation** — LLM precompile (0x0802) validates names for phishing, impersonation, and availability
- ⬡ **Precompile Registration** — Register names through native Ritual precompiles
- 📊 **Dashboard** — Manage owned domains, staking, TEE sessions, and transaction history

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS v3 with Ritual design tokens
- **Web3**: wagmi v2 + viem v2
- **State**: Zustand with localStorage persistence
- **Animations**: Framer Motion
- **Chain**: Ritual Chain (ID: 1979)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
├── app/                   # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Web3Provider
│   ├── page.tsx           # Landing page (hero + search)
│   ├── search/page.tsx    # Search + registration
│   └── dashboard/page.tsx # Dashboard
├── components/
│   ├── layout/            # Header, Footer
│   ├── wallet/            # StakingPanel
│   ├── tee/               # TEESessionCard
│   ├── search/            # NameSearch, LLMValidation
│   ├── registration/      # RegisterForm, AsyncTransactionStatus
│   ├── dashboard/         # Dashboard, OwnedDomains, TransactionHistory
│   └── ui/                # GlowButton, HexAddress, StatusDot
├── hooks/                 # Ritual integration hooks
│   ├── useRitualWrite.ts  # Bypass eth_call simulation
│   ├── useRitualWallet.ts # Balance, deposit, withdraw
│   ├── useExecutorDiscovery.ts
│   ├── useLLMValidation.ts
│   ├── useAsyncJobEvents.ts
│   ├── useSenderLock.ts
│   └── useDepositGate.ts
├── stores/                # Zustand stores
├── lib/                   # Chain config, encoding, fees
└── types/                 # TypeScript type definitions
```

## Ritual Integration

| Component | Contract/Precompile | Purpose |
|-----------|-------------------|---------|
| RitualWallet | `0x532F...3948` | Staking, fee deposits |
| LLM Precompile | `0x0802` | Name validation AI |
| TEEServiceRegistry | `0x9644...Bf47F` | Executor discovery |
| AsyncJobTracker | `0xC069...AEF5` | Transaction lifecycle |
