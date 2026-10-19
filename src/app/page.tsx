import type { Metadata } from "next";
import DeskPage from "@/components/desk/DeskPage";

const description = "Arvind Guruprasad, tech generalist in Stockholm. I turn strategy into working systems, from scoping the deal to writing the agent.";

export const metadata: Metadata = {
  title: "Arvind Guruprasad | Tech generalist in Stockholm",
  description,
  openGraph: { type: "website", url: "/", title: "Arvind Guruprasad | Tech generalist in Stockholm", description },
  twitter: { card: "summary", title: "Arvind Guruprasad | Tech generalist in Stockholm", description },
};

export default function Home() {
  return <DeskPage />;
}
