import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
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
import {
  BOOSTS,
  ZONES,
  type BoostId,
  type ChestId,
  type SkillId,
  type TaskId,
  type ToolId,
  type UpgradeId,
  type Zone,
  type Rock,
  type HazardId,
} from "./gameData";
import {
  INITIAL,
  deriveStats,
  itemPrice,
  reducer,
  upgradePrice,
  zoneIndexFor,
  type HitEvent,
  type Settings,
  type State,
  type Stats,
} from "./gameEngine";
import { DIAMOND_ITEMS, UPGRADES } from "./gameData";
import { startMapper } from "react-native-reanimated";

export * from "./gameData";
export { deriveStats, itemPrice, upgradePrice, rollChest } from "./gameEngine";
export type { HitEvent, Reward, Settings, Stats } from "./gameEngine";

const SAVE_KEY = "glebia.save.v3";
const rolls = () => Array.from({ length: 12 }, () => Math.random());

type ActiveBoost = {
  id: BoostId;
  name: string;
  short: string;
  color: string;
  remaining: number;
};

type GameContextType = {
  state: State;
  stats: Stats;
  now: number;
  myCoins: number;
  diamonds: number;
  depth: number;
  currentZone: Zone;
  zoneIndex: number;
  nextZone: Zone | null;
  currentRock: Rock;
  hazard: HazardId | null;
  rockKey: number;
  rockHealth: number;
  rockMaxHealth: number;
  combo: number;
  hitEvent: HitEvent | null;
  activeBoosts: ActiveBoost[];
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
  buyItem: (id: string) => void;
  buyPack: (id: string, txId?: string) => void;
  openChest: (id: ChestId) => void;
  rebirth: () => void;
  buySkill: (id: SkillId) => void;
  toggleSetting: (key: keyof Settings) => void;
  setCosmetic: (id: string | null) => void;
  resetAll: () => void;
  getItemPrice: (id: string) => number;
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(Date.now());
  const stateRef = useRef(state);
  stateRef.current = state;
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveLatest = useCallback(() => {
    const { event, lastChest, ...rest } = stateRef.current;
    void event;
    void lastChest;
    AsyncStorage.setItem(SAVE_KEY, JSON.stringify(rest));
  }, []);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (st) => {
      if (st !== "active") saveLatest();
    });
    return () => sub.remove();
  }, [saveLatest]);

  useEffect(() => {
    AsyncStorage.getItem(SAVE_KEY)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw);
          dispatch({
            type: "LOAD",
            state: {
              ...INITIAL,
              ...saved,
              event: null,
              lastChest: null,
              combo: 0,
              upgrades: { ...INITIAL.upgrades, ...saved.upgrades },
              progress: { ...INITIAL.progress, ...saved.progress },
              perm: { ...INITIAL.perm, ...saved.perm },
              skills: { ...INITIAL.skills, ...saved.skills },
              chests: { ...INITIAL.chests, ...saved.chests },
              stats: { ...INITIAL.stats, ...saved.stats },
              settings: { ...INITIAL.settings, ...saved.settings },
            },
          });
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const save = setInterval(() => {
      const { event, lastChest, ...rest } = stateRef.current;
      void event;
      void lastChest;
      AsyncStorage.setItem(SAVE_KEY, JSON.stringify(rest));
    }, 3000);
    const clock = setInterval(() => {
      setNow(Date.now());
      dispatch({ type: "PLAY_TICK" });
    }, 1000);
    return () => {
      clearInterval(save);
      clearInterval(clock);
    };
  }, [ready]);

  const stats = useMemo(
    () => deriveStats(state, state.combo, now),
    [state, now],
  );

  const autoOn = stats.autoDps > 0;
  useEffect(() => {
    if (!ready || !autoOn) return;
    const id = setInterval(
      () => dispatch({ type: "AUTO", r: rolls(), now: Date.now() }),
      1000,
    );
    return () => clearInterval(id);
  }, [ready, autoOn]);

  useEffect(
    () => () => {
      if (comboTimer.current) clearTimeout(comboTimer.current);
    },
    [],
  );

  const hitRock = useCallback(() => {
    dispatch({ type: "HIT", r: rolls(), now: Date.now() });
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(
      () => dispatch({ type: "COMBO_RESET" }),
      1500,
    );
  }, []);

  const zoneIndex = zoneIndexFor(state.depth);
  const activeBoosts: ActiveBoost[] = (Object.keys(BOOSTS) as BoostId[])
    .filter((id) => (state.boosts[id] ?? 0) > now)
    .map((id) => ({
      id,
      ...BOOSTS[id],
      remaining: (state.boosts[id] ?? 0) - now,
    }));

  const value: GameContextType = {
    state,
    stats,
    now,
    myCoins: state.coins,
    diamonds: state.diamonds,
    depth: state.depth,
    currentZone: ZONES[zoneIndex],
    zoneIndex,
    nextZone: ZONES[zoneIndex + 1] ?? null,
    currentRock: state.rock,
    hazard: state.hazard,
    rockKey: state.rockKey,
    rockHealth: state.rockHp,
    rockMaxHealth: state.rockMax,
    combo: state.combo,
    hitEvent: state.event,
    activeBoosts,
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
      upgradePrice(UPGRADE_BY_ID[id], state.upgrades[id], state.skills.haggler),
    claimTaskReward: (id) => dispatch({ type: "CLAIM", id }),
    buyItem: (id) =>
      dispatch({ type: "BUY_ITEM", id, r: rolls(), now: Date.now() }),
    buyPack: (id, txId) => {
      dispatch({ type: "BUY_PACK", id, txId });
      setTimeout(saveLatest, 150);
    },
    openChest: (id) =>
      dispatch({ type: "OPEN_CHEST", id, r: rolls(), now: Date.now() }),
    rebirth: () => dispatch({ type: "REBIRTH" }),
    buySkill: (id) => dispatch({ type: "BUY_SKILL", id }),
    toggleSetting: (key) => dispatch({ type: "SET_SETTING", key }),
    setCosmetic: (id) => dispatch({ type: "SET_COSMETIC", id }),
    resetAll: () => dispatch({ type: "RESET_ALL" }),
    getItemPrice: (id) => itemPrice(ITEM_BY_ID[id], state.perm),
  };

  return ready ? (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  ) : null;
}

const UPGRADE_BY_ID = Object.fromEntries(
  UPGRADES.map((u) => [u.id, u]),
) as Record<UpgradeId, (typeof UPGRADES)[number]>;
const ITEM_BY_ID = Object.fromEntries(DIAMOND_ITEMS.map((i) => [i.id, i]));

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
