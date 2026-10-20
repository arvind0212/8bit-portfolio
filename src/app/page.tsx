import type { Metadata } from "next";
import { pageMeta, SITE } from "@/lib/meta";
import DeskPage from "@/components/desk/DeskPage";

const description = "Arvind Guruprasad, AI engineer in Stockholm. Curious where AI is taking us, I find out by building, then write down what I learn.";

export const metadata: Metadata = pageMeta("Arvind Guruprasad | AI engineer in Stockholm", description, "/");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "Arvind Guruprasad",
      jobTitle: "AI engineer",
      url: SITE,
      email: "mailto:arvindguruprasad33@gmail.com",
      address: { "@type": "PostalAddress", addressLocality: "Stockholm", addressCountry: "Sweden" },
      sameAs: ["https://www.linkedin.com/in/arvind-guruprasad-73479a142/", "https://github.com/arvind0212"],
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Karolinska Institutet" },
        { "@type": "CollegeOrUniversity", name: "KTH Royal Institute of Technology" },
        { "@type": "CollegeOrUniversity", name: "Stockholm University" },
        { "@type": "CollegeOrUniversity", name: "BMS College of Engineering" },
      ],
      knowsAbout: ["AI agents", "LLM evaluation", "Agentic AI", "Healthcare data", "Clinical data standards"],
    },
    { "@type": "WebSite", url: SITE, name: "Arvind Guruprasad", author: { "@id": `${SITE}/#person` } },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <DeskPage />
    </>
  );
}
