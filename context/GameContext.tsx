// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useReducer,
//   useRef,
//   useState,
//   type ReactNode,
// } from "react";

// /* ===================== HELPERS ===================== */
// export const formatNumber = (n: number) => {
//   if (n < 1000) return String(Math.floor(n));
//   const units = ["K", "M", "B", "T"];
//   let v = n,
//     i = -1;
//   while (v >= 1000 && i < units.length - 1) {
//     v /= 1000;
//     i++;
//   }
//   const s = v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
//   return `${parseFloat(s)}${units[i]}`;
// };

// /* ===================== TOOLS ===================== */
// export type ToolId =
//   | "hands"
//   | "woodenPickaxe"
//   | "stonePickaxe"
//   | "ironPickaxe"
//   | "goldPickaxe"
//   | "diamondPickaxe"
//   | "emeraldPickaxe"
//   | "rubyPickaxe"
//   | "obsidianPickaxe"
//   | "crystalPickaxe"
//   | "vibraniumPickaxe"
//   | "goldenDrill"
//   | "plasmaDrill";

// export type GameTool = {
//   id: ToolId;
//   name: string;
//   damageMultiplier: number;
//   price: number;
// };

// // Order = progression. You can buy a tool only after owning the previous one.
// export const TOOLS: GameTool[] = [
//   { id: "hands", name: "Bare Hands", damageMultiplier: 1, price: 0 },
//   {
//     id: "woodenPickaxe",
//     name: "Wooden Pickaxe",
//     damageMultiplier: 1.5,
//     price: 40,
//   },
//   {
//     id: "stonePickaxe",
//     name: "Stone Pickaxe",
//     damageMultiplier: 2.2,
//     price: 250,
//   },
//   {
//     id: "ironPickaxe",
//     name: "Iron Pickaxe",
//     damageMultiplier: 3.5,
//     price: 1500,
//   },
//   { id: "goldPickaxe", name: "Gold Pickaxe", damageMultiplier: 5, price: 7000 },
//   {
//     id: "diamondPickaxe",
//     name: "Diamond Pickaxe",
//     damageMultiplier: 8,
//     price: 30000,
//   },
//   {
//     id: "emeraldPickaxe",
//     name: "Emerald Pickaxe",
//     damageMultiplier: 12,
//     price: 120000,
//   },
//   {
//     id: "rubyPickaxe",
//     name: "Ruby Pickaxe",
//     damageMultiplier: 18,
//     price: 500000,
//   },
//   {
//     id: "obsidianPickaxe",
//     name: "Obsidian Pickaxe",
//     damageMultiplier: 27,
//     price: 2_000_000,
//   },
//   {
//     id: "crystalPickaxe",
//     name: "Crystal Pickaxe",
//     damageMultiplier: 40,
//     price: 8_000_000,
//   },
//   {
//     id: "vibraniumPickaxe",
//     name: "Vibranium Pickaxe",
//     damageMultiplier: 60,
//     price: 30_000_000,
//   },
//   {
//     id: "goldenDrill",
//     name: "Golden Drill",
//     damageMultiplier: 90,
//     price: 120_000_000,
//   },
//   {
//     id: "plasmaDrill",
//     name: "Plasma Drill",
//     damageMultiplier: 140,
//     price: 500_000_000,
//   },
// ];

// /* ===================== UPGRADES ===================== */
// export type UpgradeId =
//   | "damage"
//   | "autoDamage"
//   | "gloves"
//   | "criticalChance"
//   | "criticalDamage"
//   | "combo"
//   | "coinBoost"
//   | "lucky";

// export type GameUpgrade = {
//   id: UpgradeId;
//   name: string;
//   description: string;
//   color: string;
//   basePrice: number;
//   priceMultiplier: number;
//   maxLevel: number;
//   effect: (level: number) => string; // text shown as "now: ..."
// };

// export const UPGRADES: GameUpgrade[] = [
//   {
//     id: "damage",
//     name: "Strong Arms",
//     description: "+2 base damage per level",
//     color: "#E8A33D",
//     basePrice: 15,
//     priceMultiplier: 1.22,
//     maxLevel: 50,
//     effect: (l) => `+${2 * l} base damage`,
//   },
//   {
//     id: "autoDamage",
//     name: "Auto Miner",
//     description: "Mines by itself every second",
//     color: "#4FD1C5",
//     basePrice: 40,
//     priceMultiplier: 1.25,
//     maxLevel: 25,
//     effect: (l) => `${2 * l} dmg/s (grows with your tool)`,
//   },
//   {
//     id: "gloves",
//     name: "Mining Gloves",
//     description: "+5% chance for a double hit",
//     color: "#D9573B",
//     basePrice: 100,
//     priceMultiplier: 1.5,
//     maxLevel: 10,
//     effect: (l) => `${5 * l}% double hit`,
//   },
//   {
//     id: "criticalChance",
//     name: "Critical Chance",
//     description: "+2% critical hit chance",
//     color: "#FF8FA0",
//     basePrice: 75,
//     priceMultiplier: 1.3,
//     maxLevel: 25,
//     effect: (l) => `${5 + 2 * l}% crit chance`,
//   },
//   {
//     id: "criticalDamage",
//     name: "Critical Power",
//     description: "+0.25x critical damage",
//     color: "#FFD84D",
//     basePrice: 125,
//     priceMultiplier: 1.35,
//     maxLevel: 20,
//     effect: (l) => `x${(2 + 0.25 * l).toFixed(2)} on crit`,
//   },
//   {
//     id: "combo",
//     name: "Combo Master",
//     description: "+20% maximum combo bonus",
//     color: "#9B7CFF",
//     basePrice: 200,
//     priceMultiplier: 1.9,
//     maxLevel: 5,
//     effect: (l) => `max +${20 * (1 + l)}% from combo`,
//   },
//   {
//     id: "coinBoost",
//     name: "Coin Boost",
//     description: "+10% coins from every rock",
//     color: "#6FCF7A",
//     basePrice: 150,
//     priceMultiplier: 1.35,
//     maxLevel: 20,
//     effect: (l) => `+${10 * l}% coins`,
//   },
//   {
//     id: "lucky",
//     name: "Lucky Miner",
//     description: "+1.5% chance for a x5 JACKPOT",
//     color: "#F0ABFC",
//     basePrice: 300,
//     priceMultiplier: 1.6,
//     maxLevel: 10,
//     effect: (l) => `${(1.5 * l).toFixed(1)}% jackpot`,
//   },
// ];

