import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/work/CaseStudy";
import { WORK } from "@/components/room/work";

const cases = WORK.filter((w) => w.case);

export function generateStaticParams() {
  return cases.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = cases.find((x) => x.slug === slug);
  return w ? { title: `${w.hook}${w.hookEm} | Arvind Guruprasad`, description: w.line } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = cases.find((x) => x.slug === slug);
  if (!w) notFound();
  return <CaseStudy w={w} />;
}
