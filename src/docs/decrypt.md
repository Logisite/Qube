---
title: Decrypt Balances
description: Reveal encrypted balances using EIP-712 user decryption.
---

## What Is Decryption?

ERC-7984 tokens store balances as encrypted values on-chain. To see the actual amount, you need to decrypt it. Qube uses [EIP-712 user decryption](https://docs.zama.org/protocol/sdk/guides/encrypt-decrypt) to securely reveal your balance without exposing it to anyone else.

## How to Decrypt

### Step 1: Navigate to Assets

Go to the [Assets](/assets) page and click the **Confidential** tab.

### Step 2: Authorize Decryption

Click **Decrypt** next to the token balance you want to reveal. Your wallet will prompt you to sign an EIP-712 permit. This authorizes the decryption session.

### Step 3: View Your Balance

After signing, your decrypted balance appears. The balance is cached for the session, so subsequent decryptions do not require another signature.

## Batch Decryption

To decrypt all your confidential balances at once, click **Decrypt All** on the Assets page. This authorizes decryption for all registered tokens in a single session.

## Custom Token Decryption

To decrypt a balance for any ERC-7984 token (not just registry tokens):

1. Enter the ERC-7984 contract address in the custom token input
2. Click **Decrypt**
3. Sign the EIP-712 permit

This works for any ERC-7984 token, even ones not listed in the registry.

## Under the Hood

The decryption flow uses several Zama SDK hooks:

```tsx
import { useAllow, useIsAllowed, useConfidentialBalance } from "@zama-fhe/react-sdk";

// Step 1: Authorize decryption for a contract
const { mutate: allow } = useAllow();
await allow([tokenAddress]);

// Step 2: Check if authorized
const { data: isAllowed } = useIsAllowed({
  contractAddresses: [tokenAddress],
});

// Step 3: Read the decrypted balance
const { data: balance } = useConfidentialBalance(
  { tokenAddress },
  { enabled: !!isAllowed },
);
```

### Three-Phase Flow

| Phase | What Happens |
|-------|--------------|
| **Authorize** | You sign an EIP-712 permit granting decryption access |
| **Decrypt** | The SDK retrieves the cleartext value from the relayer |
| **Done** | The decrypted balance is displayed and cached |

## Caching

Decrypted values are cached in the browser for the session. This means:

- Subsequent decryptions for the same token are instant
- Cached values survive page reloads
- No additional wallet prompts until the session expires

To force a refresh, click **Decrypt** again.

## Security Considerations

- Only you can decrypt your own balances (the EIP-712 permit is wallet-specific)
- Decrypted values are never stored on-chain
- The relayer cannot read your balance without your authorization
- Sessions have a time-to-live (TTL) and expire after a period

## Related

- [Assets Page](/docs/assets) for managing your balances
- [Zama Encrypt & Decrypt Guide](https://docs.zama.org/protocol/sdk/guides/encrypt-decrypt) for more details
- [Zama User Decryption](https://docs.zama.org/protocol/relayer-sdk-guides/fhevm-relayer/decryption/user-decryption) for the full specification
