import { useState } from "react";
import { ScrollView, View } from "react-native";
import { ChestModal } from "@/components/ChestModal";
import { ChestGraphic } from "@/components/GameGraphics";
import { Bar, Btn, Row, Screen, Tag, TopBar, Txt } from "@/components/ui";
import {
  CHESTS,
  CHEST_ORDER,
  RARE_EVERY,
  useGame,
} from "@/context/GameContext";

export default function ChestsScreen() {
  const { state, openChest } = useGame();
  const [show, setShow] = useState(false);
  const total = CHEST_ORDER.reduce((t, id) => t + state.chests[id], 0);
  const toRare = RARE_EVERY - (state.chestDrops % RARE_EVERY);

  return (
    <Screen>
      <TopBar />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-6">
        <Txt tone="mute" className="text-sm">
          Chests drop from ore, hazards, quests and every 50 m of new depth. You
          have{" "}
          <Txt bold className="text-sm">
            {total}
          </Txt>{" "}
          unopened.
        </Txt>

        <View className="gap-1.5 rounded-xl bg-panel px-3.5 py-3">
          <View className="flex-row justify-between">
            <Txt d className="text-base">
              Rare chest chance
            </Txt>
            <Txt tone="amber" bold className="text-sm">
              {toRare === RARE_EVERY ? "Next chest!" : `in ${toRare} chests`}
            </Txt>
          </View>
          <Bar
            percent={((RARE_EVERY - toRare) / RARE_EVERY) * 100}
            color="#F0ABFC"
          />
          <Txt tone="mute" className="text-[13px]">
            Most chests are wooden or stone. Every {RARE_EVERY}th chest has a
            big chance to be iron, golden, crystal or vibranium.
          </Txt>
        </View>

        {CHEST_ORDER.map((id) => {
          const c = CHESTS[id];
          const n = state.chests[id];
          return (
            <Row
              key={id}
              icon={<ChestGraphic kind={id} size={54} />}
              title={c.name}
              sub={c.desc}
              dim={n === 0}
              right={
                n > 0 ? (
                  <Btn
                    label={`Open ×${n}`}
                    onPress={() => {
                      openChest(id);
                      setShow(true);
                    }}
                  />
                ) : (
                  <Tag label="None" tone="mute" />
                )
              }
            />
          );
        })}
      </ScrollView>

      {state.lastChest && (
        <ChestModal
          visible={show}
          chest={state.lastChest.chest}
          rewards={state.lastChest.rewards}
          runId={state.lastChest.id}
          onClose={() => setShow(false)}
        />
      )}
    </Screen>
  );
}
