import type { Metadata } from "next";
import Shell from "@/components/work/Shell";
import TopicFilter from "@/components/site/TopicFilter";
import { POSTS } from "@/components/site/writing";
import "@/components/site/site.css";
import "@/components/writing/read.css";

export const metadata: Metadata = {
  title: "Writing | Arvind Guruprasad",
  description: "Notes from building with agents: clinical data, evaluation, harnesses and moving from consulting into building.",
};

export default function WritingIndex() {
  const long = POSTS.find((p) => p.long)!;
  return (
    <Shell>
      <section className="wi" aria-labelledby="wi-h">
        <p className="crumb"><a href="/">← Home</a></p>
        <p className="label">Writing</p>
        <h1 id="wi-h">Notes from building.</h1>
        <p className="intro">Short pieces on what I learn while building with agents, and one long read.</p>

        <a className="feat" href={"/writing/" + long.slug}>
          <div className="feat-c">
            <p className="wc-meta"><span className="fk-l">Long read</span><time>{long.date}</time></p>
            <h2>{long.title}</h2>
            <p>{long.dek}</p>
            <span className="read">Read it<span aria-hidden="true"> →</span></span>
          </div>
          <div className="wc-frame feat-art"><div className="wc-fr" dangerouslySetInnerHTML={{ __html: long.preview }} /></div>
        </a>

        <h2 className="wi-sub">Notes</h2>
        <TopicFilter />
      </section>
    </Shell>
  );
}
