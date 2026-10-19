import type { Metadata } from "next";
import SubPage from "@/components/room/SubPage";
import TopicFilter from "@/components/site/TopicFilter";
import "@/components/site/site.css";

export const metadata: Metadata = {
  title: "Writing | Arvind Guruprasad",
  description: "Notes from building with agents: clinical data, evaluation, harnesses and moving from consulting into building.",
};

export default function WritingIndex() {
  return (
    <SubPage label="Writing" title="Notes from building.">
      <p className="intro">Short pieces on what I learn while building with agents.</p>
      <TopicFilter />
    </SubPage>
  );
}
