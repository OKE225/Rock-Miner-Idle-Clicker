export const formatNumber = (n: number) => {
  if (n < 1000) return String(Math.floor(n));
  const units = ["K", "M", "B", "T"];
  let v = n,
    i = -1;
  while (v >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }
  const s = v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
  return `${parseFloat(s)}${units[i]}`;
};

export const formatTime = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    x = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? h + ":" : ""}${mm}:${String(x).padStart(2, "0")}`;
};

export type ToolId =
  | "hands"
  | "woodenPickaxe"
  | "stonePickaxe"
  | "ironPickaxe"
  | "goldPickaxe"
  | "diamondPickaxe"
  | "emeraldPickaxe"
  | "rubyPickaxe"
  | "obsidianPickaxe"
  | "crystalPickaxe"
  | "vibraniumPickaxe"
  | "goldenDrill"
  | "plasmaDrill";

export type GameTool = {
  id: ToolId;
  name: string;
  damageMultiplier: number;
  price: number;
};

export const TOOLS: GameTool[] = [
  { id: "hands", name: "Bare Hands", damageMultiplier: 1, price: 0 },
  {
    id: "woodenPickaxe",
    name: "Wooden Pickaxe",
    damageMultiplier: 1.5,
    price: 40,
  },
  {
    id: "stonePickaxe",
    name: "Stone Pickaxe",
    damageMultiplier: 2.2,
    price: 250,
  },
  {
    id: "ironPickaxe",
    name: "Iron Pickaxe",
    damageMultiplier: 3.5,
    price: 1500,
  },
  { id: "goldPickaxe", name: "Gold Pickaxe", damageMultiplier: 5, price: 7000 },
  {
    id: "diamondPickaxe",
    name: "Diamond Pickaxe",
    damageMultiplier: 8,
    price: 30000,
  },
  {
    id: "emeraldPickaxe",
    name: "Emerald Pickaxe",
    damageMultiplier: 12,
    price: 120000,
  },
  {
    id: "rubyPickaxe",
    name: "Ruby Pickaxe",
    damageMultiplier: 18,
    price: 500000,
  },
  {
    id: "obsidianPickaxe",
    name: "Obsidian Pickaxe",
    damageMultiplier: 27,
    price: 2_000_000,
  },
  {
    id: "crystalPickaxe",
    name: "Crystal Pickaxe",
    damageMultiplier: 40,
    price: 8_000_000,
  },
  {
    id: "vibraniumPickaxe",
    name: "Vibranium Pickaxe",
    damageMultiplier: 60,
    price: 30_000_000,
  },
  {
    id: "goldenDrill",
    name: "Golden Drill",
    damageMultiplier: 90,
    price: 120_000_000,
  },
  {
    id: "plasmaDrill",
    name: "Plasma Drill",
    damageMultiplier: 140,
    price: 500_000_000,
  },
];

export type UpgradeId =
  | "damage"
  | "autoDamage"
  | "gloves"
  | "criticalChance"
  | "criticalDamage"
  | "combo"
  | "coinBoost"
  | "luckyStrikes"
  | "lucky";

export type GameUpgrade = {
  id: UpgradeId;
  name: string;
  description: string;
  color: string;
  basePrice: number;
  priceMultiplier: number;
  maxLevel: number;
  effect: (level: number) => string;
};

// export const UPGRADES: GameUpgrade[] = [
//   {
//     id: "damage",
//     name: "Strong Arms",
//     description: "+2 base damage per level",
//     color: "#E8A33D",
//     basePrice: 10,
//     priceMultiplier: 1.15,
//     maxLevel: 100,
//     effect: (l) => `+${2 * l} base damage`,
//   },
//   {
//     id: "autoDamage",
//     name: "Auto Miner",
//     description: "Mines by itself every second",
//     color: "#4FD1C5",
//     basePrice: 25,
//     priceMultiplier: 1.18,
//     maxLevel: 50,
//     effect: (l) => `${2 * l} dmg/s (grows with your tool)`,
//   },
//   {
//     id: "gloves",
//     name: "Mining Gloves",
//     description: "+5% chance for a double hit",
//     color: "#D9573B",
//     basePrice: 60,
//     priceMultiplier: 1.35,
//     maxLevel: 20,
//     effect: (l) => `${5 * l}% double hit`,
//   },
//   {
//     id: "criticalChance",
//     name: "Critical Chance",
//     description: "+2% critical hit chance",
//     color: "#FF8FA0",
//     basePrice: 50,
//     priceMultiplier: 1.5,
//     maxLevel: 20,
//     effect: (l) => `${5 + 2 * l}% crit chance`,
//   },
//   {
//     id: "criticalDamage",
//     name: "Critical Power",
//     description: "+0.25x critical damage",
//     color: "#FFD84D",
//     basePrice: 75,
//     priceMultiplier: 1.25,
//     maxLevel: 40,
//     effect: (l) => `x${(2 + 0.25 * l).toFixed(2)} on crit`,
//   },
//   {
//     id: "combo",
//     name: "Combo Master",
//     description: "+20% maximum combo bonus",
//     color: "#9B7CFF",
//     basePrice: 120,
//     priceMultiplier: 1.6,
//     maxLevel: 10,
//     effect: (l) => `max +${20 * (1 + l)}% from combo`,
//   },
//   {
//     id: "coinBoost",
//     name: "Coin Multiplier",
//     description: "+5% coins per rock",
//     color: "#6FCF7A",
//     basePrice: 90,
//     priceMultiplier: 1.2,
//     maxLevel: 80,
//     effect: (l) => `+${5 * l}% coins`,
//   },
//   {
//     id: "luckyStrikes",
//     name: "Lucky Strikes",
//     description: "+3% chance for DOUBLE coins from a rock",
//     color: "#FFC93C",
//     basePrice: 150,
//     priceMultiplier: 1.4,
//     maxLevel: 30,
//     effect: (l) => `${3 * l}% double coins`,
//   },
//   {
//     id: "lucky",
//     name: "Lucky Miner",
//     description: "+1.5% chance for a x5 JACKPOT",
//     color: "#F0ABFC",
//     basePrice: 180,
//     priceMultiplier: 1.45,
//     maxLevel: 20,
//     effect: (l) => `${(1.5 * l).toFixed(1)}% jackpot`,
//   },
// ];

export const UPGRADES: GameUpgrade[] = [
  {
    id: "damage",
    name: "Strong Arms",
    description: "+2 base damage per level",
    color: "#E8A33D",
    basePrice: 15,
    priceMultiplier: 1.18,
    maxLevel: 100,
    effect: (l) => `+${2 * l} base damage`,
  },
  {
    id: "autoDamage",
    name: "Auto Miner",
    description: "Mines by itself every second",
    color: "#4FD1C5",
    basePrice: 35,
    priceMultiplier: 1.22,
    maxLevel: 50,
    effect: (l) => `${2 * l} dmg/s (grows with your tool)`,
  },
  {
    id: "gloves",
    name: "Mining Gloves",
    description: "+5% chance for a double hit",
    color: "#D9573B",
    basePrice: 90,
    priceMultiplier: 1.45,
    maxLevel: 20,
    effect: (l) => `${5 * l}% double hit`,
  },
  {
    id: "criticalChance",
    name: "Critical Chance",
    description: "+2% critical hit chance",
    color: "#FF8FA0",
    basePrice: 70,
    priceMultiplier: 1.6,
    maxLevel: 20,
    effect: (l) => `${5 + 2 * l}% crit chance`,
  },
  {
    id: "criticalDamage",
    name: "Critical Power",
    description: "+0.25x critical damage",
    color: "#FFD84D",
    basePrice: 100,
    priceMultiplier: 1.3,
    maxLevel: 40,
    effect: (l) => `x${(2 + 0.25 * l).toFixed(2)} on crit`,
  },
  {
    id: "combo",
    name: "Combo Master",
    description: "+20% maximum combo bonus",
    color: "#9B7CFF",
    basePrice: 160,
    priceMultiplier: 1.7,
    maxLevel: 10,
    effect: (l) => `max +${20 * (1 + l)}% from combo`,
  },
  {
    id: "coinBoost",
    name: "Coin Multiplier",
    description: "+5% coins per rock",
    color: "#6FCF7A",
    basePrice: 120,
    priceMultiplier: 1.25,
    maxLevel: 80,
    effect: (l) => `+${5 * l}% coins`,
  },
  {
    id: "luckyStrikes",
    name: "Lucky Strikes",
    description: "+3% chance for DOUBLE coins from a rock",
    color: "#FFC93C",
    basePrice: 200,
    priceMultiplier: 1.45,
    maxLevel: 30,
    effect: (l) => `${3 * l}% double coins`,
  },
  {
    id: "lucky",
    name: "Lucky Miner",
    description: "+1.5% chance for a x5 JACKPOT",
    color: "#F0ABFC",
    basePrice: 240,
    priceMultiplier: 1.5,
    maxLevel: 20,
    effect: (l) => `${(1.5 * l).toFixed(1)}% jackpot`,
  },
];

export type RockId =
  | "dirt"
  | "stone"
  | "iron"
  | "gold"
  | "diamond"
  | "emerald"
  | "ruby"
  | "vibranium"
  | "obsidian"
  | "crystal";
export type Rock = {
  id: RockId;
  name: string;
  health: number;
  reward: number;
  color: string;
  background: string;
};

export const ROCKS: Record<RockId, Rock> = {
  dirt: {
    id: "dirt",
    name: "Dirt",
    health: 5,
    reward: 1,
    color: "#8B5E3C",
    background: "#4A3220",
  },
  stone: {
    id: "stone",
    name: "Stone",
    health: 10,
    reward: 2,
    color: "#7A7A7A",
    background: "#3A3A3A",
  },
  iron: {
    id: "iron",
    name: "Iron Ore",
    health: 18,
    reward: 5,
    color: "#8D8680",
    background: "#44352E",
  },
  gold: {
    id: "gold",
    name: "Gold Ore",
    health: 28,
    reward: 12,
    color: "#9A7A3A",
    background: "#4A3517",
  },
  diamond: {
    id: "diamond",
    name: "Diamond",
    health: 45,
    reward: 30,
    color: "#4E8EA8",
    background: "#1E3F4F",
  },
  emerald: {
    id: "emerald",
    name: "Emerald",
    health: 65,
    reward: 55,
    color: "#2F7A52",
    background: "#1D3B2A",
  },
  ruby: {
    id: "ruby",
    name: "Ruby",
    health: 90,
    reward: 90,
    color: "#8A3A44",
    background: "#451A1A",
  },
  vibranium: {
    id: "vibranium",
    name: "Vibranium",
    health: 140,
    reward: 180,
    color: "#4A4560",
    background: "#2A1D45",
  },
  obsidian: {
    id: "obsidian",
    name: "Obsidian",
    health: 220,
    reward: 320,
    color: "#3A3350",
    background: "#191521",
  },
  crystal: {
    id: "crystal",
    name: "Crystal",
    health: 350,
    reward: 600,
    color: "#8A5A94",
    background: "#3F1F45",
  },
};
export const ROCK_ORDER: RockId[] = [
  "dirt",
  "stone",
  "iron",
  "gold",
  "diamond",
  "emerald",
  "ruby",
  "vibranium",
  "obsidian",
  "crystal",
];

export type Zone = {
  id: number;
  name: string;
  short: string;
  color: string;
  startDepth: number;
  hpScale: number;
  rewardScale: number;
  rocks: { id: RockId; weight: number }[];
};

export const ZONES: Zone[] = [
  {
    id: 1,
    name: "Surface Mine",
    short: "Surface",
    color: "#8B5E3C",
    startDepth: 0,
    hpScale: 1,
    rewardScale: 1,
    rocks: [
      { id: "dirt", weight: 60 },
      { id: "stone", weight: 30 },
      { id: "iron", weight: 9 },
      { id: "gold", weight: 1 },
    ],
  },
  {
    id: 2,
    name: "Stone Depths",
    short: "Stone",
    color: "#8A8A8A",
    startDepth: 30,
    hpScale: 8,
    rewardScale: 3,
    rocks: [
      { id: "dirt", weight: 25 },
      { id: "stone", weight: 40 },
      { id: "iron", weight: 22 },
      { id: "gold", weight: 10 },
      { id: "diamond", weight: 3 },
    ],
  },
  {
    id: 3,
    name: "Iron Caverns",
    short: "Iron",
    color: "#B5653D",
    startDepth: 90,
    hpScale: 120,
    rewardScale: 15,
    rocks: [
      { id: "stone", weight: 25 },
      { id: "iron", weight: 35 },
      { id: "gold", weight: 22 },
      { id: "diamond", weight: 13 },
      { id: "emerald", weight: 5 },
    ],
  },
  {
    id: 4,
    name: "Crystal Abyss",
    short: "Crystal",
    color: "#4FD1C5",
    startDepth: 200,
    hpScale: 3000,
    rewardScale: 80,
    rocks: [
      { id: "iron", weight: 15 },
      { id: "gold", weight: 25 },
      { id: "diamond", weight: 25 },
      { id: "emerald", weight: 18 },
      { id: "ruby", weight: 12 },
      { id: "vibranium", weight: 5 },
    ],
  },
  {
    id: 5,
    name: "Vibranium Core",
    short: "Core",
    color: "#9B7CFF",
    startDepth: 400,
    hpScale: 100000,
    rewardScale: 800,
    rocks: [
      { id: "gold", weight: 12 },
      { id: "diamond", weight: 20 },
      { id: "emerald", weight: 20 },
      { id: "ruby", weight: 20 },
      { id: "vibranium", weight: 18 },
      { id: "obsidian", weight: 8 },
      { id: "crystal", weight: 2 },
    ],
  },
  {
    id: 6,
    name: "Deep Void",
    short: "Void",
    color: "#7A5AA8",
    startDepth: 800,
    hpScale: 4_000_000,
    rewardScale: 15000,
    rocks: [
      { id: "emerald", weight: 12 },
      { id: "ruby", weight: 20 },
      { id: "vibranium", weight: 28 },
      { id: "obsidian", weight: 25 },
      { id: "crystal", weight: 15 },
    ],
  },
];

export const DIAMOND_DROP: Record<RockId, number> = {
  dirt: 0.00005,
  stone: 0.00008,
  iron: 0.00015,
  gold: 0.00025,
  diamond: 0.001,
  emerald: 0.0012,
  ruby: 0.0015,
  vibranium: 0.002,
  obsidian: 0.0025,
  crystal: 0.003,
};
export const CHEST_DROP: Record<RockId, number> = {
  dirt: 0.004,
  stone: 0.006,
  iron: 0.01,
  gold: 0.015,
  diamond: 0.025,
  emerald: 0.03,
  ruby: 0.035,
  vibranium: 0.045,
  obsidian: 0.05,
  crystal: 0.06,
};

export type HazardId = "evil" | "cavein" | "monster";
export type Hazard = {
  id: HazardId;
  name: string;
  tagline: string;
  color: string;
  minZone: number;
  hpMult: number;
  rewardMult: number;
  chestChance: number;
  diamondChance: number;
};
export const HAZARDS: Record<HazardId, Hazard> = {
  evil: {
    id: "evil",
    name: "Evil Rock",
    tagline: "It is angry. It has 6x the HP.",
    color: "#D9573B",
    minZone: 0,
    hpMult: 6,
    rewardMult: 7,
    chestChance: 0.6,
    diamondChance: 0.01,
  },
  cavein: {
    id: "cavein",
    name: "Cave-In",
    tagline: "A collapsed tunnel blocks the way. 4x HP.",
    color: "#E8A33D",
    minZone: 1,
    hpMult: 4,
    rewardMult: 5,
    chestChance: 0.45,
    diamondChance: 0.006,
  },
  monster: {
    id: "monster",
    name: "Underground Monster",
    tagline: "Something lives in this rock. 12x HP.",
    color: "#9B7CFF",
    minZone: 2,
    hpMult: 12,
    rewardMult: 15,
    chestChance: 1,
    diamondChance: 0.04,
  },
};
export const HAZARD_LIST = Object.values(HAZARDS);

export type ChestId =
  "wooden" | "stone" | "iron" | "golden" | "crystal" | "vibranium";
export type Chest = {
  id: ChestId;
  name: string;
  desc: string;
  color: string;
  coinRocks: number;
  diamonds: [min: number, max: number, chance: number];
  boostChance: number;
  boostMinutes: number;
  toolChance: number;
  cosmeticChance: number;
  permChance: number;
};
export const CHESTS: Record<ChestId, Chest> = {
  wooden: {
    id: "wooden",
    name: "Wooden Chest",
    desc: "Coins and a small boost",
    color: "#A9743A",
    coinRocks: 5,
    diamonds: [1, 1, 0.02],
    boostChance: 0.2,
    boostMinutes: 10,
    toolChance: 0,
    cosmeticChance: 0,
    permChance: 0,
  },
  stone: {
    id: "stone",
    name: "Stone Chest",
    desc: "More coins, sometimes a diamond",
    color: "#8A8A8A",
    coinRocks: 12,
    diamonds: [1, 2, 0.04],
    boostChance: 0.3,
    boostMinutes: 10,
    toolChance: 0,
    cosmeticChance: 0,
    permChance: 0,
  },
  iron: {
    id: "iron",
    name: "Iron Chest",
    desc: "Lots of coins, diamonds and a boost",
    color: "#B0B7C3",
    coinRocks: 30,
    diamonds: [1, 3, 0.25],
    boostChance: 0.6,
    boostMinutes: 20,
    toolChance: 0,
    cosmeticChance: 0,
    permChance: 0,
  },
  golden: {
    id: "golden",
    name: "Golden Chest",
    desc: "Rare pickaxe, many diamonds",
    color: "#FFC93C",
    coinRocks: 80,
    diamonds: [5, 15, 1],
    boostChance: 1,
    boostMinutes: 30,
    toolChance: 0.35,
    cosmeticChance: 0,
    permChance: 0,
  },
  crystal: {
    id: "crystal",
    name: "Crystal Chest",
    desc: "Cosmetics and permanent bonuses",
    color: "#F0ABFC",
    coinRocks: 180,
    diamonds: [10, 30, 1],
    boostChance: 1,
    boostMinutes: 45,
    toolChance: 0.1,
    cosmeticChance: 1,
    permChance: 0.6,
  },
  vibranium: {
    id: "vibranium",
    name: "Vibranium Chest",
    desc: "Extremely rare rewards",
    color: "#9B7CFF",
    coinRocks: 500,
    diamonds: [40, 120, 1],
    boostChance: 1,
    boostMinutes: 60,
    toolChance: 0.5,
    cosmeticChance: 1,
    permChance: 1,
  },
};
export const CHEST_ORDER: ChestId[] = [
  "wooden",
  "stone",
  "iron",
  "golden",
  "crystal",
  "vibranium",
];
export const COMMON_CHESTS: [ChestId, number][] = [
  ["wooden", 62],
  ["stone", 33],
  ["iron", 5],
];
export const RARE_CHESTS: [ChestId, number][] = [
  ["iron", 40],
  ["golden", 35],
  ["crystal", 18],
  ["vibranium", 7],
];
export const RARE_EVERY = 10;
export const RARE_CHANCE = 0.7;

export type BoostId = "coin2" | "damage2" | "auto3" | "crit10" | "double10";
export const BOOSTS: Record<
  BoostId,
  { name: string; short: string; color: string }
> = {
  coin2: { name: "Coin Boost ×2", short: "Coins ×2", color: "#FFC93C" },
  damage2: { name: "Damage Boost ×2", short: "Damage ×2", color: "#D9573B" },
  auto3: { name: "Auto Miner Boost ×3", short: "Auto ×3", color: "#4FD1C5" },
  crit10: {
    name: "Critical Strike Boost +10%",
    short: "Crit +10%",
    color: "#FF8FA0",
  },
  double10: {
    name: "Double Hit Boost +10%",
    short: "Double +10%",
    color: "#9B7CFF",
  },
};

export type PermId = "coins" | "damage" | "auto";
export const PERMS: Record<
  PermId,
  { name: string; color: string; max: number; effect: (l: number) => string }
> = {
  coins: {
    name: "Permanent +10% Coins",
    color: "#FFC93C",
    max: 5,
    effect: (l) => `+${10 * l}% coins`,
  },
  damage: {
    name: "Permanent +10% Damage",
    color: "#D9573B",
    max: 5,
    effect: (l) => `+${10 * l}% damage`,
  },
  auto: {
    name: "Permanent +1 Auto Damage",
    color: "#4FD1C5",
    max: 5,
    effect: (l) => `+${l} dmg/s`,
  },
};

export type DiamondItem = {
  id: string;
  group: "Boosts" | "Permanent" | "Utility";
  name: string;
  desc: string;
  price: number;
  color: string;
  boost?: { id: BoostId; minutes: number };
  perm?: PermId;
  skip?: number;
  adFree?: boolean;
};
export const DIAMOND_ITEMS: DiamondItem[] = [
  {
    id: "coin2",
    group: "Boosts",
    name: "Coin Boost ×2",
    desc: "Double coins for 30 minutes",
    price: 20,
    color: "#FFC93C",
    boost: { id: "coin2", minutes: 30 },
  },
  {
    id: "damage2",
    group: "Boosts",
    name: "Damage Boost ×2",
    desc: "Double damage for 30 minutes",
    price: 25,
    color: "#D9573B",
    boost: { id: "damage2", minutes: 30 },
  },
  {
    id: "auto3",
    group: "Boosts",
    name: "Auto Miner Boost ×3",
    desc: "Triple auto damage for 1 hour",
    price: 40,
    color: "#4FD1C5",
    boost: { id: "auto3", minutes: 60 },
  },
  {
    id: "crit10",
    group: "Boosts",
    name: "Critical Strike Boost",
    desc: "+10% crit chance for 1 hour",
    price: 30,
    color: "#FF8FA0",
    boost: { id: "crit10", minutes: 60 },
  },
  {
    id: "double10",
    group: "Boosts",
    name: "Double Hit Boost",
    desc: "+10% double hit chance for 1 hour",
    price: 50,
    color: "#9B7CFF",
    boost: { id: "double10", minutes: 60 },
  },
  {
    id: "permCoins",
    group: "Permanent",
    name: "Permanent +10% Coins",
    desc: "Lasts forever, even after rebirth",
    price: 150,
    color: "#FFC93C",
    perm: "coins",
  },
  {
    id: "permDamage",
    group: "Permanent",
    name: "Permanent +10% Damage",
    desc: "Lasts forever, even after rebirth",
    price: 200,
    color: "#D9573B",
    perm: "damage",
  },
  {
    id: "permAuto",
    group: "Permanent",
    name: "Permanent +1 Auto Damage",
    desc: "+1 damage every second, forever",
    price: 150,
    color: "#4FD1C5",
    perm: "auto",
  },
  {
    id: "skip",
    group: "Utility",
    name: "Instant Depth Skip",
    desc: "Jump 25 m deeper right now",
    price: 75,
    color: "#8B5E3C",
    skip: 25,
  },
  {
    id: "adFree",
    group: "Utility",
    name: "Ad-Free Supporter",
    desc: "Removes ads and supports the game",
    price: 250,
    color: "#6FCF7A",
    adFree: true,
  },
];
export const PERM_PRICE_GROWTH = 1.5;

export type DiamondPack = {
  id: string;
  productId: string;
  name: string;
  diamonds: number;
  price: string;
  bonus: string;
  badge?: string;
};
export const PACKS: DiamondPack[] = [
  {
    id: "p1",
    productId: "diamonds_50",
    name: "Handful",
    diamonds: 50,
    price: "$0.99",
    bonus: "",
  },
  {
    id: "p2",
    productId: "diamonds_120",
    name: "Pouch",
    diamonds: 120,
    price: "$1.99",
    bonus: "+10% bonus",
  },
  {
    id: "p3",
    productId: "diamonds_350",
    name: "Sack",
    diamonds: 350,
    price: "$4.99",
    bonus: "+20% bonus",
    badge: "Popular",
  },
  {
    id: "p4",
    productId: "diamonds_800",
    name: "Crate",
    diamonds: 800,
    price: "$9.99",
    bonus: "+30% bonus",
  },
  {
    id: "p5",
    productId: "diamonds_2000",
    name: "Vault",
    diamonds: 2000,
    price: "$19.99",
    bonus: "+40% bonus",
    badge: "Best value",
  },
];

export const COSMETICS = [
  { id: "ember", name: "Ember Sparks", color: "#FF8A3D" },
  { id: "frost", name: "Frost Shards", color: "#7FD8FF" },
  { id: "goldDust", name: "Gold Dust", color: "#FFD84D" },
  { id: "neon", name: "Neon Pop", color: "#F0ABFC" },
  { id: "toxic", name: "Toxic Slime", color: "#7CF59A" },
];

export const REBIRTH_DEPTH = 400;
export const rebirthPoints = (depth: number, rebirths: number) =>
  Math.floor(depth / 100) + rebirths;

export type SkillId =
  | "mighty"
  | "critEye"
  | "pulverize"
  | "slayer"
  | "prospector"
  | "haggler"
  | "jackpot"
  | "richVeins"
  | "engineer"
  | "diamondDigger"
  | "chestMagnet"
  | "timeKeeper";
export type Branch = "power" | "wealth" | "fortune";
export type Skill = {
  id: SkillId;
  branch: Branch;
  name: string;
  desc: string;
  maxLevel: number;
  cost: number;
  requires?: SkillId;
  effect: (l: number) => string;
};

export const SKILLS: Skill[] = [
  {
    id: "mighty",
    branch: "power",
    name: "Mighty Swing",
    desc: "+10% damage per level",
    maxLevel: 5,
    cost: 1,
    effect: (l) => `+${10 * l}% damage`,
  },
  {
    id: "critEye",
    branch: "power",
    name: "Critical Eye",
    desc: "+3% critical chance per level",
    maxLevel: 5,
    cost: 1,
    requires: "mighty",
    effect: (l) => `+${3 * l}% crit`,
  },
  {
    id: "pulverize",
    branch: "power",
    name: "Pulverize",
    desc: "+0.2x critical damage per level",
    maxLevel: 5,
    cost: 2,
    requires: "critEye",
    effect: (l) => `+${(0.2 * l).toFixed(1)}x crit`,
  },
  {
    id: "slayer",
    branch: "power",
    name: "Giant Slayer",
    desc: "+25% damage against hazards per level",
    maxLevel: 4,
    cost: 3,
    requires: "pulverize",
    effect: (l) => `+${25 * l}% vs hazards`,
  },
  {
    id: "prospector",
    branch: "wealth",
    name: "Prospector",
    desc: "+10% coins per level",
    maxLevel: 5,
    cost: 1,
    effect: (l) => `+${10 * l}% coins`,
  },
  {
    id: "haggler",
    branch: "wealth",
    name: "Haggler",
    desc: "-3% upgrade prices per level",
    maxLevel: 5,
    cost: 2,
    requires: "prospector",
    effect: (l) => `-${3 * l}% prices`,
  },
  {
    id: "jackpot",
    branch: "wealth",
    name: "Jackpot Hunter",
    desc: "+2% jackpot chance per level",
    maxLevel: 5,
    cost: 2,
    requires: "haggler",
    effect: (l) => `+${2 * l}% jackpot`,
  },
  {
    id: "richVeins",
    branch: "wealth",
    name: "Rich Veins",
    desc: "+30% coins from gold and rarer ores",
    maxLevel: 4,
    cost: 3,
    requires: "jackpot",
    effect: (l) => `+${30 * l}% from rare ore`,
  },
  {
    id: "engineer",
    branch: "fortune",
    name: "Auto Engineer",
    desc: "+15% auto damage per level",
    maxLevel: 5,
    cost: 1,
    effect: (l) => `+${15 * l}% auto`,
  },
  {
    id: "diamondDigger",
    branch: "fortune",
    name: "Diamond Digger",
    desc: "+50% diamond drop chance per level",
    maxLevel: 5,
    cost: 2,
    requires: "engineer",
    effect: (l) => `+${50 * l}% diamonds`,
  },
  {
    id: "chestMagnet",
    branch: "fortune",
    name: "Chest Magnet",
    desc: "+25% chest drop chance per level",
    maxLevel: 5,
    cost: 2,
    requires: "diamondDigger",
    effect: (l) => `+${25 * l}% chests`,
  },
  {
    id: "timeKeeper",
    branch: "fortune",
    name: "Time Keeper",
    desc: "+10% boost duration per level",
    maxLevel: 5,
    cost: 3,
    requires: "chestMagnet",
    effect: (l) => `+${10 * l}% boost time`,
  },
];
export const BRANCHES: { id: Branch; name: string; color: string }[] = [
  { id: "power", name: "Power", color: "#D9573B" },
  { id: "wealth", name: "Wealth", color: "#FFC93C" },
  { id: "fortune", name: "Fortune", color: "#4FD1C5" },
];

export type TaskId =
  | "destroyRocks"
  | "earnCoins"
  | "buyUpgrades"
  | "buyTools"
  | "critHits"
  | "bestCombo"
  | "reachDepth"
  | "mineGold"
  | "mineDiamond"
  | "mineEmerald"
  | "mineRuby"
  | "mineVibranium"
  | "reachZone3"
  | "reachZone4"
  | "reachZone5"
  | "reachZone6"
  | "hazard5"
  | "hazard25"
  | "chestsOpened"
  | "rebirthOnce";

export type GameTask = {
  id: TaskId;
  title: string;
  description: string;
  target: number;
  reward: number;
  diamonds?: number;
  chest?: ChestId;
};

export const TASKS: GameTask[] = [
  {
    id: "destroyRocks",
    title: "Rock Breaker",
    description: "Destroy 25 rocks",
    target: 25,
    reward: 40,
    chest: "wooden",
  },
  {
    id: "earnCoins",
    title: "First Savings",
    description: "Earn 500 coins",
    target: 500,
    reward: 100,
  },
  {
    id: "buyUpgrades",
    title: "Improver",
    description: "Buy 10 upgrades",
    target: 10,
    reward: 300,
    diamonds: 2,
  },
  {
    id: "buyTools",
    title: "Tool Collector",
    description: "Buy 2 tools",
    target: 2,
    reward: 400,
    chest: "stone",
  },
  {
    id: "critHits",
    title: "Crit Streak",
    description: "Land 50 critical hits",
    target: 50,
    reward: 600,
    diamonds: 3,
  },
  {
    id: "bestCombo",
    title: "Combo Master",
    description: "Reach a 40 hit combo",
    target: 40,
    reward: 800,
    chest: "wooden",
  },
  {
    id: "reachDepth",
    title: "Deep Digger",
    description: "Reach 30 M depth",
    target: 30,
    reward: 500,
    diamonds: 2,
  },
  {
    id: "mineGold",
    title: "Gold Rush",
    description: "Mine 5 Gold Ore",
    target: 5,
    reward: 300,
    chest: "wooden",
  },
  {
    id: "mineDiamond",
    title: "Diamond Hunter",
    description: "Mine 5 Diamond rocks",
    target: 5,
    reward: 1500,
    diamonds: 5,
    chest: "stone",
  },
  {
    id: "hazard5",
    title: "Hazard Hunter",
    description: "Break 5 hazard rocks",
    target: 5,
    reward: 2500,
    chest: "iron",
  },
  {
    id: "chestsOpened",
    title: "Chest Opener",
    description: "Open 5 chests",
    target: 5,
    reward: 1000,
    diamonds: 5,
  },
  {
    id: "reachZone3",
    title: "Iron Explorer",
    description: "Reach Iron Caverns (90 M)",
    target: 90,
    reward: 2000,
    diamonds: 5,
  },
  {
    id: "mineEmerald",
    title: "Emerald Seeker",
    description: "Mine 5 Emeralds",
    target: 5,
    reward: 8000,
    chest: "iron",
  },
  {
    id: "mineRuby",
    title: "Ruby Collector",
    description: "Mine 5 Rubies",
    target: 5,
    reward: 40000,
    diamonds: 10,
  },
  {
    id: "reachZone4",
    title: "Crystal Adventurer",
    description: "Reach Crystal Abyss (200 M)",
    target: 200,
    reward: 15000,
    chest: "iron",
  },
  {
    id: "mineVibranium",
    title: "Vibranium Miner",
    description: "Mine 5 Vibranium",
    target: 5,
    reward: 400000,
    chest: "golden",
  },
  {
    id: "hazard25",
    title: "Giant Slayer",
    description: "Break 25 hazard rocks",
    target: 25,
    reward: 50000,
    diamonds: 20,
    chest: "crystal",
  },
  {
    id: "reachZone5",
    title: "Core Breaker",
    description: "Reach Vibranium Core (400 M)",
    target: 400,
    reward: 200000,
    diamonds: 15,
    chest: "golden",
  },
  {
    id: "reachZone6",
    title: "Into the Void",
    description: "Reach Deep Void (800 M)",
    target: 800,
    reward: 3_000_000,
    diamonds: 30,
    chest: "crystal",
  },
  {
    id: "rebirthOnce",
    title: "Reborn",
    description: "Complete your first Rebirth",
    target: 1,
    reward: 0,
    diamonds: 25,
    chest: "golden",
  },
];
