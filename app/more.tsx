import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { DiamondIcon } from "@/components/GameGraphics";
import { Row, Screen, Tag, TopBar, Txt } from "@/components/ui";
import { useGame } from "@/context/GameContext";
import { FeedbackForm } from "@/components/FeedbackForm";

export default function MoreScreen() {
  const { state, diamonds } = useGame();
  return (
    <Screen>
      <TopBar />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-6">
        <FeedbackForm />

        <Row
          stripe="#9B7CFF"
          title="Rebirth & Skill Tree"
          sub={
            state.rebirths === 0
              ? "Reach the Deep Void, rebirth and unlock the skill tree"
              : `${state.skillPoints} skill points · ${state.rebirths} rebirths`
          }
          right={<Tag label="Open" tone="amber" />}
          onPress={() => router.push("/skills")}
        />
        <Row
          icon={<DiamondIcon size={34} />}
          title="Diamond Store"
          sub={`You have ${diamonds} diamonds. Buy packs or find free ways to get them.`}
          right={<Tag label="Open" tone="amber" />}
          onPress={() => router.push("/store")}
        />
        <Row
          stripe="#4FD1C5"
          title="Stats"
          sub="Play time, rocks destroyed, deepest point, records"
          right={<Tag label="Open" tone="amber" />}
          onPress={() => router.push("/stats")}
        />
        <Row
          stripe="#B8A790"
          title="Settings"
          sub="Vibration, effects, hit effect, reset progress"
          right={<Tag label="Open" tone="amber" />}
          onPress={() => router.push("/settings")}
        />

        {state.adFree && (
          <View className="rounded-xl border-2 border-ok bg-panel px-3.5 py-3">
            <Txt d tone="ok" className="text-lg">
              Ad-Free Supporter
            </Txt>
            <Txt tone="mute" className="text-sm">
              Thank you! Ads are removed and you support the game.
            </Txt>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
