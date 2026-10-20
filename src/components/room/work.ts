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
  tldr: string;
  stats: { v: string; l: string }[];
  sketchNote?: string;
  why: string;
  how: string;
  flow: Flow;
  flowCaption: string;
  notes: string[];
  chart?: Chart;
  hard: { issue: string; fix: string }[];
  alternatives: { option: string; why: string }[];
  ship: string;
  tryIt?: { repo: string; steps: string[] };
  limits: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

export type Chart = {
  title: string;
  unit: string;
  min: number;
  max: number;
  series: [string, string];
  rows: { label: string; short: string; values: [number, number] }[];
  caption: string;
};

/* the window each tile shows; "chart" draws case.chart, the others render html */
export type Screen = { file: string; flag: string; kind: "chart" | "code" | "ui"; html?: string; tone: "accent" | "plain" };

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
  ctx: string;
  outcome: { v: string; l: string };
  screen: Screen;
  /* how the screen enters its tile: along the bottom, out of a corner, or down from the top */
  enter: "bottom" | "corner" | "top" | false;
  case?: Case;
};

export const WORK: Work[] = [
  {
    slug: "thesis",
    kind: "case",
    featured: true,
    tag: "Master's thesis",
    year: "2026",
    hook: "Can AI reformat hospital data and keep its meaning?",
    hookEm: "",
    line: "Clinical data agents can pass every check and still change what the data means. I measured where.",
    pillar: "Knowing what to check",
    owned: ["Discovery", "Strategy", "Architecture", "Build"],
    ctx: "My master's thesis, 2026.",
    outcome: { v: "91.5%", l: "of medications kept their meaning" },
    screen: { file: "benchmark / medications.csv", flag: "synthetic data", kind: "chart", tone: "accent" },
    enter: "bottom",
    case: {
      dek: "A controlled benchmark of three AI agent designs that reshape messy, synthetic hospital records into a research standard (OMOP), graded field by field against a locked answer key.",
      role: "Sole author",
      when: "2026 · MSc, KI and KTH",
      team: "Supervised by Vladimir Li, Arkus AI",
      tldr: "Agents kept lab results almost perfectly intact and got medications right about 91% of the time, on synthetic data. The agents with tools scored highest but sometimes failed to finish; the simplest agent never failed. Passing a schema check told me nothing about whether the meaning survived.",
      stats: [
        { v: "~100%", l: "lab results kept their meaning, best agent" },
        { v: "~91%", l: "medications kept their meaning, best agent" },
        { v: "0", l: "failed runs for the simplest agent" },
        { v: "32% → <10%", l: "likely-wrong code mappings once agents could look codes up" },
      ],
      why: "Hospitals record data their own way, so research means reshaping it into a shared standard. That step is quietly risky: a lab value in the wrong unit, a drug mapped to a less specific code, or an order read as a dose given all pass structural checks. I wanted to know whether AI agents can do this job without changing what the data means.",
      how: "I generated synthetic patients with a known correct answer for every record, then made the source data messier in five stacked layers: formats, schema, local codes, units and timing. Three agents, from reasoning only to a sandboxed workspace with lookup tools, ran each layer on two models, and a deterministic scorer graded every field.",
      flow: {
        steps: [
          { glyph: "doc", label: "Messy records", note: "5 layers of noise" },
          { glyph: "agent", label: "Agent A, B or C", note: "GPT-5.4 · Kimi-K2.6" },
          { glyph: "check", label: "Schema check", note: "passes" },
          { glyph: "table", label: "Locked truth", note: "same meaning?", hot: true },
        ],
      },
      flowCaption: "Fig. 1 · The benchmark. Most pipelines stop at the schema check; this one keeps going.",
      notes: [
        "Labs mostly survived every layer of messiness. Medications broke on dosing instructions, drug specificity, route and timing.",
        "Kimi-K2.6 used about three times the tokens of GPT-5.4 on the hardest agent, and took longer.",
      ],
      chart: {
        title: "Medications kept their meaning, by agent",
        unit: "% accepted accuracy",
        min: 89,
        max: 92,
        series: ["GPT-5.4", "Kimi-K2.6"],
        rows: [
          { label: "A · reasoning only", short: "A reason", values: [90.6, 89.9] },
          { label: "B · with lookup tools", short: "B tools", values: [91.3, 90.4] },
          { label: "C · sandboxed workspace", short: "C sandbox", values: [91.5, 91.4] },
        ],
        caption: "Fig. 2 · All five layers of messiness stacked. More autonomy helped a little on medications; labs were 99–100% for every agent.",
      },
      hard: [
        { issue: "Agents with tools sometimes failed to finish a run.", fix: "Kept the reasoning-only agent as a reliable baseline and reported failures next to accuracy." },
        { issue: "Grading by exact match punished clinically equivalent answers, like the same glucose value in different units.", fix: "Scored exact and accepted separately, crediting only documented equivalences." },
      ],
      alternatives: [
        { option: "Real patient records", why: "There is no known-correct answer for every record, and they can't be shared. Synthetic data could be graded field by field and published." },
        { option: "One agent design", why: "It wouldn't show what autonomy buys. A ladder of three shows where tools help and where they add failures." },
        { option: "Web search for the agents", why: "Left off, so every run used the same local terminology tools and can be repeated." },
      ],
      ship: "Defended in June 2026. The benchmark code is public, and a plain-language summary sits alongside the full thesis.",
      tryIt: { repo: "https://github.com/arvind0212/agentic-clinical-etl-benchmark", steps: [] },
      limits: [
        "Synthetic data in a lab setting, not a deployment.",
        "Only lab results and medications.",
        "Only messiness that can be recovered; truly ambiguous records are future work.",
        "The ~100% counts documented, clinically equivalent conversions as correct.",
      ],
      stack: ["Python", "Synthea", "OMOP CDM 5.4", "LOINC", "RxNorm", "UMLS", "GPT-5.4", "Kimi-K2.6"],
      links: [{ label: "Read the long read", href: "/writing/thesis" }],
    },
  },
  {
    slug: "ki-pipeline",
    kind: "case",
    featured: true,
    tag: "Research assistant, KI",
    year: "2025",
    hook: "AI reads the dosing notes.",
    hookEm: " Code checks every row.",
    line: "The old pipeline dropped about 90% of the data. LLM parsing plus rule checks kept every record.",
    pillar: "Builds whatever it takes",
    owned: ["Discovery", "Strategy", "Architecture", "Build", "Rollout"],
    ctx: "Built solo at Karolinska Institutet, 2025.",
    outcome: { v: "0", l: "records lost. The old process lost ~90%" },
    screen: {
      file: "parse_prescriptions.py",
      flag: "example row",
      kind: "code",
      tone: "plain",
      html: '<p class="raw">"1 tablett 50 mg dagligen i 7 dagar, sedan 2 tabletter"</p><p class="via">Gemini 2.5 Pro + rule checks</p><pre class="json">{ <b>"dose_mg"</b>: [50, 100],\n  <b>"per_day"</b>: 1, <b>"days"</b>: [7, null],\n  <b>"check"</b>: <i>"passed"</i> }</pre>',
    },
    enter: "corner",
    case: {
      dek: "Free-text Swedish dosage instructions, turned into structured records a research group could use. The model reads; code checks every row it returns.",
      role: "Research Assistant, Applied AI for Medical Data",
      when: "Apr–Oct 2025",
      team: "Zheng Chang's group, psychiatric pharmacoepidemiology · built solo",
      tldr: "Every one of 1,000 prescription records came back: 99.4% as valid, rule-checked output and 1.1% flagged for a person to review. The old process had dropped about 90% of them.",
      stats: [
        { v: "99.4%", l: "came back as valid, rule-checked output" },
        { v: "1.1%", l: "flagged for a person to review" },
        { v: "0", l: "records lost" },
        { v: "~90%", l: "lost by the old process" },
      ],
      why: "The group studies how psychiatric medicines are used, and prescriptions are the raw material. Their old pipeline couldn't read free-text dosage instructions, so most of a Swedish prescription dataset never reached the research.",
      how: "I agreed labelling rules with the researchers, wrote a JSON schema for a structured prescription, and iterated prompts on Gemini 2.5 Pro. Every row the model returned then went through a deterministic layer: clinical logic rules, a duplicate check, a confidence score and review flags.",
      flow: {
        steps: [
          { glyph: "doc", label: "Free text", note: "Swedish dosage" },
          { glyph: "code", label: "LLM parsing", note: "Gemini 2.5 Pro", hot: true },
          { glyph: "check", label: "Rules check", note: "logic · duplicates" },
          { glyph: "table", label: "Structured record", note: "or 1.1% to review" },
        ],
      },
      flowCaption: "Fig. 1 · The pipeline. The model handles language; anything that must be exact is checked in code.",
      notes: [
        "The model was strongest exactly where rules break: reading Swedish phrasing, working out titration schedules and normalising indications to English.",
      ],
      hard: [
        { issue: "Titration schedules hide arithmetic, like doses that step up week by week.", fix: "Let the model work the schedule out, then checked the result against clinical logic rules in code." },
        { issue: "Some regimens were unusually high.", fix: "Flagged them for clinical review instead of letting the pipeline decide." },
      ],
      alternatives: [
        { option: "Keep a rules-only parser", why: "That was the old process, and it lost about 90% of the records." },
        { option: "Trust the model's output", why: "Integrity and safety stay in code. Every row is checked, and doubtful ones go to a person." },
      ],
      ship: "I set the pipeline up for the group and ran it on their real prescription data. It's a research pipeline, not a production rollout.",
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
    hook: "Call my agent from any app.",
    hookEm: " See what it read.",
    line: "A Windows prototype that brings my agent into any app, shows what it read and waits for a yes.",
    pillar: "Product-minded",
    owned: ["Discovery", "Architecture", "Build"],
    ctx: "A prototype, 2026.",
    outcome: { v: "1 yes", l: "before anything is pasted" },
    screen: {
      file: "Ambient Island",
      flag: "illustrative",
      kind: "ui",
      tone: "plain",
      html: '<span class="pill"><i></i>Read 3 fields from this window</span><div class="ask"><p>Paste the answer into the form?</p><p class="ctx">Using: window · clipboard</p><p class="btns"><b>Yes</b><span>Not now</span></p></div>',
    },
    enter: "top",
    case: {
      dek: "A small island at the top of the screen. Call it from any app, see exactly what context it took, and approve before anything goes back into your work.",
      role: "Solo, personal project",
      when: "2026 · in progress",
      team: "Just me and my agent harness",
      tldr: "A working Windows prototype, built for my own use. It brings my agent into any app, shows what it read, and pastes nothing back without a yes. Offline technical checks pass.",
      stats: [],
      sketchNote:
        "This is a sketch. The build isn't public yet, so there's no link or screenshot, and the visuals here are illustrative.",
      why: "Asking an agent for help meant leaving the app I was in, copying context across and pasting the answer back by hand.",
      how: "The island rests as a small pill at the top of the active screen and opens downward for a question. Context from the screen, an app, the clipboard or audio is taken only when I ask for it, shown so I can check it, and paste-back waits for approval.",
      flow: {
        steps: [
          { glyph: "doc", label: "Any app" },
          { glyph: "chips", label: "Context you can inspect", note: "only when asked" },
          { glyph: "hand", label: "Your yes", hot: true },
          { glyph: "paste", label: "Pasted back" },
        ],
      },
      flowCaption: "Fig. 1 · The loop. Nothing touches your app without a yes.",
      notes: [],
      hard: [
        { issue: "On first real use, setting it up was too fiddly.", fix: "I rebuilt the setup; it's now much simpler." },
      ],
      alternatives: [
        { option: "Always-on screen reading", why: "It would be convenient, but the island sees your screen, clipboard or audio only when you ask." },
      ],
      ship: "A packaged Windows build for my own use. It isn't public yet.",
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
    line: "I was part of the team behind a GenAI accelerator that drafted HL7v2-to-FHIR mappings for engineers to review. It reached about 65–70% end-to-end accuracy on the samples we had; the result belongs to the team.",
    pillar: "Strategy-focused",
    owned: ["Discovery", "Strategy", "Rollout"],
    ctx: "A team result at Quantiphi, 2022–24.",
    outcome: { v: "65–70%", l: "end-to-end accuracy on available samples" },
    screen: { file: "", flag: "", kind: "ui", tone: "plain" },
    enter: false,
  },
];
