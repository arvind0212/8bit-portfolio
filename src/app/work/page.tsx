import type { Metadata } from "next";
import Shell from "@/components/work/Shell";
import WorkCard from "@/components/work/WorkCard";
import { WORK } from "@/components/room/work";

export const metadata: Metadata = {
  title: "All work | Arvind Guruprasad",
  description: "Everything Arvind Guruprasad has built or led, with the limits written down.",
};

export default function WorkIndex() {
  const cases = WORK.filter((w) => w.kind !== "team");
  const team = WORK.filter((w) => w.kind === "team");
  return (
    <Shell>
      <section className="cs" aria-labelledby="h-all">
        <p className="crumb"><a href="/">← Home</a></p>
        <p className="label">All work · {WORK.length}</p>
        <h1 id="h-all">Everything, with the limits <em>written down.</em></h1>
        <p className="dek">Case studies I can show in full, each starting with the outcome. Team results follow below.</p>
        <ol className="cards wgrid">
          {cases.map((w, i) => <WorkCard key={w.slug} w={w} n={i + 1} />)}
        </ol>
        {team.length > 0 && (
          <div className="wsub">
            <h2 className="label">Team work</h2>
            <p className="intro">Results that belong to a team. My part is named in each line.</p>
            <ol className="trows">
              {team.map((w) => (
                <li key={w.slug} id={w.slug}>
                  <h3>{w.hook}<em>{w.hookEm}</em></h3>
                  <p className="cmeta">{w.tag} · {w.year}</p>
                  <p>{w.line}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </Shell>
  );
}
