import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SubPage from "@/components/room/SubPage";
import { POSTS } from "@/components/site/writing";
import "@/components/site/site.css";

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
  return (
    <SubPage label={"Writing · " + p.date} title={p.title}>
      <p className="intro post-dek">{p.dek}</p>
      <ul className="wc-tags post-tags" aria-label="Topics">{p.topics.map((t) => <li key={t}>{t}</li>)}</ul>
      <article className="post-body">
        <p>The full text is being moved here.</p>
      </article>
    </SubPage>
  );
}