// /* ===================== ROCKS & ZONES ===================== */
// export type RockId =
//   | "dirt"
//   | "stone"
//   | "iron"
//   | "gold"
//   | "diamond"
//   | "emerald"
//   | "ruby"
//   | "vibranium"
//   | "obsidian"
//   | "crystal";

// export type Rock = {
//   id: RockId;
//   name: string;
//   health: number;
//   reward: number;
//   color: string;
//   background: string;
// };

// export const ROCKS: Record<RockId, Rock> = {
//   dirt: {
//     id: "dirt",
//     name: "Dirt",
//     health: 5,
//     reward: 1,
//     color: "#8B5E3C",
//     background: "#4A3220",
//   },
//   stone: {
//     id: "stone",
//     name: "Stone",
//     health: 10,
//     reward: 2,
//     color: "#7A7A7A",
//     background: "#3A3A3A",
//   },
//   iron: {
//     id: "iron",
//     name: "Iron Ore",
//     health: 18,
//     reward: 5,
//     color: "#8D8680",
//     background: "#44352E",
//   },
//   gold: {
//     id: "gold",
//     name: "Gold Ore",
//     health: 28,
//     reward: 12,
//     color: "#9A7A3A",
//     background: "#4A3517",
//   },
//   diamond: {
//     id: "diamond",
//     name: "Diamond",
//     health: 45,
//     reward: 30,
//     color: "#4E8EA8",
//     background: "#1E3F4F",
//   },
//   emerald: {
//     id: "emerald",
//     name: "Emerald",
//     health: 65,
//     reward: 55,
//     color: "#2F7A52",
//     background: "#1D3B2A",
//   },
//   ruby: {
//     id: "ruby",
//     name: "Ruby",
//     health: 90,
//     reward: 90,
//     color: "#8A3A44",
//     background: "#451A1A",
//   },
//   vibranium: {
//     id: "vibranium",
//     name: "Vibranium",
//     health: 140,
//     reward: 180,
//     color: "#4A4560",
//     background: "#2A1D45",
//   },
//   obsidian: {
//     id: "obsidian",
//     name: "Obsidian",
//     health: 220,
//     reward: 320,
//     color: "#3A3350",
//     background: "#191521",
//   },
//   crystal: {
//     id: "crystal",
//     name: "Crystal",
//     health: 350,
//     reward: 600,
//     color: "#8A5A94",
//     background: "#3F1F45",
//   },
// };
// export const ROCK_ORDER: RockId[] = [
//   "dirt",
//   "stone",
//   "iron",
//   "gold",
//   "diamond",
//   "emerald",
//   "ruby",
//   "vibranium",
//   "obsidian",
//   "crystal",
// ];

// export type Zone = {
//   id: number;
//   name: string;
//   short: string;
//   color: string;
//   startDepth: number;
//   hpScale: number;
//   rewardScale: number;
//   rocks: { id: RockId; weight: number }[];
// };

// // hpScale / rewardScale were tuned with a simulated player (4 taps per second):
// // zone 2 ~ 1 min, zone 3 ~ 6 min, zone 4 ~ 20 min, zone 5 ~ 1 h, zone 6 ~ 5 h.
// export const ZONES: Zone[] = [
//   {
//     id: 1,
//     name: "Surface Mine",
//     short: "Surface",
//     color: "#8B5E3C",
//     startDepth: 0,
//     hpScale: 1,
//     rewardScale: 1,
//     rocks: [
//       { id: "dirt", weight: 60 },
//       { id: "stone", weight: 30 },
//       { id: "iron", weight: 9 },
//       { id: "gold", weight: 1 },
//     ],
//   },
//   {
//     id: 2,
//     name: "Stone Depths",
//     short: "Stone",
//     color: "#8A8A8A",
//     startDepth: 30,
//     hpScale: 8,
//     rewardScale: 3,
//     rocks: [
//       { id: "dirt", weight: 25 },
//       { id: "stone", weight: 40 },
//       { id: "iron", weight: 22 },
//       { id: "gold", weight: 10 },
//       { id: "diamond", weight: 3 },
//     ],
//   },
//   {
//     id: 3,
//     name: "Iron Caverns",
//     short: "Iron",
//     color: "#B5653D",
//     startDepth: 90,
//     hpScale: 120,
//     rewardScale: 15,
//     rocks: [
//       { id: "stone", weight: 25 },
//       { id: "iron", weight: 35 },
//       { id: "gold", weight: 22 },
//       { id: "diamond", weight: 13 },
//       { id: "emerald", weight: 5 },
//     ],
//   },
//   {
//     id: 4,
//     name: "Crystal Abyss",
//     short: "Crystal",
//     color: "#4FD1C5",
//     startDepth: 200,
//     hpScale: 3000,
//     rewardScale: 80,
//     rocks: [
//       { id: "iron", weight: 15 },
//       { id: "gold", weight: 25 },
//       { id: "diamond", weight: 25 },
//       { id: "emerald", weight: 18 },
//       { id: "ruby", weight: 12 },
//       { id: "vibranium", weight: 5 },
//     ],
//   },
//   {
//     id: 5,
//     name: "Vibranium Core",
//     short: "Core",
//     color: "#9B7CFF",
//     startDepth: 400,
//     hpScale: 100000,
//     rewardScale: 800,
//     rocks: [
//       { id: "gold", weight: 12 },
//       { id: "diamond", weight: 20 },
//       { id: "emerald", weight: 20 },
//       { id: "ruby", weight: 20 },
//       { id: "vibranium", weight: 18 },
//       { id: "obsidian", weight: 8 },
//       { id: "crystal", weight: 2 },
//     ],
//   },
//   {
//     id: 6,
//     name: "Deep Void",
//     short: "Void",
//     color: "#7A5AA8",
//     startDepth: 800,
//     hpScale: 4_000_000,
//     rewardScale: 15000,
//     rocks: [
//       { id: "emerald", weight: 12 },
//       { id: "ruby", weight: 20 },
//       { id: "vibranium", weight: 28 },
//       { id: "obsidian", weight: 25 },
//       { id: "crystal", weight: 15 },
//     ],
//   },
// ];

// export const zoneIndexFor = (depth: number) =>
//   ZONES.reduce((a, z, i) => (depth >= z.startDepth ? i : a), 0);

