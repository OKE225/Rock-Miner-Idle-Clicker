import {
  BOOSTS,
  CHESTS,
  CHEST_DROP,
  COMMON_CHESTS,
  COSMETICS,
  DIAMOND_DROP,
  DIAMOND_ITEMS,
  HAZARDS,
  HAZARD_LIST,
  PACKS,
  PERMS,
  PERM_PRICE_GROWTH,
  RARE_CHANCE,
  RARE_CHESTS,
  RARE_EVERY,
  REBIRTH_DEPTH,
  ROCKS,
  ROCK_ORDER,
  SKILLS,
  TASKS,
  TOOLS,
  UPGRADES,
  ZONES,
  formatNumber,
  rebirthPoints,
  type BoostId,
  type ChestId,
  type DiamondItem,
  type GameUpgrade,
  type HazardId,
  type PermId,
  type Rock,
  type RockId,
  type SkillId,
  type TaskId,
  type ToolId,
  type UpgradeId,
  type Zone,
} from "./gameData";

export type Reward = {
  kind: "coins" | "diamonds" | "boost" | "tool" | "cosmetic" | "perm";
  text: string;
  color: string;
};
export type Boosts = Partial<Record<BoostId, number>>;

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
  doubleCoins: boolean;
  rockId: RockId;
  hazard: HazardId | null;
  nextHazard: HazardId | null;
  diamonds: number;
  chest: ChestId | null;
  newZone: string | null;
  milestone: string | null;
};

export type PlayStats = {
  playSeconds: number;
  rocks: number;
  totalCoins: number;
  deepest: number;
  crits: number;
  bestCombo: number;
  chestsOpened: number;
  hazards: number;
  diamondsEarned: number;
  diamondsSpent: number;
};
export type Settings = { haptics: boolean; numbers: boolean; shake: boolean };

export type State = {
  coins: number;
  diamonds: number;
  depth: number;
  rock: Rock;
  hazard: HazardId | null;
  rockHp: number;
  rockMax: number;
  rockKey: number;
  hazardCountdown: number;
  activeToolId: ToolId;
  ownedToolIds: ToolId[];
  combo: number;
  upgrades: Record<UpgradeId, number>;
  progress: Record<TaskId, number>;
  claimed: TaskId[];
  perm: Record<PermId, number>;
  boosts: Boosts;
  adFree: boolean;
  chests: Record<ChestId, number>;
  chestDrops: number;
  rebirths: number;
  skillPoints: number;
  skills: Record<SkillId, number>;
  cosmetics: string[];
  activeCosmetic: string | null;
  stats: PlayStats;
  settings: Settings;
  event: HitEvent | null;
  eventId: number;
  lastChest: { id: number; chest: ChestId; rewards: Reward[] } | null;
  grantedTx: string[];
};

const zeroRecord = <K extends string>(keys: K[]) =>
  Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;

export const INITIAL: State = {
  coins: 0,
  diamonds: 0,
  depth: 0,
  rock: ROCKS.dirt,
  hazard: null,
  rockHp: ROCKS.dirt.health,
  rockMax: ROCKS.dirt.health,
  rockKey: 0,
  hazardCountdown: 30,
  activeToolId: "hands",
  ownedToolIds: ["hands"],
  combo: 0,
  upgrades: zeroRecord(UPGRADES.map((u) => u.id)),
  progress: zeroRecord(TASKS.map((t) => t.id)),
  claimed: [],
  perm: zeroRecord(Object.keys(PERMS) as PermId[]),
  boosts: {},
  adFree: false,
  chests: zeroRecord(Object.keys(CHESTS) as ChestId[]),
  chestDrops: 0,
  rebirths: 0,
  skillPoints: 0,
  skills: zeroRecord(SKILLS.map((s) => s.id)),
  cosmetics: [],
  activeCosmetic: null,
  stats: {
    playSeconds: 0,
    rocks: 0,
    totalCoins: 0,
    deepest: 0,
    crits: 0,
    bestCombo: 0,
    chestsOpened: 0,
    hazards: 0,
    diamondsEarned: 0,
    diamondsSpent: 0,
  },
  settings: { haptics: true, numbers: true, shake: true },
  event: null,
  eventId: 0,
  lastChest: null,
  grantedTx: [],
};

