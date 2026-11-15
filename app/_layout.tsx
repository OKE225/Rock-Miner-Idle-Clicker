import "./global.css";
import {
  Oswald_500Medium,
  Oswald_700Bold,
  useFonts,
} from "@expo-google-fonts/oswald";
import {
  SourceSans3_400Regular,
  SourceSans3_600SemiBold,
} from "@expo-google-fonts/source-sans-3";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GameTabBar from "@/components/GameTabBar";
import { GameProvider } from "@/context/GameContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Oswald_500Medium,
    Oswald_700Bold,
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
  });
  if (!fontsLoaded) return null;

  return (
    <GameProvider>
      <StatusBar style="light" />
      <Tabs
        tabBar={(props) => <GameTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: "fade",
          sceneStyle: { backgroundColor: "#1A1512" },
        }}>
        <Tabs.Screen name="index" options={{ title: "Mine" }} />
        <Tabs.Screen name="shop" options={{ title: "Shop" }} />
        <Tabs.Screen name="map" options={{ title: "Map" }} />
        <Tabs.Screen name="quests" options={{ title: "Quests" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>
    </GameProvider>
  );
}
