import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Pressable, Text, View, type TextProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatNumber } from "@/context/GameContext";
import { CalmBackdrop } from "./Backdrop";

const TONES = {
  ink: "text-ink",
  mute: "text-mute",
  amber: "text-amber",
  teal: "text-teal",
  danger: "text-danger",
  ok: "text-ok",
  dark: "text-bg",
};

/** Text with the project fonts. d = Oswald heading (uppercase), bold = Source Sans semi-bold. */
export function Txt({
  tone = "ink",
  d = false,
  bold = false,
  className = "",
  ...rest
}: TextProps & {
  tone?: keyof typeof TONES;
  d?: boolean;
  bold?: boolean;
  className?: string;
}) {
  return (
    <Text
      className={`${d ? "font-display uppercase tracking-wide" : bold ? "font-bodyb" : "font-body"} ${TONES[tone]} ${className}`}
      {...rest}
    />
  );
}

/** Screen with a gradient background (used by Shop, Map, Quests). */
export function Screen({ children }: { children: ReactNode }) {
  const { top } = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-bg">
      <CalmBackdrop />
      <View className="flex-1" style={{ paddingTop: top }}>
        {children}
      </View>
    </View>
  );
}

/** Coins on the left, any second value on the right. The coin number "pops" when it grows. */
export function TopBar({
  coins,
  label,
  value,
}: {
  coins: number;
  label: string;
  value: string;
}) {
  const pop = useRef(new Animated.Value(1)).current;
  const prev = useRef(coins);
  useEffect(() => {
    if (coins > prev.current) {
      Animated.sequence([
        Animated.timing(pop, {
          toValue: 1.2,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(pop, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prev.current = coins;
  }, [coins]);
  return (
    <View className="flex-row justify-between px-5 pb-2 pt-4">
      <View>
        <Txt tone="mute" className="text-[13px]">
          Coins
        </Txt>
        <Animated.View
          style={{
            transform: [{ scale: pop }],
            transformOrigin: "left center",
          }}
          className="flex-row items-center gap-2">
          <View className="h-5 w-5 rounded-full border-2 border-[#B26A00] bg-[#FFC93C]" />
          <Txt d tone="amber" className="text-[30px]">
            {formatNumber(coins)}
          </Txt>
        </Animated.View>
      </View>
      <View className="items-end">
        <Txt tone="mute" className="text-[13px]">
          {label}
        </Txt>
        <Txt d className="text-[30px]">
          {value}
        </Txt>
      </View>
    </View>
  );
}

/** Smoothly animated progress bar (percent 0-100). */
export function Bar({
  percent,
  color = "#4FD1C5",
  height = 10,
}: {
  percent: number;
  color?: string;
  height?: number;
}) {
  const w = useRef(new Animated.Value(percent)).current;
  useEffect(() => {
    Animated.timing(w, {
      toValue: percent,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [percent]);
  return (
    <View
      className="overflow-hidden bg-line"
      style={{ height, borderRadius: height / 2 }}>
      <Animated.View
        style={{
          height: "100%",
          backgroundColor: color,
          width: w.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
            extrapolate: "clamp",
          }),
        }}
      />
    </View>
  );
}

/** Chunky button that squeezes when pressed. */
export function Btn({
  label,
  onPress,
  tone = "amber",
  disabled = false,
  big = false,
  className = "",
}: {
  label: string;
  onPress: () => void;
  tone?: "amber" | "teal" | "line";
  disabled?: boolean;
  big?: boolean;
  className?: string;
}) {
  const s = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(s, {
      toValue: v,
      speed: 40,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  const bg =
    tone === "amber" ? "bg-amber" : tone === "teal" ? "bg-teal" : "bg-line";
  return (
    <View className={className}>
      <Animated.View style={{ transform: [{ scale: s }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={() => to(big ? 0.95 : 0.92)}
          onPressOut={() => to(1)}
          disabled={disabled}
          className={`items-center justify-center rounded-[10px] px-4 ${big ? "min-h-[64px]" : "min-h-[44px]"} ${bg} ${disabled ? "opacity-40" : ""}`}>
          <Text
            className={`font-display uppercase tracking-wide ${big ? "text-2xl" : "text-base"} ${tone === "line" ? "text-ink" : "text-bg"}`}>
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

/** Card with a colored stripe or an icon on the left, title + subtitle, and something on the right. */
export function Row({
  stripe,
  icon,
  title,
  sub,
  right,
  dim = false,
  outline = false,
  children,
}: {
  stripe?: string;
  icon?: ReactNode;
  title: string;
  sub?: string;
  right?: ReactNode;
  dim?: boolean;
  outline?: boolean;
  children?: ReactNode;
}) {
  return (
    <View
      className={`rounded-xl bg-panel px-3.5 py-3 ${dim ? "opacity-50" : ""} ${outline ? "border-2 border-amber" : ""}`}>
      <View className="flex-row items-center gap-3">
        {stripe ? (
          <View
            className="w-2 self-stretch rounded"
            style={{ backgroundColor: stripe }}
          />
        ) : null}
        {icon}
        <View className="flex-1">
          <Txt d className="text-lg">
            {title}
          </Txt>
          {sub ? (
            <Txt tone="mute" className="text-sm">
              {sub}
            </Txt>
          ) : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

export const Tag = ({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof TONES;
}) => (
  <Txt d tone={tone} className="text-sm">
    {label}
  </Txt>
);

/** Pill tabs (Tools / Upgrades). */
export function PillTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <View className="flex-row gap-2.5 px-5 pb-2">
      {tabs.map((t) => (
        <Pressable
          key={t.id}
          onPress={() => onChange(t.id)}
          className={`min-h-[44px] flex-1 items-center justify-center rounded-xl ${active === t.id ? "bg-amber" : "bg-panel"}`}>
          <Txt d tone={active === t.id ? "dark" : "mute"} className="text-base">
            {t.label}
          </Txt>
        </Pressable>
      ))}
    </View>
  );
}
