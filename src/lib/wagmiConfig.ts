import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { ritualChain } from "./chain";

export const wagmiConfig = createConfig({
  chains: [ritualChain],
  connectors: [injected()],
  transports: {
    [ritualChain.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc.ritualfoundation.org"
    ),
  },
});
