import type { Metadata } from "next";

export const SITE = "https://www.lifeofaguru.com";

const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Arvind Guruprasad, AI engineer in Stockholm" };

export function pageMeta(title: string, description: string, path?: string): Metadata {
  return {
    title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: { type: "website", siteName: "Arvind Guruprasad", title, description, images: [OG_IMAGE], ...(path ? { url: path } : {}) },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}
