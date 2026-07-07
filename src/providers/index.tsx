import "@rainbow-me/rainbowkit/styles.css"

import { type PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import {
  ZamaProvider,
  RelayerWeb,
  SepoliaConfig,
  MainnetConfig,
  indexedDBStorage,
} from "@zama-fhe/react-sdk"
import { LazyViemSigner } from "@/lib/signer"
import { config } from "@/lib/config"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
})

const signer = new LazyViemSigner({ config })

const relayer = new RelayerWeb({
  getChainId: () => signer.getChainId(),
  transports: {
    [SepoliaConfig.chainId]: {
      ...SepoliaConfig,
    },
    [MainnetConfig.chainId]: {
      ...MainnetConfig,
    },
  },
})

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ZamaProvider
            relayer={relayer}
            signer={signer}
            storage={indexedDBStorage}
          >
            {children}
          </ZamaProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