export const zoneIndexFor = (depth: number) =>
  ZONES.reduce((a, z, i) => (depth >= z.startDepth ? i : a), 0);
export const comboMultiplier = (combo: number, comboLevel: number) =>
  1 + Math.min(combo * 0.02, 0.2 * (1 + comboLevel));

const pickWeighted = <T>(table: [T, number][], roll: number): T => {
  let r = roll * table.reduce((t, x) => t + x[1], 0);
  for (const [item, w] of table) {
    r -= w;
    if (r <= 0) return item;
  }
  return table[0][0];
};
const pickRock = (zone: Zone, roll: number): Rock =>
  ROCKS[
    pickWeighted(
      zone.rocks.map((x) => [x.id, x.weight] as [RockId, number]),
      roll,
    )
  ];
export const avgRockReward = (zone: Zone) => {
  const total = zone.rocks.reduce((t, x) => t + x.weight, 0);
  return (
    (zone.rocks.reduce((t, x) => t + x.weight * ROCKS[x.id].reward, 0) /
      total) *
    zone.rewardScale
  );
};

export const upgradePrice = (u: GameUpgrade, level: number, haggler: number) =>
  Math.ceil(
    u.basePrice *
      Math.pow(u.priceMultiplier, level) *
      Math.max(0.5, 1 - 0.03 * haggler),
  );
export const itemPrice = (item: DiamondItem, perm: Record<PermId, number>) =>
  item.perm
    ? Math.ceil(item.price * Math.pow(PERM_PRICE_GROWTH, perm[item.perm]))
    : item.price;

type StatInput = Pick<
  State,
  | "upgrades"
  | "activeToolId"
  | "perm"
  | "skills"
  | "rebirths"
  | "boosts"
  | "hazard"
>;

export function deriveStats(s: StatInput, combo: number, now: number) {
  const on = (b: BoostId) => (s.boosts[b] ?? 0) > now;
  const up = s.upgrades,
    sk = s.skills;
  const toolMult =
    TOOLS.find((t) => t.id === s.activeToolId)?.damageMultiplier ?? 1;
  const baseDamage = 1 + 2 * up.damage;
  const comboMult = comboMultiplier(combo, up.combo);
  const hazardMult = s.hazard ? 1 + 0.25 * sk.slayer : 1;
  const rebirthMult = 1 + 0.1 * s.rebirths;
  const damageMult =
    toolMult *
    comboMult *
    (1 + 0.1 * sk.mighty) *
    (1 + 0.1 * s.perm.damage) *
    rebirthMult *
    (on("damage2") ? 2 : 1) *
    hazardMult;
  const autoBase =
    2 * up.autoDamage * Math.sqrt(toolMult) * (1 + 0.15 * sk.engineer) +
    s.perm.auto;
  return {
    toolMult,
    baseDamage,
    comboMult,
    damageMult,
    damagePerClick: Math.max(1, Math.floor(baseDamage * damageMult)),
    critChance: Math.min(
      0.95,
      0.05 +
        0.02 * up.criticalChance +
        0.03 * sk.critEye +
        (on("crit10") ? 0.1 : 0),
    ),
    critMult: 2 + 0.25 * up.criticalDamage + 0.2 * sk.pulverize,
    doubleChance: Math.min(0.95, 0.05 * up.gloves + (on("double10") ? 0.1 : 0)),
    autoDps: Math.floor(
      autoBase * (on("auto3") ? 3 : 1) * hazardMult * rebirthMult,
    ),
    coinMult:
      (1 + 0.05 * up.coinBoost + 0.1 * s.perm.coins + 0.1 * sk.prospector) *
      rebirthMult *
      (on("coin2") ? 2 : 1),
    jackpotChance: 0.015 * up.lucky + 0.02 * sk.jackpot,
    doubleCoinChance: Math.min(0.9, 0.03 * up.luckyStrikes),
    diamondMult: 1 + 0.5 * sk.diamondDigger,
    chestMult: 1 + 0.25 * sk.chestMagnet,
  };
}
export type Stats = ReturnType<typeof deriveStats>;

