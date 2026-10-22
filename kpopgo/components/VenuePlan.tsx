/**
 * The venue plan.
 *
 * This is a diagram of a *rule*, not a copy of a seating chart. The venue
 * publishes its own chart as a single flat JPEG with 123 block numbers on it,
 * which is the right artefact for somebody who already knows how the building
 * is organised and useless to somebody standing outside it who does not. What
 * a reader actually needs is four facts — the hundreds digit is the level, the
 * other two digits run one way round, the loop has exactly one break, and the
 * gate letters run the same way as the numbers — and those four facts fit in a
 * drawing that stays legible at 360px.
 *
 * So nothing here is traced. The geometry is computed from bearings read off
 * the published chart and redrawn at this site's own proportions, which is
 * also why the caption says schematic: a reader who needs to know whether
 * block 417 or 418 is the one beside gate D must open the venue's chart, and
 * the guide says so.
 *
 * It is drawn entirely in theme tokens for the same reason the band's
 * hairlines were moved out of inline styles: a value that has to change with
 * the theme cannot live in a hard-coded hex.
 */

const CX = 210;
const CY = 206;

/** Bearing in degrees, clockwise from the top of the plan, as the chart prints it. */
function at(bearing: number, r: number): readonly [number, number] {
  const a = ((bearing - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
}

/**
 * The seating is a horseshoe, not a ring. The outfield corner the chart draws
 * on its right has no seats in it at any level, and that break is where the
 * numbering restarts — which is the single most useful thing on this diagram,
 * so it is drawn as a gap rather than smoothed into a circle.
 */
const GAP_FROM = 50;
const GAP_TO = 94;

function tier(r: number) {
  const [x1, y1] = at(GAP_TO, r);
  const [x2, y2] = at(GAP_FROM, r);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 1 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function arrowHead(bearing: number, r: number, size: number) {
  const [tx, ty] = at(bearing, r);
  const a = ((bearing - 90) * Math.PI) / 180;
  const tanX = -Math.sin(a);
  const tanY = Math.cos(a);
  const outX = Math.cos(a);
  const outY = Math.sin(a);
  const bx = tx - tanX * size;
  const by = ty - tanY * size;
  const w = size * 0.52;
  return [
    `${tx.toFixed(1)},${ty.toFixed(1)}`,
    `${(bx + outX * w).toFixed(1)},${(by + outY * w).toFixed(1)}`,
    `${(bx - outX * w).toFixed(1)},${(by - outY * w).toFixed(1)}`,
  ].join(" ");
}

const TIERS = [
  // `labelAt` fans the four ranges apart around the bottom of the plan. Set
  // to a single bearing they stack into one block of four rows, which reads
  // as a list standing in front of the drawing rather than as four labels
  // each sitting on its own band — and worst at phone width, where the plates
  // very nearly touch.
  { r: 68, w: 20, range: "101–132", tone: 0.1, labelAt: 166 },
  { r: 91, w: 20, range: "201–222", tone: 0.16, labelAt: 176 },
  { r: 114, w: 20, range: "301–334", tone: 0.22, labelAt: 184 },
  { r: 139, w: 24, range: "401–435", tone: 0.3, labelAt: 192 },
];

const GATE_R = 170;

/**
 * Gate letters run clockwise in the same direction the block numbers do, which
 * is the fact that makes the building navigable without a compass. Bearings
 * are read off the chart; A sits by the low 400s, C at the bottom centre, G is
 * the last gate before the break.
 */
const GATES = [
  { id: "A", at: 125 },
  { id: "B", at: 146 },
  { id: "C", at: 180 },
  { id: "D", at: 215 },
  { id: "E", at: 237 },
  { id: "F", at: 344 },
  { id: "G", at: 17 },
];

/** The chart marks its ticket offices ②, ③ and ④. There is no ① on it. */
const OFFICES = [
  { id: "2", at: 250 },
  { id: "3", at: 331 },
  { id: "4", at: 29 },
];

export function GocheokBowl() {
  return (
    <svg
      viewBox="0 0 420 440"
      role="img"
      aria-labelledby="bowl-t bowl-d"
      style={{ width: "100%", height: "auto", maxWidth: 460 }}
    >
      <title id="bowl-t">Gocheok Sky Dome, seating levels and gates in plan</title>
      <desc id="bowl-d">
        Four concentric seating levels around a central floor, numbered 101 to 132,
        201 to 222, 301 to 334 and 401 to 435 from the inside out. Every level is
        broken at the same place, on the right of the plan, where the building has
        no seats and the numbering restarts. Seven gates lettered A to G sit outside
        the top level and run clockwise in the same direction as the block numbers:
        A, B, C, D and E along the bottom, F and G along the top. Ticket offices
        marked 2, 3 and 4 sit beside gates E, F and G.
      </desc>

      {/* The floor. It carries no permanent numbers, which is the point. */}
      <circle
        cx={CX}
        cy={CY}
        r={46}
        fill="none"
        stroke="var(--rule-soft)"
        strokeWidth="1.6"
        strokeDasharray="5 6"
      />
      <text
        x={CX}
        y={CY + 4}
        textAnchor="middle"
        fill="var(--ink-46)"
        fontFamily="var(--font-data)"
        fontSize="13"
        fontWeight="700"
        letterSpacing="0.14em"
      >
        FLOOR
      </text>

      {/* The four levels. Each band is a step lighter than the one inside it,
          so the hundreds digit reads as a height rather than as a ring. */}
      {TIERS.map((t, i) => (
        <g key={t.range}>
          <path
            d={tier(t.r)}
            fill="none"
            stroke="var(--ink)"
            strokeOpacity={t.tone}
            strokeWidth={t.w}
            strokeLinecap="butt"
          />
          <path
            d={tier(t.r)}
            fill="none"
            stroke={i === 3 ? "var(--cy)" : "var(--rule-soft)"}
            strokeWidth="1.3"
            opacity={i === 3 ? 0.5 : 1}
          />
          {/* A plate under the label, so the range stays legible against a
              band whose tone inverts between the two themes. */}
          <rect
            x={(at(t.labelAt, t.r)[0] - 35).toFixed(1)}
            y={(at(t.labelAt, t.r)[1] - 8.5).toFixed(1)}
            width="70"
            height="17"
            rx="3"
            fill="var(--paper)"
          />
          <text
            x={at(t.labelAt, t.r)[0].toFixed(1)}
            y={(at(t.labelAt, t.r)[1] + 4.5).toFixed(1)}
            textAnchor="middle"
            fill="var(--ink)"
            fontFamily="var(--font-data)"
            fontSize="13"
            fontWeight="700"
            letterSpacing="0.06em"
          >
            {t.range}
          </text>
        </g>
      ))}

      {/* The break, and the direction the numbers run through it. */}
      {[GAP_FROM, GAP_TO].map((b) => {
        const [x1, y1] = at(b, 52);
        const [x2, y2] = at(b, 155);
        return (
          <line
            key={b}
            x1={x1.toFixed(1)}
            y1={y1.toFixed(1)}
            x2={x2.toFixed(1)}
            y2={y2.toFixed(1)}
            stroke="var(--ju)"
            strokeWidth="1.3"
            strokeDasharray="4 5"
            opacity="0.8"
          />
        );
      })}
      <path
        d={`M ${at(56, 118)[0].toFixed(1)} ${at(56, 118)[1].toFixed(1)} A 118 118 0 0 1 ${at(85, 118)[0].toFixed(1)} ${at(85, 118)[1].toFixed(1)}`}
        fill="none"
        stroke="var(--ju)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <polygon points={arrowHead(88, 118, 10)} fill="var(--ju)" />

      {/* Gates. */}
      {GATES.map((g) => {
        const [x, y] = at(g.at, GATE_R);
        return (
          <g key={g.id}>
            <circle
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              r="13"
              fill="var(--paper)"
              stroke="var(--cy)"
              strokeWidth="1.6"
            />
            <text
              x={x.toFixed(1)}
              y={(y + 5).toFixed(1)}
              textAnchor="middle"
              fill="var(--cy)"
              fontFamily="var(--font-data)"
              fontSize="14"
              fontWeight="700"
            >
              {g.id}
            </text>
          </g>
        );
      })}

      {/* Ticket offices. */}
      {OFFICES.map((o) => {
        const [x, y] = at(o.at, GATE_R - 4);
        return (
          <g key={o.id}>
            <rect
              x={(x - 9).toFixed(1)}
              y={(y - 9).toFixed(1)}
              width="18"
              height="18"
              rx="4"
              fill="var(--paper)"
              stroke="var(--ju)"
              strokeWidth="1.5"
            />
            <text
              x={x.toFixed(1)}
              y={(y + 4.5).toFixed(1)}
              textAnchor="middle"
              fill="var(--ju)"
              fontFamily="var(--font-data)"
              fontSize="12"
              fontWeight="700"
            >
              {o.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
