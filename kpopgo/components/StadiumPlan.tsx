/**
 * Seoul World Cup Stadium, as a rule rather than as a chart.
 *
 * The venue publishes a seating graphic and, unlike Gocheok, publishes no
 * description of it: the Gocheok chart's own alt text states 시계방향 and
 * lists every block range, which is why that diagram can draw a direction.
 * This one cannot, and does not. What the operator does publish is its seat
 * finder, and the shape of that form is the system — it asks for a compass
 * direction and then a letter, so those are the two coordinates a seat has.
 *
 * That makes this building the easier of the two to teach, for one reason
 * worth drawing: at Gocheok the block number tells you nothing about where
 * you are until you know the rule, while here the first half of the name is
 * a compass bearing. A reader standing outside the west stand already knows
 * that W-something is the side they are looking at.
 *
 * Three facts, all read off the operator's own finder:
 *
 *   · four sides, named E / W / S / N
 *   · letters within a side, and the ranges differ — west runs furthest
 *   · I and O are never used, on any side
 *
 * The letter sets are the data and the drawing is derived from them, so a
 * side's range cannot drift from its label. Nothing here is traced; it is a
 * rectangle at this site's proportions, and the caption says schematic
 * because a reader who needs to know which letter sits beside which gate has
 * to open the venue's own chart.
 *
 * What it deliberately does not show: which way the letters run within a
 * side, where the stage goes, and which blocks are sold. The first is not in
 * the source, and the other two are the promoter's and set per show.
 */

/** Letters the venue uses on each side, from its own seat finder. */
const SIDES = [
  { key: "N", ko: "북", en: "North", last: "P", count: 14 },
  { key: "E", ko: "동", en: "East", last: "T", count: 18 },
  { key: "S", ko: "남", en: "South", last: "P", count: 14 },
  { key: "W", ko: "서", en: "West", last: "X", count: 22 },
] as const;

/**
 * A to the side's last letter, with I and O removed.
 *
 * Derived rather than listed, because the whole point of the drawing is that
 * the gaps are systematic: a list would let a side quietly keep an I.
 */
function letters(last: string): string[] {
  const out: string[] = [];
  for (let c = 65; c <= last.charCodeAt(0); c++) {
    const ch = String.fromCharCode(c);
    if (ch === "I" || ch === "O") continue;
    out.push(ch);
  }
  return out;
}

const W = 400;
const H = 300;
const PAD = 46;
const BAND = 30;

export function WorldCupBowl() {
  // Every side's range is computed, so the caption and the band agree.
  const sides = SIDES.map((s) => {
    const l = letters(s.last);
    return { ...s, letters: l, range: `A–${l[l.length - 1]}` };
  });
  const north = sides.find((s) => s.key === "N")!;
  const east = sides.find((s) => s.key === "E")!;
  const south = sides.find((s) => s.key === "S")!;
  const west = sides.find((s) => s.key === "W")!;

  const label = (s: (typeof sides)[number]) => `${s.key} · ${s.range}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="wcb-t wcb-d"
      style={{ width: "100%", height: "auto", maxWidth: 460 }}
    >
      <title id="wcb-t">Seoul World Cup Stadium, stands and block letters in plan</title>
      <desc id="wcb-d">
        The pitch sits in the middle and four stands surround it, named by compass
        direction. North and south run A to P, east runs A to T, and west runs A to
        X, which is the longest side. The letters I and O are not used anywhere in
        the building.
      </desc>
        {/* Outer bowl. */}
        <rect
          x={PAD - BAND}
          y={PAD - BAND}
          width={W - 2 * (PAD - BAND)}
          height={H - 2 * (PAD - BAND)}
          // Exactly PAD - (PAD - BAND), so the corner curve ends where the
          // east and west bands begin. At any larger radius their ends poke
          // outside the outline and the drawing reads as a mistake -- which
          // is only visible rendered, which is the whole lesson of the
          // Gocheok plan's four passes.
          rx={PAD - (PAD - BAND)}
          fill="none"
          stroke="var(--rule-soft)"
          strokeWidth={1}
        />

        {/* The four stands. West is drawn in the accent, because it is the
            side a reader is most likely to be on and the one that runs
            furthest — the only asymmetry in the building worth knowing. */}
        {[
          { s: north, x: PAD, y: PAD - BAND, w: W - 2 * PAD, h: BAND },
          { s: south, x: PAD, y: H - PAD, w: W - 2 * PAD, h: BAND },
          { s: west, x: PAD - BAND, y: PAD, w: BAND, h: H - 2 * PAD },
          { s: east, x: W - PAD, y: PAD, w: BAND, h: H - 2 * PAD },
        ].map(({ s, x, y, w, h }) => (
          <rect
            key={s.key}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={6}
            fill="var(--ink)"
            fillOpacity={0.06}
            stroke={s.key === "W" ? "var(--cy)" : "var(--rule-soft)"}
            strokeWidth={s.key === "W" ? 1.4 : 1}
          />
        ))}

        {/* The pitch. Named rather than coloured, because a concert covers
            part of it and the floor is the promoter's to lay out. */}
        <rect
          x={PAD + 10}
          y={PAD + 10}
          width={W - 2 * PAD - 20}
          height={H - 2 * PAD - 20}
          rx={8}
          fill="none"
          stroke="var(--rule-soft)"
          strokeDasharray="3 4"
        />
        <text
          x={W / 2}
          y={H / 2 - 4}
          textAnchor="middle"
          fill="var(--ink-46)"
          fontFamily="var(--font-data)"
          fontSize={11}
        >
          PITCH
        </text>
        <text
          x={W / 2}
          y={H / 2 + 12}
          textAnchor="middle"
          fill="var(--ink-46)"
          fontFamily="var(--font-data)"
          fontSize={9}
        >
          floor layout set per show
        </text>

        {/* Side labels, each on a plate of paper so the text stays legible
            whichever way the band's tone inverts between themes. */}
        {[
          { s: north, x: W / 2, y: PAD - BAND / 2 },
          { s: south, x: W / 2, y: H - PAD + BAND / 2 },
          { s: west, x: PAD - BAND / 2, y: H / 2 },
          { s: east, x: W - PAD + BAND / 2, y: H / 2 },
        ].map(({ s, x, y }) => {
          const t = label(s);
          const w = t.length * 7 + 14;
          // East and west are vertical stands, and a horizontal label on one
          // runs off the edge of the drawing -- which is only visible once it
          // is rendered, so it is worth saying here. Rotating the label onto
          // the band removes the overflow and reads the way a long stand does.
          const upright = s.key === "N" || s.key === "S";
          return (
            <g
              key={s.key}
              transform={upright ? undefined : `rotate(${s.key === "W" ? -90 : 90} ${x} ${y})`}
            >
              <rect
                x={x - w / 2}
                y={y - 9}
                width={w}
                height={18}
                rx={4}
                fill="var(--paper)"
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="var(--ink)"
                fontFamily="var(--font-data)"
                fontSize={11}
              >
                {t}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
