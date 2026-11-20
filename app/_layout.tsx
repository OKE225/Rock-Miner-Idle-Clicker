import "./global.css";
import { useEffect } from "react";
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
import { initPurchases } from "@/services/purchases";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Oswald_500Medium,
    Oswald_700Bold,
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
  });
  useEffect(() => {
    initPurchases();
  }, []);
  if (!fontsLoaded) return null;

  return (
    <GameProvider>
      <StatusBar style="light" />
      <Tabs
        tabBar={(props) => <GameTabBar {...props} />}
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          animation: "fade",
          sceneStyle: { backgroundColor: "#1A1512" },
        }}>
        <Tabs.Screen name="index" options={{ title: "Mine" }} />
        <Tabs.Screen name="shop" options={{ title: "Shop" }} />
        <Tabs.Screen name="chests" options={{ title: "Chests" }} />
        <Tabs.Screen name="map" options={{ title: "Map" }} />
        <Tabs.Screen name="quests" options={{ title: "Quests" }} />
        <Tabs.Screen name="more" options={{ title: "More" }} />
        <Tabs.Screen name="store" options={{ href: null, title: "Store" }} />
        <Tabs.Screen name="skills" options={{ href: null, title: "Skills" }} />
        <Tabs.Screen name="stats" options={{ href: null, title: "Stats" }} />
        <Tabs.Screen
          name="settings"
          options={{ href: null, title: "Settings" }}
        />
      </Tabs>
    </GameProvider>
  );
}
