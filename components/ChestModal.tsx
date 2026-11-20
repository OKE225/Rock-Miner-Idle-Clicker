import { useEffect } from "react";
import { Modal, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { CHESTS, type ChestId, type Reward } from "@/context/GameContext";
import { Flash } from "./Effects";
import { ChestGraphic, DiamondIcon } from "./GameGraphics";
import { Btn, Txt } from "./ui";

const SHAKE_MS = 4 * 180 + 60;

function RewardCard({
  index,
  runId,
  reward,
}: {
  index: number;
  runId: number;
  reward: Reward;
}) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = 0;
    v.value = withDelay(
      SHAKE_MS + 250 + index * 180,
      withSpring(1, { damping: 9, stiffness: 160 }),
    );
  }, [runId, index, v]);
  const style = useAnimatedStyle(() => ({
    opacity: Math.min(1, v.value * 2),
    transform: [{ scale: 0.4 + 0.6 * v.value }],
  }));
  return (
    <Animated.View style={style}>
      <View
        className="flex-row items-center gap-2 rounded-xl border-2 bg-panel px-4 py-3"
        style={{ borderColor: reward.color }}>
        {reward.kind === "diamonds" ? (
          <DiamondIcon size={22} />
        ) : (
          <View
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: reward.color }}
          />
        )}
        <Txt d className="flex-1 text-lg" style={{ color: reward.color }}>
          {reward.text}
        </Txt>
      </View>
    </Animated.View>
  );
}

export function ChestModal({
  visible,
  chest,
  rewards,
  runId,
  onClose,
}: {
  visible: boolean;
  chest: ChestId;
  rewards: Reward[];
  runId: number;
  onClose: () => void;
}) {
  const shake = useSharedValue(0);
  const pop = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    shake.value = 0;
    pop.value = 0;
    shake.value = withSequence(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 90 }),
          withTiming(-1, { duration: 90 }),
        ),
        4,
      ),
      withTiming(0, { duration: 60 }),
    );
    pop.value = withDelay(SHAKE_MS, withSpring(1, { damping: 8 }));
  }, [visible, runId, pop, shake]);

  const chestStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${shake.value * 8}deg` },
      { scale: 1 + 0.25 * pop.value },
    ],
  }));

  const color = CHESTS[chest].color;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/80 px-6">
        <Flash id={visible ? runId : 0} color={color} />
        <Txt d className="mb-2 text-3xl" style={{ color }}>
          {CHESTS[chest].name}
        </Txt>
        <Animated.View style={chestStyle}>
          <ChestGraphic kind={chest} open={false} size={140} />
        </Animated.View>
        <View className="mt-4 w-full gap-2">
          {rewards.map((r, i) => (
            <RewardCard
              key={`${runId}-${i}`}
              index={i}
              runId={runId}
              reward={r}
            />
          ))}
        </View>
        <Btn className="mt-5 w-full" big label="Collect" onPress={onClose} />
      </View>
    </Modal>
  );
}
