import { WORK } from "../room/work";
import WorkCard from "./WorkCard";
import "./work.css";

export default function WorkSection() {
  const cases = WORK.filter((w) => w.kind !== "team");
  const featured = cases.filter((w) => w.featured).slice(0, 3);
  return (
    <section className="sec" id="work" aria-labelledby="h-work">
      <div className="shead">
        <div>
          <p className="label"><span className="n">01</span>Selected work</p>
          <h2 id="h-work">Proof, with the limits written down.</h2>
        </div>
        <div className="rownav" aria-label="Scroll the work">
          <button type="button" id="prev" aria-label="Previous">←</button>
          <button type="button" id="next" aria-label="Next">→</button>
        </div>
      </div>
      <ol className="cards" id="cards">
        {featured.map((w, i) => <WorkCard key={w.slug} w={w} n={i + 1} />)}
        <li className="card all">
          <a href="/work"><span className="k">All work · {WORK.length}</span><b>Every project, including team work.</b><span className="read">View all work<span aria-hidden="true"> →</span></span></a>
        </li>
      </ol>
    </section>
  );
}
