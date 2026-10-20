import type { Chart } from "../room/work";

/* dot plot: one row per agent, two marks per row; shape as well as colour tells the series apart */
export default function DotChart({ c }: { c: Chart }) {
  const x = (v: number) => ((v - c.min) / (c.max - c.min)) * 100;
  const ticks = Array.from({ length: c.max - c.min + 1 }, (_, i) => c.min + i);
  return (
    <figure className="dots">
      <figcaption className="dhead">
        <b>{c.title}</b>
        <span className="dkey">
          <span><i className="m0" />{c.series[0]}</span>
          <span><i className="m1" />{c.series[1]}</span>
        </span>
      </figcaption>
      <div className="dplot" role="img" aria-label={c.title + ": " + c.rows.map((r) => `${r.label}, ${c.series[0]} ${r.values[0]}%, ${c.series[1]} ${r.values[1]}%`).join("; ")}>
        {c.rows.map((r, ri) => (
          <div className="drow" key={r.label}>
            <span className="dl">{r.label}</span>
            <span className="dt">
              {ticks.map((t) => <i key={t} className="grid" style={{ left: x(t) + "%" }} />)}
              <i className="span" style={{ left: x(Math.min(...r.values)) + "%", width: Math.abs(x(r.values[0]) - x(r.values[1])) + "%" }} />
              {r.values.map((v, i) => (
                <span key={i} className={"mk m" + i} style={{ left: x(v) + "%" }} tabIndex={0} aria-label={`${c.series[i]}: ${v}%`}>
                  <span className="tip">{c.series[i]} · {v}%</span>
                  {ri === c.rows.length - 1 && i === 0 && <span className="dv">{v}%</span>}
                </span>
              ))}
            </span>
          </div>
        ))}
        <div className="drow axis">
          <span className="dl">{c.unit}</span>
          <span className="dt">{ticks.map((t) => <span key={t} className="tk" style={{ left: x(t) + "%" }}>{t}</span>)}</span>
        </div>
      </div>
      <p className="dcap">{c.caption}</p>
      <details className="dtable">
        <summary>See the numbers</summary>
        <table>
          <thead><tr><th>Agent</th><th>{c.series[0]}</th><th>{c.series[1]}</th></tr></thead>
          <tbody>{c.rows.map((r) => <tr key={r.label}><td>{r.label}</td><td>{r.values[0]}%</td><td>{r.values[1]}%</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}
