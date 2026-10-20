import { WORK, type Work } from "../room/work";
import Shell from "./Shell";
import LayerStrip from "./LayerStrip";
import Figure from "./Figure";
import DotChart from "./DotChart";

const val = (v: string) =>
  v.split(/\{\{(.+?)\}\}/).map((t, i) => (i % 2 ? <span key={i} className="ph" title="To confirm">[{t}]</span> : t));

function Part({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="part" aria-labelledby={"p" + n}>
      <h2 id={"p" + n}><span className="n">{n}</span>{title}</h2>
      <div className="pbody">{children}</div>
    </section>
  );
}

export default function CaseStudy({ w }: { w: Work }) {
  const c = w.case!;
  const cases = WORK.filter((x) => x.kind !== "team");
  const next = cases[(cases.indexOf(w) + 1) % cases.length];
  let n = 0;
  const num = () => String(++n).padStart(2, "0");
  return (
    <Shell>
      <article className="cs" aria-labelledby="cs-h">
        <p className="crumb"><a href="/work">← All work</a></p>
        <p className="label"><span className="n">{w.tag}</span>· {w.year}{w.kind === "sketch" && <span className="badge">Sketch</span>}</p>
        <h1 id="cs-h">{w.hook}<em>{w.hookEm}</em></h1>
        <p className="dek">{c.dek}</p>

        <div className="tldr">
          <p className="tl"><span>The outcome</span></p>
          <p className="tt">{c.tldr}</p>
          {c.stats.length > 0 && (
            <ul className="stats">
              {c.stats.map((s) => <li key={s.v + s.l}><b>{s.v}</b><span>{s.l}</span></li>)}
            </ul>
          )}
        </div>
        {w.kind === "sketch" && <p className="sketchnote">{c.sketchNote}</p>}

        <dl className="glance">
          <div><dt>Role</dt><dd>{val(c.role)}</dd></div>
          <div><dt>When</dt><dd>{val(c.when)}</dd></div>
          <div><dt>With</dt><dd>{val(c.team)}</dd></div>
          <div><dt>Proves</dt><dd>{w.pillar}</dd></div>
        </dl>
        <div className="owned"><p>Layers I owned</p><LayerStrip owned={w.owned} size="lg" /></div>

        <Part n={num()} title="Why I built it"><p>{c.why}</p></Part>

        <Part n={num()} title="How I did it">
          <p>{c.how}</p>
          <Figure flow={c.flow} caption={c.flowCaption} />
          {c.notes.map((t) => <p className="obs" key={t}><span>Observation</span>{t}</p>)}
          {c.chart && <DotChart c={c.chart} />}
        </Part>

        {c.hard.length > 0 && (
          <Part n={num()} title="What got hard">
            <ol className="pairs">{c.hard.map((h) => <li key={h.issue}><p>{h.issue}</p><p><b>So I</b> {h.fix.charAt(0).toLowerCase() + h.fix.slice(1)}</p></li>)}</ol>
          </Part>
        )}

        <Part n={num()} title="What I didn't choose">
          <ol className="pairs alt">{c.alternatives.map((a) => <li key={a.option}><p><b>{a.option}</b></p><p>{a.why}</p></li>)}</ol>
        </Part>

        <Part n={num()} title={c.tryIt ? "Shipping it, and running it yourself" : "Shipping it"}>
          <p>{c.ship}</p>
          {c.tryIt && (
            <div className="try">
              <p className="tl"><span>Run it yourself</span></p>
              <p><a className="read" href={c.tryIt.repo} target="_blank" rel="noopener noreferrer">{c.tryIt.repo.replace("https://", "")}<span aria-hidden="true"> ↗</span></a></p>
              {c.tryIt.steps.length > 0
                ? <pre><code>{c.tryIt.steps.join("\n")}</code></pre>
                : <p className="small">Setup steps are in the repository&apos;s README.</p>}
            </div>
          )}
          {c.links.length > 0 && <p className="more">{c.links.map((l) => <a key={l.href} className="read" href={l.href}>{l.label}<span aria-hidden="true"> →</span></a>)}</p>}
        </Part>

        <div className="lim"><h2>What this doesn&apos;t prove</h2><ul>{c.limits.map((l) => <li key={l}>{l}</li>)}</ul></div>
        <ul className="stack" aria-label="Stack">{c.stack.map((s) => <li key={s}>{s}</li>)}</ul>

        <a className="nextcs" href={"/work/" + next.slug}><span>Next case</span><b>{next.hook}<em>{next.hookEm}</em></b></a>
      </article>
    </Shell>
  );
}
