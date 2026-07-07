import { useAllow, useIsAllowed, useConfidentialBalance, useConfidentialBalances } from "@zama-fhe/react-sdk"

export function useDecryptAllow() {
  const { mutateAsync: allow, isPending } = useAllow()
  return { allow, isPending }
}

export function useDecryptAllowed(addresses: `0x${string}`[]) {
  const { data, isLoading, error } = useIsAllowed({
    contractAddresses: addresses as [`0x${string}`, ...`0x${string}`[]],
  })
  return { data, isLoading, error }
}

export function useDecryptBalance(tokenAddress: `0x${string}`, enabled = false) {
  const { data, isLoading, error, refetch } = useConfidentialBalance(
    { tokenAddress },
    { enabled },
  )
  return { data, isLoading, error, refetch }
}

export function useDecryptBalances(tokenAddresses: `0x${string}`[], enabled = false) {
  const { data, isLoading, error, refetch } = useConfidentialBalances(
    { tokenAddresses },
    { enabled },
  )
  return { data, isLoading, error, refetch }
}
