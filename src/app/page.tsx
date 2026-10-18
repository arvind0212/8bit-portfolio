import type { Metadata } from "next";
import RoomPage from "@/components/room/RoomPage";

const description = "Arvind Guruprasad, tech generalist in Stockholm. I turn strategy into working systems, from scoping the deal to writing the agent.";

export const metadata: Metadata = {
  title: "Arvind Guruprasad | Strategy that ships",
  description,
  openGraph: { type: "website", url: "/", title: "Arvind Guruprasad | Strategy that ships", description },
  twitter: { card: "summary", title: "Arvind Guruprasad | Strategy that ships", description },
};

export default function Home() {
  return <RoomPage />;
}
