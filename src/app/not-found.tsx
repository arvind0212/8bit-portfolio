import type { Metadata } from "next";
import Shell from "@/components/work/Shell";

export const metadata: Metadata = { title: "Page not found | Arvind Guruprasad", robots: { index: false } };

export default function NotFound() {
  return (
    <Shell>
      <section className="cs" aria-labelledby="h-404">
        <p className="label">404</p>
        <h1 id="h-404">This page <em>isn&apos;t here.</em></h1>
        <p className="dek">The link may be old. Everything I&apos;ve built is on the home page.</p>
        <p style={{ marginTop: "var(--s-6)", display: "flex", gap: "var(--s-5)", flexWrap: "wrap", alignItems: "center" }}>
          <a className="btn" href="/">Go to the home page <span aria-hidden="true">→</span></a>
          <a className="crumb-l" href="/work">See all work</a>
        </p>
      </section>
    </Shell>
  );
}
