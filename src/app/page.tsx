import type { Metadata } from "next";
import DeskPage from "@/components/desk/DeskPage";

const description = "Arvind Guruprasad, AI engineer in Stockholm. Curious where AI is taking us, I find out by building, then write down what I learn.";

export const metadata: Metadata = {
  title: "Arvind Guruprasad | AI engineer in Stockholm",
  description,
  openGraph: { type: "website", url: "/", title: "Arvind Guruprasad | AI engineer in Stockholm", description },
  twitter: { card: "summary", title: "Arvind Guruprasad | AI engineer in Stockholm", description },
};

export default function Home() {
  return <DeskPage />;
}