export function rollChest(
  dropNumber: number,
  rType: number,
  rRare: number,
): ChestId {
  const rare = dropNumber % RARE_EVERY === 0 && rRare < RARE_CHANCE;
  return pickWeighted(rare ? RARE_CHESTS : COMMON_CHESTS, rType);
}
const giveChest = (
  s: State,
  rType: number,
  rRare: number,
): { s: State; chest: ChestId } => {
  const drop = s.chestDrops + 1;
  const chest = rollChest(drop, rType, rRare);
  return {
    s: {
      ...s,
      chestDrops: drop,
      chests: { ...s.chests, [chest]: s.chests[chest] + 1 },
    },
    chest,
  };
};

const addBoost = (
  s: State,
  id: BoostId,
  minutes: number,
  now: number,
): State => {
  const ms = minutes * 60000 * (1 + 0.1 * s.skills.timeKeeper);
  return {
    ...s,
    boosts: { ...s.boosts, [id]: Math.max(now, s.boosts[id] ?? 0) + ms },
  };
};
const addDiamonds = (s: State, n: number): State => ({
  ...s,
  diamonds: s.diamonds + n,
  stats: { ...s.stats, diamondsEarned: s.stats.diamondsEarned + n },
});

function resolveChest(
  s0: State,
  id: ChestId,
  r: number[],
  now: number,
): { s: State; rewards: Reward[] } {
  const c = CHESTS[id];
  const st = deriveStats(s0, 0, now);
  let s: State = {
    ...s0,
    chests: { ...s0.chests, [id]: s0.chests[id] - 1 },
    stats: { ...s0.stats, chestsOpened: s0.stats.chestsOpened + 1 },
    progress: { ...s0.progress, chestsOpened: s0.progress.chestsOpened + 1 },
  };
  const rewards: Reward[] = [];

  const coins = Math.ceil(
    avgRockReward(ZONES[zoneIndexFor(s.depth)]) *
      st.coinMult *
      c.coinRocks *
      (0.8 + 0.4 * r[0]),
  );
  s = {
    ...s,
    coins: s.coins + coins,
    stats: { ...s.stats, totalCoins: s.stats.totalCoins + coins },
  };
  rewards.push({
    kind: "coins",
    text: `+${formatNumber(coins)} coins`,
    color: "#FFC93C",
  });

  if (r[1] < c.diamonds[2]) {
    const n =
      c.diamonds[0] + Math.floor(r[2] * (c.diamonds[1] - c.diamonds[0] + 1));
    s = addDiamonds(s, n);
    rewards.push({
      kind: "diamonds",
      text: `+${n} diamonds`,
      color: "#4FC3F7",
    });
  }
  if (r[3] < c.boostChance) {
    const ids: BoostId[] = ["coin2", "damage2", "crit10", "double10"];
    const b = ids[Math.floor(r[4] * ids.length)];
    s = addBoost(s, b, c.boostMinutes, now);
    rewards.push({
      kind: "boost",
      text: `${BOOSTS[b].name} (${c.boostMinutes} min)`,
      color: BOOSTS[b].color,
    });
  }
  if (r[5] < c.toolChance) {
    const tool = TOOLS.find((t) => !s.ownedToolIds.includes(t.id));
    if (tool) {
      s = {
        ...s,
        ownedToolIds: [...s.ownedToolIds, tool.id],
        activeToolId: tool.id,
      };
      rewards.push({
        kind: "tool",
        text: `Free ${tool.name}!`,
        color: "#F3E9DC",
      });
    } else {
      s = addDiamonds(s, 10);
      rewards.push({
        kind: "diamonds",
        text: "+10 diamonds",
        color: "#4FC3F7",
      });
    }
  }
  if (r[6] < c.cosmeticChance) {
    const free = COSMETICS.filter((x) => !s.cosmetics.includes(x.id));
    if (free.length) {
      const cos = free[Math.floor(r[8] * free.length)];
      s = {
        ...s,
        cosmetics: [...s.cosmetics, cos.id],
        activeCosmetic: s.activeCosmetic ?? cos.id,
      };
      rewards.push({
        kind: "cosmetic",
        text: `Hit effect: ${cos.name}`,
        color: cos.color,
      });
    } else {
      s = addDiamonds(s, 20);
      rewards.push({
        kind: "diamonds",
        text: "+20 diamonds",
        color: "#4FC3F7",
      });
    }
  }
  if (r[7] < c.permChance) {
    const open = (Object.keys(PERMS) as PermId[]).filter(
      (p) => s.perm[p] < PERMS[p].max,
    );
    if (open.length) {
      const p = open[Math.floor(r[9] * open.length)];
      s = { ...s, perm: { ...s.perm, [p]: s.perm[p] + 1 } };
      rewards.push({
        kind: "perm",
        text: PERMS[p].name,
        color: PERMS[p].color,
      });
    } else {
      s = addDiamonds(s, 25);
      rewards.push({
        kind: "diamonds",
        text: "+25 diamonds",
        color: "#4FC3F7",
      });
    }
  }
  return { s, rewards };
}

