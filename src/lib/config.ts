import { http } from "wagmi"
import { sepolia, mainnet } from "wagmi/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"

export const REGISTRY_ADDRESSES = {
  [sepolia.id]: "0x2f0750Bbb0A246059d80e94c454586a7F27a128e",
  [mainnet.id]: "0xeb5015fF021DB115aCe010f23F55C2591059bBA0",
} as const

export function getRegistryAddress(chainId: number | undefined) {
  return (
    REGISTRY_ADDRESSES[chainId as keyof typeof REGISTRY_ADDRESSES] ??
    REGISTRY_ADDRESSES[sepolia.id]
  )
}

export const config = getDefaultConfig({
  appName: "Confidential Wrapper Registry",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "PLACEHOLDER",
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
    [mainnet.id]: http(
      import.meta.env.VITE_MAINNET_RPC_URL ||
        "https://ethereum-rpc.publicnode.com",
    ),
  },
})

export const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const
