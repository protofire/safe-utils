"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Network, NETWORKS } from "@/app/constants";

const REGISTRY_FEATURE_FLAG = "PROTOFIRE_FORK_OZ_SAFE_UTILS";

type ChainConfig = {
  chainId: string;
  chainName: string;
  shortName: string;
  chainLogoUri: string;
  isTestnet: boolean;
  transactionService: string;
  features: string[];
};

type RegistryResponse = {
  next: string | null;
  previous: string | null;
  count: number;
  results: ChainConfig[];
};

type NetworksContextValue = {
  networks: Network[];
  isLoading: boolean;
};

const NetworksContext = createContext<NetworksContextValue>({
  networks: NETWORKS,
  isLoading: false,
});

export function NetworksProvider({ children }: { children: ReactNode }) {
  const [networks, setNetworks] = useState<Network[]>(NETWORKS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const registryUrl = process.env.NEXT_PUBLIC_REGISTRY_CHAINS_URL;
    if (!registryUrl) return;

    const controller = new AbortController();

    async function fetchNetworks() {
      setIsLoading(true);
      try {
        const allChains: ChainConfig[] = [];
        let nextUrl: string | null = registryUrl!;

        while (nextUrl) {
          const res = await fetch(nextUrl, { signal: controller.signal });
          if (!res.ok) throw new Error(`Registry fetch failed: ${res.statusText}`);
          const data: RegistryResponse = await res.json();
          allChains.push(...data.results);
          nextUrl = data.next;
        }

        const filtered = allChains
          .filter((c) => c.features.includes(REGISTRY_FEATURE_FLAG))
          .map((c): Network => ({
            value: c.shortName,
            label: c.chainName,
            chainId: parseInt(c.chainId, 10),
            gnosisPrefix: c.shortName,
            logo: c.chainLogoUri,
            testnet: c.isTestnet,
            transactionService: c.transactionService,
          }));

        if (filtered.length > 0) {
          setNetworks(filtered);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.warn("Failed to load networks from registry, using static fallback:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchNetworks();

    return () => controller.abort();
  }, []);

  return (
    <NetworksContext.Provider value={{ networks, isLoading }}>
      {children}
    </NetworksContext.Provider>
  );
}

export function useNetworks() {
  return useContext(NetworksContext);
}