function spawn(s: State, depth: number, r: number[]) {
  const zi = zoneIndexFor(depth);
  const zone = ZONES[zi];
  const base = pickRock(zone, r[3]);
  const countdown = s.hazardCountdown - 1;
  if (countdown <= 0) {
    const avail = HAZARD_LIST.filter((h) => h.minZone <= zi);
    const h = avail[Math.floor(r[9] * avail.length)];
    return {
      rock: base,
      hazard: h.id as HazardId | null,
      hp: Math.ceil(base.health * zone.hpScale * h.hpMult),
      countdown: 25 + Math.floor(r[10] * 21),
    };
  }
  return {
    rock: base,
    hazard: null as HazardId | null,
    hp: Math.ceil(base.health * zone.hpScale),
    countdown,
  };
}

const updateDepthProgress = (p: Record<TaskId, number>, depth: number) => {
  const n = { ...p };
  n.reachDepth = Math.max(n.reachDepth, depth);
  (
    ["reachZone3", "reachZone4", "reachZone5", "reachZone6"] as TaskId[]
  ).forEach((id) => {
    n[id] = Math.max(n[id], depth);
  });
  return n;
};

function milestones(
  s: State,
  depth: number,
  r: number[],
): { s: State; text: string | null; chest: ChestId | null } {
  let ns = s,
    text: string | null = null,
    chest: ChestId | null = null;
  for (
    let m = Math.floor(s.stats.deepest / 50) + 1;
    m <= Math.floor(depth / 50);
    m++
  ) {
    const g = giveChest(ns, r[7], r[8]);
    ns = g.s;
    chest = g.chest;
    text = `${m * 50} m reached: ${CHESTS[g.chest].name}`;
    if (m % 4 === 0) {
      ns = addDiamonds(ns, 1);
      text += " + 1 diamond";
    }
  }
  return {
    s: {
      ...ns,
      stats: { ...ns.stats, deepest: Math.max(ns.stats.deepest, depth) },
    },
    text,
    chest,
  };
}

const emptyEvent = (s: State, id: number): HitEvent => ({
  id,
  damage: 0,
  crit: false,
  critMult: 1,
  double: false,
  auto: false,
  destroyed: false,
  reward: 0,
  jackpot: false,
  doubleCoins: false,
  rockId: s.rock.id,
  hazard: s.hazard,
  nextHazard: null,
  diamonds: 0,
  chest: null,
  newZone: null,
  milestone: null,
});

