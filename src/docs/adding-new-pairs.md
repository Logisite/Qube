---
title: Adding New Token Pairs
description: How to extend the registry with new ERC-20 to ERC-7984 pairs.
---

## Overview

Qube supports a hybrid registry model: the on-chain Wrappers Registry is the primary source of truth, but you can also declare custom or dev-only pairs via local configuration. This page explains how to add new ERC-20 to ERC-7984 pairs to the app.

## Adding a Pair via Local Configuration

### Step 1: Get the Contract Addresses

You need:

- The **ERC-20 token address** on Sepolia
- The **ERC-7984 wrapper address** on Sepolia

### Step 2: Add to `src/lib/tokens.ts`

Open `src/lib/tokens.ts` and add a new entry to the `TOKEN_PAIRS` array:

```typescript
export const TOKEN_PAIRS: TokenPair[] = [
  // ... existing pairs
  {
    symbol: "cMYTOKENMock",
    name: "Confidential MYTOKEN Mock",
    displayName: "MYTOKEN",
    erc20: {
      address: "0xYourERC20AddressHere",
      decimals: 18,
    },
    erc7984: {
      address: "0xYourERC7984AddressHere",
      decimals: 18,
    },
  },
]
```

### Step 3: Verify the Token Interface

Make sure your ERC-20 token implements the standard interface:

```solidity
function balanceOf(address owner) view returns (uint256)
function approve(address spender, uint256 amount) returns (bool)
function allowance(address owner, address spender) view returns (uint256)
```

And your ERC-7984 wrapper implements the [ERC-7984 interface](https://eips.ethereum.org/EIPS/eip-7984):

```solidity
function confidentialBalanceOf(address account) returns (euint64)
function confidentialTransfer(address to, externalEuint64 amount, bytes calldata proof) returns (euint64)
```

### Step 4: Test

1. Start the dev server: `pnpm dev`
2. Navigate to the [Registry](/registry) page
3. Verify your new pair appears in the list
4. Try wrapping and unwrapping on the [Wrap](/wrap) and [Unwrap](/unwrap) pages

## Adding a Pair via On-Chain Registration

To register a pair permanently in the Wrappers Registry contract, you need to deploy a wrapper and register it through the official Zama protocol process.

### Prerequisites

- Deploy an ERC-20 token on Sepolia
- Deploy a [ConfidentialWrapper](https://github.com/zama-ai/protocol-apps/blob/main/contracts/confidential-wrapper/contracts/ConfidentialWrapper.sol) contract for your token
- Register the pair in the [Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry)

### Resources

- [Zama Confidential Wrapper Documentation](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/confidential-wrapper)
- [OpenZeppelin Confidential Contracts](https://docs.openzeppelin.com/confidential-contracts)
- [Wrapper Registry Source Code](https://github.com/zama-ai/protocol-apps)

## TokenPair Interface

The `TokenPair` type used in `src/lib/tokens.ts`:

```typescript
export interface TokenPair {
  symbol: string        // Symbol of the confidential token (e.g., "cUSDCMock")
  name: string          // Full name (e.g., "Confidential USDC Mock")
  displayName: string   // Short display name (e.g., "USDC")
  erc20: {
    address: `0x${string}`  // ERC-20 token contract address
    decimals: number        // Number of decimals (e.g., 6 or 18)
  }
  erc7984: {
    address: `0x${string}`  // ERC-7984 wrapper contract address
    decimals: number        // Number of decimals (must match or be <= 6)
  }
}
```

## Related

- [Supported Tokens](/docs/supported-tokens) for the current list of official pairs
- [Registry](/docs/registry) to see how pairs are displayed
- [Zama Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry) for the official registry documentation
