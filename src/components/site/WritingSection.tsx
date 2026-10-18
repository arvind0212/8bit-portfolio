import PostRow from "./PostRow";
import { DRAFTS, PUBLISHED } from "./writing";
import "./site.css";

export default function WritingSection() {
  return (
    <section className="sec" id="writing" aria-labelledby="h-writing">
      <div className="wr-head">
        <div>
          <p className="label"><span className="n">04</span>Writing</p>
          <h2 id="h-writing">Notes from building.</h2>
        </div>
        <a className="read wr-all" href="/writing">All writing<span aria-hidden="true"> →</span></a>
      </div>
      <ol className="wr-list">
        {[...PUBLISHED.slice(0, 2), DRAFTS[0]].map((p) => <PostRow key={p.slug} p={p} />)}
      </ol>
      <a className="read wr-mob" href="/writing">All writing<span aria-hidden="true"> →</span></a>
    </section>
  );
}
