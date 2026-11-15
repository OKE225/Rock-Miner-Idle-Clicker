import { useState } from "react";
import { ScrollView, View } from "react-native";
import { ToolGraphic } from "@/components/GameGraphics";
import {
  Bar,
  Btn,
  PillTabs,
  Row,
  Screen,
  Tag,
  TopBar,
  Txt,
} from "@/components/ui";
import {
  TOOLS,
  UPGRADES,
  formatNumber,
  useGame,
  type GameTool,
  type GameUpgrade,
} from "@/context/GameContext";

type ShopTab = "tools" | "upgrades";

function ToolCard({ tool, index }: { tool: GameTool; index: number }) {
  const { myCoins, activeToolId, ownedToolIds, buyTool, selectTool } =
    useGame();
  const owned = ownedToolIds.includes(tool.id);
  const active = activeToolId === tool.id;
  const unlocked =
    owned || index === 0 || ownedToolIds.includes(TOOLS[index - 1].id);
  const next = unlocked && !owned;

  let right = <Tag label="Locked" tone="mute" />;
  if (active) right = <Tag label="Equipped" tone="amber" />;
  else if (owned)
    right = (
      <Btn tone="line" label="Equip" onPress={() => selectTool(tool.id)} />
    );
  else if (next)
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

export default function ShopScreen() {
  const { myCoins, stats } = useGame();
  const [tab, setTab] = useState<ShopTab>("tools");
  return (
    <Screen>
      <TopBar
        coins={myCoins}
        label="Hit damage"
        value={formatNumber(stats.damagePerClick)}
      />
      <PillTabs<ShopTab>
        tabs={[
          { id: "tools", label: "Tools" },
          { id: "upgrades", label: "Upgrades" },
        ]}
        active={tab}
        onChange={setTab}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2.5 px-5 pb-6 pt-1">
        {tab === "tools"
          ? TOOLS.map((t, i) => <ToolCard key={t.id} tool={t} index={i} />)
          : UPGRADES.map((u) => <UpgradeCard key={u.id} upgrade={u} />)}
      </ScrollView>
    </Screen>
  );
}
