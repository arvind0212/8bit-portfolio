import { WORK } from "../room/work";
import WorkCard from "./WorkCard";
import "./work.css";

export default function WorkSection() {
  const cases = WORK.filter((w) => w.kind !== "team");
  const featured = cases.filter((w) => w.featured).slice(0, 3);
  return (
    <section className="sec" id="work" aria-labelledby="h-work">
      <p className="label"><span className="n">01</span>Selected work</p>
      <h2 id="h-work">Proof, with the limits written down.</h2>
      <ol className="cards" id="cards">
        {featured.map((w, i) => <WorkCard key={w.slug} w={w} n={i + 1} />)}
        <li className="more">
          <p className="cmeta">All work · {WORK.length}</p>
          <a className="read" href="/work">Every case, plus team results<span aria-hidden="true"> →</span></a>
        </li>
      </ol>
    </section>
  );
}
