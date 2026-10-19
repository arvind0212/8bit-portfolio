import type { ReactElement } from "react";

type Pt = [number, number];
type Step = "Listen" | "Plan" | "Build" | "Prove" | "Learn";
type Label = [number, number, "start" | "middle" | "end"];

const TAU = Math.PI * 2;
const AGENT: Step[] = ["Build", "Prove"];
const STEPS: [Step, number][] = [["Prove", 0.1], ["Learn", 0.375], ["Listen", 0.5], ["Plan", 0.625], ["Build", 0.9]];

const ICON: Record<Step, ReactElement> = {
  Listen: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
  Plan: <><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
  Build: <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />,
  Prove: <path d="M5 12.5l4.5 4.5L19 7" />,
  Learn: <path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.8 10.6c.6.6.8 1.3.8 2.4h6c0-1.1.2-1.8.8-2.4A6 6 0 0 0 12 3z" />,
};

/* lemniscate: t 0..1, right lobe first, crossing the centre at t=.25 and t=.75 */
const lem = (t: number, a: number, k: number): Pt => {
  const s = t * TAU, d = 1 + Math.sin(s) ** 2;
  return [(a * Math.cos(s)) / d, (k * a * Math.sin(s) * Math.cos(s)) / d];
};
const path = (p: Pt[]) => "M" + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const toward = (a: Pt, b: Pt, r: number): Pt => {
  const d = dist(a, b);
  return [a[0] + ((b[0] - a[0]) / d) * r, a[1] + ((b[1] - a[1]) / d) * r];
};

type Layout = {
  id: string; W: number; H: number; R: number; cx: number; cy: number;
  f: (t: number) => Pt; agent: (p: Pt) => boolean; zone: ReactElement;
  notYet: { c: Pt; at: Pt; anchor: "start" | "middle" };
  brief: [number, number, string, "start" | "middle" | "end"][];
  labels: Record<Step, Label>;
};

const wide = (): Layout => {
  const W = 690, H = 470, a = 250, k = 1.5, cx = 345, cy = 215, R = 32;
  return {
    id: "hw", W, H, R, cx, cy,
    f: (t) => { const [x, y] = lem(t, a, k); return [cx + x, cy + y]; },
    agent: ([x]) => x > cx,
    zone: <>
      <rect className="zone" x={cx} y="8" width={W - cx - 8} height={H - 16} rx="18" />
      <text className="zl p" x="22" y={H - 48}>PEOPLE</text>
      <text className="zl a" x={W - 22} y={H - 48} textAnchor="end">AGENTS</text>
      <text className="zs" x={W - 22} y={H - 29} textAnchor="end">or a person, same checks</text>
    </>,
    notYet: { c: [cx + a * 0.36, cy], at: [cx + a * 0.48 + 10, cy + 5], anchor: "start" },
    brief: [[cx, cy + 74, "brief", "middle"], [cx, cy - 62, "passed", "middle"]],
    labels: { Prove: [0, R + 32, "middle"], Build: [0, -R - 14, "middle"], Learn: [0, -R - 14, "middle"], Plan: [0, R + 32, "middle"], Listen: [-R - 12, 8, "end"] },
  };
};

const tall = (): Layout => {
  const W = 400, H = 780, a = 300, k = 1.35, cx = 200, cy = 380, R = 36;
  return {
    id: "hp", W, H, R, cx, cy,
    f: (t) => { const [x, y] = lem(t, a, k); return [cx - y, cy + x]; },
    agent: ([, y]) => y > cy,
    zone: <>
      <rect className="zone" x="8" y={cy} width={W - 16} height={H - cy - 4} rx="18" />
      <text className="zl p" x="16" y="34">PEOPLE</text>
      <text className="zl a" x="16" y={H - 46}>AGENTS</text>
      <text className="zs" x="16" y={H - 22}>or a person, same checks</text>
    </>,
    notYet: { c: [cx, cy + a * 0.3], at: [cx, cy + a * 0.3 + 12], anchor: "middle" },
    brief: [[cx + 44, cy - 10, "brief ↓", "start"], [cx - 44, cy + 26, "passed ↑", "end"]],
    labels: { Prove: [R + 10, 10, "start"], Build: [-R - 10, 10, "end"], Learn: [-R - 10, 10, "end"], Plan: [R + 10, 10, "start"], Listen: [0, -R - 16, "middle"] },
  };
};