// const pickRock = (zone: Zone, roll: number): Rock => {
//   let r = roll * zone.rocks.reduce((t, x) => t + x.weight, 0);
//   for (const x of zone.rocks) {
//     r -= x.weight;
//     if (r <= 0) return ROCKS[x.id];
//   }
//   return ROCKS[zone.rocks[0].id];
// };
// const rockHp = (rock: Rock, zone: Zone) =>
//   Math.ceil(rock.health * zone.hpScale);

// /* ===================== TASKS ===================== */
// export type TaskId =
//   | "destroyRocks"
//   | "earnCoins"
//   | "buyUpgrades"
//   | "buyTools"
//   | "critHits"
//   | "bestCombo"
//   | "reachDepth"
//   | "mineGold"
//   | "mineDiamond"
//   | "mineEmerald"
//   | "mineRuby"
//   | "mineVibranium"
//   | "reachZone3"
//   | "reachZone4"
//   | "reachZone5"
//   | "reachZone6";

// export type GameTask = {
//   id: TaskId;
//   title: string;
//   description: string;
//   target: number;
//   reward: number;
// };

// export const TASKS: GameTask[] = [
//   {
//     id: "destroyRocks",
//     title: "Rock Breaker",
//     description: "Destroy 25 rocks",
//     target: 25,
//     reward: 40,
//   },
//   {
//     id: "earnCoins",
//     title: "First Savings",
//     description: "Earn 500 coins",
//     target: 500,
//     reward: 100,
//   },
//   {
//     id: "buyUpgrades",
//     title: "Improver",
//     description: "Buy 10 upgrades",
//     target: 10,
//     reward: 300,
//   },
//   {
//     id: "buyTools",
//     title: "Tool Collector",
//     description: "Buy 2 tools",
//     target: 2,
//     reward: 400,
//   },
//   {
//     id: "critHits",
//     title: "Lucky Strikes",
//     description: "Land 50 critical hits",
//     target: 50,
//     reward: 600,
//   },
//   {
//     id: "bestCombo",
//     title: "Combo Master",
//     description: "Reach a 40 hit combo",
//     target: 40,
//     reward: 800,
//   },
//   {
//     id: "reachDepth",
//     title: "Deep Digger",
//     description: "Reach 30 M depth",
//     target: 30,
//     reward: 500,
//   },
//   {
//     id: "mineGold",
//     title: "Gold Rush",
//     description: "Mine 5 Gold Ore",
//     target: 5,
//     reward: 300,
//   },
//   {
//     id: "mineDiamond",
//     title: "Diamond Hunter",
//     description: "Mine 5 Diamonds",
//     target: 5,
//     reward: 1500,
//   },
//   {
//     id: "mineEmerald",
//     title: "Emerald Seeker",
//     description: "Mine 5 Emeralds",
//     target: 5,
//     reward: 8000,
//   },
//   {
//     id: "mineRuby",
//     title: "Ruby Collector",
//     description: "Mine 5 Rubies",
//     target: 5,
//     reward: 40000,
//   },
//   {
//     id: "mineVibranium",
//     title: "Vibranium Miner",
//     description: "Mine 5 Vibranium",
//     target: 5,
//     reward: 400000,
//   },
//   {
//     id: "reachZone3",
//     title: "Iron Explorer",
//     description: "Reach Iron Caverns (90 M)",
//     target: 90,
//     reward: 2000,
//   },
//   {
//     id: "reachZone4",
//     title: "Crystal Adventurer",
//     description: "Reach Crystal Abyss (200 M)",
//     target: 200,
//     reward: 15000,
//   },
//   {
//     id: "reachZone5",
//     title: "Core Breaker",
//     description: "Reach Vibranium Core (400 M)",
//     target: 400,
//     reward: 200000,
//   },
//   {
//     id: "reachZone6",
//     title: "Into the Void",
//     description: "Reach Deep Void (800 M)",
//     target: 800,
//     reward: 3_000_000,
//   },
// ];

// /* ===================== STATS ===================== */
// export const comboMultiplier = (combo: number, comboLevel: number) =>
//   1 + Math.min(combo * 0.02, 0.2 * (1 + comboLevel));

// export function deriveStats(
//   up: Record<UpgradeId, number>,
//   toolId: ToolId,
//   combo: number,
// ) {
//   const toolMult = TOOLS.find((t) => t.id === toolId)?.damageMultiplier ?? 1;
//   const baseDamage = 1 + 2 * up.damage;
//   const comboMult = comboMultiplier(combo, up.combo);
//   return {
//     toolMult,
//     baseDamage,
//     comboMult,
//     damagePerClick: Math.max(1, Math.floor(baseDamage * toolMult * comboMult)),
//     critChance: Math.min(0.95, 0.05 + 0.02 * up.criticalChance),
//     critMult: 2 + 0.25 * up.criticalDamage,
//     doubleChance: 0.05 * up.gloves,
//     autoDps: Math.floor(2 * up.autoDamage * Math.sqrt(toolMult)),
//     coinMult: 1 + 0.1 * up.coinBoost,
//     jackpotChance: 0.015 * up.lucky,
//   };
// }
// export type Stats = ReturnType<typeof deriveStats>;

// /* ===================== STATE ===================== */
// export type HitEvent = {
//   id: number;
//   damage: number;
//   crit: boolean;
//   critMult: number;
//   double: boolean;
//   auto: boolean;
//   destroyed: boolean;
//   reward: number;
//   jackpot: boolean;
//   rockId: RockId;
//   newZone: string | null;
// };

// type State = {
//   coins: number;
//   depth: number;
//   rock: Rock;
//   rockHp: number;
//   rockMax: number;
//   rockKey: number;
//   activeToolId: ToolId;
//   ownedToolIds: ToolId[];
//   combo: number;
//   upgrades: Record<UpgradeId, number>;
//   progress: Record<TaskId, number>;
//   claimed: TaskId[];
//   event: HitEvent | null;
//   eventId: number;
// };

// const zeroRecord = <K extends string>(keys: K[]) =>
//   Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;

// const INITIAL: State = {
//   coins: 0,
//   depth: 0,
//   rock: ROCKS.dirt,
//   rockHp: ROCKS.dirt.health,
//   rockMax: ROCKS.dirt.health,
//   rockKey: 0,
//   activeToolId: "hands",
//   ownedToolIds: ["hands"],
//   combo: 0,
//   upgrades: zeroRecord(UPGRADES.map((u) => u.id)),
//   progress: zeroRecord(TASKS.map((t) => t.id)),
//   claimed: [],
//   event: null,
//   eventId: 0,
// };

