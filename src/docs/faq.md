---
title: FAQ
description: Common questions and troubleshooting.
---

## General

### What is Qube?

Qube is a Confidential Wrapper Registry dApp. It lets you browse, wrap, unwrap, and decrypt official ERC-20 to ERC-7984 wrapper pairs on the Sepolia testnet.

### What network does Qube use?

Qube runs on **Sepolia** testnet only. Make sure your wallet is connected to Sepolia before using any features.

### What is ERC-7984?

[ERC-7984](https://eips.ethereum.org/EIPS/eip-7984) is a standard for confidential fungible tokens. Balances and transfer amounts are encrypted on-chain using Fully Homomorphic Encryption (FHE). Only the token holder can decrypt their own balance.

### What is the difference between ERC-20 and ERC-7984?

ERC-20 tokens have public balances visible to everyone. ERC-7984 tokens have encrypted balances that only the owner can decrypt. The underlying asset is the same, but the confidentiality layer protects your financial privacy.

## Wallet and Connection

### My wallet is not connecting

1. Make sure your wallet extension is installed and unlocked
2. Check that you are on the **Sepolia** network
3. Try refreshing the page and reconnecting

### I do not have Sepolia ETH

Get test ETH from a Sepolia faucet:

- [Sepolia PoW Faucet](https://sepoliafaucet.com)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com)

You need Sepolia ETH to pay for gas on transactions.

## Wrapping and Unwrapping

### The wrap transaction failed

Common causes:

- **Insufficient ERC-20 balance**: You do not have enough tokens to wrap
- **Insufficient gas**: You need Sepolia ETH for the transaction
- **Wrong network**: Make sure your wallet is on Sepolia
- **Approval failed**: Check that the ERC-20 approval transaction was confirmed

### The unwrap transaction failed

Common causes:

- **Insufficient confidential balance**: You do not have enough encrypted tokens to unwrap
- **Decryption not authorized**: Click **Decrypt** first to authorize the decryption session
- **Wrong network**: Make sure your wallet is on Sepolia

### How long does unwrap take?

Unwrapping is a two-step process:

1. The unwrap transaction is submitted (1-2 minutes)
2. The finalize transaction is submitted after decryption (1-2 minutes)

Total time is typically 2-4 minutes on Sepolia.

## Decryption

### I cannot decrypt my balance

Common causes:

- **Not authorized**: Click **Decrypt** to sign the EIP-712 permit
- **Session expired**: Decryption sessions have a TTL. Click **Decrypt** again to refresh
- **Wrong network**: Make sure your wallet is on Sepolia

### Why do I need to sign a decryption permit?

The EIP-712 permit proves you own the wallet and authorizes the decryption session. Without it, anyone could decrypt your balance. The permit is scoped to specific contracts and expires after a time.

### Can I decrypt balances for tokens not in the registry?

Yes. On the [Assets](/assets) page, enter the ERC-7984 contract address in the custom token input and click **Decrypt**. This works for any ERC-7984 token, even ones not listed in the registry.

## Faucet

### Why can I not mint some tokens?

Some tokens have restricted mint functions. Only tokens with permissionless faucets can be minted directly. Check the [Faucet](/docs/faucet) page for details.

### How many tokens can I claim?

Each token has a fixed claim amount (typically 1,000,000 tokens). You can claim once per token. To get more, you would need to deploy a new faucet contract.

## Adding New Pairs

### Can I add my own token pairs?

Yes. See the [Adding New Pairs](/docs/adding-new-pairs) guide for instructions on adding custom pairs via local configuration.

### Will my custom pairs appear in the registry?

Custom pairs added via local configuration only appear in the Qube app. To register a pair permanently in the Wrappers Registry, you need to deploy a wrapper and register it through the official Zama protocol process.

## Related

- [Quickstart Guide](/docs/quickstart) for getting started
- [Supported Tokens](/docs/supported-tokens) for the full list of pairs
- [Zama Documentation](https://docs.zama.org/protocol) for more details on the protocol
