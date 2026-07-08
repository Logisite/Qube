import { useState, useCallback, useRef } from "react"
import { useWriteContract, useAccount } from "wagmi"
import { MINT_ABI, getClaimAmount, hasPublicMint } from "@/lib/mint-abi"
import type { TokenPair } from "@/lib/tokens"

export function useFaucet() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [currentIndex, setCurrentIndex] = useState(-1)
  const currentIndexRef = useRef(-1)

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

  const mintAll = useCallback(
    async (pairs: TokenPair[]) => {
      const publicPairs = pairs.filter(hasPublicMint)
      try {
        for (let i = 0; i < publicPairs.length; i++) {
          setCurrentIndex(i)
          currentIndexRef.current = i
          const { raw } = getClaimAmount(publicPairs[i])
          await mint(publicPairs[i].erc20.address, raw)
        }
        return { successCount: publicPairs.length, failedIndex: -1 }
      } catch (error) {
        const failedIndex = currentIndexRef.current >= 0 ? currentIndexRef.current : 0
        throw { ...error as Error, failedIndex, completedCount: failedIndex }
      } finally {
        setCurrentIndex(-1)
        currentIndexRef.current = -1
      }
    },
    [mint],
  )

  const isPending = currentIndex >= 0

  return { mint, mintAll, isPending, currentIndex }
}
