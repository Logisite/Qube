---
title: Use Faucet
description: Claim official cTokenMock test tokens on Sepolia.
---

## What Is the Faucet?

The Faucet page lets you claim official cTokenMock test tokens on the Sepolia testnet. These are the same tokens registered in the [Confidential Token Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry), so you can immediately try the wrap and unwrap flow.

## Network Availability

The faucet is available on **Sepolia only**. On Ethereum mainnet, you need to already have ERC-20 tokens (USDC, USDT, WETH, etc.) in your wallet to use the wrap and unwrap features.

## How to Use the Faucet

### Step 1: Navigate to Faucet

Go to the [Faucet](/faucet) page.

### Step 2: Connect Your Wallet

Make sure your wallet is connected and on the **Sepolia** network.

### Step 3: Claim Tokens

You have two options:

**Mint Dev Bundle**: Click this button to mint all available test tokens in sequence. This is the fastest way to get started.

**Individual Claim**: Click the claim button next to any specific token to mint it individually.

### Step 4: Wait for Confirmation

Each mint transaction is submitted to Sepolia. Wait for the transactions to confirm before proceeding.

## Available Tokens

| Token | Claim Amount | Notes |
|-------|-------------|-------|
| USDC | 1,000,000 | 6 decimals |
| USDT | 1,000,000 | 6 decimals |
| WETH | 1 WETH | 18 decimals |
| BRON | 1,000,000 | 18 decimals |
| ZAMA | 1,000,000 | 18 decimals |
| tGBP | 1,000,000 | 6 decimals |
| XAUt | 1,000,000 | 6 decimals |

## Permissions

Not all tokens have permissionless faucets. Some tokens (like ctGBP) have restricted mint functions. For these tokens, you may need to use an alternative method to obtain test tokens.

## What to Do After Claiming

Once you have test tokens, you can:

1. **Wrap** them into confidential ERC-7984 tokens on the [Wrap](/wrap) page
2. **Decrypt** your encrypted balances on the [Assets](/assets) page
3. **Unwrap** them back to ERC-20 on the [Unwrap](/unwrap) page

## Related

- [Quickstart Guide](/docs/quickstart) for the full getting-started flow
- [Supported Tokens](/docs/supported-tokens) for the full list of official pairs
