import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { DiamondIcon, ToolGraphic } from "@/components/GameGraphics";
import {
  Bar,
  Btn,
  PillTabs,
  Row,
  Screen,
  Section,
  Tag,
  TopBar,
  Txt,
} from "@/components/ui";
import {
  DIAMOND_ITEMS,
  PERMS,
  TOOLS,
  UPGRADES,
  formatNumber,
  formatTime,
  useGame,
  type DiamondItem,
  type GameTool,
  type GameUpgrade,
} from "@/context/GameContext";

type ShopTab = "tools" | "upgrades" | "boosts";

function ToolCard({ tool, index }: { tool: GameTool; index: number }) {
  const { myCoins, activeToolId, ownedToolIds, buyTool, selectTool } =
    useGame();
  const owned = ownedToolIds.includes(tool.id);
  const active = activeToolId === tool.id;
  const unlocked =
    owned || index === 0 || ownedToolIds.includes(TOOLS[index - 1].id);

  let right = <Tag label="Locked" tone="mute" />;
  if (active) right = <Tag label="Equipped" tone="amber" />;
  else if (owned)
    right = (
      <Btn tone="line" label="Equip" onPress={() => selectTool(tool.id)} />
    );
  else if (unlocked)
    right = (
      <Btn
        label={formatNumber(tool.price)}
        onPress={() => buyTool(tool.id)}
        disabled={myCoins < tool.price}
      />
    );

  return (
    <Row
      icon={<ToolGraphic toolId={tool.id} size={46} />}
      title={tool.name}
      sub={`×${tool.damageMultiplier} damage`}
      right={right}
      outline={active}
      dim={!unlocked}
    />
  );
}

function UpgradeCard({ upgrade }: { upgrade: GameUpgrade }) {
  const { myCoins, upgradeLevels, buyUpgrade, getUpgradePrice } = useGame();
  const level = upgradeLevels[upgrade.id];
  const price = getUpgradePrice(upgrade.id);
  const maxed = level >= upgrade.maxLevel;
  return (
    <Row
      stripe={upgrade.color}
      title={upgrade.name}
      sub={upgrade.description}
      right={
        maxed ? (
          <Tag label="Max" tone="ok" />
        ) : (
          <Btn
            label={formatNumber(price)}
            onPress={() => buyUpgrade(upgrade.id)}
            disabled={myCoins < price}
          />
        )
      }>
      <View className="mt-2 flex-row items-center gap-3">
        <View className="flex-1">
          <Bar
            percent={(level / upgrade.maxLevel) * 100}
            color={upgrade.color}
            height={8}
          />
        </View>
        <Txt tone="mute" className="text-[13px]">
          Lv {level}/{upgrade.maxLevel}
        </Txt>
      </View>
      <Txt tone="teal" bold className="mt-1 text-[13px]">
        Now: {level === 0 ? "not bought yet" : upgrade.effect(level)}
      </Txt>
    </Row>
  );
}

function ItemCard({ item }: { item: DiamondItem }) {
  const { diamonds, state, now, buyItem, getItemPrice } = useGame();
  const price = getItemPrice(item.id);
  const level = item.perm ? state.perm[item.perm] : 0;
  const maxed =
    (item.perm && level >= PERMS[item.perm].max) ||
    (item.adFree && state.adFree);
  const endsAt = item.boost ? (state.boosts[item.boost.id] ?? 0) : 0;
  const active = endsAt > now;

  return (
    <Row
      stripe={item.color}
      title={item.name}
      sub={item.desc}
      right={
        maxed ? (
          <Tag label={item.adFree ? "Owned" : "Max"} tone="ok" />
        ) : (
          <Btn
            tone="teal"
            icon={<DiamondIcon size={18} />}
            label={String(price)}
            onPress={() => buyItem(item.id)}
            disabled={diamonds < price}
          />
        )
      }>
      {item.perm ? (
        <Txt tone="teal" bold className="mt-1 text-[13px]">
          Level {level}/{PERMS[item.perm].max}
          {level > 0 ? ` · ${PERMS[item.perm].effect(level)}` : ""}
        </Txt>
      ) : null}
      {active ? (
        <Txt tone="ok" bold className="mt-1 text-[13px]">
          Active · {formatTime(endsAt - now)} left (buying adds time)
        </Txt>
      ) : null}
    </Row>
  );
}

export default function ShopScreen() {
  const { stats, diamonds } = useGame();
  const [tab, setTab] = useState<ShopTab>("tools");
  const groups = ["Boosts", "Permanent", "Utility"] as const;
  return (
    <Screen>
      <TopBar />
      <PillTabs<ShopTab>
        tabs={[
          { id: "tools", label: "Tools" },
          { id: "upgrades", label: "Upgrades" },
          { id: "boosts", label: "Diamonds" },
        ]}
        active={tab}
        onChange={setTab}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-6 pt-1">
        {tab === "tools" && (
          <>
            <Txt tone="mute" className="text-sm">
              Hit damage now:{" "}
              <Txt bold className="text-sm">
                {formatNumber(stats.damagePerClick)}
              </Txt>
            </Txt>
            {TOOLS.map((t, i) => (
              <ToolCard key={t.id} tool={t} index={i} />
            ))}
          </>
        )}
        {tab === "upgrades" &&
          UPGRADES.map((u) => <UpgradeCard key={u.id} upgrade={u} />)}
        {tab === "boosts" && (
          <>
            <Row
              icon={<DiamondIcon size={40} />}
              title={`${diamonds} diamonds`}
              sub="Premium currency for boosts and permanent bonuses"
              right={
                <Btn
                  tone="teal"
                  label="Get more"
                  onPress={() => router.push("/store")}
                />
              }
            />
            {groups.map((g) => (
              <View key={g} className="gap-2.5">
                <Section
                  title={
                    g === "Boosts"
                      ? "Timed boosts"
                      : g === "Permanent"
                        ? "Permanent bonuses (kept after Rebirth)"
                        : "Utility"
                  }
                />
                {DIAMOND_ITEMS.filter((i) => i.group === g).map((i) => (
                  <ItemCard key={i.id} item={i} />
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
