import { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import { Bar, Btn, Screen, Tag, TopBar, Txt } from "@/components/ui";
import {
  TASKS,
  formatNumber,
  useGame,
  type GameTask,
} from "@/context/GameContext";

/** Pulses while a reward is waiting to be claimed. */
function Pulse({ children }: { children: React.ReactNode }) {
  const v = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1.08,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  return (
    <Animated.View style={{ transform: [{ scale: v }] }}>
      {children}
    </Animated.View>
  );
}

function TaskCard({ task }: { task: GameTask }) {
  const { taskProgress, claimedTaskIds, claimTaskReward } = useGame();
  const progress = Math.min(taskProgress[task.id], task.target);
  const done = progress >= task.target;
  const claimed = claimedTaskIds.includes(task.id);

  let right = <Tag label={`+${formatNumber(task.reward)}`} tone="amber" />;
  if (claimed) right = <Tag label="Claimed" tone="ok" />;
  else if (done)
    right = (
      <Pulse>
        <Btn
          tone="teal"
          label={`Claim ${formatNumber(task.reward)}`}
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
  const { myCoins, claimedTaskIds, taskProgress } = useGame();
  // ready to claim first, then in progress, claimed last
  const rank = (t: GameTask) =>
    claimedTaskIds.includes(t.id) ? 2 : taskProgress[t.id] >= t.target ? 0 : 1;
  const sorted = [...TASKS].sort((a, b) => rank(a) - rank(b));
  return (
    <Screen>
      <TopBar
        coins={myCoins}
        label="Completed"
        value={`${claimedTaskIds.length}/${TASKS.length}`}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-6">
        {sorted.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ScrollView>
    </Screen>
  );
}
