import { Alert, ScrollView, View } from "react-native";
import {
  BackBar,
  Bar,
  Btn,
  Row,
  Screen,
  Section,
  Tag,
  TopBar,
  Txt,
} from "@/components/ui";
import {
  BRANCHES,
  REBIRTH_DEPTH,
  SKILLS,
  rebirthPoints,
  useGame,
  type Skill,
} from "@/context/GameContext";

function SkillNode({ skill, color }: { skill: Skill; color: string }) {
  const { state, buySkill } = useGame();
  const level = state.skills[skill.id];
  const unlocked = state.rebirths >= 1;
  const prereq = !skill.requires || state.skills[skill.requires] >= 1;
  const maxed = level >= skill.maxLevel;
  const canBuy =
    unlocked && prereq && !maxed && state.skillPoints >= skill.cost;

  let right = (
    <Btn
      label={`Learn · ${skill.cost}`}
      onPress={() => buySkill(skill.id)}
      disabled={!canBuy}
    />
  );
  if (maxed) right = <Tag label="Max" tone="ok" />;
  else if (!prereq) right = <Tag label="Locked" tone="mute" />;

  return (
    <Row
      stripe={color}
      title={skill.name}
      sub={skill.desc}
      right={right}
      dim={!prereq || !unlocked}>
      <View className="mt-2 flex-row items-center gap-1.5">
        {Array.from({ length: skill.maxLevel }, (_, i) => (
          <View
            key={i}
            className="h-2.5 flex-1 rounded-full"
            style={{ backgroundColor: i < level ? color : "#3A2F27" }}
          />
        ))}
      </View>
      <Txt tone="teal" bold className="mt-1 text-[13px]">
        Now: {level === 0 ? "not learned" : skill.effect(level)}
      </Txt>
    </Row>
  );
}

export default function SkillsScreen() {
  const { state, depth, rebirth } = useGame();
  const can = depth >= REBIRTH_DEPTH;
  const points = rebirthPoints(depth, state.rebirths);

  const ask = () =>
    Alert.alert(
      "Rebirth?",
      `Coins, tools, depth and coin upgrades reset.\n\nYou keep: diamonds, chests, permanent bonuses, skills, quests and hit effects.\n\nYou get ${points} skill points and +10% coins and damage forever.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Rebirth", style: "destructive", onPress: rebirth },
      ],
    );

  return (
    <Screen>
      <TopBar />
      <BackBar title="Rebirth & Skills" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-8 pt-2">
        <View className="gap-2 rounded-xl border-2 border-[#9B7CFF] bg-panel px-3.5 py-3">
          <View className="flex-row items-center justify-between">
            <Txt d className="text-xl">
              Rebirth
            </Txt>
            <Txt tone="mute" className="text-sm">
              Rebirths:{" "}
              <Txt bold className="text-sm">
                {state.rebirths}
              </Txt>{" "}
              (+{state.rebirths * 10}% coins & damage)
            </Txt>
          </View>
          <Txt tone="mute" className="text-sm">
            Reach {REBIRTH_DEPTH} m to finish the game with a Rebirth. You
            restart from the surface, but stronger.
          </Txt>
          <Bar percent={(depth / REBIRTH_DEPTH) * 100} color="#9B7CFF" />
          <Txt tone="amber" bold className="text-[13px]">
            {depth} / {REBIRTH_DEPTH} m · Reward now: {can ? points : 0} skill
            points
          </Txt>
          <Btn
            tone="teal"
            label={
              can
                ? `Rebirth · +${points} points`
                : `Locked until ${REBIRTH_DEPTH} m`
            }
            onPress={ask}
            disabled={!can}
          />
        </View>

        <View className="flex-row items-center justify-between px-1 pt-2">
          <Txt d className="text-xl">
            Skill Tree
          </Txt>
          <Txt d tone="amber" className="text-lg">
            {state.skillPoints} points
          </Txt>
        </View>
        {state.rebirths < 1 && (
          <View className="rounded-xl bg-deep px-3.5 py-3">
            <Txt d tone="amber" className="text-base">
              Locked
            </Txt>
            <Txt tone="mute" className="text-sm">
              The skill tree opens after your first Rebirth. These are permanent
              upgrades that stay forever.
            </Txt>
          </View>
        )}
        {BRANCHES.map((b) => (
          <View key={b.id} className="gap-2.5">
            <Section title={b.name} />
            <View
              className="ml-2 gap-2.5 border-l-2 pl-3"
              style={{ borderColor: b.color }}>
              {SKILLS.filter((s) => s.branch === b.id).map((s) => (
                <SkillNode key={s.id} skill={s} color={b.color} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
