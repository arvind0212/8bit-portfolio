export type Work = {
  slug: string;
  featured: boolean;
  tag: string;
  hook: string;
  hookEm: string;
  line: string;
  href: string;
  cta: string;
  frame: string;
  preview: string;
  year: string;
  summary: string;
};

export const WORK: Work[] = [
  {
    slug: "thesis",
    featured: true,
    tag: "Master's thesis",
    hook: "Valid",
    hookEm: " is not correct.",
    line: "Clinical agents can pass validation and still be wrong. I measured where.",
    href: "/thesis-summary.html",
    cta: "Read the summary",
    frame: "",
    preview:
      '<p class="fk">Synthetic patient record</p><div class="vc"><div><span>Schema check</span><b>Valid ✓</b></div><div><span>Matches the source</span><b class="no">Not correct ✗</b></div></div><p class="big">Valid <em>is not correct.</em></p>',
    year: "2026",
    summary:
      "Three agent designs mapping synthetic patient data to OMOP. The best reached about 100% accepted accuracy on labs and about 91% on medications; the tool-heavy agents failed more often. Synthetic data, not a deployment.",
  },
  {
    slug: "ki-pipeline",
    featured: true,
    tag: "Research · Karolinska Institutet",
    hook: "1,000+ prescriptions,",
    hookEm: " parsed and checked.",
    line: "LLM parsing plus rules: 99.4% success on 1,000+ records.",
    href: "/work#ki-pipeline",
    cta: "Read more",
    frame: "ki",
    preview:
      '<p class="fk">Prescription pipeline</p><p class="stat">99.4%</p><p class="fs">success on 1,000+ prescription records</p><div class="pipe"><span>Free text</span><i>→</i><span class="acc">LLM parsing</span><i>→</i><span>Rules check</span></div>',
    year: "2025",
    summary:
      "A pipeline that turns unstructured Swedish prescriptions into structured records, with LLM parsing and a rule-based check. 99.4% success across 1,000+ records, with a small share flagged for manual review.",
  },
  {
    slug: "ambient",
    featured: true,
    tag: "Prototype",
    hook: "An agent that",
    hookEm: " asks before it pastes.",
    line: "Ambient Island shows what it read and waits for your yes.",
    href: "/work#ambient",
    cta: "Read more",
    frame: "ui",
    preview:
      '<span class="island"><i></i>Read 3 fields from this page</span><div class="ask"><p>Paste them into the form?</p><b>Yes</b><span>Not now</span></div>',
    year: "2026",
    summary:
      "A desktop prototype: context arrives as chips you can remove, and nothing is pasted until you approve it. Chips and the approval gate pass every offline check; live checks are still open.",
  },
  {
    slug: "fhir-accelerator",
    featured: false,
    tag: "Team result · Quantiphi",
    hook: "HL7v2 to FHIR,",
    hookEm: " drafted first.",
    line: "A GenAI accelerator that drafted mappings before the team reviewed them.",
    href: "/work#fhir-accelerator",
    cta: "Read more",
    frame: "",
    preview: "",
    year: "2022–24",
    summary:
      "Every hospital feed had to be mapped from HL7v2 to FHIR by hand. I led a GenAI accelerator as technical program manager; my part was design and delivery, and the result belongs to the team.",
  },
];
