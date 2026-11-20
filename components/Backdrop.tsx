import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { Rock } from "@/context/GameContext";
import { ZoneDecor, mix } from "./GameGraphics";

function Layer({ rock }: { rock: Rock }) {
  const { width, height } = useWindowDimensions();
  const cy = height * 0.4;
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[
          mix(rock.background, "#ffffff", 0.08),
          rock.background,
          "#1A1512",
        ]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      {[460, 340, 230].map((d, i) => (
        <View
          key={d}
          style={{
            position: "absolute",
            left: width / 2 - d / 2,
            top: cy - d / 2,
            width: d,
            height: d,
            borderRadius: d / 2,
            backgroundColor: mix(rock.color, "#ffffff", 0.2),
            opacity: 0.06 + i * 0.03,
          }}
        />
      ))}
      <ZoneDecor rockId={rock.id} />
    </View>
  );
}

export function Backdrop({ rock }: { rock: Rock }) {
  const [prev, setPrev] = useState(rock);
  const [cur, setCur] = useState(rock);
  const fade = useSharedValue(1);

  useEffect(() => {
    if (rock.id === cur.id) return;
    setPrev(cur);
    setCur(rock);
    fade.value = 0;
    fade.value = withTiming(1, { duration: 450 });
  }, [rock.id, cur, fade, rock]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Layer rock={prev} />
      <Animated.View style={[StyleSheet.absoluteFill, fadeStyle]}>
        <Layer rock={cur} />
      </Animated.View>
    </View>
  );
}

export function CalmBackdrop() {
  return (
    <LinearGradient
      colors={["#2A211B", "#1A1512", "#120E0C"]}
      locations={[0, 0.5, 1]}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}