function Figure({ L, className }: { L: Layout; className: string }) {
  const { id, f, R, agent } = L;
  const at = Object.fromEntries(STEPS.map(([s, t]) => [s, f(t)])) as Record<Step, Pt>;
  const lines: ReactElement[] = [];
  STEPS.forEach(([from, t0], i) => {
    const [to, t1raw] = STEPS[(i + 1) % STEPS.length];
    const t1 = t1raw <= t0 ? t1raw + 1 : t1raw;
    const a = at[from], b = at[to];
    const seg = Array.from({ length: 201 }, (_, j) => f((t0 + ((t1 - t0) * j) / 200) % 1))
      .filter((p) => dist(p, a) > R + 3 && dist(p, b) > R + 7);
    const runs: [Pt[], boolean][] = [];
    let cur: Pt[] = [seg[0]], z = agent(seg[0]);
    for (const p of seg.slice(1)) {
      if (agent(p) !== z) { runs.push([[...cur, p], z]); cur = [p]; z = agent(p); }
      else cur.push(p);
    }
    runs.push([cur, z]);
    runs.forEach(([r, ag], j) => lines.push(
      <path key={`${from}${j}`} className={ag ? "ln a" : "ln p"} d={path(r)} markerEnd={j === runs.length - 1 ? `url(#${id}${ag ? "a" : "p"})` : undefined} />,
    ));
  });
  const loop = path(Array.from({ length: 720 }, (_, i) => f(i / 720))) + "Z";
  const s = toward(at.Prove, L.notYet.c, R + 3), e = toward(at.Build, L.notYet.c, R + 7);
  return (
    <svg className={className} viewBox={`0 0 ${L.W} ${L.H}`} role="img" aria-label="One continuous loop in two halves. People: Listen, Plan, Learn. Agents, or a person held to the same checks: Build and Prove, repeating until it passes. The brief crosses to the agents and passed work crosses back.">
      <defs>
        <marker id={`${id}p`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path className="ah p" d="M0 0L10 5L0 10z" /></marker>
        <marker id={`${id}a`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path className="ah a" d="M0 0L10 5L0 10z" /></marker>
      </defs>
      {L.zone}
      {lines}
      <path className="ny" d={`M${s[0].toFixed(1)} ${s[1].toFixed(1)}Q${L.notYet.c[0].toFixed(1)} ${L.notYet.c[1].toFixed(1)} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`} markerEnd={`url(#${id}a)`} />
      <text className="sm" x={L.notYet.at[0]} y={L.notYet.at[1]} textAnchor={L.notYet.anchor}>not yet</text>
      {L.brief.map(([x, y, t, anc]) => <text key={t} className="sm" x={x} y={y} textAnchor={anc}>{t}</text>)}
      <g className="mv">
        <circle className="halo" r="11"><animateMotion dur="16s" repeatCount="indefinite" path={loop} /></circle>
        <circle className="dot" r="4.5"><animateMotion dur="16s" repeatCount="indefinite" path={loop} /></circle>
      </g>
      {STEPS.map(([step]) => {
        const [x, y] = at[step], ag = AGENT.includes(step), sc = (R / 26) * 0.95;
        const [dx, dy, anc] = L.labels[step];
        return (
          <g key={step}>
            <circle className={ag ? "node a" : "node p"} cx={x} cy={y} r={R} />
            <g className={ag ? "ic a" : "ic p"} transform={`translate(${(x - 12 * sc).toFixed(1)} ${(y - 12 * sc).toFixed(1)}) scale(${sc.toFixed(3)})`}>{ICON[step]}</g>
            <text className="nm" x={x + dx} y={y + dy} textAnchor={anc}>{step}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* how I work: one loop, the people half sets intent and judges, the agent half builds and proves */
export default function HowLoop() {
  return (
    <div className="howloop">
      <Figure L={wide()} className="hl-wide" />
      <Figure L={tall()} className="hl-tall" />
    </div>
  );
}
