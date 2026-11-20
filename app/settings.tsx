import { Alert, ScrollView, Switch, View } from "react-native";
import { BackBar, Btn, Screen, Section, TopBar, Txt } from "@/components/ui";
import { COSMETICS, useGame } from "@/context/GameContext";
import type { Settings } from "@/context/GameContext";
import { purchasesMode } from "@/services/purchases";

const SETTINGS: { key: keyof Settings; label: string }[] = [
  { key: "haptics", label: "Vibration on hit" },
  { key: "numbers", label: "Floating damage numbers" },
  { key: "shake", label: "Screen shake" },
];

export default function SettingsScreen() {
  const { state, toggleSetting, setCosmetic, resetAll } = useGame();
  const owned = COSMETICS.filter((c) => state.cosmetics.includes(c.id));

  const reset = () =>
    Alert.alert(
      "Reset everything?",
      "This deletes ALL progress, including diamonds, chests and skills.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: resetAll },
      ],
    );

  return (
    <Screen>
      <TopBar />
      <BackBar title="Settings" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-8 pt-2">
        <Section title="Game" />
        {SETTINGS.map((x) => (
          <View
            key={x.key}
            className="flex-row items-center justify-between rounded-xl bg-panel px-3.5 py-2.5">
            <Txt>{x.label}</Txt>
            <Switch
              value={state.settings[x.key]}
              onValueChange={() => toggleSetting(x.key)}
              trackColor={{ false: "#3A2F27", true: "#E8A33D" }}
              thumbColor="#F3E9DC"
            />
          </View>
        ))}

        <Section title="Hit effect (found in Crystal and Vibranium chests)" />
        {owned.length === 0 ? (
          <Txt tone="mute" className="text-sm">
            No hit effects yet.
          </Txt>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            <Btn
              tone={state.activeCosmetic === null ? "amber" : "line"}
              label="None"
              onPress={() => setCosmetic(null)}
            />
            {owned.map((c) => (
              <Btn
                key={c.id}
                tone={state.activeCosmetic === c.id ? "amber" : "line"}
                label={c.name}
                onPress={() => setCosmetic(c.id)}
              />
            ))}
          </View>
        )}

        <Section title="Store" />
        <View className="rounded-xl bg-panel px-3.5 py-3">
          <Txt d className="text-base">
            {purchasesMode() === "revenuecat"
              ? "Connected to the store"
              : "Demo mode"}
          </Txt>
          <Txt tone="mute" className="text-sm">
            {purchasesMode() === "revenuecat"
              ? "Diamond packs are real purchases."
              : "Diamond purchases are simulated until RevenueCat is connected."}
          </Txt>
        </View>

        <Section title="Progress" />
        <Txt tone="mute" className="text-sm">
          The game saves itself automatically, also when you close the app.
        </Txt>
        <Btn
          tone="danger"
          label="Reset all progress"
          onPress={reset}
          className="mt-1"
        />
      </ScrollView>
    </Screen>
  );
}
