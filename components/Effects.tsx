import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

export function FloatText({
  text,
  color = "#F3E9DC",
  size = 26,
  x,
  y = 0,
  rise = 110,
}: {
  text: string;
  color?: string;
  size?: number;
  x: number;
  y?: number;
  rise?: number;
}) {
  const v = useSharedValue(0);

  useEffect(() => {
    v.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [v]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(v.value, [0, 0.12, 0.7, 1], [0, 1, 1, 0]),
    transform: [
      { translateY: interpolate(v.value, [0, 1], [0, -rise]) },
      {
        scale: interpolate(v.value, [0, 0.15, 0.3, 1], [0.4, 1.4, 1, 1]),
      },
    ],
  }));

  return (
    <Animated.Text
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          pointerEvents: "none",
          fontFamily: "Oswald_700Bold",
          fontSize: size,
          color,
          textShadowColor: "#120E0C",
          textShadowOffset: { width: 0, height: 3 },
          textShadowRadius: 0,
        },
        style,
      ]}>
      {text}
    </Animated.Text>
  );
}

function Chunk({
  progress,
  a,
  d,
  s,
  r,
  color,
}: {
  progress: SharedValue<number>;
  a: number;
  d: number;
  s: number;
  r: number;
  color: string;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.7, 1], [1, 1, 0]),
    transform: [
      { translateX: Math.cos(a) * d * progress.value },
      { translateY: (Math.sin(a) * d + 60) * progress.value },
      { rotate: `${r * progress.value}deg` },
    ],
  }));
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: s,
          height: s,
          borderRadius: 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export function Debris({ color, count }: { color: string; count: number }) {
  const progress = useSharedValue(0);
  const parts = useBurstParts(count);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { alignItems: "center", justifyContent: "center" },
      ]}>
      {parts.map((p, i) => (
        <Chunk
          key={i}
          progress={progress}
          {...p}
          color={i % 3 === 0 ? "#F3E9DC" : color}
        />
      ))}
    </View>
  );
}
function useBurstParts(count: number) {
  return useRef(
    Array.from({ length: count }, () => ({
      a: Math.random() * Math.PI * 2,
      d: 50 + Math.random() * 90,
      s: 5 + Math.random() * 9,
      r: Math.random() * 540 - 270,
    })),
  ).current;
}

export function Flash({ id, color }: { id: number; color: string }) {
  const v = useSharedValue(0);
  useEffect(() => {
    if (!id) return;
    v.value = withSequence(
      withTiming(1, { duration: 60 }),
      withTiming(0, { duration: 280 }),
    );
  }, [id, v]);
  const style = useAnimatedStyle(() => ({ opacity: v.value * 0.28 }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: color }, style]}
    />
  );
}

export function Banner({
  id,
  title,
  sub,
  bg,
  fg,
}: {
  id: number;
  title: string;
  sub?: string;
  bg: string;
  fg: string;
}) {
  const v = useSharedValue(0);
  useEffect(() => {
    if (!id) return;
    v.value = 0;
    v.value = withSequence(
      withSpring(1, { damping: 9, stiffness: 180 }),
      withDelay(700, withTiming(2, { duration: 250 })),
    );
  }, [id, v]);
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(v.value, [0, 0.2, 1, 2], [0, 1, 1, 0]),
    transform: [
      { translateY: interpolate(v.value, [0, 1, 2], [-30, 0, -10]) },
      { scale: interpolate(v.value, [0, 1, 2], [0.7, 1, 0.95]) },
    ],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: 20,
          right: 20,
          top: 0,
          alignItems: "center",
          paddingVertical: 8,
          borderRadius: 12,
          backgroundColor: bg,
        },
        style,
      ]}>
      <Animated.Text
        style={{
          fontFamily: "Oswald_700Bold",
          fontSize: 24,
          letterSpacing: 1.2,
          color: fg,
          textTransform: "uppercase",
        }}>
        {title}
      </Animated.Text>
      {sub ? (
        <Animated.Text
          style={{
            fontFamily: "SourceSans3_600SemiBold",
            fontSize: 14,
            color: fg,
          }}>
          {sub}
        </Animated.Text>
      ) : null}
    </Animated.View>
  );
}
