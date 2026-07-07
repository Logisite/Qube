import type { TokenPair } from "@/lib/tokens"

// Faucet mint ABI for underlying ERC-20 cTokenMock contracts.
// NOT the same as the ERC-7984 wrapper ABI faucet mints public tokens,
// not confidential ones.
export const MINT_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

export function getClaimAmount(pair: TokenPair): { display: string; raw: bigint } {
  const decimals = BigInt(pair.erc20.decimals)
  if (pair.symbol === "cWETHMock") {
    return { display: "1", raw: 10n ** decimals }
  }
  return { display: "1M", raw: 1_000_000n * 10n ** decimals }
}

// Only Mock pairs have permissionless faucets.
// Non-Mock pairs (e.g. ctGBP) have restricted mint() not callable externally.
export function hasPublicMint(pair: TokenPair): boolean {
  return pair.symbol.endsWith("Mock")
}
