import type { Metadata } from "next";
import RoomPage from "@/components/room/RoomPage";

export const metadata: Metadata = { title: "V7 | Arvind Guruprasad", robots: { index: false } };

export default function V7() {
  return <RoomPage />;
}
