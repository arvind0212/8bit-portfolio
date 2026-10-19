/* building blocks shared by the long read and the short posts: numbered parts, technical drawers and the closing band */

export function Part({ n, title, hook, children }: { n: string; title: string; hook: string; children: React.ReactNode }) {
  return (
    <section className="part lr-part" aria-labelledby={"p" + n}>
      <h2 id={"p" + n}><span className="n">{n}</span>{title}</h2>
      <div className="pbody">
        <h3 className="hook">{hook}</h3>
        {children}
      </div>
    </section>
  );
}

export function Tech({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="tech">
      <summary><span>Technical detail</span>{title}</summary>
      <div>{children}</div>
    </details>
  );
}

type Act = { label: string; href: string; primary?: boolean };

export function ReadFoot({ title, line, acts, limits, related }: {
  title: string;
  line: string;
  acts: Act[];
  limits?: string[];
  related?: { label: string; title: string; href: string };
}) {
  return (
    <>
      <div className="lr-cta">
        <h2>{title}</h2>
        <p>{line}</p>
        <div className="lr-acts">
          {acts.map((a) => {
            const ext = a.href.startsWith("http");
            const tgt = ext ? { target: "_blank", rel: "noopener noreferrer" } : {};
            return a.primary
              ? <a key={a.href} className="btn" href={a.href} {...tgt}>{a.label}<span aria-hidden="true">{ext ? "↗" : "→"}</span></a>
              : <a key={a.href} className="read" href={a.href} {...tgt}>{a.label}<span aria-hidden="true">{ext ? " ↗" : " →"}</span></a>;
          })}
        </div>
      </div>
      {limits && <div className="lim"><h2>What this doesn&apos;t prove</h2><ul>{limits.map((l) => <li key={l}>{l}</li>)}</ul></div>}
      {related && <a className="nextcs" href={related.href}><span>{related.label}</span><b>{related.title}</b></a>}
    </>
  );
}
