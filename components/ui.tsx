import { router } from "expo-router";
import { useEffect, useRef, type ReactNode } from "react";
import { Pressable, Text, View, type TextProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatNumber, useGame } from "@/context/GameContext";
import { CalmBackdrop } from "./Backdrop";
import { DiamondIcon } from "./GameGraphics";

export const TONES = {
  ink: "text-ink",
  mute: "text-mute",
  amber: "text-amber",
  teal: "text-teal",
  danger: "text-danger",
  ok: "text-ok",
  dark: "text-bg",
};

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

function usePop(value: number) {
  const pop = useSharedValue(1);
  const prev = useRef(value);

  useEffect(() => {
    if (value > prev.current)
      pop.value = withSequence(
        withTiming(1.2, { duration: 80 }),
        withTiming(1, { duration: 120 }),
      );

    prev.current = value;
  }, [value, pop]);

  return useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));
}

export function TopBar() {
  const { myCoins, diamonds } = useGame();
  const coinPop = usePop(myCoins);
  const diaPop = usePop(diamonds);
  return (
    <View className="flex-row items-end justify-between px-5 pb-2 pt-4">
      <View>
        <Txt tone="mute" className="text-[13px]">
          Coins
        </Txt>
        <Animated.View style={[{ transformOrigin: "left center" }, coinPop]}>
          <View className="flex-row items-center gap-2">
            <View className="h-5 w-5 rounded-full border-2 border-[#B26A00] bg-[#FFC93C]" />
            <Txt d tone="amber" className="text-[30px]">
              {formatNumber(myCoins)}
            </Txt>
          </View>
        </Animated.View>
      </View>
      <Pressable onPress={() => router.push("/store")} className="items-end">
        <Txt tone="mute" className="text-[13px]">
          Diamonds
        </Txt>
        <Animated.View style={[{ transformOrigin: "right center" }, diaPop]}>
          <View className="flex-row items-center gap-1.5 rounded-full border-2 border-line bg-deep py-0.5 pl-2 pr-1.5">
            <DiamondIcon size={24} />
            <Txt d className="text-[22px]" style={{ color: "#7FD8FF" }}>
              {formatNumber(diamonds)}
            </Txt>
            <View className="h-5 w-5 items-center justify-center rounded-full bg-teal">
              <Txt d tone="dark" className="text-[14px] leading-[16px]">
                +
              </Txt>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

export function BackBar({ title }: { title: string }) {
  return (
    <View className="flex-row items-center gap-3 px-5 pb-1 pt-3">
      <Pressable
        onPress={() => router.back()}
        className="h-10 w-10 items-center justify-center rounded-xl bg-panel">
        <Txt d className="text-xl">
          ‹
        </Txt>
      </Pressable>
      <Txt d className="text-2xl">
        {title}
      </Txt>
    </View>
  );
}

export function Bar({
  percent,
  color = "#4FD1C5",
  height = 10,
  animated = true,
}: {
  percent: number;
  color?: string;
  height?: number;
  animated?: boolean;
}) {
  const clamped = Math.min(
    100,
    Math.max(0, Number.isFinite(percent) ? percent : 0),
  );
  const w = useSharedValue(clamped);
  useEffect(() => {
    w.value = animated ? withTiming(clamped, { duration: 160 }) : clamped;
  }, [clamped, animated, w]);
  const fill = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View
      className="overflow-hidden bg-line"
      style={{ height, borderRadius: height / 2 }}>
      {animated ? (
        <Animated.View
          style={[{ height: "100%", backgroundColor: color }, fill]}
        />
      ) : (
        <View
          style={{
            height: "100%",
            backgroundColor: color,
            width: `${clamped}%`,
          }}
        />
      )}
    </View>
  );
}

export function Btn({
  label,
  onPress,
  onPressIn,
  tone = "amber",
  disabled = false,
  big = false,
  icon,
  className = "",
}: {
  label: string;
  onPress?: () => void;
  onPressIn?: () => void;
  tone?: "amber" | "teal" | "line" | "danger";
  disabled?: boolean;
  big?: boolean;
  icon?: ReactNode;
  className?: string;
}) {
  const s = useSharedValue(1);
  const to = (v: number) => {
    s.value = withSpring(v, { damping: 12, stiffness: 400 });
  };
  const press = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  const bg =
    tone === "amber"
      ? "bg-amber"
      : tone === "teal"
        ? "bg-teal"
        : tone === "danger"
          ? "bg-danger"
          : "bg-line";
  return (
    <View className={className}>
      <Animated.View style={press}>
        <Pressable
          onPress={onPress}
          onPressIn={() => {
            to(big ? 0.95 : 0.92);
            onPressIn?.();
          }}
          onPressOut={() => to(1)}
          disabled={disabled}
          className={`flex-row items-center justify-center gap-1.5 rounded-[10px] px-4 ${big ? "min-h-[64px]" : "min-h-[44px]"} ${bg} ${disabled ? "opacity-40" : ""}`}>
          {icon}
          <Text
            className={`font-display uppercase tracking-wide ${big ? "text-2xl" : "text-base"} ${tone === "line" || tone === "danger" ? "text-ink" : "text-bg"}`}>
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export function Row({
  stripe,
  icon,
  title,
  sub,
  right,
  dim = false,
  outline = false,
  onPress,
  children,
}: {
  stripe?: string;
  icon?: ReactNode;
  title: string;
  sub?: string;
  right?: ReactNode;
  dim?: boolean;
  outline?: boolean;
  onPress?: () => void;
  children?: ReactNode;
}) {
  const body = (
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
  return onPress ? <Pressable onPress={onPress}>{body}</Pressable> : body;
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

export const Chip = ({ label, color }: { label: string; color: string }) => (
  <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: color }}>
    <Txt d tone="dark" className="text-[12px]">
      {label}
    </Txt>
  </View>
);

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
    <View className="flex-row gap-2 px-5 pb-2">
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

export const Section = ({ title }: { title: string }) => (
  <Txt d tone="mute" className="px-1 pt-2 text-sm">
    {title}
  </Txt>
);
