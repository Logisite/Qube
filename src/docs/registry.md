---
title: Browse Registry
description: Explore all official ERC-20 to ERC-7984 wrapper pairs on Sepolia.
---

## What Is the Registry?

The Registry page shows all official ERC-20 to ERC-7984 wrapper pairs registered on the Sepolia testnet. It reads from the on-chain [Confidential Token Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry) contract.

## How to Use the Registry

### Browse Token Pairs

Navigate to the [Registry](/registry) page to see all available pairs. Each row displays:

- **Token name** (for example, "Confidential USDC Mock")
- **Symbol** (for example, "cUSDCMock")
- **ERC-20 address** (the underlying public token)
- **ERC-7984 address** (the confidential wrapper token)

### Search

Use the search bar to filter token pairs by name, symbol, or address. The search works across all displayed fields.

### Sort

Click the column headers to sort by name or symbol. Click again to reverse the sort order.

## On-Chain Data

Qube fetches registry data directly from the on-chain contract at address:

```
0x2f0750Bbb0A246059d80e94c454586a7F27a128e
```

If the on-chain fetch fails, the app falls back to a locally cached set of token pairs.

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
