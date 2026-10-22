/**
 * The venue plan.
 *
 * This is a diagram of a *rule*, not a copy of a seating chart. The venue
 * publishes its own chart as a single flat JPEG with 123 block numbers on it,
 * which is the right artefact for somebody who already knows how the building
 * is organised and useless to somebody standing outside it who does not. What
 * a reader actually needs is four facts — the hundreds digit is the level, the
 * other two digits run one way round, the loop has exactly one break, and the
 * gate letters run the same way as the numbers — and those four fit in a
 * drawing that stays legible at 360px.
 *
 * So nothing here is traced. The geometry is computed from bearings read off
 * the published chart and redrawn at this site's own proportions, which is
 * also why the caption says schematic: a reader who needs to know whether
 * block 417 or 418 is the one beside gate D must open the venue's chart, and
 * the guide says so.
 *
 * The first version drew four concentric circles with one shared gap, and
 * that was not merely a duller picture — it was a false one. Measured off the
 * chart, the break is 44° at the 100 level, 71° at the 200, 91° at the 300 and
 * 96° at the 400, because the upper decks stop short of that corner while the
 * lowest ring very nearly closes around it. Drawing the four real openings is
 * what makes the shape a horseshoe rather than a target, so the honest version
 * and the legible one turned out to be the same drawing.
 *
 * It is drawn entirely in theme tokens for the same reason the band's
 * hairlines were moved out of inline styles: a value that has to change with
 * the theme cannot live in a hard-coded hex.
 */

const CX = 200;
const CY = 214;

/**
 * A point at `bearing` degrees clockwise from the top of the plan, on an
 * ellipse of the given half-axes. Everything is laid out on ellipses rather than
 * circles because the footprint is not round: the chart's bowl is appreciably
 * taller than it is wide, and a circle reads as a target.
 */
function on(bearing: number, rx: number, ry: number): readonly [number, number] {
  const a = ((bearing - 90) * Math.PI) / 180;
  return [CX + rx * Math.cos(a), CY + ry * Math.sin(a)] as const;
}

/**
 * The four levels, each with the two bearings its seating actually runs
 * between — `from` is where that level's 01 block sits, `to` is where its
 * highest-numbered block ends. Both are read off the published chart.
 */
const TIERS = [
  { rx: 70, ry: 84, band: 19, from: 94, to: 50, range: "101–132", tone: 0.1, labelAt: 166 },
  { rx: 92, ry: 108, band: 19, from: 108, to: 37, range: "201–222", tone: 0.16, labelAt: 176 },
  { rx: 114, ry: 132, band: 19, from: 117, to: 26, range: "301–334", tone: 0.22, labelAt: 184 },
  { rx: 138, ry: 158, band: 22, from: 121, to: 25, range: "401–435", tone: 0.3, labelAt: 192 },
];

const FIELD = { rx: 50, ry: 62 };
const GATE = { rx: 162, ry: 186 };

/**
 * Clockwise from `from` round to `to`, sampled rather than drawn with an arc
 * command: the radius differs on the two axes, and a single `A` cannot carry
 * four different openings on four different ellipses.
 */
