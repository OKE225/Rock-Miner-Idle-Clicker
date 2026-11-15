import { StyleSheet } from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
} from "react-native-svg";
import type { RockId, ToolId } from "@/context/GameContext";

const OUT = "#120E0C";

/** Mix two #rrggbb colors. t = 0 -> hex, t = 1 -> to */
export const mix = (hex: string, to: string, t: number) => {
  const parse = (h: string) =>
    [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = parse(hex),
    b = parse(to);
  return (
    "#" +
    a
      .map((v, i) =>
        Math.round(v + (b[i] - v) * t)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
};

/* ---------- small building blocks ---------- */
const Crystal = ({
  x,
  y,
  h,
  w,
  c,
}: {
  x: number;
  y: number;
  h: number;
  w: number;
  c: string;
}) => (
  <G>
    <Polygon
      points={`${x - w / 2},${y} ${x - w / 2},${y - h * 0.62} ${x},${y - h} ${x + w / 2},${y - h * 0.62} ${x + w / 2},${y}`}
      fill={c}
      stroke={OUT}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Polygon
      points={`${x - w / 2},${y - h * 0.62} ${x},${y - h} ${x},${y} ${x - w / 2},${y}`}
      fill="#fff"
      fillOpacity={0.3}
    />
  </G>
);

const Nugget = ({
  x,
  y,
  s,
  c,
}: {
  x: number;
  y: number;
  s: number;
  c: string;
}) => (
  <G>
    <Polygon
      points={`${x},${y - s} ${x + s},${y - s * 0.4} ${x + s * 0.7},${y + s * 0.6} ${x - s * 0.6},${y + s * 0.7} ${x - s},${y - s * 0.2}`}
      fill={c}
      stroke={OUT}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Polygon
      points={`${x},${y - s} ${x + s * 0.4},${y - s * 0.5} ${x - s * 0.2},${y - s * 0.1} ${x - s},${y - s * 0.2}`}
      fill="#fff"
      fillOpacity={0.4}
    />
  </G>
);

const Spark = ({
  x,
  y,
  s = 12,
  c,
}: {
  x: number;
  y: number;
  s?: number;
  c: string;
}) => (
  <Polygon
    points={`${x},${y - s} ${x + s * 0.3},${y - s * 0.3} ${x + s},${y} ${x + s * 0.3},${y + s * 0.3} ${x},${y + s} ${x - s * 0.3},${y + s * 0.3} ${x - s},${y} ${x - s * 0.3},${y - s * 0.3}`}
    fill={c}
    opacity={0.9}
  />
);

/* ---------- ROCKS (viewBox 100x100) ---------- */
const GEMS: Partial<Record<RockId, [string, string]>> = {
  diamond: ["#BDF3EE", "#7FD8FF"],
  emerald: ["#7CF59A", "#3DDC84"],
  ruby: ["#FF8FA0", "#E0245E"],
  crystal: ["#FFD0FF", "#E070F0"],
  vibranium: ["#C9B8FF", "#8A5CF6"],
};

export const RockGraphic = ({
  id,
  color,
  size = 120,
  damage = 0,
}: {
  id: RockId;
  color: string;
  size?: number;
  damage?: number;
}) => {
  const body =
    id === "dirt"
      ? "M8 82 Q12 42 50 28 Q88 42 92 82 Q50 95 8 82Z"
      : "M14 70 L24 38 L48 17 L74 24 L89 52 L82 80 L50 90 L24 85Z";
  const gem = GEMS[id];
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d={body}
        fill={color}
        stroke={OUT}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Path
        d="M20 62 L26 40 L48 22 L60 28 L40 44 Z"
        fill="#fff"
        fillOpacity={0.2}
      />
      <Path
        d="M50 90 L82 80 L89 52 L70 64 L56 78 Z"
        fill="#000"
        fillOpacity={0.28}
      />

      {id === "dirt" && (
        <G>
          <Path
            d="M40 31 L42 22 M50 29 L50 19 M60 31 L63 23"
            stroke="#5BA85A"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Path
            d="M24 74 q5-8 10 0 t10 0"
            stroke="#D98FA0"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <Circle
            cx="66"
            cy="58"
            r="5"
            fill="#A98E70"
            stroke={OUT}
            strokeWidth={1.5}
          />
          <Circle
            cx="38"
            cy="56"
            r="3.5"
            fill="#A98E70"
            stroke={OUT}
            strokeWidth={1.5}
          />
          <Rect x="58" y="72" width="16" height="5" rx="2.5" fill="#CFC3A8" />
        </G>
      )}
      {id === "stone" && (
        <G>
          <Circle cx="58" cy="58" r="4" fill="#000" fillOpacity={0.25} />
          <Circle cx="40" cy="66" r="3" fill="#000" fillOpacity={0.2} />
          <Polygon
            points="52,38 62,40 58,48 50,46"
            fill="#fff"
            fillOpacity={0.18}
          />
        </G>
      )}
      {id === "iron" && (
        <G>
          <Nugget x={54} y={56} s={11} c="#C9D1D9" />
          <Nugget x={34} y={64} s={8} c="#AEB6C2" />
          <Nugget x={68} y={68} s={7} c="#B5653D" />
          <Circle cx="48" cy="48" r="2" fill="#B5653D" />
        </G>
      )}
      {id === "gold" && (
        <G>
          <Nugget x={54} y={56} s={12} c="#FFD84D" />
          <Nugget x={33} y={65} s={8} c="#FFC93C" />
          <Nugget x={69} y={68} s={7} c="#FFE066" />
          <Spark x={72} y={40} s={6} c="#FFF3B0" />
        </G>
      )}
      {gem && (
        <G>
          <Crystal x={52} y={68} h={36} w={17} c={gem[1]} />
          <Crystal x={34} y={74} h={25} w={13} c={gem[0]} />
          <Crystal x={69} y={76} h={22} w={12} c={gem[0]} />
          <Spark x={76} y={36} s={6} c="#fff" />
        </G>
      )}
      {id === "vibranium" && (
        <Circle
          cx="50"
          cy="56"
          r="36"
          stroke="#9B7CFF"
          strokeWidth={1.5}
          fill="none"
          opacity={0.6}
        />
      )}
      {id === "obsidian" && (
        <G>
          <Polygon
            points="50,22 62,52 50,76 38,52"
            fill="#2A2438"
            stroke={OUT}
            strokeWidth={2}
          />
          <Polygon
            points="30,50 40,62 32,76 24,62"
            fill="#2A2438"
            stroke={OUT}
            strokeWidth={2}
          />
          <Polygon
            points="72,48 80,64 70,76 64,60"
            fill="#2A2438"
            stroke={OUT}
            strokeWidth={2}
          />
          <Line
            x1="50"
            y1="26"
            x2="45"
            y2="48"
            stroke="#8A7BB0"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Spark x={74} y={34} s={6} c="#B89CFF" />
        </G>
      )}

      {damage > 0.3 && (
        <Polyline
          points="50,28 44,44 54,56 46,72"
          fill="none"
          stroke={OUT}
          strokeWidth={2.4}
          strokeLinecap="round"
          opacity={0.85}
        />
      )}
      {damage > 0.6 && (
        <Polyline
          points="68,34 62,48 72,60"
          fill="none"
          stroke={OUT}
          strokeWidth={2.4}
          strokeLinecap="round"
          opacity={0.85}
        />
      )}
      {damage > 0.85 && (
        <Polyline
          points="28,52 40,58 34,74"
          fill="none"
          stroke={OUT}
          strokeWidth={2.4}
          strokeLinecap="round"
          opacity={0.85}
        />
      )}
    </Svg>
  );
};

/* ---------- TOOLS ---------- */
const HEAD: Partial<Record<ToolId, string>> = {
  woodenPickaxe: "#A9743A",
  stonePickaxe: "#8A8A8A",
  ironPickaxe: "#C9D1D9",
  goldPickaxe: "#FFC93C",
  diamondPickaxe: "#7FD8FF",
  emeraldPickaxe: "#4FCC7A",
  rubyPickaxe: "#E05252",
  obsidianPickaxe: "#6A5E80",
  crystalPickaxe: "#F0ABFC",
  vibraniumPickaxe: "#8A5CF6",
};

export const ToolGraphic = ({
  toolId,
  size = 48,
}: {
  toolId: ToolId;
  size?: number;
}) => {
  if (toolId === "hands") {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {[0, 1, 2, 3].map((i) => (
          <Rect
            key={i}
            x={27 + i * 13}
            y={24 + (i === 1 || i === 2 ? -3 : 0)}
            width={11}
            height={26}
            rx={5.5}
            fill="#E0A97E"
            stroke={OUT}
            strokeWidth={3}
          />
        ))}
        <Rect
          x="22"
          y="40"
          width="56"
          height="42"
          rx="14"
          fill="#E0A97E"
          stroke={OUT}
          strokeWidth={3}
        />
        <Rect
          x="13"
          y="50"
          width="16"
          height="24"
          rx="8"
          fill="#E0A97E"
          stroke={OUT}
          strokeWidth={3}
        />
        <Path
          d="M32 66 H70"
          stroke="#B9835C"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </Svg>
    );
  }
  if (toolId === "goldenDrill" || toolId === "plasmaDrill") {
    const plasma = toolId === "plasmaDrill";
    const c = plasma ? "#3FE0F0" : "#FFC93C";
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Rect
          x="6"
          y="42"
          width="24"
          height="18"
          rx="6"
          fill="#3A2F27"
          stroke={OUT}
          strokeWidth={3}
        />
        <Rect
          x="28"
          y="32"
          width="38"
          height="38"
          rx="8"
          fill={c}
          stroke={OUT}
          strokeWidth={3}
        />
        <Rect
          x="32"
          y="36"
          width="12"
          height="30"
          rx="5"
          fill="#fff"
          fillOpacity={0.35}
        />
        <Polygon
          points="66,36 96,51 66,66"
          fill="#C9D1D9"
          stroke={OUT}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <Line x1="72" y1="40" x2="80" y2="60" stroke={OUT} strokeWidth={2} />
        <Line x1="80" y1="43" x2="88" y2="55" stroke={OUT} strokeWidth={2} />
        {plasma && (
          <Polyline
            points="44,40 52,52 46,52 56,64"
            fill="none"
            stroke="#fff"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {plasma && (
          <Circle
            cx="47"
            cy="51"
            r="22"
            stroke="#3FE0F0"
            strokeWidth={1.5}
            fill="none"
            opacity={0.5}
          />
        )}
      </Svg>
    );
  }
  const head = HEAD[toolId] ?? "#C9D1D9";
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Line
        x1="24"
        y1="90"
        x2="56"
        y2="26"
        stroke={OUT}
        strokeWidth={14}
        strokeLinecap="round"
      />
      <Line
        x1="24"
        y1="90"
        x2="56"
        y2="26"
        stroke="#8A5A2B"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <Line
        x1="22"
        y1="88"
        x2="53"
        y2="28"
        stroke="#B07A3E"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Path
        d="M14 42 Q52 0 92 42"
        stroke={OUT}
        strokeWidth={17}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M14 42 Q52 0 92 42"
        stroke={head}
        strokeWidth={11}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M22 36 Q52 8 84 34"
        stroke="#fff"
        strokeOpacity={0.4}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      {toolId === "vibraniumPickaxe" && (
        <Circle
          cx="52"
          cy="22"
          r="6"
          fill="#C9B8FF"
          stroke={OUT}
          strokeWidth={1.5}
        />
      )}
      {toolId === "crystalPickaxe" && <Spark x={52} y={16} s={7} c="#fff" />}
    </Svg>
  );
};

/* ---------- ZONE BACKGROUND DECORATIONS (full screen) ---------- */
const GEM_DECOR: Partial<Record<RockId, [string, string]>> = {
  diamond: ["#4FD1C5", "#BDF3EE"],
  emerald: ["#3DDC84", "#7CF59A"],
  ruby: ["#E0245E", "#FF8FA0"],
  crystal: ["#E070F0", "#FFD0FF"],
};

export function ZoneDecor({ rockId }: { rockId: RockId }) {
  const gem = GEM_DECOR[rockId];
  const tint =
    rockId === "iron"
      ? "#5A4A44"
      : rockId === "obsidian"
        ? "#2A2438"
        : "#46424D";
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice">
      {rockId === "dirt" && (
        <G>
          <G fill="#6B4A2E" opacity={0.55}>
            <Circle cx="40" cy="170" r="7" />
            <Circle cx="330" cy="130" r="9" />
            <Circle cx="90" cy="450" r="6" />
            <Circle cx="350" cy="500" r="8" />
            <Circle cx="60" cy="680" r="9" />
            <Circle cx="320" cy="720" r="6" />
          </G>
          <G
            stroke="#5A3D26"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={0.8}>
            <Path d="M0 110 Q45 150 20 220 T55 310" />
            <Path d="M390 190 Q340 230 365 300 T330 420" />
            <Path d="M0 580 Q40 620 15 700" />
          </G>
          <Path
            d="M270 610 q15-28 30 0 t30 0 t30 0"
            stroke="#D98FA0"
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
          />
          <Rect
            x="40"
            y="540"
            width="46"
            height="12"
            rx="6"
            fill="#CFC3A8"
            transform="rotate(-25 63 546)"
          />
        </G>
      )}
      {(rockId === "stone" || rockId === "iron" || rockId === "obsidian") && (
        <G>
          <G fill={tint}>
            <Polygon points="10,0 60,0 35,80" />
            <Polygon points="120,0 160,0 140,56" />
            <Polygon points="300,0 360,0 330,90" />
          </G>
          <G stroke={tint} strokeWidth={3} fill="none" opacity={0.9}>
            <Polyline points="30,230 80,290 60,360 110,430" />
            <Polyline points="360,290 320,360 350,450 300,530" />
            <Polyline points="40,630 90,680 70,750" />
          </G>
          {rockId === "iron" && (
            <G>
              <G stroke="#B5653D" strokeWidth={4} fill="none" opacity={0.6}>
                <Polyline points="0,250 70,310 50,400 120,470" />
                <Polyline points="390,320 320,380 350,480 290,560" />
              </G>
              <G fill="#7A4A30" opacity={0.7}>
                <Circle cx="40" cy="620" r="8" />
                <Circle cx="70" cy="650" r="8" />
                <Circle cx="340" cy="720" r="8" />
              </G>
              <Spark x={60} y={180} s={10} c="#F0A070" />
              <Spark x={330} y={240} s={10} c="#F0A070" />
            </G>
          )}
          {rockId === "obsidian" && (
            <G>
              <Spark x={60} y={170} s={12} c="#B89CFF" />
              <Spark x={330} y={230} s={10} c="#B89CFF" />
              <Spark x={350} y={600} s={9} c="#8A7BB0" />
            </G>
          )}
        </G>
      )}
      {rockId === "gold" && (
        <G>
          <G stroke="#E8A33D" strokeWidth={3} fill="none" opacity={0.55}>
            <Polyline points="0,260 60,310 40,390 110,460" />
            <Polyline points="390,340 330,390 360,480 300,570" />
            <Polyline points="20,650 80,710 60,800" />
          </G>
          <G fill="#C98A1E" opacity={0.8}>
            <Polygon points="40,570 62,558 78,580 54,596" />
            <Polygon points="320,650 345,640 358,664 334,678" />
          </G>
          <Spark x={60} y={160} c="#FFD84D" />
          <Spark x={330} y={220} c="#FFD84D" />
          <Spark x={340} y={570} c="#FFE9A0" />
          <Spark x={50} y={480} c="#FFE9A0" />
          <Spark x={200} y={120} c="#FFD84D" />
        </G>
      )}
      {gem && (
        <G>
          <G fill={gem[0]} opacity={0.3}>
            <Polygon points="0,844 25,640 55,844" />
            <Polygon points="40,844 80,700 110,844" />
            <Polygon points="390,844 360,620 330,844" />
            <Polygon points="340,844 300,720 270,844" />
            <Polygon points="0,0 40,0 20,120" />
            <Polygon points="350,0 390,0 375,140" />
          </G>
          <Spark x={70} y={190} c={gem[1]} />
          <Spark x={320} y={250} c="#fff" />
          <Spark x={40} y={490} c="#fff" />
          <Spark x={350} y={530} c={gem[1]} />
        </G>
      )}
      {rockId === "vibranium" && (
        <G>
          <G stroke="#9B7CFF" strokeWidth={3} fill="none" opacity={0.35}>
            <Circle cx="195" cy="360" r="110" />
            <Circle cx="195" cy="360" r="170" />
            <Circle cx="195" cy="360" r="240" />
            <Polyline points="0,620 60,660 30,740 90,810" />
            <Polyline points="390,580 330,630 360,720 300,800" />
          </G>
          <Spark x={60} y={160} c="#C9B8FF" />
          <Spark x={330} y={210} c="#C9B8FF" />
          <Spark x={40} y={520} c="#fff" />
          <Spark x={350} y={620} c="#9B7CFF" />
        </G>
      )}
    </Svg>
  );
}
