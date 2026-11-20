import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Backdrop } from "@/components/Backdrop";
import { Banner, Debris, Flash, FloatText } from "@/components/Effects";
import {
  HazardGraphic,
  RockGraphic,
  ToolGraphic,
} from "@/components/GameGraphics";
import { Bar, Btn, Chip, TopBar, Txt } from "@/components/ui";
import {
  CHESTS,
  COSMETICS,
  HAZARDS,
  ROCK_ORDER,
  TOOLS,
  formatNumber,
  formatTime,
  useGame,
} from "@/context/GameContext";
import {
  requestNotificationPermissions,
  scheduleRandomGameNotification,
} from "@/lib/notifications";

const RARITY = [
  ["COMMON", "#B8A790"],
  ["COMMON", "#B8A790"],
  ["UNCOMMON", "#6FCF7A"],
  ["UNCOMMON", "#6FCF7A"],
  ["RARE", "#4FD1C5"],
  ["RARE", "#4FD1C5"],
  ["EPIC", "#F0ABFC"],
  ["EPIC", "#F0ABFC"],
  ["LEGENDARY", "#E8A33D"],
  ["LEGENDARY", "#E8A33D"],
] as const;

type Float = {
  id: string;
  text: string;
  color: string;
  size: number;
  x: number;
  y: number;
};
type Burst = { id: string; color: string; count: number };

