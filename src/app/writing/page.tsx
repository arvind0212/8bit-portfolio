import type { Metadata } from "next";
import SubPage from "@/components/room/SubPage";

export const metadata: Metadata = {
  title: "Writing | Arvind Guruprasad",
  description: "Notes from building with agents.",
  robots: { index: false },
};

export default function WritingIndex() {
  return (
    <SubPage label="Writing" title="Notes from building.">
      <p className="intro">The first posts are being written. They will land here.</p>
    </SubPage>
  );
}
