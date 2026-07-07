---
title: Browse Registry
description: Explore all official ERC-20 to ERC-7984 wrapper pairs on Sepolia and mainnet.
---

## What Is the Registry?

The Registry page shows all official ERC-20 to ERC-7984 wrapper pairs registered on the selected network. It reads from the on-chain [Confidential Token Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry) contract.

## Supported Networks

Qube supports two networks with separate registries:

| Network | Registry Address | Etherscan |
|---------|-----------------|-----------|
| **Sepolia** (testnet) | `0x2f0750Bbb0A246059d80e94c454586a7F27a128e` | [View](https://sepolia.etherscan.io/address/0x2f0750Bbb0A246059d80e94c454586a7F27a128e) |
| **Ethereum Mainnet** | `0xeb5015fF021DB115aCe010f23F55C2591059bBA0` | [View](https://etherscan.io/address/0xeb5015fF021DB115aCe010f23F55C2591059bBA0) |

## How to Use the Registry

### Browse Token Pairs

Navigate to the [Registry](/registry) page to see all available pairs. Each row displays:

- **Token name** (for example, "Confidential USDC Mock" or "Confidential USDC")
- **Symbol** (for example, "cUSDCMock" or "cUSDC")
- **ERC-20 address** (the underlying public token)
- **ERC-7984 address** (the confidential wrapper token)

### Search

Use the search bar to filter token pairs by name, symbol, or address. The search works across all displayed fields.

### Sort

Click the column headers to sort by name or symbol. Click again to reverse the sort order.

## On-Chain Data

Qube fetches registry data directly from the on-chain contract. If the on-chain fetch fails, the app falls back to a locally cached set of token pairs.

### Registry ABI

The registry contract exposes a single function to read all pairs:

```solidity
function getTokenConfidentialTokenPairs()
    returns (tuple(string symbol, string name, address erc20, address erc7984)[])
```

## Data Sources

Qube uses a hybrid approach for registry data:

1. **Primary**: On-chain reads from the Wrappers Registry contract
2. **Fallback**: Local configuration in `src/lib/tokens.ts`

This ensures the app works even if the on-chain contract is temporarily unavailable.

## Supported Tokens

See the full list of official pairs on the [Supported Tokens](/docs/supported-tokens) page.

## Related

- [Wrap Tokens](/docs/wrap) to convert an ERC-20 into its confidential form
- [Unwrap Tokens](/docs/unwrap) to convert back
- [Adding New Pairs](/docs/adding-new-pairs) to extend the registry
