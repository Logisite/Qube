export interface DocPage {
  slug: string
  title: string
  description: string
}

export interface DocGroup {
  title: string
  pages: DocPage[]
}

export const DOC_GROUPS: DocGroup[] = [
  {
    title: "Introduction",
    pages: [
      {
        slug: "introduction",
        title: "What is Qube?",
        description: "Learn about the Confidential Wrapper Registry and why canonical pairs matter.",
      },
    ],
  },
  {
    title: "Getting Started",
    pages: [
      {
        slug: "quickstart",
        title: "Quickstart Guide",
        description: "Get up and running in minutes: connect, claim, wrap, decrypt.",
      },
    ],
  },
  {
    title: "Core Features",
    pages: [
      {
        slug: "registry",
        title: "Browse Registry",
        description: "Explore all official ERC-20 to ERC-7984 wrapper pairs on Sepolia.",
      },
      {
        slug: "wrap",
        title: "Wrap Tokens",
        description: "Convert public ERC-20 tokens into confidential ERC-7984 tokens.",
      },
      {
        slug: "unwrap",
        title: "Unwrap Tokens",
        description: "Convert confidential ERC-7984 tokens back to public ERC-20.",
      },
      {
        slug: "decrypt",
        title: "Decrypt Balances",
        description: "Reveal encrypted balances using EIP-712 user decryption.",
      },
      {
        slug: "faucet",
        title: "Use Faucet",
        description: "Claim official cTokenMock test tokens on Sepolia.",
      },
    ],
  },
  {
    title: "Developer Guide",
    pages: [
      {
        slug: "adding-new-pairs",
        title: "Adding New Token Pairs",
        description: "How to extend the registry with new ERC-20 to ERC-7984 pairs.",
      },
    ],
  },
  {
    title: "Reference",
    pages: [
      {
        slug: "supported-tokens",
        title: "Supported Tokens",
        description: "Full list of all 7 official token pairs with addresses.",
      },
      {
        slug: "faq",
        title: "FAQ",
        description: "Common questions and troubleshooting.",
      },
    ],
  },
]

export function getAllDocPages(): DocPage[] {
  return DOC_GROUPS.flatMap((group) => group.pages)
}

export function getDocBySlug(slug: string): DocPage | undefined {
  return getAllDocPages().find((page) => page.slug === slug)
}

export function getDocNavigation(slug: string): { prev: DocPage | null; next: DocPage | null } {
  const pages = getAllDocPages()
  const index = pages.findIndex((page) => page.slug === slug)

  return {
    prev: index > 0 ? pages[index - 1] : null,
    next: index < pages.length - 1 ? pages[index + 1] : null,
  }
}
