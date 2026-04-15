import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLogoSrc(logo: string): string {
  if (logo.startsWith("https://")) return logo;
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${logo}`;
}


export const API_URLS: { [key: string]: string } = {
  arbitrum: "https://safe-transaction-arbitrum.safe.global",
  aurora: "https://safe-transaction-aurora.safe.global",
  avalanche: "https://safe-transaction-avalanche.safe.global",
  base: "https://safe-transaction-base.safe.global",
  "base-sepolia": "https://safe-transaction-base-sepolia.safe.global",
  "blast":"https://transaction-blast.safe.protofire.io",
  "blast-sepolia":"https://transaction-blast-testnet.safe.protofire.io",
  bsc: "https://safe-transaction-bsc.safe.global",
  celo: "https://safe-transaction-celo.safe.global",
  ethereum: "https://safe-transaction-mainnet.safe.global",
  gnosis: "https://safe-transaction-gnosis-chain.safe.global",
  "gnosis-chiado": "https://safe-transaction-chiado.safe.global",
  linea: "https://safe-transaction-linea.safe.global",
  mantle: "https://safe-transaction-mantle.safe.global",
  optimism: "https://safe-transaction-optimism.safe.global",
  polygon: "https://safe-transaction-polygon.safe.global",
  "polygon-zkevm": "https://safe-transaction-zkevm.safe.global",
  scroll: "https://safe-transaction-scroll.safe.global",
  sepolia: "https://safe-transaction-sepolia.safe.global",
  worldchain: "https://safe-transaction-worldchain.safe.global",
  xlayer: "https://safe-transaction-xlayer.safe.global",
  zksync: "https://safe-transaction-zksync.safe.global",
  swell: "https://trx-swell.safe.protofire.io",
  "swell-testnet": "https://trx-swell-testnet.safe.protofire.io",
  "zircuit-mainnet":"https://transaction.safe.zircuit.com",
  "zircuit-testnet":"https://transaction-testnet.safe.zircuit.com",
  "harmony":"https://transaction.multisig.harmony.one",
  "harmony-testnet":"https://transaction-testnet.multisig.harmony.one",
  "moca-mainnet":"https://transaction-mocachain.safe.protofire.io",
  "moca-testnet":"https://transaction-mocachain-testnet.safe.protofire.io",
  "plasma":"https://transaction-plasma.safe.protofire.io",
  "plasma-testnet":"https://transaction-plasma-testnet.safe.protofire.io",
  "wemix":"https://transaction-wemix.safe.protofire.io",
  "wemix-testnet":"https://transaction-wemix-testnet.safe.protofire.io",
  "mantrachain":"https://transaction-mantra.safe.protofire.io",
  "mantrachain-dukong":"https://transaction-mantra-testnet.safe.protofire.io",
  "alpen":"https://transaction-alpen-testnet.safe.protofire.io",
  "ault-testnet":"https://transaction-ault-testnet.safe.protofire.io",
  "dogeos-chykyu":"https://transaction-dogeos-testnet.safe.protofire.io",
  "hoodi-testnet":"https://transaction-ethereum-hoodi.safe.protofire.io",
  "tempo-testnet":"https://transaction-tempo-testnet.safe.protofire.io",
}

export function isValidNetwork(network: string): boolean {
  return Object.keys(API_URLS).includes(network);
}


export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}


export function isValidNonce(nonce: string): boolean {
  // Ensure nonce is a positive integer within reasonable bounds
  const nonceNum = parseInt(nonce);
  return /^\d+$/.test(nonce) && nonceNum >= 0 && nonceNum <= 100000000000;
}