// type Action =
//   | { type: "HIT"; r: number[] }
//   | { type: "AUTO"; r: number[] }
//   | { type: "COMBO_RESET" }
//   | { type: "BUY_TOOL"; id: ToolId }
//   | { type: "SELECT_TOOL"; id: ToolId }
//   | { type: "BUY_UPGRADE"; id: UpgradeId }
//   | { type: "CLAIM"; id: TaskId }
//   | { type: "LOAD"; state: State };

// export const upgradePrice = (u: GameUpgrade, level: number) =>
//   Math.ceil(u.basePrice * Math.pow(u.priceMultiplier, level));

// // Applies damage to the current rock. If it breaks: reward, depth +1, next rock, progress for quests.
// function strike(
//   s: State,
//   total: number,
//   meta: Pick<HitEvent, "crit" | "critMult" | "double" | "auto">,
//   r: number[],
// ): State {
//   const hp = s.rockHp - total;
//   const eventId = s.eventId + 1;
//   const event: HitEvent = {
//     id: eventId,
//     damage: total,
//     ...meta,
//     destroyed: false,
//     reward: 0,
//     jackpot: false,
//     rockId: s.rock.id,
//     newZone: null,
//   };
//   if (hp > 0) return { ...s, rockHp: hp, eventId, event };

//   const st = deriveStats(s.upgrades, s.activeToolId, s.combo);
//   const zi = zoneIndexFor(s.depth);
//   const jackpot = r[2] < st.jackpotChance;
//   const reward = Math.ceil(
//     s.rock.reward * ZONES[zi].rewardScale * st.coinMult * (jackpot ? 5 : 1),
//   );
//   const depth = s.depth + 1;
//   const nzi = zoneIndexFor(depth);
//   const next = pickRock(ZONES[nzi], r[3]);
//   const p = { ...s.progress };
//   p.destroyRocks += 1;
//   p.earnCoins += reward;
//   p.reachDepth = Math.max(p.reachDepth, depth);
//   (
//     [
//       "mineGold",
//       "mineDiamond",
//       "mineEmerald",
//       "mineRuby",
//       "mineVibranium",
//     ] as TaskId[]
//   ).forEach((id) => {
//     if (id.toLowerCase() === `mine${s.rock.id}`) p[id] += 1;
//   });
//   (
//     ["reachZone3", "reachZone4", "reachZone5", "reachZone6"] as TaskId[]
//   ).forEach((id) => {
//     p[id] = Math.max(p[id], depth);
//   });
//   return {
//     ...s,
//     coins: s.coins + reward,
//     depth,
//     rock: next,
//     rockHp: rockHp(next, ZONES[nzi]),
//     rockMax: rockHp(next, ZONES[nzi]),
//     rockKey: s.rockKey + 1,
//     progress: p,
//     eventId,
//     event: {
//       ...event,
//       destroyed: true,
//       reward,
//       jackpot,
//       newZone: nzi !== zi ? ZONES[nzi].name : null,
//     },
//   };
// }

// function reducer(s: State, a: Action): State {
//   switch (a.type) {
//     case "HIT": {
//       const combo = s.combo + 1;
//       const st = deriveStats(s.upgrades, s.activeToolId, combo);
//       const crit = a.r[0] < st.critChance;
//       const double = a.r[1] < st.doubleChance;
//       const one = Math.max(
//         1,
//         Math.floor(
//           st.baseDamage * st.toolMult * st.comboMult * (crit ? st.critMult : 1),
//         ),
//       );
//       const next = strike(
//         { ...s, combo },
//         one * (double ? 2 : 1),
//         { crit, critMult: st.critMult, double, auto: false },
//         a.r,
//       );
//       next.progress = {
//         ...next.progress,
//         critHits: next.progress.critHits + (crit ? 1 : 0),
//         bestCombo: Math.max(next.progress.bestCombo, combo),
//       };
//       return next;
//     }
//     case "AUTO": {
//       const st = deriveStats(s.upgrades, s.activeToolId, 0);
//       return st.autoDps > 0
//         ? strike(
//             s,
//             st.autoDps,
//             { crit: false, critMult: 1, double: false, auto: true },
//             a.r,
//           )
//         : s;
//     }
//     case "COMBO_RESET":
//       return { ...s, combo: 0 };
//     case "BUY_TOOL": {
//       const i = TOOLS.findIndex((t) => t.id === a.id);
//       const tool = TOOLS[i];
//       if (!tool || s.ownedToolIds.includes(tool.id) || s.coins < tool.price)
//         return s;
//       if (i > 0 && !s.ownedToolIds.includes(TOOLS[i - 1].id)) return s;
//       return {
//         ...s,
//         coins: s.coins - tool.price,
//         ownedToolIds: [...s.ownedToolIds, tool.id],
//         activeToolId: tool.id,
//         progress: { ...s.progress, buyTools: s.progress.buyTools + 1 },
//       };
//     }
//     case "SELECT_TOOL":
//       return s.ownedToolIds.includes(a.id) ? { ...s, activeToolId: a.id } : s;
//     case "BUY_UPGRADE": {
//       const u = UPGRADES.find((x) => x.id === a.id);
//       if (!u) return s;
//       const level = s.upgrades[a.id];
//       const price = upgradePrice(u, level);
//       if (level >= u.maxLevel || s.coins < price) return s;
//       return {
//         ...s,
//         coins: s.coins - price,
//         upgrades: { ...s.upgrades, [a.id]: level + 1 },
//         progress: { ...s.progress, buyUpgrades: s.progress.buyUpgrades + 1 },
//       };
//     }
//     case "CLAIM": {
//       const t = TASKS.find((x) => x.id === a.id);
//       if (!t || s.claimed.includes(a.id) || s.progress[a.id] < t.target)
//         return s;
//       return { ...s, coins: s.coins + t.reward, claimed: [...s.claimed, a.id] };
//     }
//     case "LOAD":
//       return a.state;
//   }
// }

// /* ===================== CONTEXT ===================== */
// const SAVE_KEY = "glebia.save.v2";
// const rolls = () => [
//   Math.random(),
//   Math.random(),
//   Math.random(),
//   Math.random(),
// ];

