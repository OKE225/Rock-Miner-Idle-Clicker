import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Bar, Btn, Screen, Tag, TopBar, Txt } from "@/components/ui";
import {
  CHESTS,
  TASKS,
  formatNumber,
  useGame,
  type GameTask,
} from "@/context/GameContext";

function Pulse({ children }: { children: React.ReactNode }) {
  const v = useSharedValue(1);
  useEffect(() => {
    v.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
    );
  }, [v]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: v.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

function TaskCard({ task }: { task: GameTask }) {
  const { taskProgress, claimedTaskIds, claimTaskReward } = useGame();
  const progress = Math.min(taskProgress[task.id], task.target);
  const done = progress >= task.target;
  const claimed = claimedTaskIds.includes(task.id);
  const reward = [
    task.reward > 0 ? `+${formatNumber(task.reward)} coins` : "",
    task.diamonds ? `${task.diamonds} diamonds` : "",
    task.chest ? CHESTS[task.chest].name : "",
  ]
    .filter(Boolean)
    .join(" · ");

  let right = null;
  if (claimed) right = <Tag label="Claimed" tone="ok" />;
  else if (done)
    right = (
      <Pulse>
        <Btn
          tone="teal"
          label="Claim"
          onPress={() => claimTaskReward(task.id)}
        />
      </Pulse>
    );

  return (
    <View
      className={`gap-2 rounded-xl bg-panel px-3.5 py-3 ${claimed ? "opacity-60" : ""}`}>
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1">
          <Txt d className="text-lg">
            {task.title}
          </Txt>
          <Txt tone="mute" className="text-sm">
            {task.description}
          </Txt>
          <Txt tone="amber" bold className="text-[13px]">
            {reward}
          </Txt>
        </View>
        {right}
      </View>
      <View className="flex-row items-center gap-2.5">
        <View className="flex-1">
          <Bar
            percent={(progress / task.target) * 100}
            color={done ? "#6FCF7A" : "#E8A33D"}
          />
        </View>
        <Txt tone="mute" className="text-[13px]">
          {formatNumber(progress)}/{formatNumber(task.target)}
        </Txt>
      </View>
    </View>
  );
}

export default function QuestsScreen() {
  const { claimedTaskIds, taskProgress } = useGame();
  const rank = (t: GameTask) =>
    claimedTaskIds.includes(t.id) ? 2 : taskProgress[t.id] >= t.target ? 0 : 1;
  const sorted = [...TASKS].sort((a, b) => rank(a) - rank(b));
  return (
    <Screen>
      <TopBar />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-6">
        <Txt tone="mute" className="text-sm">
          Completed:{" "}
          <Txt bold className="text-sm">
            {claimedTaskIds.length}/{TASKS.length}
          </Txt>
        </Txt>
        {sorted.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ScrollView>
    </Screen>
  );
}
