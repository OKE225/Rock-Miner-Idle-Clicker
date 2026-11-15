import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Backdrop } from "@/components/Backdrop";
import { Debris, Banner, Flash, FloatText } from "@/components/Effects";
import { RockGraphic, ToolGraphic } from "@/components/GameGraphics";
import { Bar, Btn, TopBar, Txt } from "@/components/ui";
import {
  ROCK_ORDER,
  TOOLS,
  formatNumber,
  useGame,
} from "@/context/GameContext";

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

/** New rock "pops" into the scene. A new key = a new rock. */
function SpawnIn({ children }: { children: ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(v, {
      toValue: 1,
      friction: 5,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [v]);
  return (
    <Animated.View
      style={{
        opacity: v.interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [0, 1, 1],
        }),
        transform: [
          {
            scale: v.interpolate({
              inputRange: [0, 1],
              outputRange: [0.45, 1],
            }),
          },
        ],
      }}>
      {children}
    </Animated.View>
  );
}

export default function MineScreen() {
  const {
    myCoins,
    depth,
    currentZone,
    nextZone,
    currentRock: rock,
    rockKey,
    rockHealth,
    rockMaxHealth,
    stats,
    combo,
    hitEvent,
    activeToolId,
    hitRock,
  } = useGame();
  const { top } = useSafeAreaInsets();

  // ---- animation values ----
  const shakeX = useRef(new Animated.Value(0)).current;
  const squash = useRef(new Animated.Value(1)).current;
  const tilt = useRef(new Animated.Value(0)).current;
  const comboPulse = useRef(new Animated.Value(1)).current;
  const comboBar = useRef(new Animated.Value(0)).current;

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

  // Everything that happens after a hit (the context gives us a "hitEvent")
  useEffect(() => {
    const e = hitEvent;
    if (!e) return;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const addFloat = (
      text: string,
      color: string,
      size: number,
      x: number,
      y: number,
    ) =>
      setFloats((l) => [
        ...l.slice(-8),
        { id: `${e.id}-${text}`, text, color, size, x, y },
      ]);

    addFloat(
      `−${formatNumber(e.damage)}`,
      e.crit ? "#E8A33D" : e.auto ? "#4FD1C5" : "#F3E9DC",
      e.crit ? 46 : e.auto ? 20 : 28,
      rnd(20, 190),
      rnd(10, 60),
    );
    setBursts((l) => [
      ...l.slice(-4),
      { id: String(e.id), color: rock.color, count: e.destroyed ? 18 : 5 },
    ]);

    if (!e.auto) {
      Animated.sequence([
        Animated.timing(squash, {
          toValue: 0.9,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(squash, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
      Animated.sequence([
        Animated.timing(tilt, {
          toValue: rnd(-8, 8),
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(tilt, {
          toValue: 0,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
      Animated.sequence([
        Animated.timing(comboPulse, {
          toValue: 1.25,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(comboPulse, { toValue: 1, useNativeDriver: true }),
      ]).start();
      comboBar.setValue(1);
      Animated.timing(comboBar, {
        toValue: 0,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }

    const amp = e.crit ? 16 : e.destroyed ? 10 : e.auto ? 0 : 5;
    if (amp)
      Animated.sequence(
        [-amp, amp, -amp / 2, amp / 3, 0].map((v) =>
          Animated.timing(shakeX, {
            toValue: v,
            duration: 40,
            useNativeDriver: true,
          }),
        ),
      ).start();

    if (e.double) addFloat("DOUBLE HIT!", "#4FD1C5", 20, rnd(40, 120), 90);
    if (e.destroyed)
      addFloat(`+${formatNumber(e.reward)}`, "#FFD84D", 42, 70, 70);

    if (e.newZone)
      setBanner({
        id: e.id,
        title: "New zone!",
        sub: e.newZone,
        bg: "#4FD1C5",
        fg: "#0F2A27",
      });
    else if (e.jackpot)
      setBanner({
        id: e.id,
        title: "JACKPOT ×5!",
        sub: `+${formatNumber(e.reward)} coins`,
        bg: "#F0ABFC",
        fg: "#2A0F2E",
      });
    else if (e.crit)
      setBanner({
        id: e.id,
        title: "Critical hit!",
        sub: `×${e.critMult.toFixed(2)} damage · −${formatNumber(e.damage)}`,
        bg: "#E8A33D",
        fg: "#1A1512",
      });

    if (e.crit) setFlash({ id: e.id, color: "#E8A33D" });
    if (!e.auto) {
      if (e.newZone || e.jackpot)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      else if (e.crit) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      else if (e.destroyed)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [comboBar, comboPulse, hitEvent, rock.color, shakeX, squash, tilt]);

  const rarity = RARITY[ROCK_ORDER.indexOf(rock.id)];
  const tool = TOOLS.find((t) => t.id === activeToolId)!;
  const zoneProgress = nextZone
    ? ((depth - currentZone.startDepth) /
        (nextZone.startDepth - currentZone.startDepth)) *
      100
    : 100;
  const damaged = 1 - rockHealth / rockMaxHealth;
  const comboBonus = Math.round((stats.comboMult - 1) * 100);

  return (
    <View className="flex-1 bg-bg">
      <Backdrop rock={rock} />
      <Animated.View
        style={{
          flex: 1,
          paddingTop: top,
          transform: [{ translateX: shakeX }],
        }}>
        <TopBar coins={myCoins} label="Depth" value={`${depth} m`} />

        {/* zone strip: 1..6, done = teal, current = amber */}
        <View className="flex-row items-center justify-between px-5 pt-2">
          <Txt tone="mute" className="text-[13px]">
            Zone {currentZone.id} · {currentZone.name}
          </Txt>
          <Txt tone="mute" className="text-[13px]">
            {nextZone
              ? `${nextZone.startDepth - depth} m to next`
              : "Final zone"}
          </Txt>
        </View>
        <View className="px-5 pt-1">
          <Bar percent={zoneProgress} color="#E8A33D" height={6} />
        </View>

        {/* combo */}
        <View className="flex-row items-center justify-between px-5 pt-2">
          <Animated.View
            style={{
              transform: [{ scale: comboPulse }],
              transformOrigin: "left center",
            }}>
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
                style={{
                  height: "100%",
                  backgroundColor: "#D9573B",
                  width: comboBar.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                }}
              />
            </View>
          </View>
        </View>

        {/* rock stage */}
        <View className="flex-1 items-center justify-center gap-3 px-5">
          <View
            className="items-center justify-center"
            style={{ width: 300, height: 270 }}>
            <SpawnIn key={rockKey}>
              <Pressable onPress={hitRock}>
                <Animated.View
                  style={{
                    transform: [
                      { scale: squash },
                      {
                        rotate: tilt.interpolate({
                          inputRange: [-10, 10],
                          outputRange: ["-10deg", "10deg"],
                        }),
                      },
                    ],
                  }}>
                  <RockGraphic
                    id={rock.id}
                    color={rock.color}
                    size={270}
                    damage={damaged}
                  />
                </Animated.View>
              </Pressable>
            </SpawnIn>
            {bursts.map((b) => (
              <Debris
                key={b.id}
                color={b.color}
                count={b.count}
                onDone={() => setBursts((l) => l.filter((x) => x.id !== b.id))}
              />
            ))}
            {floats.map((f) => (
              <FloatText
                key={f.id}
                text={f.text}
                color={f.color}
                size={f.size}
                x={f.x}
                y={f.y}
                onDone={() => setFloats((l) => l.filter((x) => x.id !== f.id))}
              />
            ))}
          </View>

          <View className="flex-row items-center gap-2">
            <Txt d className="text-xl">
              {rock.name}
            </Txt>
            <View className="rounded-md bg-deep px-2 py-0.5">
              <Txt d className="text-[12px]" style={{ color: rarity[1] }}>
                {rarity[0]}
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
              color="#D9573B"
              height={14}
            />
          </View>

          <Btn
            big
            className="w-full"
            label={`Hit! −${formatNumber(stats.damagePerClick)}`}
            onPress={hitRock}
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
        style={{ position: "absolute", left: 0, right: 0, top: top + 150 }}>
        <Banner {...banner} />
      </View>
      <Flash id={flash.id} color={flash.color} />
    </View>
  );
}
