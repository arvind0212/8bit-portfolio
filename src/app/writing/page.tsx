import type { Metadata } from "next";
import SubPage from "@/components/room/SubPage";
import PostRow from "@/components/site/PostRow";
import { DRAFTS, PUBLISHED } from "@/components/site/writing";
import "@/components/site/site.css";

export const metadata: Metadata = {
  title: "Writing | Arvind Guruprasad",
  description: "Notes from building with agents: clinical data, harnesses, and moving from consulting into building.",
};

export default function WritingIndex() {
  return (
    <SubPage label="Writing" title="Notes from building.">
      <p className="intro">Short pieces on what I learn while building with agents.</p>
      <div className="wr-group">
        <h3>Published</h3>
        <ol className="wr-list">{PUBLISHED.map((p) => <PostRow key={p.slug} p={p} />)}</ol>
      </div>
      <div className="wr-group">
        <h3>In the works</h3>
        <ol className="wr-list">{DRAFTS.map((p) => <PostRow key={p.slug} p={p} />)}</ol>
      </div>
    </SubPage>
  );
}
