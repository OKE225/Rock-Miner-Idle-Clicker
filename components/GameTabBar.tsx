import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabItem({
  label,
  focused,
  onPress,
}: {
  label: string;
  focused: boolean;
  onPress: () => void;
}) {
  const bar = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const lift = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.spring(bar, {
      toValue: focused ? 1 : 0,
      friction: 6,
      useNativeDriver: true,
    }).start();
    if (focused)
      Animated.sequence([
        Animated.timing(lift, {
          toValue: 1.18,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.spring(lift, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
  }, [focused]);
  return (
    <Pressable
      onPress={onPress}
      className="min-h-[56px] flex-1 items-center justify-center">
      {/* amber line on top of the active tab (same as the design) */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: "#E8A33D",
          opacity: bar,
          transform: [{ scaleX: bar }],
        }}
      />
      <Animated.Text
        style={{
          fontFamily: "Oswald_500Medium",
          fontSize: 12,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          color: focused ? "#E8A33D" : "#B8A790",
          transform: [{ scale: lift }],
        }}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

export default function GameTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      className="flex-row border-t border-line bg-deep"
      style={{ paddingBottom: bottom }}>
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const label = descriptors[route.key].options.title ?? route.name;
        const press = () => {
          const e = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
        };
        return (
          <TabItem
            key={route.key}
            label={label}
            focused={focused}
            onPress={press}
          />
        );
      })}
    </View>
  );
}
