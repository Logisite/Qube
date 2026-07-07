export const SUPPORTED_CHAINS = {
  1: {
    name: "Ethereum Mainnet",
    shortName: "Ethereum",
    etherscan: "etherscan.io",
    isTestnet: false,
  },
  11155111: {
    name: "Sepolia Testnet",
    shortName: "Sepolia",
    etherscan: "sepolia.etherscan.io",
    isTestnet: true,
  },
} as const

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS

export function getChainConfig(chainId: number | undefined) {
  if (!chainId) return SUPPORTED_CHAINS[11155111]
  return (
    SUPPORTED_CHAINS[chainId as SupportedChainId] ?? SUPPORTED_CHAINS[11155111]
  )
}

export function getEtherscanUrl(
  chainId: number | undefined,
  path: string,
) {
  const config = getChainConfig(chainId)
  return `https://${config.etherscan}/${path}`
}

export function isTestnet(chainId: number | undefined) {
  const config = getChainConfig(chainId)
  return config.isTestnet
}

export function isSupportedChain(chainId: number | undefined): boolean {
  return !!chainId && chainId in SUPPORTED_CHAINS
}
