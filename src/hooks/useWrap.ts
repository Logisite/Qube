import { useShield } from "@zama-fhe/react-sdk"

export function useWrap(tokenAddress: `0x${string}`, wrapperAddress: `0x${string}`) {
  const { mutateAsync: shield, isPending, error } = useShield({
    tokenAddress,
    wrapperAddress,
  })

  return { shield, isPending, error }
}
