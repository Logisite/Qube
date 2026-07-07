---
title: Wrap Tokens
description: Convert public ERC-20 tokens into confidential ERC-7984 tokens.
---

## What Is Wrapping?

Wrapping converts a standard ERC-20 token into its confidential ERC-7984 equivalent. The underlying ERC-20 is deposited into a wrapper contract, and you receive an equivalent amount of the confidential token with an encrypted balance.

For example, wrapping 100 USDC gives you 100 cUSDCMock (confidential USDC) with an encrypted balance that only you can decrypt.

## How to Wrap

### Step 1: Navigate to Wrap

Go to the [Wrap](/wrap) page.

### Step 2: Select a Token

Choose which ERC-20 token you want to wrap from the dropdown. Only tokens with official wrappers in the registry are available.

### Step 3: Enter an Amount

Type the amount of tokens you want to wrap. The form shows your current ERC-20 balance so you know how much is available.

### Step 4: Approve and Wrap

Click **Wrap**. Your wallet will prompt you for two transactions:

1. **ERC-20 Approval**: Authorize the wrapper contract to spend your tokens
2. **Shield Transaction**: Execute the wrap on-chain

After both confirm, your ERC-20 tokens are converted to confidential ERC-7984 tokens.

## Approval Strategies

Qube supports three approval strategies to control how the wrapper contract is approved:

| Strategy | Behavior |
|----------|----------|
| **Exact** | Approves only the amount you are wrapping. Safest, but costs an approval transaction every time. |
| **Max** | Approves `type(uint256).max`. One approval covers all future wraps for this token. |
| **Skip** | Skips the approval step entirely. Use this if you have already approved the wrapper contract. |

The default strategy is **Exact**. You can change it in the wrap form.

## Under the Hood

The wrap operation uses [Zama's `useShield` hook](https://docs.zama.org/protocol/sdk/api-references/react/useshield):

```tsx
import { useShield } from "@zama-fhe/react-sdk";

const { mutateAsync: shield, isPending } = useShield({
  tokenAddress: "0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF", // ERC-20 address
  wrapperAddress: "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639", // ERC-7984 address
});

// Shield 100 tokens
const { txHash, receipt } = await shield({ amount: 1000000n }); // 6 decimals
```

The SDK handles:

- ERC-20 approval (if needed)
- The shield transaction
- Balance cache invalidation after success

## Decimal Handling

The wrapper enforces a maximum of 6 decimals for the confidential token. When wrapping, amounts are rounded down and excess tokens are refunded. For example, if you wrap 10.1234567 USDC (6 decimals), you receive 10.123456 cUSDCMock and the remaining 0.0000007 is refunded.

## Error Handling

| Error | Cause |
|-------|-------|
| `InsufficientERC20BalanceError` | Your ERC-20 balance is less than the wrap amount |
| Transaction reverted | Insufficient gas or wrong network |

## Related

- [Unwrap Tokens](/docs/unwrap) to convert back to ERC-20
- [Decrypt Balances](/docs/decrypt) to see your encrypted balance
- [Zama Shield Guide](https://docs.zama.org/protocol/sdk/guides/shield-tokens) for more details
