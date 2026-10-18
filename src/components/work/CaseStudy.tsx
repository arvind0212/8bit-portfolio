import { WORK, type Work } from "../room/work";
import Shell from "./Shell";
import LayerStrip from "./LayerStrip";
import Figure from "./Figure";

const val = (v: string) =>
  v.split(/\{\{(.+?)\}\}/).map((t, i) => (i % 2 ? <span key={i} className="ph" title="To confirm">[{t}]</span> : t));

export default function CaseStudy({ w }: { w: Work }) {
  const c = w.case!;
  const cases = WORK.filter((x) => x.kind !== "team");
  const next = cases[(cases.indexOf(w) + 1) % cases.length];
  return (
    <Shell>
      <article className="cs" aria-labelledby="cs-h">
        <p className="crumb"><a href="/work">← All work</a><a href="/">Home</a></p>
        <p className="label"><span className="n">{w.tag}</span>· {w.year}{w.kind === "sketch" && <span className="badge">Sketch</span>}</p>
        <h1 id="cs-h">{w.hook}<em>{w.hookEm}</em></h1>
        <p className="dek">{c.dek}</p>

        <dl className="glance">
          <div><dt>Role</dt><dd>{val(c.role)}</dd></div>
          <div><dt>When</dt><dd>{val(c.when)}</dd></div>
          <div><dt>With</dt><dd>{val(c.team)}</dd></div>
          <div><dt>Proves</dt><dd>{w.pillar}</dd></div>
        </dl>
        <div className="owned"><p>Layers I owned</p><LayerStrip owned={w.owned} size="lg" /></div>

        {c.stats.length > 0 && (
          <ul className="stats">
            {c.stats.map((s) => <li key={s.v + s.l}><b>{s.v}</b><span>{s.l}</span></li>)}
          </ul>
        )}

        {w.kind === "sketch" && <p className="sketchnote">{c.sketchNote}</p>}

        <Figure flow={c.flow} caption={c.flowCaption} />

        <ol className="pdo">
          <li><h2><span className="n">01</span>Problem</h2><p>{c.problem}</p></li>
          <li><h2><span className="n">02</span>Decision</h2><p>{c.decision}</p></li>
          <li><h2><span className="n">03</span>Outcome</h2><p>{c.outcome}</p></li>
        </ol>

        <div className="side">
          <div className="not"><h2>What I chose not to do</h2><p>{c.notDone}</p></div>
          <div className="lim"><h2>What this doesn&apos;t prove</h2><ul>{c.limits.map((l) => <li key={l}>{l}</li>)}</ul></div>
        </div>

        <ul className="stack" aria-label="Stack">{c.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        {c.links.length > 0 && (
          <p className="more">{c.links.map((l) => <a key={l.href} className="read" href={l.href}>{l.label}<span aria-hidden="true"> →</span></a>)}</p>
        )}

        <a className="nextcs" href={"/work/" + next.slug}><span>Next case</span><b>{next.hook}<em>{next.hookEm}</em></b></a>
      </article>
    </Shell>
  );
}
