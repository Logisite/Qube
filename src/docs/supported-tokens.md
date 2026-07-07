---
title: Supported Tokens
description: Full list of all official token pairs on Sepolia and mainnet.
---

## Sepolia Testnet (7 pairs)

| Symbol | Display Name | ERC-20 Address | ERC-7984 Address | Decimals |
|--------|-------------|----------------|------------------|----------|
| cUSDCMock | USDC | `0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF` | `0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639` | 6 |
| cUSDTMock | USDT | `0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0` | `0x4E7B06D78965594eB5EF5414c357ca21E1554491` | 6 |
| cWETHMock | WETH | `0xff54739b16576FA5402F211D0b938469Ab9A5f3F` | `0x46208622DA27d91db4f0393733C8BA082ed83158` | 18 |
| cBRONMock | BRON | `0xFf021fB13cA64e5354c62c954b949a88cfDEb25E` | `0xaa5612FA27c927a0c7961f5AEFEE5ba3A0F9C891` | 18 |
| cZAMAMock | ZAMA | `0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57` | `0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB` | 18 |
| ctGBPMock | tGBP | `0x93c931278A2aad1916783F952f94276eA5111442` | `0xfCE5c7069c5525eF6c8C2b2E35A745bA20a2F7CC` | 6 |
| cXAUtMock | XAUt | `0x24377AE4AA0C45ecEe71225007f17c5D423dd940` | `0xe4FcF848739845BC81Dee1d5352cf3844F0a60C7` | 6 |

## Ethereum Mainnet (9 pairs)

| Symbol | Display Name | ERC-20 Address | ERC-7984 Address | Decimals |
|--------|-------------|----------------|------------------|----------|
| cUSDC | USDC | `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` | `0xe978F22157048E5DB8E5d07971376e86671672B2` | 6 |
| cUSDT | USDT | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | `0xAe0207C757Aa2B4019Ad96edD0092ddc63EF0c50` | 6 |
| cWETH | WETH | `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2` | `0xda9396b82634Ea99243cE51258B6A5Ae512D4893` | 18 |
| cBRON | BRON | `0xBA2C598E11eD093079cC324FCa5BbbA99F616E83` | `0x85dE671c3bec1aDeD752c3Cea943521181C826bc` | 18 |
| cZAMA | ZAMA | `0xA12CC123ba206d4031D1c7f6223D1C2Ec249f4f3` | `0x80CB147Fd86dC6dEe3Eee7e4Cee33d1397d98071` | 18 |
| ctGBP | tGBP | `0x27f6c8289550fce67f6b50bed1f519966afe5287` | `0xa873750ccBafD5ec7Dd13bfD5237d7129832eDD9` | 6 |
| cXAUt | XAUt | `0x68749665FF8D2d112Fa859AA293F07A622782F38` | `0x73cc9aF9d6BEFdb3c3fAf8a5E8c05Cb95FdaEEf1` | 6 |
| cbbqTGBP | bbqTGBP | `0xbeeffABcd0dB09589Dd21854aa760C52aB4bf04F` | `0xBA4cFF6ED6F7Cb2A58776dECa4E984b498446762` | 6 |
| csteakcUSDC | steakcUSDC | `0xbEEF00A59B577423653A1526c7009bdE103F542B` | `0x66Bf74E96900D1a19c7070D939D124f2F565C458` | 6 |

## Network

- **Sepolia**: 7 pairs with `Mock` suffix (test tokens)
- **Mainnet**: 9 pairs with real tokens (no `Mock` suffix)

Mainnet has 2 additional tokens not on Sepolia: **bbqTGBP** and **steakcUSDC**.

## Registry Contract

| Network | Address |
|---------|---------|
| Sepolia | `0x2f0750Bbb0A246059d80e94c454586a7F27a128e` |
| Mainnet | `0xeb5015fF021DB115aCe010f23F55C2591059bBA0` |

## Token Details

### USDC (cUSDCMock / cUSDC)

- **Decimals**: 6
- **Type**: Stablecoin
- **Use case**: Confidential stablecoin transfers

### USDT (cUSDTMock / cUSDT)

- **Decimals**: 6
- **Type**: Stablecoin
- **Use case**: Confidential stablecoin transfers

### WETH (cWETHMock / cWETH)

- **Decimals**: 18
- **Type**: Wrapped Ether
- **Use case**: Confidential ETH-pegged transfers

### BRON (cBRONMock / cBRON)

- **Decimals**: 18
- **Type**: Utility token
- **Use case**: Confidential utility token transfers

### ZAMA (cZAMAMock / cZAMA)

- **Decimals**: 18
- **Type**: Protocol token
- **Use case**: Confidential protocol token transfers

### tGBP (ctGBPMock / ctGBP)

- **Decimals**: 6
- **Type**: Stablecoin (British Pound)
- **Use case**: Confidential fiat-pegged transfers

### XAUt (cXAUtMock / cXAUt)

- **Decimals**: 6
- **Type**: Commodity token (Gold)
- **Use case**: Confidential commodity-backed transfers

### bbqTGBP (mainnet only)

- **Decimals**: 6
- **Type**: Yield-bearing stablecoin
- **Use case**: Confidential yield token transfers

### steakcUSDC (mainnet only)

- **Decimals**: 6
- **Type**: Yield-bearing stablecoin
- **Use case**: Confidential yield token transfers

## Related

- [Browse Registry](/docs/registry) to explore pairs in the app
- [Wrap Tokens](/docs/wrap) to convert ERC-20 to ERC-7984
- [Adding New Pairs](/docs/adding-new-pairs) to extend the list
- [Zama Wrappers Registry](https://docs.zama.org/protocol/protocol-apps/confidential-tokens/wrapper-registry) for the official registry
