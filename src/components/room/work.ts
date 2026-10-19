export const LAYERS = ["Discovery", "Strategy", "Architecture", "Build", "Rollout"] as const;
export type Layer = (typeof LAYERS)[number];

export type Glyph = "doc" | "agent" | "check" | "cross" | "code" | "table" | "chips" | "hand" | "paste";
export type Flow = { steps: { glyph: Glyph; label: string; note?: string; hot?: boolean }[] };

/* {{like this}} renders as a visible placeholder until it's confirmed */
export type Case = {
  dek: string;
  role: string;
  when: string;
  team: string;
  stats: { v: string; l: string }[];
  sketchNote?: string;
  flow: Flow;
  flowCaption: string;
  problem: string;
  decision: string;
  outcome: string;
  notDone: string;
  limits: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

export type Work = {
  slug: string;
  kind: "case" | "sketch" | "team";
  featured: boolean;
  tag: string;
  year: string;
  hook: string;
  hookEm: string;
  line: string;
  pillar: string;
  owned: Layer[];
  frame: string;
  preview: string;
  case?: Case;
};

export const WORK: Work[] = [
  {
    slug: "thesis",
    kind: "case",
    featured: true,
    tag: "Master's thesis",
    year: "2026",
    hook: "Valid",
    hookEm: " is not correct.",
    line: "Clinical data agents can pass every check and still change what the data means. I measured where.",
    pillar: "Knowing what to check",
    owned: ["Discovery", "Strategy", "Architecture", "Build"],
    frame: "",
    preview:
      '<p class="fk">Synthetic patient record</p><div class="vc"><div><span>Schema check</span><b>Valid ✓</b></div><div><span>Same clinical meaning</span><b class="no">Not always ✗</b></div></div><p class="big sm-hide">Valid <em>is not correct.</em></p>',
    case: {
      dek: "A controlled benchmark of three AI agent designs that reshape messy, synthetic hospital records into a research standard (OMOP), graded field by field against a locked answer key.",
      role: "Sole author",
      when: "2026 · MSc, KI and KTH",
      team: "Supervised by Vladimir Li, Arkus AI",
      stats: [
        { v: "~100%", l: "lab results kept their meaning, best agent" },
        { v: "~91%", l: "medications kept their meaning, best agent" },
        { v: "0", l: "failed runs for the simplest agent" },
        { v: "32% → <10%", l: "likely-wrong code mappings once agents could look codes up" },
      ],
      flow: {
        steps: [
          { glyph: "doc", label: "Messy records", note: "5 layers of noise" },
          { glyph: "agent", label: "Agent A, B or C", note: "GPT-5.4 · Kimi-K2.6" },
          { glyph: "check", label: "Schema check", note: "passes" },
          { glyph: "table", label: "Locked truth", note: "same meaning?", hot: true },
        ],
      },
      flowCaption: "Fig. 1 · The benchmark. Passing the schema check is where most pipelines stop; this one keeps going.",
      problem:
        "A converted table can pass every structural check and still be clinically wrong: a lab value in the wrong unit, a drug mapped to a less specific code, an order read as a dose given.",
      decision:
        "I built a synthetic benchmark with a known answer for every record, stacked five layers of realistic messiness, and compared three agents, from reasoning only to a sandboxed workspace with tools.",
      outcome:
        "Labs came through almost intact; medications topped out around 91%. Agents with tools scored highest but sometimes failed to finish. The reasoning-only agent never failed.",
      notDone:
        "I didn't test on real patients. A known-correct answer for every record is impossible with real data, so I chose synthetic data I could grade field by field and share openly.",
      limits: [
        "Synthetic data in a lab setting, not a deployment.",
        "Only lab results and medications.",
        "Only messiness that can be recovered; truly ambiguous records are future work.",
        "The ~100% counts documented, clinically equivalent conversions as correct.",
      ],
      stack: ["Python", "Synthea", "OMOP CDM 5.4", "LOINC", "RxNorm", "UMLS", "GPT-5.4", "Kimi-K2.6"],
      links: [
        { label: "Read the full thesis summary", href: "/thesis-summary.html" },
        { label: "Benchmark code on GitHub", href: "https://github.com/arvind0212/agentic-clinical-etl-benchmark" },
      ],
    },
  },
  {
    slug: "ki-pipeline",
    kind: "case",
    featured: true,
    tag: "Karolinska Institutet",
    year: "2025",
    hook: "1,000 prescriptions,",
    hookEm: " none lost.",
    line: "The old pipeline dropped about 90% of the data. LLM parsing plus rule checks kept every record.",
    pillar: "Builds whatever it takes",
    owned: ["Discovery", "Strategy", "Architecture", "Build", "Rollout"],
    frame: "ki",
    preview:
      '<p class="fk">Prescription pipeline</p><p class="stat">99.4%</p><p class="fs">valid, rule-checked output · 0 records lost</p><div class="pipe sm-hide"><span>Free text</span><i>→</i><span class="acc">LLM parsing</span><i>→</i><span>Rules check</span></div>',
    case: {
      dek: "Free-text Swedish dosage instructions, turned into structured records a research group could use. The model reads; code checks every row it returns.",
      role: "Research Assistant, Applied AI for Medical Data",
      when: "Apr–Oct 2025",
      team: "Zheng Chang's group, psychiatric pharmacoepidemiology · built solo",
      stats: [
        { v: "99.4%", l: "came back as valid, rule-checked output" },
        { v: "1.1%", l: "flagged for a person to review" },
        { v: "0", l: "records lost" },
        { v: "~90%", l: "lost by the old process" },
      ],
      flow: {
        steps: [
          { glyph: "doc", label: "Free text", note: "Swedish dosage" },
          { glyph: "code", label: "LLM parsing", note: "Gemini 2.5 Pro", hot: true },
          { glyph: "check", label: "Rules check", note: "logic · duplicates" },
          { glyph: "table", label: "Structured record", note: "or 1.1% to review" },
        ],
      },
      flowCaption: "Fig. 1 · The pipeline. The model handles language; anything that must be exact is checked in code.",
      problem:
        "The group's old pipeline couldn't read free-text dosage instructions, so about 90% of a Swedish prescription dataset never reached the research.",
      decision:
        "Split the work by strength. The model reads Swedish, works out titration schedules and normalises indications. Code enforces clinical logic rules, catches duplicates, scores confidence and flags doubts.",
      outcome:
        "Every record came back: 99.4% as valid, rule-checked output and 1.1% flagged for a person to review. Nothing was dropped.",
      notDone:
        "I didn't let the model decide what's safe. High-dose regimens and low-confidence rows go to a person instead of being guessed.",
      limits: [
        "99.4% is the share of valid, rule-checked output, not accuracy against a gold standard.",
        "A validated research pipeline, not a live clinical system.",
        "The data isn't public, so there are no screenshots of real records.",
      ],
      stack: ["Gemini 2.5 Pro", "JSON Schema", "Rule-based validation", "Hash de-duplication", "Confidence scoring"],
      links: [],
    },
  },
  {
    slug: "ambient",
    kind: "sketch",
    featured: true,
    tag: "Prototype",
    year: "2026",
    hook: "An assistant that",
    hookEm: " asks before it pastes.",
    line: "A Windows prototype that brings my agent into any app, shows what it read and waits for a yes.",
    pillar: "Product-minded",
    owned: ["Discovery", "Architecture", "Build"],
    frame: "ui",
    preview:
      '<p class="fk">Illustrative</p><span class="island"><i></i>Using: this window</span><div class="ask"><p>Paste the answer back?</p><b>Yes</b><span>Not now</span></div>',
    case: {
      dek: "A small island at the top of the screen. Call it from any app, see exactly what context it took, and approve before anything goes back into your work.",
      role: "Solo, personal project",
      when: "2026 · in progress",
      team: "Just me and my agent harness",
      stats: [],
      sketchNote:
        "This is a sketch. The build isn't public yet, so there's no link or screenshot, and the visuals here are illustrative.",
      flow: {
        steps: [
          { glyph: "doc", label: "Any app" },
          { glyph: "chips", label: "Context you can inspect", note: "only when asked" },
          { glyph: "hand", label: "Your yes", hot: true },
          { glyph: "paste", label: "Pasted back" },
        ],
      },
      flowCaption: "Fig. 1 · The loop. Nothing touches your app without a yes.",
      problem:
        "Asking an agent for help means leaving the app you're in, copying context across and pasting the answer back by hand.",
      decision:
        "Bring the agent to the app instead. Context is taken only when asked for and shown so you can check it, and paste-back waits for approval.",
      outcome:
        "Offline technical checks pass. First real use showed setup was too fiddly and the open view too cramped, so I'm reworking the setup and the open view now.",
      notDone:
        "No always-on screen reading. The island sees your screen, clipboard or audio only when you ask it to.",
      limits: [
        "Built for my own use; no other users yet.",
        "Live checks on the Windows desktop and with live model providers are still open.",
      ],
      stack: ["Electron", "React", "TypeScript", "Rust (N-API)", "Windows"],
      links: [],
    },
  },
  {
    slug: "fhir-accelerator",
    kind: "team",
    featured: false,
    tag: "Team result · Quantiphi",
    year: "2022–24",
    hook: "HL7v2 to FHIR,",
    hookEm: " drafted first.",
    line: "As technical program manager I led the team behind a GenAI accelerator that drafted HL7v2-to-FHIR mappings for engineers to review. It reached about 65–70% end-to-end accuracy on the samples we had; the result belongs to the team.",
    pillar: "Strategy-focused",
    owned: ["Discovery", "Strategy", "Rollout"],
    frame: "",
    preview: "",
  },
];
