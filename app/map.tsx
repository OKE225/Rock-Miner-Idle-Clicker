import { ScrollView, View } from "react-native";
import { HazardGraphic, RockGraphic } from "@/components/GameGraphics";
import { Bar, Row, Screen, Section, Tag, TopBar, Txt } from "@/components/ui";
import { HAZARD_LIST, ROCKS, ZONES, useGame } from "@/context/GameContext";

export default function MapScreen() {
  const { depth, zoneIndex, nextZone, currentZone } = useGame();
  const progress = nextZone
    ? ((depth - currentZone.startDepth) /
        (nextZone.startDepth - currentZone.startDepth)) *
      100
    : 100;

  return (
    <Screen>
      <TopBar />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-6">
        <View className="flex-row items-baseline justify-between">
          <Txt tone="mute" className="text-sm">
            Dig down layer by layer.
          </Txt>
          <Txt d className="text-xl">
            {depth} m
          </Txt>
        </View>

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

        <Section title="Hazards (they never hurt you, they are just very tough)" />
        {HAZARD_LIST.map((h) => (
          <Row
            key={h.id}
            icon={<HazardGraphic kind={h.id} size={46} />}
            title={h.name}
            sub={h.tagline}
            right={
              <Tag
                label={`Zone ${h.minZone + 1}+`}
                tone={zoneIndex >= h.minZone ? "ok" : "mute"}
              />
            }
            dim={zoneIndex < h.minZone}>
            <Txt tone="amber" bold className="mt-1 text-[13px]">
              Big coin reward · {Math.round(h.chestChance * 100)}% chest ·{" "}
              {Math.round(h.diamondChance * 100)}% diamonds
            </Txt>
          </Row>
        ))}
      </ScrollView>
    </Screen>
  );
}
