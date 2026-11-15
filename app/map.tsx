import { ScrollView, View } from "react-native";
import { RockGraphic } from "@/components/GameGraphics";
import { Bar, Row, Screen, Tag, TopBar, Txt } from "@/components/ui";
import { ROCKS, ZONES, useGame } from "@/context/GameContext";

export default function MapScreen() {
  const { myCoins, depth, zoneIndex, nextZone, currentZone } = useGame();
  const progress = nextZone
    ? ((depth - currentZone.startDepth) /
        (nextZone.startDepth - currentZone.startDepth)) *
      100
    : 100;

  return (
    <Screen>
      <TopBar coins={myCoins} label="Depth" value={`${depth} m`} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-6">
        <Txt tone="mute" className="text-sm">
          Dig down layer by layer. Deeper zones have tougher rocks and richer
          ore.
        </Txt>

        {ZONES.map((zone, i) => {
          const right =
            i < zoneIndex ? (
              <Tag label="Done" tone="ok" />
            ) : i === zoneIndex ? (
              <Tag label="You are here" tone="amber" />
            ) : (
              <Tag label="Locked" tone="mute" />
            );
          return (
            <Row
              key={zone.id}
              stripe={zone.color}
              title={`${zone.id} · ${zone.name}`}
              sub={`From ${zone.startDepth} m · ${zone.rocks.length} rock types`}
              right={right}
              outline={i === zoneIndex}
              dim={i > zoneIndex}>
              <View className="mt-2 flex-row gap-1">
                {zone.rocks.map((r) => (
                  <RockGraphic
                    key={r.id}
                    id={r.id}
                    color={ROCKS[r.id].color}
                    size={30}
                  />
                ))}
              </View>
            </Row>
          );
        })}

        <View className="gap-1.5 rounded-xl bg-panel px-3.5 py-3">
          <View className="flex-row justify-between">
            <Txt tone="mute" className="text-[13px]">
              {nextZone ? `Next zone: ${nextZone.name}` : "Final zone reached"}
            </Txt>
            <Txt tone="mute" className="text-[13px]">
              {nextZone ? `${depth} / ${nextZone.startDepth} m` : ""}
            </Txt>
          </View>
          <Bar percent={progress} color="#E8A33D" />
        </View>
      </ScrollView>
    </Screen>
  );
}
