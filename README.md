# Qube

A Confidential Wrapper Registry dApp for browsing, wrapping, unwrapping, and decrypting official ERC-20 to ERC-7984 token pairs on Sepolia and Ethereum mainnet.

[![License](https://img.shields.io/badge/License-Apache_2.0-white.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev)

## Why

Many developers create their own ERC-20 testnet tokens and ERC-7984 wrappers instead of using the official Zama Wrappers Registry. This fragments the ecosystem. Qube provides a single interface to all canonical pairs so integrations compose naturally and users get a consistent experience.

## Features

- **Browse** - View all official ERC-20 to ERC-7984 wrapper pairs from the on-chain registry
- **Wrap** - Convert any registry ERC-20 into its confidential ERC-7984 equivalent
- **Unwrap** - Convert confidential tokens back to their public ERC-20 form
- **Decrypt** - Reveal encrypted balances using EIP-712 user decryption
- **Faucet** - Claim official cTokenMock test tokens on Sepolia
- **Dual-network** - Supports Sepolia (7 pairs) and Ethereum mainnet (9 pairs)
- **Docs** - Built-in GitBook-style documentation with dark mode

## Supported Networks

| Network | Registry Address | Token Pairs |
|---------|-----------------|-------------|
| Sepolia (testnet) | `0x2f0750Bbb0A246059d80e94c454586a7F27a128e` | 7 (Mock tokens) |
| Ethereum Mainnet | `0xeb5015fF021DB115aCe010f23F55C2591059bBA0` | 9 (Real tokens) |

## Quick Start

```bash
git clone https://github.com/your-org/qube.git
cd qube
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) and connect your wallet to Sepolia or mainnet.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Language | TypeScript |
| Build | Vite 8 |
| Web3 | wagmi + viem |
| FHE | Zama FHE SDK |
| Styling | Tailwind CSS |
| Docs | react-markdown + shiki |

## Repository Overview

```
src/
  pages/          # Route components (WrapPage, UnwrapPage, FaucetPage, etc.)
  components/     # UI components including docs layout and landing page
  lib/            # Core logic (tokens, config, chains, registry)
  hooks/          # React hooks (balances, decryption, allowance)
  providers/      # Web3 and query providers
  docs/           # Markdown documentation files
```

## Documentation

Full documentation is available in [`src/docs/`](./src/docs/):

- [Introduction](./src/docs/introduction.md) - What Qube is and why it exists
- [Quickstart](./src/docs/quickstart.md) - Get up and running in minutes
- [Supported Tokens](./src/docs/supported-tokens.md) - All official pairs on both networks
- [Registry](./src/docs/registry.md) - How the on-chain registry works
- [Wrap](./src/docs/wrap.md) / [Unwrap](./src/docs/unwrap.md) - Token conversion flows
- [Decrypt](./src/docs/decrypt.md) - EIP-712 user decryption
- [Faucet](./src/docs/faucet.md) - Claiming test tokens on Sepolia

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make changes and test with `pnpm dev`
4. Submit a pull request

## License

[Apache 2.0](./LICENSE)
