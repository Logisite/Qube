export interface TokenPair {
  symbol: string
  name: string
  displayName: string
  erc20: { address: `0x${string}`; decimals: number }
  erc7984: { address: `0x${string}`; decimals: number }
}

export function formatDisplayName(pair: TokenPair): string {
  return pair.displayName
}

export const SEPOLIA_TOKEN_PAIRS: TokenPair[] = [
  {
    symbol: "cUSDCMock",
    name: "Confidential USDC Mock",
    displayName: "USDC",
    erc20: { address: "0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF", decimals: 6 },
    erc7984: { address: "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639", decimals: 6 },
  },
  {
    symbol: "cUSDTMock",
    name: "Confidential USDT Mock",
    displayName: "USDT",
    erc20: { address: "0xa7dA08FafDC9097Cc0E7D4f113A61e31d7e8e9b0", decimals: 6 },
    erc7984: { address: "0x4E7B06D78965594eB5EF5414c357ca21E1554491", decimals: 6 },
  },
  {
    symbol: "cWETHMock",
    name: "Confidential WETH Mock",
    displayName: "WETH",
    erc20: { address: "0xff54739b16576FA5402F211D0b938469Ab9A5f3F", decimals: 18 },
    erc7984: { address: "0x46208622DA27d91db4f0393733C8BA082ed83158", decimals: 18 },
  },
  {
    symbol: "cBRONMock",
    name: "Confidential BRON Mock",
    displayName: "BRON",
    erc20: { address: "0xFf021fB13cA64e5354c62c954b949a88cfDEb25E", decimals: 18 },
    erc7984: { address: "0xaa5612FA27c927a0c7961f5AEFEE5ba3A0F9C891", decimals: 18 },
  },
  {
    symbol: "cZAMAMock",
    name: "Confidential ZAMA Mock",
    displayName: "ZAMA",
    erc20: { address: "0x75355a85c6FB9df5f0C80FF54e8747EEe9a0BF57", decimals: 18 },
    erc7984: { address: "0xf2D628d2598aF4eAF94CB76a437Ff86CA78FfbFB", decimals: 18 },
  },
  {
    symbol: "ctGBPMock",
    name: "Confidential tGBP Mock",
    displayName: "tGBP",
    erc20: { address: "0x93c931278A2aad1916783F952f94276eA5111442", decimals: 6 },
    erc7984: { address: "0xfCE5c7069c5525eF6c8C2b2E35A745bA20a2F7CC", decimals: 6 },
  },
  {
    symbol: "cXAUtMock",
    name: "Confidential XAUt Mock",
    displayName: "XAUt",
    erc20: { address: "0x24377AE4AA0C45ecEe71225007f17c5D423dd940", decimals: 6 },
    erc7984: { address: "0xe4FcF848739845BC81Dee1d5352cf3844F0a60C7", decimals: 6 },
  },
]

export const MAINNET_TOKEN_PAIRS: TokenPair[] = [
  {
    symbol: "cUSDC",
    name: "Confidential USDC",
    displayName: "USDC",
    erc20: { address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6 },
    erc7984: { address: "0xe978F22157048E5DB8E5d07971376e86671672B2", decimals: 6 },
  },
  {
    symbol: "cUSDT",
    name: "Confidential USDT",
    displayName: "USDT",
    erc20: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
    erc7984: { address: "0xAe0207C757Aa2B4019Ad96edD0092ddc63EF0c50", decimals: 6 },
  },
  {
    symbol: "cWETH",
    name: "Confidential WETH",
    displayName: "WETH",
    erc20: { address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", decimals: 18 },
    erc7984: { address: "0xda9396b82634Ea99243cE51258B6A5Ae512D4893", decimals: 18 },
  },
  {
    symbol: "cBRON",
    name: "Confidential BRON",
    displayName: "BRON",
    erc20: { address: "0xBA2C598E11eD093079cC324FCa5BbbA99F616E83", decimals: 18 },
    erc7984: { address: "0x85dE671c3bec1aDeD752c3Cea943521181C826bc", decimals: 18 },
  },
  {
    symbol: "cZAMA",
    name: "Confidential ZAMA",
    displayName: "ZAMA",
    erc20: { address: "0xA12CC123ba206d4031D1c7f6223D1C2Ec249f4f3", decimals: 18 },
    erc7984: { address: "0x80CB147Fd86dC6dEe3Eee7e4Cee33d1397d98071", decimals: 18 },
  },
  {
    symbol: "ctGBP",
    name: "Confidential tGBP",
    displayName: "tGBP",
    erc20: { address: "0x27f6c8289550fce67f6b50bed1f519966afe5287", decimals: 6 },
    erc7984: { address: "0xa873750ccBafD5ec7Dd13bfD5237d7129832eDD9", decimals: 6 },
  },
  {
    symbol: "cXAUt",
    name: "Confidential XAUt",
    displayName: "XAUt",
    erc20: { address: "0x68749665FF8D2d112Fa859AA293F07A622782F38", decimals: 6 },
    erc7984: { address: "0x73cc9aF9d6BEFdb3c3fAf8a5E8c05Cb95FdaEEf1", decimals: 6 },
  },
  {
    symbol: "cbbqTGBP",
    name: "Confidential bbqTGBP",
    displayName: "bbqTGBP",
    erc20: { address: "0xbeeffABcd0dB09589Dd21854aa760C52aB4bf04F", decimals: 6 },
    erc7984: { address: "0xBA4cFF6ED6F7Cb2A58776dECa4E984b498446762", decimals: 6 },
  },
  {
    symbol: "csteakcUSDC",
    name: "Confidential steakcUSDC",
    displayName: "steakcUSDC",
    erc20: { address: "0xbEEF00A59B577423653A1526c7009bdE103F542B", decimals: 6 },
    erc7984: { address: "0x66Bf74E96900D1a19c7070D939D124f2F565C458", decimals: 6 },
  },
]

export function getTokenPairsForChain(chainId: number | undefined): TokenPair[] {
  if (chainId === 1) return MAINNET_TOKEN_PAIRS
  return SEPOLIA_TOKEN_PAIRS
}

export const TOKEN_PAIRS = SEPOLIA_TOKEN_PAIRS
