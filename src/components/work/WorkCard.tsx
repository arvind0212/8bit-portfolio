import type { Work } from "../room/work";
import LayerStrip from "./LayerStrip";

export default function WorkCard({ w, n }: { w: Work; n: number }) {
  const href = "/work/" + w.slug;
  return (
    <li className={"card" + (w.kind === "sketch" ? " sketch" : "")}>
      <a className="cv" href={href} tabIndex={-1} aria-hidden="true">
        <div className={"frame " + w.frame}>
          <div className="fr" dangerouslySetInnerHTML={{ __html: w.preview }} />
        </div>
      </a>
      <div className="ct">
        <p className="cmeta"><span className="n">{String(n).padStart(2, "0")}</span>{w.tag}{w.kind === "sketch" && <span className="badge">Sketch</span>}<span className="yr">{w.year}</span></p>
        <h3><a href={href}>{w.hook}<em>{w.hookEm}</em></a></h3>
        <p className="cline">{w.line}</p>
        <div className="cfoot">
          <LayerStrip owned={w.owned} />
          <a className="read" href={href} aria-label={"Read: " + w.hook + w.hookEm}>{w.kind === "sketch" ? "See the sketch" : "Read the case"}<span aria-hidden="true"> →</span></a>
        </div>
      </div>
    </li>
  );
}