function strike(
  s: State,
  total: number,
  meta: Pick<HitEvent, "crit" | "critMult" | "double" | "auto">,
  r: number[],
  now: number,
): State {
  const hp = s.rockHp - total;
  const eventId = s.eventId + 1;
  const event: HitEvent = { ...emptyEvent(s, eventId), damage: total, ...meta };
  if (hp > 0) return { ...s, rockHp: hp, eventId, event };

  const st = deriveStats(s, s.combo, now);
  const zi = zoneIndexFor(s.depth);
  const h = s.hazard ? HAZARDS[s.hazard] : null;
  const jackpot = r[2] < st.jackpotChance;
  const doubleCoins = r[4] < st.doubleCoinChance;
  const rich =
    ROCK_ORDER.indexOf(s.rock.id) >= 3 ? 1 + 0.3 * s.skills.richVeins : 1;
  const reward = Math.ceil(
    s.rock.reward *
      ZONES[zi].rewardScale *
      (h ? h.rewardMult : 1) *
      st.coinMult *
      rich *
      (jackpot ? 5 : 1) *
      (doubleCoins ? 2 : 1),
  );

  let ns: State = { ...s, coins: s.coins + reward };
  const diamonds =
    r[5] < (h ? h.diamondChance : DIAMOND_DROP[s.rock.id] * st.diamondMult)
      ? h
        ? 1 + Math.floor(r[11] * 3)
        : 1
      : 0;
  if (diamonds) ns = addDiamonds(ns, diamonds);
  let chest: ChestId | null = null;
  if (r[6] < (h ? h.chestChance : CHEST_DROP[s.rock.id] * st.chestMult)) {
    const g = giveChest(ns, r[7], r[8]);
    ns = g.s;
    chest = g.chest;
  }

  const depth = s.depth + 1;
  const ms = milestones(ns, depth, [
    ...r.slice(0, 7),
    r[11],
    r[0],
    ...r.slice(9),
  ]);
  ns = ms.s;
  const nzi = zoneIndexFor(depth);
  const next = spawn(ns, depth, r);

  const p = updateDepthProgress(ns.progress, depth);
  p.destroyRocks += 1;
  p.earnCoins += reward;
  (
    [
      "mineGold",
      "mineDiamond",
      "mineEmerald",
      "mineRuby",
      "mineVibranium",
    ] as TaskId[]
  ).forEach((id) => {
    if (id.toLowerCase() === `mine${s.rock.id}`) p[id] += 1;
  });
  if (h) {
    p.hazard5 += 1;
    p.hazard25 += 1;
  }

  return {
    ...ns,
    depth,
    rock: next.rock,
    hazard: next.hazard,
    rockHp: next.hp,
    rockMax: next.hp,
    hazardCountdown: next.countdown,
    rockKey: s.rockKey + 1,
    progress: p,
    eventId,
    stats: {
      ...ns.stats,
      rocks: ns.stats.rocks + 1,
      totalCoins: ns.stats.totalCoins + reward,
      hazards: ns.stats.hazards + (h ? 1 : 0),
    },
    event: {
      ...event,
      destroyed: true,
      reward,
      jackpot,
      doubleCoins,
      diamonds,
      chest: chest ?? ms.chest,
      nextHazard: next.hazard,
      newZone: nzi !== zi ? ZONES[nzi].name : null,
      milestone: ms.text,
    },
  };
}

