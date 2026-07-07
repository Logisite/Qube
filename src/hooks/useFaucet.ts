import { useState, useCallback } from "react"
import { useWriteContract, useAccount } from "wagmi"
import { MINT_ABI, getClaimAmount, hasPublicMint } from "@/lib/mint-abi"
import type { TokenPair } from "@/lib/tokens"

export function useFaucet() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  // -1 = idle. 0..n = minting token at this index.
  const [currentIndex, setCurrentIndex] = useState(-1)

  const mint = useCallback(
    (tokenAddress: `0x${string}`, rawAmount: bigint) => {
      if (!address) throw new Error("Wallet not connected")
      return writeContractAsync({
        address: tokenAddress,
        abi: MINT_ABI,
        functionName: "mint",
        args: [address, rawAmount],
      })
    },
    [address, writeContractAsync],
  )

  // Mints tokens sequentially, stopping on first failure.
  // If one mint fails (e.g. no gas), remaining mints are skipped
  // to avoid wasting the user's time.
  const mintAll = useCallback(
    async (pairs: TokenPair[]) => {
      const publicPairs = pairs.filter(hasPublicMint)
      try {
        for (let i = 0; i < publicPairs.length; i++) {
          setCurrentIndex(i)
          const { raw } = getClaimAmount(publicPairs[i])
          await mint(publicPairs[i].erc20.address, raw)
        }
        return { successCount: publicPairs.length, failedIndex: -1 }
      } catch (error) {
        const failedIndex = currentIndex >= 0 ? currentIndex : 0
        throw { ...error as Error, failedIndex, completedCount: failedIndex }
      } finally {
        setCurrentIndex(-1)
      }
    },
    [mint, currentIndex],
  )

  const isPending = currentIndex >= 0

  return { mint, mintAll, isPending, currentIndex }
}
