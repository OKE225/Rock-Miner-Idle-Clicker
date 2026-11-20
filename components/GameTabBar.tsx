import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = ["index", "shop", "chests", "map", "quests", "more"];
const PARENT: Record<string, string> = {
  store: "more",
  skills: "more",
  stats: "more",
  settings: "more",
};

function TabItem({
  label,
  focused,
  onPress,
}: {
  label: string;
  focused: boolean;
  onPress: () => void;
}) {
  const bar = useSharedValue(focused ? 1 : 0);
  const lift = useSharedValue(1);
  useEffect(() => {
    bar.value = withTiming(focused ? 1 : 0, { duration: 150 });

    if (focused) {
      lift.value = withTiming(1, { duration: 150 });
    }
  }, [focused, bar, lift]);
  const barStyle = useAnimatedStyle(() => ({
    opacity: bar.value,
    transform: [{ scaleX: bar.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lift.value }],
  }));
  return (
    <Pressable
      onPress={onPress}
      className="min-h-[56px] flex-1 items-center justify-center">
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: "#E8A33D",
          },
          barStyle,
        ]}
      />
      <Animated.Text
        style={[
          {
            fontFamily: "Oswald_500Medium",
            fontSize: 12,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: focused ? "#E8A33D" : "#B8A790",
          },
          textStyle,
        ]}>
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
      {state.routes.map((route) => {
        if (!TABS.includes(route.name)) return null;
        const current = state.routes[state.index].name;
        const focused = (PARENT[current] ?? current) === route.name;
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
