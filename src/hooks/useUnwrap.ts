import { useUnshield } from "@zama-fhe/react-sdk"

export function useUnwrap(tokenAddress: `0x${string}`, wrapperAddress: `0x${string}`) {
  const { mutateAsync: unshield, isPending, error } = useUnshield({
    tokenAddress,
    wrapperAddress,
  })

  return { unshield, isPending, error }
}
