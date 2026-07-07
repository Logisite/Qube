---
title: Unwrap Tokens
description: Convert confidential ERC-7984 tokens back to public ERC-20.
---

## What Is Unwrapping?

Unwrapping converts confidential ERC-7984 tokens back into their public ERC-20 form. The process burns your encrypted tokens and returns the equivalent amount of the underlying ERC-20 to your wallet.

## How to Unwrap

### Step 1: Navigate to Unwrap

Go to the [Unwrap](/unwrap) page.

### Step 2: Select a Token

Choose which confidential ERC-7984 token you want to unwrap from the dropdown.

### Step 3: Enter an Amount

Type the amount of confidential tokens you want to unwrap. The form shows your current confidential balance so you know how much is available.

### Step 4: Confirm

Click **Unwrap**. Your wallet will prompt you to confirm the unshield transaction.

After the transaction confirms, your confidential tokens are converted back to public ERC-20 tokens.

## Two-Step Process

At the contract level, unwrapping is a two-step asynchronous process:

1. **Unwrap Request**: Burns the encrypted amount and emits an `UnwrapRequested` event
2. **Finalize**: Decrypts the amount publicly and sends the equivalent ERC-20 tokens to the recipient

Qube handles both steps in a single call using [Zama's `useUnshield` hook](https://docs.zama.org/protocol/sdk/api-references/react/useunshield). If the page closes between steps, you can resume with `useResumeUnshield`.

## Under the Hood

The unwrap operation uses Zama's React SDK:

```tsx
import { useUnshield } from "@zama-fhe/react-sdk";

const { mutateAsync: unshield, isPending } = useUnshield({
  tokenAddress: "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639",
});

await unshield({
  amount: 500n,
  onUnwrapSubmitted: (txHash) => console.log("Unwrap tx:", txHash),
  onFinalizing: () => console.log("Waiting for decryption proof..."),
  onFinalizeSubmitted: (txHash) => console.log("Finalized:", txHash),
});
```

## Callbacks

The `useUnshield` hook provides three callbacks to track progress:

| Callback | When It Fires |
|----------|---------------|
| `onUnwrapSubmitted` | The unwrap transaction is submitted on-chain |
| `onFinalizing` | The SDK begins waiting for the decryption proof |
| `onFinalizeSubmitted` | The finalize transaction is submitted on-chain |

## Error Handling

| Error | Cause |
|-------|-------|
| `InsufficientConfidentialBalanceError` | Your confidential balance is less than the unwrap amount |
| `BalanceCheckUnavailableError` | No cached credentials. Call `allow()` first or use `skipBalanceCheck: true` |
| Transaction reverted | Insufficient gas or wrong network |

## Related

- [Wrap Tokens](/docs/wrap) to convert ERC-20 to ERC-7984
- [Decrypt Balances](/docs/decrypt) to see your encrypted balance before unwrapping
- [Zama Unshield Guide](https://docs.zama.org/protocol/sdk/guides/unshield-tokens) for more details
