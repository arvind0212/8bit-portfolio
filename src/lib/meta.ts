import type { Metadata } from "next";

export const SITE = "https://www.lifeofaguru.com";

export function pageMeta(title: string, description: string, path?: string): Metadata {
  return {
    title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: { type: "website", siteName: "Arvind Guruprasad", title, description, ...(path ? { url: path } : {}) },
    twitter: { card: "summary", title, description },
  };
}