// type GameContextType = {
//   myCoins: number;
//   depth: number;
//   currentZone: Zone;
//   zoneIndex: number;
//   nextZone: Zone | null;
//   currentRock: Rock;
//   rockKey: number;
//   rockHealth: number;
//   rockMaxHealth: number;
//   stats: Stats;
//   combo: number;
//   comboMultiplier: number;
//   hitEvent: HitEvent | null;
//   activeToolId: ToolId;
//   ownedToolIds: ToolId[];
//   upgradeLevels: Record<UpgradeId, number>;
//   taskProgress: Record<TaskId, number>;
//   claimedTaskIds: TaskId[];
//   hitRock: () => void;
//   buyTool: (id: ToolId) => void;
//   selectTool: (id: ToolId) => void;
//   buyUpgrade: (id: UpgradeId) => void;
//   getUpgradePrice: (id: UpgradeId) => number;
//   claimTaskReward: (id: TaskId) => void;
// };

// const GameContext = createContext<GameContextType | null>(null);

// export function GameProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(reducer, INITIAL);
//   const [ready, setReady] = useState(false);
//   const stateRef = useRef(state);
//   stateRef.current = state;
//   const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // load save
//   useEffect(() => {
//     AsyncStorage.getItem(SAVE_KEY)
//       .then((raw) => {
//         if (raw) {
//           const saved = JSON.parse(raw);
//           dispatch({
//             type: "LOAD",
//             state: {
//               ...INITIAL,
//               ...saved,
//               event: null,
//               combo: 0,
//               upgrades: { ...INITIAL.upgrades, ...saved.upgrades },
//               progress: { ...INITIAL.progress, ...saved.progress },
//             },
//           });
//         }
//         setReady(true);
//       })
//       .catch(() => setReady(true));
//   }, []);

//   // autosave
//   useEffect(() => {
//     if (!ready) return;
//     const id = setInterval(() => {
//       const { event, ...rest } = stateRef.current;
//       void event;
//       AsyncStorage.setItem(SAVE_KEY, JSON.stringify(rest));
//     }, 3000);
//     return () => clearInterval(id);
//   }, [ready]);

//   // auto miner
//   const autoLevel = state.upgrades.autoDamage;
//   useEffect(() => {
//     if (!ready || autoLevel === 0) return;
//     const id = setInterval(() => dispatch({ type: "AUTO", r: rolls() }), 1000);
//     return () => clearInterval(id);
//   }, [ready, autoLevel]);

//   useEffect(
//     () => () => {
//       if (comboTimer.current) clearTimeout(comboTimer.current);
//     },
//     [],
//   );

//   const hitRock = useCallback(() => {
//     dispatch({ type: "HIT", r: rolls() });
//     if (comboTimer.current) clearTimeout(comboTimer.current);
//     comboTimer.current = setTimeout(
//       () => dispatch({ type: "COMBO_RESET" }),
//       1500,
//     );
//   }, []);

//   const stats = useMemo(
//     () => deriveStats(state.upgrades, state.activeToolId, state.combo),
//     [state.upgrades, state.activeToolId, state.combo],
//   );
//   const zoneIndex = zoneIndexFor(state.depth);

//   const value: GameContextType = {
//     myCoins: state.coins,
//     depth: state.depth,
//     currentZone: ZONES[zoneIndex],
//     zoneIndex,
//     nextZone: ZONES[zoneIndex + 1] ?? null,
//     currentRock: state.rock,
//     rockKey: state.rockKey,
//     rockHealth: state.rockHp,
//     rockMaxHealth: state.rockMax,
//     stats,
//     combo: state.combo,
//     comboMultiplier: stats.comboMult,
//     hitEvent: state.event,
//     activeToolId: state.activeToolId,
//     ownedToolIds: state.ownedToolIds,
//     upgradeLevels: state.upgrades,
//     taskProgress: state.progress,
//     claimedTaskIds: state.claimed,
//     hitRock,
//     buyTool: (id) => dispatch({ type: "BUY_TOOL", id }),
//     selectTool: (id) => dispatch({ type: "SELECT_TOOL", id }),
//     buyUpgrade: (id) => dispatch({ type: "BUY_UPGRADE", id }),
//     getUpgradePrice: (id) =>
//       upgradePrice(
//         UPGRADES.find((u) => u.id === id)!,
//         state.upgrades[id],
//       ),
//     claimTaskReward: (id) => dispatch({ type: "CLAIM", id }),
//   };

//   return ready ? (
//     <GameContext.Provider value={value}>{children}</GameContext.Provider>
//   ) : null;
// }

// export function useGame() {
//   const ctx = useContext(GameContext);
//   if (!ctx) throw new Error("useGame must be used inside GameProvider");
//   return ctx;
// }

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ===================== HELPERS ===================== */
export const formatNumber = (n: number) => {
  if (n < 1000) return String(Math.floor(n));

  const units = ["K", "M", "B", "T"];
  let v = n;
  let i = -1;

  while (v >= 1000 && i < units.length - 1) {
    v /= 1000;
    i++;
  }

  const s = v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);

  return `${parseFloat(s)}${units[i]}`;
};

/* ===================== TOOLS ===================== */
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
  {
    id: "goldPickaxe",
    name: "Gold Pickaxe",
    damageMultiplier: 5,
    price: 7000,
  },
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
    price: 2000000,
  },
  {
    id: "crystalPickaxe",
    name: "Crystal Pickaxe",
    damageMultiplier: 40,
    price: 8000000,
  },
  {
    id: "vibraniumPickaxe",
    name: "Vibranium Pickaxe",
    damageMultiplier: 60,
    price: 30000000,
  },
  {
    id: "goldenDrill",
    name: "Golden Drill",
    damageMultiplier: 90,
    price: 120000000,
  },
  {
    id: "plasmaDrill",
    name: "Plasma Drill",
    damageMultiplier: 140,
    price: 500000000,
  },
];

/* ===================== UPGRADES ===================== */
export type UpgradeId =
  | "damage"
  | "autoDamage"
  | "gloves"
  | "criticalChance"
  | "criticalDamage"
  | "combo"
  | "coinBoost"
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

