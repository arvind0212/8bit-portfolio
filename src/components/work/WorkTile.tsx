import type { Work } from "../room/work";

function MiniChart({ w }: { w: Work }) {
  const c = w.case?.chart;
  if (!c) return null;
  const x = (v: number) => ((v - c.min) / (c.max - c.min)) * 100 + "%";
  const ticks = Array.from({ length: c.max - c.min + 1 }, (_, i) => c.min + i);
  return (
    <>
      <p className="leg"><span>{c.series[0]}</span><span className="o">{c.series[1]}</span></p>
      <div className="sdots">
        {c.rows.map((r) => {
          const [a, b] = r.values;
          return (
            <div className="sdr" key={r.label}>
              <span>{r.short}</span>
              <div className="sdt">
                <s style={{ left: x(Math.min(a, b)), width: `calc(${x(Math.max(a, b))} - ${x(Math.min(a, b))})` }} />
                <u className="o" style={{ left: x(b) }} />
                <u style={{ left: x(a) }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="sax"><span /><div>{ticks.map((t) => <span key={t}>{t}%</span>)}</div></div>
    </>
  );
}

export default function WorkTile({ w, span }: { w: Work; span: number }) {
  const s = w.screen;
  const href = "/work/" + w.slug;
  return (
    <li className={`tile w${span} t-${s.tone}` + (w.enter ? " enter-" + w.enter : "")}>
      <div className="thead">
        <p className="trole">{w.tag} · {w.year}</p>
        <h3><a href={href}>{w.hook}{w.hookEm && <span className="hk2">{w.hookEm}</span>}</a></h3>
        <p className="out"><b>{w.outcome.v}</b><span>{w.outcome.l}</span></p>
      </div>
      <div className="shot" aria-hidden="true">
        <div className="scr">
          <p className="sbar"><i /><i /><i /><em>{s.file}</em><span>{s.flag}</span></p>
          {s.kind === "chart"
            ? <div className="sb chart"><MiniChart w={w} /></div>
            : <div className={"sb " + s.kind} dangerouslySetInnerHTML={{ __html: s.html ?? "" }} />}
        </div>
      </div>
      <span className="go" aria-hidden="true">→</span>
    </li>
  );
}
