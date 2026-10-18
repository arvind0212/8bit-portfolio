import type { Metadata } from "next";
import SubPage from "@/components/room/SubPage";
import { WORK } from "@/components/room/work";

export const metadata: Metadata = {
  title: "All work | Arvind Guruprasad",
  description: "Everything Arvind Guruprasad has built or led, with the limits written down.",
};

export default function WorkIndex() {
  return (
    <SubPage label="All work" title="Everything, with the limits written down.">
      <ol className="worklist">
        {WORK.map((w, i) => (
          <li key={w.slug} id={w.slug}>
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="cmeta">{w.tag} · {w.year}</p>
              <h3>{w.hook}<em>{w.hookEm}</em></h3>
              <p className="wsum">{w.summary}</p>
              {w.slug === "thesis" && <a className="read" href={w.href}>{w.cta}<span aria-hidden="true"> →</span></a>}
            </div>
          </li>
        ))}
      </ol>
    </SubPage>
  );
}
