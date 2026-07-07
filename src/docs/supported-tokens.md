---
title: Supported Tokens
description: Full list of all 7 official token pairs with addresses.
---

## Official Token Pairs

Qube supports 7 official ERC-20 to ERC-7984 wrapper pairs registered on the Sepolia testnet.

| Symbol | Display Name | ERC-20 Address | ERC-7984 Address | Decimals |
|--------|-------------|----------------|------------------|----------|
| cUSDCMock | USDC | `0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF` | `0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639` | 6 |
| cUSDTMock | USDT | `0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0` | `0x4E7B06D78965594eB5EF5414c357ca21E1554491` | 6 |
| cWETHMock | WETH | `0xff54739b16576FA5402F211D0b938469Ab9A5f3F` | `0x46208622DA27d91db4f0393733C8BA082ed83158` | 18 |
| cBRONMock | BRON | `0xFf021fB13cA64e5354c62c954b949a88cfDEb25E` | `0xaa5612FA27c927a0c7961f5AEFEE5ba3A0F9C891` | 18 |
| cZAMAMock | ZAMA | `0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57` | `0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB` | 18 |
| ctGBPMock | tGBP | `0x93c931278A2aad1916783F952f94276eA5111442` | `0xfCE5c7069c5525eF6c8C2b2E35A745bA20a2F7CC` | 6 |
| cXAUtMock | XAUt | `0x24377AE4AA0C45ecEe71225007f17c5D423dd940` | `0xe4FcF848739845BC81Dee1d5352cf3844F0a60C7` | 6 |

## Network

All pairs are deployed on **Sepolia** testnet.

## Registry Contract

The on-chain Wrappers Registry is at:

```
0x2f0750Bbb0A246059d80e94c454586a7F27a128e
```

## Token Details

### USDC (cUSDCMock)

- **Decimals**: 6
- **Type**: Stablecoin mock
- **Use case**: Testing confidential stablecoin transfers

### USDT (cUSDTMock)

- **Decimals**: 6
- **Type**: Stablecoin mock
- **Use case**: Testing confidential stablecoin transfers

### WETH (cWETHMock)

- **Decimals**: 18
- **Type**: Wrapped Ether mock
- **Use case**: Testing confidential ETH-pegged transfers

### BRON (cBRONMock)

- **Decimals**: 18
- **Type**: Utility token mock
- **Use case**: Testing confidential utility token transfers

### ZAMA (cZAMAMock)

- **Decimals**: 18
- **Type**: Protocol token mock
- **Use case**: Testing confidential protocol token transfers

### tGBP (ctGBPMock)

- **Decimals**: 6
- **Type**: Stablecoin mock (British Pound)
- **Use case**: Testing confidential fiat-pegged transfers

### XAUt (cXAUtMock)

- **Decimals**: 6
- **Type**: Commodity token mock (Gold)
- **Use case**: Testing confidential commodity-backed transfers

## Related

- [Browse Registry](/docs/registry) to explore pairs in the app
- [Wrap Tokens](/docs/wrap) to convert ERC-20 to ERC-7984
- [Adding New Pairs](/docs/adding-new-pairs) to extend the list
- [Zama Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry) for the official registry
