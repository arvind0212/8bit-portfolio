import { WORK } from "../room/work";
import WorkTile from "./WorkTile";
import "./work.css";

const SPANS = [7, 5, 12];

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
      </ol>
    </section>
  );
}
