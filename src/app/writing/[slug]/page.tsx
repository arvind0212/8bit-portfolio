import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { POSTS } from "@/components/site/writing";
import ThesisRead from "@/components/writing/ThesisRead";
import PostRead from "@/components/writing/PostRead";
import "@/components/site/site.css";
import "@/components/writing/read.css";

export function generateStaticParams() {
  return POSTS.filter((p) => p.live).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  return p ? { title: p.title + " | Arvind Guruprasad", description: p.dek } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug && x.live);
  if (!p) notFound();
  return p.long ? <ThesisRead /> : <PostRead p={p} />;
}
