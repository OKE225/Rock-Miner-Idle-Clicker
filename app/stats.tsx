import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { BackBar, Btn, Screen, Section, TopBar, Txt } from "@/components/ui";
import { formatNumber, useGame } from "@/context/GameContext";

const time = (s: number) =>
  `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min`;

const Line = ({ k, v }: { k: string; v: string }) => (
  <View className="flex-row justify-between rounded-xl bg-panel px-3.5 py-3">
    <Txt>{k}</Txt>
    <Txt d className="text-lg">
      {v}
    </Txt>
  </View>
);

export default function StatsScreen() {
  const { state, depth } = useGame();
  const s = state.stats;

  return (
    <Screen>
      <TopBar />
      <BackBar title="Stats" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-8 pt-2">
        <Section title="Stats" />
        <Line k="Play time" v={time(s.playSeconds)} />
        <Line k="Rocks destroyed" v={formatNumber(s.rocks)} />
        <Line k="Deepest point" v={`${s.deepest} m`} />
        <Line k="Current depth" v={`${depth} m`} />
        <Line k="Coins earned" v={formatNumber(s.totalCoins)} />
        <Line k="Critical hits" v={formatNumber(s.crits)} />
        <Line k="Best combo" v={String(s.bestCombo)} />
        <Line k="Hazards broken" v={String(s.hazards)} />
        <Line k="Chests opened" v={String(s.chestsOpened)} />
        <Line k="Diamonds earned" v={formatNumber(s.diamondsEarned)} />
        <Line k="Diamonds spent" v={formatNumber(s.diamondsSpent)} />
        <Line k="Rebirths" v={String(state.rebirths)} />

        <Btn
          tone="line"
          label="Open Settings"
          onPress={() => router.push("/settings")}
          className="mt-2"
        />
      </ScrollView>
    </Screen>
  );
}