export const UPGRADES: GameUpgrade[] = [
  {
    id: "damage",
    name: "Strong Arms",
    description: "+2 base damage per level",
    color: "#E8A33D",
    basePrice: 15,
    priceMultiplier: 1.22,
    maxLevel: 50,
    effect: (level) => `+${2 * level} base damage`,
  },
  {
    id: "autoDamage",
    name: "Auto Miner",
    description: "Mines by itself every second",
    color: "#4FD1C5",
    basePrice: 40,
    priceMultiplier: 1.25,
    maxLevel: 25,
    effect: (level) => `${2 * level} dmg/s (grows with your tool)`,
  },
  {
    id: "gloves",
    name: "Mining Gloves",
    description: "+5% chance for a double hit",
    color: "#D9573B",
    basePrice: 100,
    priceMultiplier: 1.5,
    maxLevel: 10,
    effect: (level) => `${5 * level}% double hit`,
  },
  {
    id: "criticalChance",
    name: "Critical Chance",
    description: "+2% critical hit chance",
    color: "#FF8FA0",
    basePrice: 75,
    priceMultiplier: 1.3,
    maxLevel: 25,
    effect: (level) => `${5 + 2 * level}% crit chance`,
  },
  {
    id: "criticalDamage",
    name: "Critical Power",
    description: "+0.25x critical damage",
    color: "#FFD84D",
    basePrice: 125,
    priceMultiplier: 1.35,
    maxLevel: 20,
    effect: (level) => `x${(2 + 0.25 * level).toFixed(2)} on crit`,
  },
  {
    id: "combo",
    name: "Combo Master",
    description: "+20% maximum combo bonus",
    color: "#9B7CFF",
    basePrice: 200,
    priceMultiplier: 1.9,
    maxLevel: 5,
    effect: (level) => `max +${20 * (1 + level)}% from combo`,
  },
  {
    id: "coinBoost",
    name: "Coin Boost",
    description: "+10% coins from every rock",
    color: "#6FCF7A",
    basePrice: 150,
    priceMultiplier: 1.35,
    maxLevel: 20,
    effect: (level) => `+${10 * level}% coins`,
  },
  {
    id: "lucky",
    name: "Lucky Miner",
    description: "+1.5% chance for a x5 JACKPOT",
    color: "#F0ABFC",
    basePrice: 300,
    priceMultiplier: 1.6,
    maxLevel: 10,
    effect: (level) => `${(1.5 * level).toFixed(1)}% jackpot`,
  },
];

/* ===================== ROCKS & ZONES ===================== */
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
    hpScale: 4000000,
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

export const zoneIndexFor = (depth: number) =>
  ZONES.reduce(
    (lastIndex, zone, index) => (depth >= zone.startDepth ? index : lastIndex),
    0,
  );

const pickRock = (zone: Zone, roll: number): Rock => {
  let remaining =
    roll * zone.rocks.reduce((total, rock) => total + rock.weight, 0);

  for (const rockChance of zone.rocks) {
    remaining -= rockChance.weight;

    if (remaining <= 0) {
      return ROCKS[rockChance.id];
    }
  }

  return ROCKS[zone.rocks[0].id];
};

const rockHp = (rock: Rock, zone: Zone) =>
  Math.ceil(rock.health * zone.hpScale);

/* ===================== TASKS ===================== */
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
  | "reachZone6";

export type GameTask = {
  id: TaskId;
  title: string;
  description: string;
  target: number;
  reward: number;
};

export const TASKS: GameTask[] = [
  {
    id: "destroyRocks",
    title: "Rock Breaker",
    description: "Destroy 25 rocks",
    target: 25,
    reward: 40,
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
  },
  {
    id: "buyTools",
    title: "Tool Collector",
    description: "Buy 2 tools",
    target: 2,
    reward: 400,
  },
  {
    id: "critHits",
    title: "Lucky Strikes",
    description: "Land 50 critical hits",
    target: 50,
    reward: 600,
  },
  {
    id: "bestCombo",
    title: "Combo Master",
    description: "Reach a 40 hit combo",
    target: 40,
    reward: 800,
  },
  {
    id: "reachDepth",
    title: "Deep Digger",
    description: "Reach 30 M depth",
    target: 30,
    reward: 500,
  },
  {
    id: "mineGold",
    title: "Gold Rush",
    description: "Mine 5 Gold Ore",
    target: 5,
    reward: 300,
  },
  {
    id: "mineDiamond",
    title: "Diamond Hunter",
    description: "Mine 5 Diamonds",
    target: 5,
    reward: 1500,
  },
  {
    id: "mineEmerald",
    title: "Emerald Seeker",
    description: "Mine 5 Emeralds",
    target: 5,
    reward: 8000,
  },
  {
    id: "mineRuby",
    title: "Ruby Collector",
    description: "Mine 5 Rubies",
    target: 5,
    reward: 40000,
  },
  {
    id: "mineVibranium",
    title: "Vibranium Miner",
    description: "Mine 5 Vibranium",
    target: 5,
    reward: 400000,
  },
  {
    id: "reachZone3",
    title: "Iron Explorer",
    description: "Reach Iron Caverns (90 M)",
    target: 90,
    reward: 2000,
  },
  {
    id: "reachZone4",
    title: "Crystal Adventurer",
    description: "Reach Crystal Abyss (200 M)",
    target: 200,
    reward: 15000,
  },
  {
    id: "reachZone5",
    title: "Core Breaker",
    description: "Reach Vibranium Core (400 M)",
    target: 400,
    reward: 200000,
  },
  {
    id: "reachZone6",
    title: "Into the Void",
    description: "Reach Deep Void (800 M)",
    target: 800,
    reward: 3000000,
  },
];

/* ===================== STATS ===================== */
export const comboMultiplier = (combo: number, comboLevel: number) =>
  1 + Math.min(combo * 0.02, 0.2 * (1 + comboLevel));

export function deriveStats(
  upgrades: Record<UpgradeId, number>,
  toolId: ToolId,
  combo: number,
) {
  const toolMult =
    TOOLS.find((tool) => tool.id === toolId)?.damageMultiplier ?? 1;

  const baseDamage = 1 + 2 * upgrades.damage;
  const comboMult = comboMultiplier(combo, upgrades.combo);

  return {
    toolMult,
    baseDamage,
    comboMult,
    damagePerClick: Math.max(1, Math.floor(baseDamage * toolMult * comboMult)),
    critChance: Math.min(0.95, 0.05 + 0.02 * upgrades.criticalChance),
    critMult: 2 + 0.25 * upgrades.criticalDamage,
    doubleChance: 0.05 * upgrades.gloves,
    autoDps: Math.floor(2 * upgrades.autoDamage * Math.sqrt(toolMult)),
    coinMult: 1 + 0.1 * upgrades.coinBoost,
    jackpotChance: 0.015 * upgrades.lucky,
  };
}

