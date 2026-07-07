---
title: Quickstart Guide
description: Get up and running in minutes: connect, claim, wrap, decrypt.
---

## Prerequisites

Before you begin, make sure you have:

- A browser wallet (MetaMask, Rainbow, etc.)
- Your wallet connected to the **Sepolia** testnet
- Some Sepolia ETH for gas (get it from a [Sepolia faucet](https://sepoliafaucet.com))

## Step 1: Connect Your Wallet

1. Open the [Qube app](/)
2. Click **Connect Wallet** in the top right
3. Select your wallet and approve the connection
4. Make sure you are on the **Sepolia** network

## Step 2: Get Test Tokens

1. Navigate to the [Faucet](/faucet) page
2. Click **Mint Dev Bundle** to claim all official cTokenMock test tokens at once
3. Wait for the transactions to confirm on Sepolia

You now have a set of public ERC-20 tokens ready to wrap.

## Step 3: Wrap a Token

1. Navigate to the [Wrap](/wrap) page
2. Select a token from the dropdown (for example, **USDC**)
3. Enter an amount to wrap (for example, `100`)
4. Click **Wrap**
5. Approve the ERC-20 spending in your wallet
6. Confirm the shield transaction
7. Wait for the transaction to confirm

Your public ERC-20 tokens are now encrypted as ERC-7984 confidential tokens.

## Step 4: Decrypt Your Balance

1. Navigate to the [Assets](/assets) page
2. Click the **Confidential** tab
3. Click **Decrypt** next to the token you just wrapped
4. Sign the EIP-712 permit in your wallet
5. Your decrypted balance appears

## Step 5: Unwrap Back to ERC-20

1. Navigate to the [Unwrap](/unwrap) page
2. Select the same token you wrapped
3. Enter an amount to unwrap
4. Click **Unwrap**
5. Confirm the unshield transaction in your wallet
6. Wait for the transaction to confirm

Your confidential tokens are now back to their public ERC-20 form.

## What Just Happened

Under the hood, Qube used [Zama's FHE SDK](https://docs.zama.org/protocol/sdk) to:

- **Shield**: Convert your ERC-20 tokens into encrypted ERC-7984 form via the wrapper contract
- **Decrypt**: Use EIP-712 user decryption to reveal your encrypted balance
- **Unshield**: Convert encrypted tokens back to public ERC-20 via a two-step unwrap and finalize flow

## Next Steps

- [Browse the Registry](/docs/registry) to see all official token pairs
- [Learn about Decryption](/docs/decrypt) to understand the EIP-712 flow
- [Add New Token Pairs](/docs/adding-new-pairs) to extend the registry
