// Movement Network Configuration
export const MOVEMENT_CONFIG = {
  // Network
  NETWORK: (process.env.NEXT_PUBLIC_MOVEMENT_NETWORK || 'testnet') as 'testnet' | 'mainnet',
  RPC_URL: process.env.NEXT_PUBLIC_MOVEMENT_RPC_URL || 'https://testnet.movementnetwork.xyz/v1',
  FAUCET_URL: process.env.NEXT_PUBLIC_FAUCET_URL || 'https://faucet.testnet.movementnetwork.xyz',
  EXPLORER_URL: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://explorer.movementnetwork.xyz',

  // Contract addresses (will be set after deployment)
  PACKAGE_ADDRESS: process.env.NEXT_PUBLIC_PACKAGE_ADDRESS || "0x234e25fcd07fc478e6d223b72acaf9fa5b1cdc3f4d7dde5b0d1bd1f80f627b0e",

  // Module names
  MODULES: {
    FIGHTER_NFT: 'simple_fighter',
    BATTLE_SYSTEM: 'simple_battle',
    STAKING_POOL: 'simple_staking',
  },

  // Game settings (amounts in Octas - 1 APT = 100,000,000 Octas)
  ENTRY_FEE: 10_000_000, // 0.1 MOVE
  MINT_FEE: 1_000_000, // 0.01 MOVE

  // Fighter types mapping (must match IDs in lib/fighters.ts)
  FIGHTER_TYPES: {
    'the-boxer': 0,        // Thunder Fist
    'the-ninja': 1,        // Shadow Strike
    'the-technician': 2,   // Cyber Warrior
    'the-detective': 3,    // Mystery Fighter
    'the-brawler': 4,      // Street King
    'the-tank': 5,         // Iron Wall
  } as const,

  // Fighter stats by type
  FIGHTER_STATS: {
    0: { name: 'Thunder Fist', power: 9, speed: 6, defense: 7 },
    1: { name: 'Shadow Strike', power: 7, speed: 10, defense: 5 },
    2: { name: 'Cyber Warrior', power: 8, speed: 8, defense: 6 },
    3: { name: 'Mystery Fighter', power: 6, speed: 7, defense: 9 },
    4: { name: 'Street King', power: 7, speed: 7, defense: 8 },
    5: { name: 'Iron Wall', power: 8, speed: 5, defense: 10 },
  } as const,
};

export type FighterType = keyof typeof MOVEMENT_CONFIG.FIGHTER_TYPES;

// Helper to get full module address
export const getModuleAddress = (moduleName: string) =>
  `${MOVEMENT_CONFIG.PACKAGE_ADDRESS}::${moduleName}`;

// Explorer URL helpers
export const getTransactionUrl = (txHash: string) =>
  `${MOVEMENT_CONFIG.EXPLORER_URL}/txn/${txHash}?network=${MOVEMENT_CONFIG.NETWORK}`;

export const getAccountUrl = (address: string) =>
  `${MOVEMENT_CONFIG.EXPLORER_URL}/account/${address}?network=${MOVEMENT_CONFIG.NETWORK}`;