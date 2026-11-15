import { Alert, View } from "react-native";

import { useGame } from "@/context/GameContext";
import { Btn, Row, Screen, Tag, TopBar, Txt } from "@/components/ui";

export default function SettingsScreen() {
  const { myCoins, depth, resetGame } = useGame();

  const confirmReset = () => {
    Alert.alert(
      "Reset game?",
      "This will permanently delete your coins, depth, tools, upgrades and quest progress. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetGame,
        },
      ],
    );
  };

  return (
    <Screen>
      <TopBar coins={myCoins} label="Depth" value={`${depth} m`} />

      <View className="gap-2.5 px-5 pt-1">
        <Row
          title="Game version"
          sub="Mining Idle v1.0.0"
          right={<Tag label="Stable" tone="ok" />}
        />

        <Row
          title="Sound effects"
          sub="Coming soon"
          right={<Tag label="Off" tone="mute" />}
        />

        <Row
          title="Haptic feedback"
          sub="Vibration on hits and rewards"
          right={<Tag label="On" tone="ok" />}
        />

        <Row
          title="Reset progress"
          sub="Delete all saved game progress and start again"
          right={<Btn label="Reset" onPress={confirmReset} />}
        />

        <Txt tone="mute" className="px-1 pt-2 text-[13px]">
          Resetting the game cannot be undone. Make sure you really want to
          start from the beginning.
        </Txt>
      </View>
    </Screen>
  );
}
