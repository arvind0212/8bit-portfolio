import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Shell from "@/components/work/Shell";
import TopicFilter from "@/components/site/TopicFilter";
import FeatPost from "@/components/site/FeatPost";
import { NOTES, NOTES_NEXT, POSTS } from "@/components/site/writing";
import "@/components/site/site.css";
import "@/components/writing/read.css";

export const metadata: Metadata = pageMeta("Writing | Arvind Guruprasad", "Notes from building with agents: clinical data, evaluation, harnesses and moving from consulting into building.", "/writing");

export default function WritingIndex() {
  const long = POSTS.find((p) => p.long)!;
  return (
    <Shell>
      <section className="wi" aria-labelledby="wi-h">
        <p className="crumb"><a href="/">← Home</a></p>
        <p className="label">Writing</p>
        <h1 id="wi-h">Notes from building.</h1>
        <p className="intro">A long read on my thesis, and short notes on what I learn while building with agents.</p>

        <FeatPost p={long} />

        {NOTES.length > 0
          ? <><h2 className="wi-sub">Notes</h2><TopicFilter /></>
          : <p className="wr-next">{NOTES_NEXT}</p>}
      </section>
    </Shell>
  );
}