export type Action =
  | { type: "HIT"; r: number[]; now: number }
  | { type: "AUTO"; r: number[]; now: number }
  | { type: "COMBO_RESET" }
  | { type: "PLAY_TICK" }
  | { type: "BUY_TOOL"; id: ToolId }
  | { type: "SELECT_TOOL"; id: ToolId }
  | { type: "BUY_UPGRADE"; id: UpgradeId }
  | { type: "CLAIM"; id: TaskId }
  | { type: "BUY_ITEM"; id: string; r: number[]; now: number }
  | { type: "BUY_PACK"; id: string; txId?: string }
  | { type: "OPEN_CHEST"; id: ChestId; r: number[]; now: number }
  | { type: "REBIRTH" }
  | { type: "BUY_SKILL"; id: SkillId }
  | { type: "SET_SETTING"; key: keyof Settings }
  | { type: "SET_COSMETIC"; id: string | null }
  | { type: "RESET_ALL" }
  | { type: "LOAD"; state: State };

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "HIT": {
      const combo = s.combo + 1;
      const st = deriveStats(s, combo, a.now);
      const crit = a.r[0] < st.critChance;
      const double = a.r[1] < st.doubleChance;
      const one = Math.max(
        1,
        Math.floor(st.baseDamage * st.damageMult * (crit ? st.critMult : 1)),
      );
      const next = strike(
        { ...s, combo },
        one * (double ? 2 : 1),
        { crit, critMult: st.critMult, double, auto: false },
        a.r,
        a.now,
      );
      return {
        ...next,
        progress: {
          ...next.progress,
          critHits: next.progress.critHits + (crit ? 1 : 0),
          bestCombo: Math.max(next.progress.bestCombo, combo),
        },
        stats: {
          ...next.stats,
          crits: next.stats.crits + (crit ? 1 : 0),
          bestCombo: Math.max(next.stats.bestCombo, combo),
        },
      };
    }
    case "AUTO": {
      const st = deriveStats(s, 0, a.now);
      return st.autoDps > 0
        ? strike(
            s,
            st.autoDps,
            { crit: false, critMult: 1, double: false, auto: true },
            a.r,
            a.now,
          )
        : s;
    }
    case "COMBO_RESET":
      return { ...s, combo: 0 };
    case "PLAY_TICK":
      return {
        ...s,
        stats: { ...s.stats, playSeconds: s.stats.playSeconds + 1 },
      };

    case "BUY_TOOL": {
      const i = TOOLS.findIndex((t) => t.id === a.id);
      const tool = TOOLS[i];
      if (!tool || s.ownedToolIds.includes(tool.id) || s.coins < tool.price)
        return s;
      if (i > 0 && !s.ownedToolIds.includes(TOOLS[i - 1].id)) return s;
      return {
        ...s,
        coins: s.coins - tool.price,
        ownedToolIds: [...s.ownedToolIds, tool.id],
        activeToolId: tool.id,
        progress: { ...s.progress, buyTools: s.progress.buyTools + 1 },
      };
    }
    case "SELECT_TOOL":
      return s.ownedToolIds.includes(a.id) ? { ...s, activeToolId: a.id } : s;
    case "BUY_UPGRADE": {
      const u = UPGRADES.find((x) => x.id === a.id);
      if (!u) return s;
      const level = s.upgrades[a.id];
      const price = upgradePrice(u, level, s.skills.haggler);
      if (level >= u.maxLevel || s.coins < price) return s;
      return {
        ...s,
        coins: s.coins - price,
        upgrades: { ...s.upgrades, [a.id]: level + 1 },
        progress: { ...s.progress, buyUpgrades: s.progress.buyUpgrades + 1 },
      };
    }

    case "CLAIM": {
      const t = TASKS.find((x) => x.id === a.id);
      if (!t || s.claimed.includes(a.id) || s.progress[a.id] < t.target)
        return s;
      let ns: State = {
        ...s,
        coins: s.coins + t.reward,
        claimed: [...s.claimed, a.id],
        stats: { ...s.stats, totalCoins: s.stats.totalCoins + t.reward },
      };
      if (t.diamonds) ns = addDiamonds(ns, t.diamonds);
      if (t.chest)
        ns = {
          ...ns,
          chests: { ...ns.chests, [t.chest]: ns.chests[t.chest] + 1 },
        };
      return ns;
    }

    case "BUY_ITEM": {
      const item = DIAMOND_ITEMS.find((x) => x.id === a.id);
      if (!item) return s;
      const price = itemPrice(item, s.perm);
      if (s.diamonds < price) return s;
      if (item.perm && s.perm[item.perm] >= PERMS[item.perm].max) return s;
      if (item.adFree && s.adFree) return s;
      let ns: State = {
        ...s,
        diamonds: s.diamonds - price,
        stats: { ...s.stats, diamondsSpent: s.stats.diamondsSpent + price },
      };
      if (item.boost)
        ns = addBoost(ns, item.boost.id, item.boost.minutes, a.now);
      if (item.perm)
        ns = {
          ...ns,
          perm: { ...ns.perm, [item.perm]: ns.perm[item.perm] + 1 },
        };
      if (item.adFree) ns = { ...ns, adFree: true };
      if (item.skip) {
        const depth = ns.depth + item.skip;
        const oldZone = zoneIndexFor(ns.depth);
        const sp = spawn(
          { ...ns, hazardCountdown: Math.max(ns.hazardCountdown, 5) },
          depth,
          a.r,
        );
        const ms = milestones(ns, depth, a.r);
        const eventId = ns.eventId + 1;
        ns = {
          ...ms.s,
          depth,
          rock: sp.rock,
          hazard: sp.hazard,
          rockHp: sp.hp,
          rockMax: sp.hp,
          hazardCountdown: sp.countdown,
          rockKey: ns.rockKey + 1,
          progress: updateDepthProgress(ns.progress, depth),
          eventId,
          event: {
            ...emptyEvent(ns, eventId),
            auto: true,
            rockId: sp.rock.id,
            hazard: sp.hazard,
            milestone: ms.text,
            newZone:
              zoneIndexFor(depth) !== oldZone
                ? ZONES[zoneIndexFor(depth)].name
                : null,
          },
        };
      }
      return ns;
    }
    case "BUY_PACK": {
      const pack = PACKS.find((x) => x.id === a.id);
      if (!pack || (a.txId && s.grantedTx.includes(a.txId))) return s;
      return {
        ...addDiamonds(s, pack.diamonds),
        grantedTx: a.txId ? [...s.grantedTx.slice(-199), a.txId] : s.grantedTx,
      };
    }

    case "OPEN_CHEST": {
      if (s.chests[a.id] <= 0) return s;
      const res = resolveChest(s, a.id, a.r, a.now);
      return {
        ...res.s,
        lastChest: {
          id: (s.lastChest?.id ?? 0) + 1,
          chest: a.id,
          rewards: res.rewards,
        },
      };
    }

    case "REBIRTH": {
      if (s.depth < REBIRTH_DEPTH) return s;
      const rebirths = s.rebirths + 1;
      return {
        ...INITIAL,
        diamonds: s.diamonds,
        chests: s.chests,
        chestDrops: s.chestDrops,
        perm: s.perm,
        boosts: s.boosts,
        adFree: s.adFree,
        skills: s.skills,
        skillPoints: s.skillPoints + rebirthPoints(s.depth, s.rebirths),
        rebirths,
        cosmetics: s.cosmetics,
        activeCosmetic: s.activeCosmetic,
        claimed: s.claimed,
        progress: { ...s.progress, rebirthOnce: rebirths },
        stats: s.stats,
        settings: s.settings,
        eventId: s.eventId,
        lastChest: s.lastChest,
        grantedTx: s.grantedTx,
      };
    }
    case "BUY_SKILL": {
      const sk = SKILLS.find((x) => x.id === a.id);
      if (!sk || s.rebirths < 1) return s;
      const level = s.skills[a.id];
      if (level >= sk.maxLevel || s.skillPoints < sk.cost) return s;
      if (sk.requires && s.skills[sk.requires] < 1) return s;
      return {
        ...s,
        skillPoints: s.skillPoints - sk.cost,
        skills: { ...s.skills, [a.id]: level + 1 },
      };
    }

    case "SET_SETTING":
      return { ...s, settings: { ...s.settings, [a.key]: !s.settings[a.key] } };
    case "SET_COSMETIC":
      return { ...s, activeCosmetic: a.id };
    case "RESET_ALL":
      return { ...INITIAL, eventId: s.eventId, grantedTx: s.grantedTx };
    case "LOAD":
      return a.state;
  }
}
