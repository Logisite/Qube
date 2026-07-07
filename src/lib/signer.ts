import type {
  SignerLifecycleCallbacks,
  EIP712TypedData,
  Hex,
  Address,
  TransactionReceipt,
  ContractAbi,
  WriteFunctionName,
  WriteContractArgs,
  WriteContractConfig,
  ReadFunctionName,
  ReadContractArgs,
  ReadContractConfig,
  ReadContractReturnType,
} from "@zama-fhe/sdk"
import { ViemSigner } from "@zama-fhe/sdk/viem"
import {
  getAccount,
  getPublicClient,
  getWalletClient,
  watchAccount,
} from "wagmi/actions"
import type { Config } from "wagmi"

export class LazyViemSigner {
  private readonly config: Config
  private signer: ViemSigner | null = null

  constructor(signerConfig: { config: Config }) {
    this.config = signerConfig.config
  }

  private async resolve(): Promise<ViemSigner> {
    if (this.signer) return this.signer

    const account = getAccount(this.config)
    const chainId = account.chainId ?? 11155111

    const publicClient = getPublicClient(this.config, { chainId })
    if (!publicClient) throw TypeError("Public client not available")

    const walletClient = await getWalletClient(this.config, { chainId })

    this.signer = new ViemSigner({
      publicClient,
      walletClient: walletClient ?? undefined,
      ethereum: typeof window !== "undefined" ? window.ethereum : undefined,
    })

    return this.signer
  }

  private reset(): void {
    this.signer = null
  }

  async getChainId(): Promise<number> {
    return (await this.resolve()).getChainId()
  }

  async getAddress(): Promise<Address> {
    return (await this.resolve()).getAddress()
  }

  async signTypedData(typedData: EIP712TypedData): Promise<Hex> {
    return (await this.resolve()).signTypedData(typedData)
  }

  writeContract = async <
    const TAbi extends ContractAbi,
    TFunctionName extends WriteFunctionName<TAbi>,
    const TArgs extends WriteContractArgs<TAbi, TFunctionName>,
  >(
    config: WriteContractConfig<TAbi, TFunctionName, TArgs>,
  ): Promise<Hex> => {
    return (await this.resolve()).writeContract(config)
  }

  readContract = async <
    const TAbi extends ContractAbi,
    TFunctionName extends ReadFunctionName<TAbi>,
    const TArgs extends ReadContractArgs<TAbi, TFunctionName>,
  >(
    config: ReadContractConfig<TAbi, TFunctionName, TArgs>,
  ): Promise<ReadContractReturnType<TAbi, TFunctionName, TArgs>> => {
    return (await this.resolve()).readContract(config) as ReadContractReturnType<
      TAbi,
      TFunctionName,
      TArgs
    >
  }

  async waitForTransactionReceipt(hash: Hex): Promise<TransactionReceipt> {
    return (await this.resolve()).waitForTransactionReceipt(hash)
  }

  async getBlockTimestamp(): Promise<bigint> {
    return (await this.resolve()).getBlockTimestamp()
  }

  subscribe(callbacks: SignerLifecycleCallbacks = {}): () => void {
    this.reset()
    return watchAccount(this.config, {
      onChange: (_prev, curr) => {
        if (curr.status === "disconnected") {
          this.reset()
          callbacks.onDisconnect?.()
        }
      },
    })
  }
}
