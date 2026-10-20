import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import DeskPage from "@/components/desk/DeskPage";

const description = "Arvind Guruprasad, AI engineer in Stockholm. Curious where AI is taking us, I find out by building, then write down what I learn.";

export const metadata: Metadata = pageMeta("Arvind Guruprasad | AI engineer in Stockholm", description, "/");

export default function Home() {
  return <DeskPage />;
}
