import type { Work } from "../room/work";

export default function WorkCard({ w, n }: { w: Work; n: number }) {
  const href = "/work/" + w.slug;
  return (
    <li className={"card" + (w.kind === "sketch" ? " sketch" : "")}>
      <div className={"frame " + w.frame} aria-hidden="true">
        <div className="fr" dangerouslySetInnerHTML={{ __html: w.preview }} />
      </div>
      <p className="cmeta"><span className="n">{String(n).padStart(2, "0")}</span>{w.tag} · {w.kind === "sketch" ? "Sketch" : w.year}</p>
      <h3><a href={href}>{w.hook}<em>{w.hookEm}</em></a></h3>
      <p className="cline">{w.line}</p>
    </li>
  );
}
