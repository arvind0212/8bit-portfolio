import FeatPost from "./FeatPost";
import PostCard from "./PostCard";
import { NOTES, NOTES_NEXT, POSTS } from "./writing";
import "./site.css";

export default function WritingSection() {
  const long = POSTS.find((p) => p.long)!;
  return (
    <section className="sec" id="writing" aria-labelledby="h-writing">
      <div className="wr-head">
        <div>
          <h2 id="h-writing">Notes from building.</h2>
        </div>
        <a className="read wr-all" href="/writing">All writing<span aria-hidden="true"> →</span></a>
      </div>
      {NOTES.length > 0
        ? <ol className="wcards">{[long, NOTES[0]].map((p) => <PostCard key={p.slug} p={p} />)}</ol>
        : <><FeatPost p={long} h="h3" /><p className="wr-next">{NOTES_NEXT}</p></>}
      <a className="read wr-mob" href="/writing">All writing<span aria-hidden="true"> →</span></a>
    </section>
  );
}