function SpawnIn({ children }: { children: ReactNode }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withSpring(1, { damping: 8, stiffness: 120 });
  }, [v]);
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(v.value, [0, 0.4, 1], [0, 1, 1]),
    transform: [{ scale: interpolate(v.value, [0, 1], [0.45, 1]) }],
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function MineScreen() {
  const {
    state,
    depth,
    currentZone,
    nextZone,
    currentRock: rock,
    hazard,
    rockKey,
    rockHealth,
    rockMaxHealth,
    stats,
    combo,
    hitEvent,
    activeToolId,
    activeBoosts,
    hitRock,
  } = useGame();
  const { top } = useSafeAreaInsets();
  const { settings, activeCosmetic } = state;
  const cosmeticColor = COSMETICS.find((c) => c.id === activeCosmetic)?.color;

  const shakeX = useSharedValue(0);
  const squash = useSharedValue(1);
  const tilt = useSharedValue(0);
  const comboPulse = useSharedValue(1);
  const comboLeft = useSharedValue(0);
  const handledEvent = useRef(0);
  const handledRock = useRef<string | null>(null);
  const screenShake = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));
  const rockAnim = useAnimatedStyle(() => ({
    transform: [{ scale: squash.value }, { rotate: `${tilt.value}deg` }],
  }));
  const comboPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboPulse.value }],
  }));
  const comboBarStyle = useAnimatedStyle(() => ({
    width: `${comboLeft.value * 100}%`,
  }));

  const effectId = useRef(0);
  const [floats, setFloats] = useState<Float[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [banner, setBanner] = useState({
    id: 0,
    title: "",
    sub: "",
    bg: "#E8A33D",
    fg: "#1A1512",
  });
  const [flash, setFlash] = useState({ id: 0, color: "#E8A33D" });
  const bannerId = useRef(0);
  const showBanner = (title: string, sub: string, bg: string, fg: string) =>
    setBanner({ id: ++bannerId.current, title, sub, bg, fg });

  useEffect(() => {
    const setup = async () => {
      const granted = await requestNotificationPermissions();

      if (granted) {
        await scheduleRandomGameNotification(8);
      }
    };

    setup();
  }, []);

  useEffect(() => {
    if (!hazard) return;

    const key = `${rockKey}-${hazard}`;

    if (handledRock.current === key) return;

    handledRock.current = key;

    showBanner("Warning!", `${HAZARDS[hazard].name} ahead`, "#D9573B", "#fff");

    if (settings.haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [rockKey, hazard, settings.haptics]);

  useEffect(() => {
    const e = hitEvent;
    if (!e || handledEvent.current === e.id) return;
    handledEvent.current = e.id;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const addFloat = (
      text: string,
      color: string,
      size: number,
      x: number,
      y: number,
    ) => {
      const id = `${e.id}-${text}-${effectId.current++}`;

      setFloats((l) => [...l.slice(-9), { id, text, color, size, x, y }]);
    };

    if (settings.numbers || e.crit) {
      addFloat(
        `−${formatNumber(e.damage)}`,
        e.crit ? "#E8A33D" : e.auto ? "#4FD1C5" : (cosmeticColor ?? "#F3E9DC"),
        e.crit ? 46 : e.auto ? 20 : 28,
        rnd(20, 190),
        rnd(10, 60),
      );
    }

    const burstId = `${e.id}-burst-${effectId.current++}`;

    setBursts((l) => [
      ...l.slice(-4),
      {
        id: burstId,
        color: cosmeticColor ?? rock.color,
        count: e.destroyed ? 18 : 5,
      },
    ]);

    if (!e.auto) {
      squash.value = withSequence(
        withTiming(0.9, { duration: 50 }),
        withSpring(1, { damping: 6, stiffness: 220 }),
      );
      tilt.value = withSequence(
        withTiming(rnd(-8, 8), { duration: 50 }),
        withSpring(0, { damping: 8, stiffness: 160 }),
      );
      comboPulse.value = withSequence(
        withTiming(1.25, { duration: 70 }),
        withSpring(1),
      );
      comboLeft.value = 1;
      comboLeft.value = withTiming(0, {
        duration: 1500,
        easing: Easing.linear,
      });
    }

    const amp = settings.shake
      ? e.crit
        ? 16
        : e.destroyed
          ? 10
          : e.auto
            ? 0
            : 5
      : 0;
    if (amp)
      shakeX.value = withSequence(
        withTiming(-amp, { duration: 40 }),
        withTiming(amp, { duration: 40 }),
        withTiming(-amp / 2, { duration: 40 }),
        withTiming(amp / 3, { duration: 40 }),
        withTiming(0, { duration: 40 }),
      );

    if (e.double) addFloat("DOUBLE HIT!", "#4FD1C5", 20, rnd(40, 120), 90);
    if (e.destroyed)
      addFloat(`+${formatNumber(e.reward)}`, "#FFD84D", 42, 70, 70);
    if (e.doubleCoins) addFloat("DOUBLE COINS!", "#FFC93C", 22, 40, 120);
    if (e.diamonds) addFloat(`+${e.diamonds} ◆`, "#7FD8FF", 38, 150, 100);
    if (e.chest)
      addFloat(`${CHESTS[e.chest].name}!`, CHESTS[e.chest].color, 22, 30, 150);

    if (e.newZone) showBanner("New zone!", e.newZone, "#4FD1C5", "#0F2A27");
    else if (e.destroyed && e.hazard)
      showBanner(
        "Hazard cleared!",
        `${HAZARDS[e.hazard].name} · +${formatNumber(e.reward)} coins`,
        "#6FCF7A",
        "#0B2A12",
      );
    else if (e.jackpot)
      showBanner(
        "JACKPOT ×5!",
        `+${formatNumber(e.reward)} coins`,
        "#F0ABFC",
        "#2A0F2E",
      );
    else if (e.milestone)
      showBanner("Milestone!", e.milestone, "#4FD1C5", "#0F2A27");
    else if (e.crit)
      showBanner(
        "Critical hit!",
        `×${e.critMult.toFixed(2)} damage · −${formatNumber(e.damage)}`,
        "#E8A33D",
        "#1A1512",
      );

    if (e.crit) setFlash({ id: e.id, color: "#E8A33D" });
    if (!e.auto && settings.haptics) {
      if (e.newZone || e.jackpot || e.diamonds || e.chest)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      else if (e.crit) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      else if (e.destroyed)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [
    comboLeft,
    comboPulse,
    cosmeticColor,
    hitEvent,
    rock.color,
    settings.haptics,
    settings.numbers,
    settings.shake,
    shakeX,
    squash,
    tilt,
  ]);

  const rarity = RARITY[ROCK_ORDER.indexOf(rock.id)];
  const tool = TOOLS.find((t) => t.id === activeToolId)!;
  const zoneProgress = nextZone
    ? ((depth - currentZone.startDepth) /
        (nextZone.startDepth - currentZone.startDepth)) *
      100
    : 100;
  const damaged = 1 - rockHealth / rockMaxHealth;
  const comboBonus = Math.round((stats.comboMult - 1) * 100);
  const hz = hazard ? HAZARDS[hazard] : null;

  return (
    <View className="flex-1 bg-bg">
      <Backdrop rock={rock} />
      <Animated.View style={[{ flex: 1, paddingTop: top }, screenShake]}>
        <TopBar />

        <View className="flex-row items-center justify-between px-5 pt-1">
          <Txt tone="mute" className="text-[13px]">
            Zone {currentZone.id} · {currentZone.name}
          </Txt>
          <Txt d className="text-[15px]">
            {depth} m
            {nextZone ? (
              <Txt tone="mute" className="text-[13px]">
                {" "}
                · {nextZone.startDepth - depth} m to next
              </Txt>
            ) : null}
          </Txt>
        </View>
        <View className="px-5 pt-1">
          <Bar percent={zoneProgress} color="#E8A33D" height={6} />
        </View>

        {activeBoosts.length > 0 && (
          <View className="flex-row flex-wrap gap-1.5 px-5 pt-2">
            {activeBoosts.map((b) => (
              <Chip
                key={b.id}
                label={`${b.short} · ${formatTime(b.remaining)}`}
                color={b.color}
              />
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between px-5 pt-2">
          <Animated.View
            style={[{ transformOrigin: "left center" }, comboPulseStyle]}>
            <Txt
              d
              tone="amber"
              className="text-[26px]"
              style={{
                textShadowColor: "#120E0C",
                textShadowOffset: { width: 0, height: 3 },
                textShadowRadius: 0,
              }}>
              {combo > 1 ? `COMBO ×${combo}` : "TAP FAST!"}
            </Txt>
          </Animated.View>
          <View className="w-[150px] gap-1">
            <View className="flex-row justify-between">
              <Txt d className="text-[13px]">
                Damage
              </Txt>
              <Txt d tone="amber" className="text-[13px]">
                +{comboBonus}%
              </Txt>
            </View>
            <View className="h-2.5 overflow-hidden rounded-full bg-line">
              <Animated.View
                style={[
                  { height: "100%", backgroundColor: "#D9573B" },
                  comboBarStyle,
                ]}
              />
            </View>
          </View>
        </View>

        <View className="flex-1 items-center justify-center gap-3 px-5">
          <View
            className="items-center justify-center"
            style={{ width: 300, height: 270 }}>
            <SpawnIn key={rockKey}>
              <Pressable onPressIn={hitRock}>
                <Animated.View style={rockAnim}>
                  {hazard ? (
                    <HazardGraphic kind={hazard} size={270} damage={damaged} />
                  ) : (
                    <RockGraphic
                      id={rock.id}
                      color={rock.color}
                      size={270}
                      damage={damaged}
                    />
                  )}
                </Animated.View>
              </Pressable>
            </SpawnIn>
            {bursts.map((b) => (
              <Debris key={b.id} color={b.color} count={b.count} />
            ))}
            {floats.map((f) => (
              <FloatText
                key={f.id}
                text={f.text}
                color={f.color}
                size={f.size}
                x={f.x}
                y={f.y}
              />
            ))}
          </View>

          <View className="flex-row items-center gap-2">
            <Txt
              d
              className="text-xl"
              style={hz ? { color: hz.color } : undefined}>
              {hz ? hz.name : rock.name}
            </Txt>
            <View className="rounded-md bg-deep px-2 py-0.5">
              <Txt
                d
                className="text-[12px]"
                style={{ color: hz ? hz.color : rarity[1] }}>
                {hz ? "HAZARD" : rarity[0]}
              </Txt>
            </View>
          </View>

          <View className="w-full gap-1.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <ToolGraphic toolId={tool.id} size={22} />
                <Txt d className="text-[15px]">
                  {tool.name}
                </Txt>
              </View>
              <Txt d className="text-[15px]">
                {formatNumber(rockHealth)} / {formatNumber(rockMaxHealth)}
              </Txt>
            </View>
            <Bar
              percent={(rockHealth / rockMaxHealth) * 100}
              color={hz ? hz.color : "#D9573B"}
              height={14}
              animated={false}
            />
          </View>

          <Btn
            big
            className="w-full"
            label={`Hit! −${formatNumber(stats.damagePerClick)}`}
            onPressIn={hitRock}
          />

          <View className="flex-row gap-5 pb-3">
            <Txt tone="mute" className="text-sm">
              Hit:{" "}
              <Txt bold className="text-sm">
                {formatNumber(stats.damagePerClick)}
              </Txt>
            </Txt>
            <Txt tone="mute" className="text-sm">
              Auto:{" "}
              <Txt bold className="text-sm">
                {formatNumber(stats.autoDps)}/s
              </Txt>
            </Txt>
            <Txt tone="mute" className="text-sm">
              Crit:{" "}
              <Txt bold className="text-sm">
                {Math.round(stats.critChance * 100)}% ×
                {stats.critMult.toFixed(2)}
              </Txt>
            </Txt>
          </View>
        </View>
      </Animated.View>

      <View
        pointerEvents="none"
        style={{ position: "absolute", left: 0, right: 0, top: top + 160 }}>
        <Banner {...banner} />
      </View>
      <Flash id={flash.id} color={flash.color} />
    </View>
  );
}