export type Stats = ReturnType<typeof deriveStats>;

/* ===================== STATE ===================== */
export type HitEvent = {
  id: number;
  damage: number;
  crit: boolean;
  critMult: number;
  double: boolean;
  auto: boolean;
  destroyed: boolean;
  reward: number;
  jackpot: boolean;
  rockId: RockId;
  newZone: string | null;
};

type State = {
  coins: number;
  depth: number;
  rock: Rock;
  rockHp: number;
  rockMax: number;
  rockKey: number;
  activeToolId: ToolId;
  ownedToolIds: ToolId[];
  combo: number;
  upgrades: Record<UpgradeId, number>;
  progress: Record<TaskId, number>;
  claimed: TaskId[];
  event: HitEvent | null;
  eventId: number;
};

const zeroRecord = <K extends string>(keys: K[]) =>
  Object.fromEntries(keys.map((key) => [key, 0])) as Record<K, number>;

const INITIAL: State = {
  coins: 0,
  depth: 0,
  rock: ROCKS.dirt,
  rockHp: ROCKS.dirt.health,
  rockMax: ROCKS.dirt.health,
  rockKey: 0,
  activeToolId: "hands",
  ownedToolIds: ["hands"],
  combo: 0,
  upgrades: zeroRecord(UPGRADES.map((upgrade) => upgrade.id)),
  progress: zeroRecord(TASKS.map((task) => task.id)),
  claimed: [],
  event: null,
  eventId: 0,
};

type Action =
  | { type: "HIT"; rolls: number[] }
  | { type: "AUTO"; rolls: number[] }
  | { type: "COMBO_RESET" }
  | { type: "BUY_TOOL"; id: ToolId }
  | { type: "SELECT_TOOL"; id: ToolId }
  | { type: "BUY_UPGRADE"; id: UpgradeId }
  | { type: "CLAIM"; id: TaskId }
  | { type: "LOAD"; state: State }
  | { type: "RESET" };

export const upgradePrice = (upgrade: GameUpgrade, level: number) =>
  Math.ceil(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, level));

function strike(
  state: State,
  totalDamage: number,
  meta: Pick<HitEvent, "crit" | "critMult" | "double" | "auto">,
  rolls: number[],
): State {
  const nextHealth = state.rockHp - totalDamage;
  const eventId = state.eventId + 1;

  const event: HitEvent = {
    id: eventId,
    damage: totalDamage,
    ...meta,
    destroyed: false,
    reward: 0,
    jackpot: false,
    rockId: state.rock.id,
    newZone: null,
  };

  if (nextHealth > 0) {
    return {
      ...state,
      rockHp: nextHealth,
      eventId,
      event,
    };
  }

  const stats = deriveStats(state.upgrades, state.activeToolId, state.combo);

  const currentZoneIndex = zoneIndexFor(state.depth);
  const jackpot = rolls[2] < stats.jackpotChance;

  const reward = Math.ceil(
    state.rock.reward *
      ZONES[currentZoneIndex].rewardScale *
      stats.coinMult *
      (jackpot ? 5 : 1),
  );

  const depth = state.depth + 1;
  const nextZoneIndex = zoneIndexFor(depth);
  const nextRock = pickRock(ZONES[nextZoneIndex], rolls[3]);

  const progress = { ...state.progress };

  progress.destroyRocks += 1;
  progress.earnCoins += reward;
  progress.reachDepth = Math.max(progress.reachDepth, depth);

  const minedRockTask: Record<RockId, TaskId | null> = {
    dirt: null,
    stone: null,
    iron: null,
    gold: "mineGold",
    diamond: "mineDiamond",
    emerald: "mineEmerald",
    ruby: "mineRuby",
    vibranium: "mineVibranium",
    obsidian: null,
    crystal: null,
  };

  const minedTaskId = minedRockTask[state.rock.id];

  if (minedTaskId) {
    progress[minedTaskId] += 1;
  }

  const zoneTasks: [TaskId, number][] = [
    ["reachZone3", 90],
    ["reachZone4", 200],
    ["reachZone5", 400],
    ["reachZone6", 800],
  ];

  zoneTasks.forEach(([taskId, targetDepth]) => {
    progress[taskId] = Math.max(
      progress[taskId],
      depth >= targetDepth ? targetDepth : progress[taskId],
    );
  });

  return {
    ...state,
    coins: state.coins + reward,
    depth,
    rock: nextRock,
    rockHp: rockHp(nextRock, ZONES[nextZoneIndex]),
    rockMax: rockHp(nextRock, ZONES[nextZoneIndex]),
    rockKey: state.rockKey + 1,
    progress,
    eventId,
    event: {
      ...event,
      destroyed: true,
      reward,
      jackpot,
      newZone:
        nextZoneIndex !== currentZoneIndex ? ZONES[nextZoneIndex].name : null,
    },
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HIT": {
      const combo = state.combo + 1;
      const stats = deriveStats(state.upgrades, state.activeToolId, combo);

      const crit = action.rolls[0] < stats.critChance;
      const double = action.rolls[1] < stats.doubleChance;

      const oneHitDamage = Math.max(
        1,
        Math.floor(
          stats.baseDamage *
            stats.toolMult *
            stats.comboMult *
            (crit ? stats.critMult : 1),
        ),
      );

      const nextState = strike(
        { ...state, combo },
        oneHitDamage * (double ? 2 : 1),
        {
          crit,
          critMult: stats.critMult,
          double,
          auto: false,
        },
        action.rolls,
      );

      return {
        ...nextState,
        progress: {
          ...nextState.progress,
          critHits: nextState.progress.critHits + (crit ? 1 : 0),
          bestCombo: Math.max(nextState.progress.bestCombo, combo),
        },
      };
    }

    case "AUTO": {
      const stats = deriveStats(state.upgrades, state.activeToolId, 0);

      if (stats.autoDps <= 0) {
        return state;
      }

      return strike(
        state,
        stats.autoDps,
        {
          crit: false,
          critMult: 1,
          double: false,
          auto: true,
        },
        action.rolls,
      );
    }

    case "COMBO_RESET":
      return {
        ...state,
        combo: 0,
      };

    case "BUY_TOOL": {
      const toolIndex = TOOLS.findIndex((tool) => tool.id === action.id);
      const tool = TOOLS[toolIndex];

      if (!tool) {
        return state;
      }

      const isOwned = state.ownedToolIds.includes(tool.id);
      const canAfford = state.coins >= tool.price;

      const previousTool = TOOLS[toolIndex - 1];
      const previousOwned =
        toolIndex === 0 || state.ownedToolIds.includes(previousTool.id);

      if (isOwned || !canAfford || !previousOwned) {
        return state;
      }

      return {
        ...state,
        coins: state.coins - tool.price,
        ownedToolIds: [...state.ownedToolIds, tool.id],
        activeToolId: tool.id,
        progress: {
          ...state.progress,
          buyTools: state.progress.buyTools + 1,
        },
      };
    }

    case "SELECT_TOOL":
      return state.ownedToolIds.includes(action.id)
        ? {
            ...state,
            activeToolId: action.id,
          }
        : state;

    case "BUY_UPGRADE": {
      const upgrade = UPGRADES.find((item) => item.id === action.id);

      if (!upgrade) {
        return state;
      }

      const level = state.upgrades[action.id];
      const price = upgradePrice(upgrade, level);

      if (level >= upgrade.maxLevel || state.coins < price) {
        return state;
      }

      return {
        ...state,
        coins: state.coins - price,
        upgrades: {
          ...state.upgrades,
          [action.id]: level + 1,
        },
        progress: {
          ...state.progress,
          buyUpgrades: state.progress.buyUpgrades + 1,
        },
      };
    }

    case "CLAIM": {
      const task = TASKS.find((item) => item.id === action.id);

      if (!task) {
        return state;
      }

      const isClaimed = state.claimed.includes(action.id);
      const isCompleted = state.progress[action.id] >= task.target;

      if (isClaimed || !isCompleted) {
        return state;
      }

      return {
        ...state,
        coins: state.coins + task.reward,
        claimed: [...state.claimed, action.id],
      };
    }

    case "LOAD":
      return action.state;

    case "RESET":
      return {
        ...INITIAL,
        eventId: state.eventId + 1,
        event: null,
      };
  }
}

