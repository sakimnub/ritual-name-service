import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Ritual Name Service (RNS) — Decentralized Identity on Ritual Chain",
  description:
    "Register unique .ritual names secured by TEE-verified computation, AI-validated by Ritual LLM, and managed through Ritual Precompiles. Your decentralized identity on Ritual Chain.",
  keywords: [
    "Ritual",
    "RNS",
    "Name Service",
    "Web3",
    "Decentralized Identity",
    "TEE",
    "LLM",
    "Blockchain",
  ],
  openGraph: {
    title: "Ritual Name Service (RNS)",
    description:
      "AI-powered decentralized name service on Ritual Chain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-black text-gray-300 font-body antialiased">
        <Web3Provider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
