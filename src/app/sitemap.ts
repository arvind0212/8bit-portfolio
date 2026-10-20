import type { MetadataRoute } from "next";
import { SITE } from "@/lib/meta";
import { WORK } from "@/components/room/work";
import { POSTS } from "@/components/site/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/work", "/writing", ...WORK.filter((w) => w.case).map((w) => `/work/${w.slug}`), ...POSTS.filter((p) => p.live).map((p) => `/writing/${p.slug}`)];
  return paths.map((p) => ({ url: SITE + p }));
}
