import { useAccount, useReadContracts } from "wagmi"
import { getTokenPairsForChain } from "@/lib/tokens"
import { ERC20_ABI } from "@/lib/config"

export function useAllTokenBalances() {
  const { address, chainId } = useAccount()
  const pairs = getTokenPairsForChain(chainId)

  const contracts = pairs.map((pair) => ({
    address: pair.erc20.address,
    abi: ERC20_ABI,
    functionName: "balanceOf" as const,
    args: [address!] as const,
  }))

  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    allowFailure: true,
    query: { enabled: !!address },
  })

  const balances = new Map<string, bigint>()
  if (data) {
    data.forEach((result, i) => {
      if (result.status === "success") {
        balances.set(pairs[i].erc20.address, result.result)
      }
    })
  }

  return { balances, isLoading, refetch }
}