function sweep(from: number, to: number, rx: number, ry: number) {
  const end = to > from ? to : to + 360;
  const pts: string[] = [];
  for (let b = from; b < end; b += 2) {
    const [x, y] = on(b, rx, ry);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const [x, y] = on(end, rx, ry);
  pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  return `M ${pts.join(" L ")}`;
}

/**
 * A line through one end of every level, which is the edge of the opening.
 *
 * Smoothed rather than joined with straight segments. The four levels end at
 * four different bearings — that is the whole point of the line — so a
 * polyline through them steps, and a stepped red dash beside a band end reads
 * as a rendering fault rather than as the shape of the building.
 */
function edge(pick: (t: (typeof TIERS)[number]) => number) {
  const pts: (readonly [number, number])[] = [
    on(pick(TIERS[0]), FIELD.rx, FIELD.ry),
    ...TIERS.map((t) => on(pick(t), t.rx, t.ry)),
  ];
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function arrowHead(bearing: number, rx: number, ry: number, size: number) {
  const [tx, ty] = on(bearing, rx, ry);
  const a = ((bearing - 90) * Math.PI) / 180;
  // Tangent to the ellipse in the clockwise direction, normalised.
  let dx = -rx * Math.sin(a);
  let dy = ry * Math.cos(a);
  const len = Math.hypot(dx, dy);
  dx /= len;
  dy /= len;
  const bx = tx - dx * size;
  const by = ty - dy * size;
  const w = size * 0.52;
  return [
    `${tx.toFixed(1)},${ty.toFixed(1)}`,
    `${(bx - dy * w).toFixed(1)},${(by + dx * w).toFixed(1)}`,
    `${(bx + dy * w).toFixed(1)},${(by - dx * w).toFixed(1)}`,
  ].join(" ");
}

/**
 * Gate letters run clockwise in the same direction the block numbers do, which
 * is the fact that makes the building navigable without a compass. Bearings
 * are read off the chart; A sits by the low 400s, C at the bottom centre, G is
 * the last gate before the opening.
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
      viewBox="0 0 400 440"
      role="img"
      aria-labelledby="bowl-t bowl-d"
      style={{ width: "100%", height: "auto", maxWidth: 420 }}
    >
      <title id="bowl-t">Gocheok Sky Dome, seating levels and gates in plan</title>
      <desc id="bowl-d">
        Four seating levels around a central floor, numbered 101 to 132, 201 to 222,
        301 to 334 and 401 to 435 from the inside out. The seating is a horseshoe
        rather than a ring: every level is open on the right of the plan, and the
        opening widens with height, from about 44 degrees at the lowest level to
        about 96 at the highest. The numbering restarts across that opening. Seven
        gates lettered A to G sit outside the top level and run clockwise in the same
        direction as the block numbers: A, B, C, D and E along the bottom, F and G
        along the top. Ticket offices marked 2, 3 and 4 sit beside gates E, F and G.
      </desc>

      {/* The floor. It carries no permanent numbers, which is the point. */}
      <ellipse
        cx={CX}
        cy={CY}
        rx={FIELD.rx}
        ry={FIELD.ry}
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
      {TIERS.map((t, i) => {
        const [lx, ly] = on(t.labelAt, t.rx, t.ry);
        return (
          <g key={t.range}>
            <path
              d={sweep(t.from, t.to, t.rx, t.ry)}
              fill="none"
              stroke="var(--ink)"
              strokeOpacity={t.tone}
              strokeWidth={t.band}
              strokeLinecap="butt"
            />
            <path
              d={sweep(t.from, t.to, t.rx, t.ry)}
              fill="none"
              stroke={i === 3 ? "var(--cy)" : "var(--rule-soft)"}
              strokeWidth="1.3"
              opacity={i === 3 ? 0.5 : 1}
            />
            {/* A plate under the label, so the range stays legible against a
                band whose tone inverts between the two themes. `labelAt` fans
                the four apart: set to one bearing they stack into a block that
                reads as a list standing in front of the drawing, worst at
                phone width. */}
            <rect
              x={(lx - 35).toFixed(1)}
              y={(ly - 8.5).toFixed(1)}
              width="70"
              height="17"
              rx="3"
              fill="var(--paper)"
            />
            <text
              x={lx.toFixed(1)}
              y={(ly + 4.5).toFixed(1)}
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
        );
      })}

      {/* The two edges of the opening, and the direction the numbers run
          through it. Each edge threads one end of all four levels, so the
          fan is the widening break rather than a decorative wedge. */}
      <path
        d={edge((t) => t.from)}
        fill="none"
        stroke="var(--ju)"
        strokeWidth="1.3"
        strokeDasharray="4 5"
        opacity="0.8"
      />
      <path
        d={edge((t) => t.to)}
        fill="none"
        stroke="var(--ju)"
        strokeWidth="1.3"
        strokeDasharray="4 5"
        opacity="0.8"
      />
      {/* Direction marks sit on the seating, not in the opening.
          An arrow drawn across the break points the one way a reader cannot
          walk: clockwise through that wedge is the jump from 132 back to 101,
          which is the single place the rule does not apply. On the band it
          says what it means — this is the way the numbers rise — and the left
          flank is the one long stretch of perimeter with no gate on it. */}
      {[258, 272, 286].map((b) => (
        <polygon
          key={b}
          points={arrowHead(b, TIERS[3].rx, TIERS[3].ry, 9)}
          fill="var(--ju)"
        />
      ))}

      {/* Gates. */}
      {GATES.map((g) => {
        const [x, y] = on(g.at, GATE.rx, GATE.ry);
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
        const [x, y] = on(o.at, GATE.rx - 4, GATE.ry - 4);
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
