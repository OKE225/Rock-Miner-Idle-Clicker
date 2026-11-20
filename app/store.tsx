import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { DiamondIcon } from "@/components/GameGraphics";
import {
  BackBar,
  Btn,
  Chip,
  Row,
  Screen,
  Section,
  TopBar,
  Txt,
} from "@/components/ui";
import { useGame } from "@/context/GameContext";
import {
  buyOffer,
  purchasesMode,
  useOffers,
  type PackOffer,
} from "@/services/purchases";

const FREE_WAYS = [
  [
    "Mine ore",
    "A very tiny chance to find a diamond in any rock. Rare ores are slightly better.",
  ],
  [
    "Break hazards",
    "Evil Rocks, Cave-Ins and Monsters have a small chance to drop diamonds.",
  ],
  ["Finish quests", "Some quests give diamonds as a reward."],
  ["Reach new depth", "Every 200 m of a new record gives 1 diamond."],
  [
    "Open chests",
    "Iron, Golden, Crystal and Vibranium chests can hold diamonds.",
  ],
];

export default function StoreScreen() {
  const { buyPack } = useGame();
  const { offers, loading } = useOffers();
  const [busy, setBusy] = useState<string | null>(null);
  const live = purchasesMode() === "revenuecat";

  const start = async (offer: PackOffer) => {
    setBusy(offer.id);
    const res = await buyOffer(offer);
    setBusy(null);
    if (res.status === "success") {
      buyPack(offer.id, res.transactionId);
      Alert.alert(
        "Thank you!",
        `${offer.diamonds} diamonds were added to your account.`,
      );
    } else if (res.status === "error") {
      Alert.alert("Purchase failed", res.message ?? "Please try again later.");
    }
  };

  const buy = (offer: PackOffer) => {
    if (busy) return;
    if (live) return void start(offer);
    Alert.alert(
      `Buy ${offer.name}?`,
      `Demo purchase for ${offer.priceLabel}. No real money is charged.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Buy", onPress: () => void start(offer) },
      ],
    );
  };

  return (
    <Screen>
      <TopBar />
      <BackBar title="Diamond Store" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-8 pt-2">
        <Txt tone="mute" className="text-sm">
          Diamonds are for rare and convenient things: boosts, permanent
          bonuses, depth skips. Everything can also be played without paying.
        </Txt>

        <Section title="Diamond packs" />
        {offers.map((p) => (
          <Row
            key={p.id}
            icon={<DiamondIcon size={44} />}
            title={`${p.diamonds} diamonds`}
            sub={`${p.name}${p.bonus ? " · " + p.bonus : ""}`}
            right={
              <Btn
                tone="teal"
                label={busy === p.id ? "..." : p.priceLabel}
                onPress={() => buy(p)}
                disabled={loading || busy !== null || (live && !p.rcPackage)}
              />
            }>
            {p.badge ? (
              <View className="mt-2 flex-row">
                <Chip
                  label={p.badge}
                  color={p.badge === "Best value" ? "#6FCF7A" : "#E8A33D"}
                />
              </View>
            ) : null}
          </Row>
        ))}
        <Txt tone="mute" className="text-[13px]">
          Payments are processed by the Google Play
        </Txt>

        <Section title="Free ways to get diamonds" />
        {FREE_WAYS.map(([title, text]) => (
          <View
            key={title}
            className="flex-row items-center gap-3 rounded-xl bg-panel px-3.5 py-3">
            <DiamondIcon size={24} />
            <View className="flex-1">
              <Txt d className="text-base">
                {title}
              </Txt>
              <Txt tone="mute" className="text-sm">
                {text}
              </Txt>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
