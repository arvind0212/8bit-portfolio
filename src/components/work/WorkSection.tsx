import { WORK } from "../room/work";
import WorkTile from "./WorkTile";
import "./work.css";

const SPANS = [7, 5, 6];

export default function WorkSection() {
  const featured = WORK.filter((w) => w.kind !== "team" && w.featured).slice(0, 3);
  return (
    <section className="sec" id="work" aria-labelledby="h-work">
      <div className="shead">
        <div>
          <h2 id="h-work">What I&apos;ve built and measured.</h2>
        </div>
      </div>
      <ol className="bento" id="cards">
        {featured.map((w, i) => <WorkTile key={w.slug} w={w} span={SPANS[i] ?? 6} />)}
        <li className="tile w6 all">
          <p className="label">All work · {WORK.length}</p>
          <ul>
            {WORK.map((w) => <li key={w.slug}>{w.hook}{w.hookEm}{w.kind === "team" && <em>team result</em>}</li>)}
          </ul>
          <a className="read" href="/work">See everything<span aria-hidden="true"> →</span></a>
        </li>
      </ol>
    </section>
  );
}
