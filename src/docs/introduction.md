---
title: What is Qube?
description: Learn about the Confidential Wrapper Registry and why canonical pairs matter.
---

## The Problem

Many developers spin up their own ERC-20 testnet tokens and ERC-7984 wrappers instead of using the ones that already exist in the official Zama Wrappers Registry. This fragments the ecosystem:

- Every team ships against a slightly different set of tokens
- Integrations do not compose across projects
- Users end up with a wallet full of look-alike confidential assets that do not interoperate

## What Qube Does

Qube is a **Confidential Wrapper Registry** that turns the official Zama Wrappers Registry into a usable product. It is a single dApp where every developer and user can:

- **Browse** all official ERC-20 to ERC-7984 wrapper pairs on Sepolia
- **Wrap** any registry ERC-20 into its confidential ERC-7984 equivalent
- **Unwrap** confidential tokens back to their public ERC-20 form
- **Decrypt** encrypted balances using EIP-712 user decryption
- **Claim** official cTokenMock test tokens via the built-in faucet

## Why Canonical Pairs Matter

The [Confidential Token Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry) is an on-chain contract that maps ERC-20 tokens to their corresponding ERC-7984 confidential token wrappers. It provides a canonical directory for discovering which ERC-20 tokens have official confidential wrappers.

When everyone uses the same canonical pairs:

- Integrations compose naturally
- Wallets can reliably display confidential balances
- Developers build against a stable, well-documented set of contracts
- Users have a consistent experience across applications

## How It Works

Qube reads the official on-chain Wrappers Registry as the primary source of truth. It also supports a local configuration for custom or dev-only pairs.

The core flow:

1. **Connect** your wallet to Sepolia
2. **Claim** test tokens from the faucet
3. **Wrap** an ERC-20 token into its confidential form
4. **Decrypt** your encrypted balance to see the amount
5. **Unwrap** back to the public ERC-20 when done

All shield, unshield, and decrypt operations are powered by [Zama's FHE SDK](https://docs.zama.org/protocol/sdk).

## Learn More

- [Quickstart Guide](/docs/quickstart) to get up and running
- [Supported Tokens](/docs/supported-tokens) for the full list of official pairs
- [ERC-7984 Standard](https://eips.ethereum.org/EIPS/eip-7984) for the technical specification