/* ===================== CONTEXT ===================== */
const SAVE_KEY = "glebia.save.v2";

const rolls = () => [
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
];

type GameContextType = {
  myCoins: number;
  depth: number;
  currentZone: Zone;
  zoneIndex: number;
  nextZone: Zone | null;
  currentRock: Rock;
  rockKey: number;
  rockHealth: number;
  rockMaxHealth: number;
  stats: Stats;
  combo: number;
  comboMultiplier: number;
  hitEvent: HitEvent | null;
  activeToolId: ToolId;
  ownedToolIds: ToolId[];
  upgradeLevels: Record<UpgradeId, number>;
  taskProgress: Record<TaskId, number>;
  claimedTaskIds: TaskId[];
  hitRock: () => void;
  buyTool: (id: ToolId) => void;
  selectTool: (id: ToolId) => void;
  buyUpgrade: (id: UpgradeId) => void;
  getUpgradePrice: (id: UpgradeId) => number;
  claimTaskReward: (id: TaskId) => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [ready, setReady] = useState(false);

  const stateRef = useRef(state);
  stateRef.current = state;

  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(SAVE_KEY)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw) as Partial<State>;

          dispatch({
            type: "LOAD",
            state: {
              ...INITIAL,
              ...saved,
              event: null,
              combo: 0,
              upgrades: {
                ...INITIAL.upgrades,
                ...saved.upgrades,
              },
              progress: {
                ...INITIAL.progress,
                ...saved.progress,
              },
            },
          });
        }

        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const saveInterval = setInterval(() => {
      const { event, ...stateToSave } = stateRef.current;

      void event;

      AsyncStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
    }, 3000);

    return () => clearInterval(saveInterval);
  }, [ready]);

  const autoLevel = state.upgrades.autoDamage;

  useEffect(() => {
    if (!ready || autoLevel === 0) {
      return;
    }

    const autoInterval = setInterval(() => {
      dispatch({
        type: "AUTO",
        rolls: rolls(),
      });
    }, 1000);

    return () => clearInterval(autoInterval);
  }, [ready, autoLevel]);

  useEffect(() => {
    return () => {
      if (comboTimer.current) {
        clearTimeout(comboTimer.current);
      }
    };
  }, []);

  const hitRock = useCallback(() => {
    dispatch({
      type: "HIT",
      rolls: rolls(),
    });

    if (comboTimer.current) {
      clearTimeout(comboTimer.current);
    }

    comboTimer.current = setTimeout(() => {
      dispatch({
        type: "COMBO_RESET",
      });
    }, 1500);
  }, []);

  const resetGame = useCallback(() => {
    if (comboTimer.current) {
      clearTimeout(comboTimer.current);
      comboTimer.current = null;
    }

    AsyncStorage.removeItem(SAVE_KEY);
    dispatch({
      type: "RESET",
    });
  }, []);

  const stats = useMemo(
    () => deriveStats(state.upgrades, state.activeToolId, state.combo),
    [state.upgrades, state.activeToolId, state.combo],
  );

  const zoneIndex = zoneIndexFor(state.depth);

  const value: GameContextType = {
    myCoins: state.coins,
    depth: state.depth,
    currentZone: ZONES[zoneIndex],
    zoneIndex,
    nextZone: ZONES[zoneIndex + 1] ?? null,
    currentRock: state.rock,
    rockKey: state.rockKey,
    rockHealth: state.rockHp,
    rockMaxHealth: state.rockMax,
    stats,
    combo: state.combo,
    comboMultiplier: stats.comboMult,
    hitEvent: state.event,
    activeToolId: state.activeToolId,
    ownedToolIds: state.ownedToolIds,
    upgradeLevels: state.upgrades,
    taskProgress: state.progress,
    claimedTaskIds: state.claimed,
    hitRock,
    buyTool: (id) => dispatch({ type: "BUY_TOOL", id }),
    selectTool: (id) => dispatch({ type: "SELECT_TOOL", id }),
    buyUpgrade: (id) => dispatch({ type: "BUY_UPGRADE", id }),
    getUpgradePrice: (id) =>
      upgradePrice(
        UPGRADES.find((upgrade) => upgrade.id === id)!,
        state.upgrades[id],
      ),
    claimTaskReward: (id) => dispatch({ type: "CLAIM", id }),
    resetGame,
  };

  return ready ? (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  ) : null;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
}
