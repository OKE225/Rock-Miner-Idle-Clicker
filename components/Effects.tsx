import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

/** Number / text that pops, floats up and fades out. */
export function FloatText({
  text,
  color = "#F3E9DC",
  size = 26,
  x,
  y = 0,
  rise = 110,
  onDone,
}: {
  text: string;
  color?: string;
  size?: number;
  x: number;
  y?: number;
  rise?: number;
  onDone: () => void;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && onDone());
  }, []);
  return (
    <Animated.Text
      style={{
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
        opacity: v.interpolate({
          inputRange: [0, 0.12, 0.7, 1],
          outputRange: [0, 1, 1, 0],
        }),
        transform: [
          {
            translateY: v.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -rise],
            }),
          },
          {
            scale: v.interpolate({
              inputRange: [0, 0.15, 0.3, 1],
              outputRange: [0.4, 1.4, 1, 1],
            }),
          },
        ],
      }}>
      {text}
    </Animated.Text>
  );
}

/** Little chunks of rock flying out from the center. */
export function Debris({
  color,
  count,
  onDone,
}: {
  color: string;
  count: number;
  onDone: () => void;
}) {
  const parts = useRef(
    Array.from({ length: count }, () => ({
      v: new Animated.Value(0),
      a: Math.random() * Math.PI * 2,
      d: 50 + Math.random() * 90,
      s: 5 + Math.random() * 9,
      r: Math.random() * 540 - 270,
    })),
  ).current;
  useEffect(() => {
    Animated.parallel(
      parts.map((p) =>
        Animated.timing(p.v, {
          toValue: 1,
          duration: 500 + Math.random() * 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ),
    ).start(() => onDone());
  }, []);
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { alignItems: "center", justifyContent: "center" },
      ]}>
      {parts.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: p.s,
            height: p.s,
            borderRadius: 2,
            backgroundColor: i % 3 === 0 ? "#F3E9DC" : color,
            opacity: p.v.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [1, 1, 0],
            }),
            transform: [
              {
                translateX: p.v.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.cos(p.a) * p.d],
                }),
              },
              {
                translateY: p.v.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, Math.sin(p.a) * p.d + 60],
                }),
              },
              {
                rotate: p.v.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", `${p.r}deg`],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

/** Full-screen color flash (used for critical hits). `id` changes -> flash plays. */
export function Flash({ id, color }: { id: number; color: string }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!id) return;
    Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [id]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: color,
          opacity: v.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.28],
          }),
        },
      ]}
    />
  );
}

/** Big banner that drops in from the top: CRITICAL HIT, JACKPOT, NEW ZONE... */
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
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!id) return;
    v.setValue(0);
    Animated.sequence([
      Animated.spring(v, {
        toValue: 1,
        friction: 6,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.delay(700),
      Animated.timing(v, { toValue: 2, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [id]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        top: 0,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: bg,
        opacity: v.interpolate({
          inputRange: [0, 0.2, 1, 2],
          outputRange: [0, 1, 1, 0],
        }),
        transform: [
          {
            translateY: v.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [-30, 0, -10],
            }),
          },
          {
            scale: v.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [0.7, 1, 0.95],
            }),
          },
        ],
      }}>
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
