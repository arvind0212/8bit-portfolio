import Shell from "../work/Shell";
import Figure from "../work/Figure";
import { Part, Tech, ReadFoot } from "./parts";

const PDF = "https://drive.google.com/file/d/1B08Fza-tUPzirZH96MxiefAJnih5meNo/view?usp=drive_link";
const REPO = "https://github.com/arvind0212/agentic-clinical-etl-benchmark";

const LAYERS = [
  ["L1", "Representation", "Decimal commas, local null markers, odd date formats, local category codes."],
  ["L2", "Schema and contract", "Renamed fields, timestamps split apart, dose and reference text merged."],
  ["L3", "Terminology", "Local lab codes, formulary IDs and brand names instead of standard codes."],
  ["L4", "Units and values", "Unit swaps and scale changes: the right concept at a different magnitude."],
  ["L5", "Timing", "Workflow timestamps shifted or redacted: which date is the real event?"],
];

const AGENTS = [
  { k: "A", name: "Reasoning only", line: "Reads the schema and sample rows, then writes a mapping plan from its own knowledge.", caps: ["Schema reasoning"] },
  { k: "B", name: "With code lookups", line: "Everything A does, plus looking up official lab and drug codes as it works.", caps: ["Schema reasoning", "Code lookups"] },
  { k: "C", name: "Full workspace", line: "Inspects files, writes and runs code, checks its own output and fixes mistakes.", caps: ["Schema reasoning", "Code lookups", "Runs code, self-checks"], best: true },
];

const BARS: [string, string, number, number, boolean?][] = [
  ["Labs", "A · reasoning only", 99, 100],
  ["Labs", "B · code lookups", 99, 100],
  ["Labs", "C · workspace", 100, 100, true],
  ["Medications", "A · reasoning only", 89.9, 90.6],
  ["Medications", "B · code lookups", 90.4, 91.3],
  ["Medications", "C · workspace", 91.4, 91.5, true],
];
const pos = (v: number) => ((v - 85) / 15) * 100;

export default function ThesisRead() {
  return (
    <Shell>
      <article className="lr" aria-labelledby="lr-h">
        <p className="crumb"><a href="/writing">← All writing</a></p>

        <header className="lr-hero">
          <div className="lr-copy">
            <p className="label"><span className="n">Long read</span>· Master&apos;s thesis · Jun 2026</p>
            <h1 id="lr-h">Can AI agents standardise clinical data <em>without losing its meaning?</em></h1>
            <p className="dek">A controlled test of whether AI agents can turn messy hospital lab and medication records into a research-ready format and keep every clinical fact intact.</p>
            <div className="lr-acts">
              <a className="btn" href={PDF} target="_blank" rel="noopener noreferrer">Read the thesis<span aria-hidden="true">↗</span></a>
              <a className="read" href={REPO} target="_blank" rel="noopener noreferrer">Benchmark on GitHub<span aria-hidden="true"> ↗</span></a>
            </div>
          </div>
          <figure className="scr lr-shot" aria-label="Accepted match rate for the best agent">
            <div className="sbar"><i /><i /><i /><em>all five layers stacked</em><span>best agent</span></div>
            <div className="lr-sb">
              <div className="lr-m"><span>Lab results</span><b>~100%</b><i style={{ "--w": "100%" } as React.CSSProperties} /></div>
              <div className="lr-m"><span>Medications</span><b>~91%</b><i style={{ "--w": "91%" } as React.CSSProperties} /></div>
              <p>Clinical fields kept their meaning, synthetic data</p>
            </div>
          </figure>
        </header>

        <dl className="glance">
          <div><dt>Author</dt><dd>Arvind Guruprasad</dd></div>
          <div><dt>Supervisor</dt><dd>Vladimir Li, Arkus AI</dd></div>
          <div><dt>Models</dt><dd>GPT-5.4 and Kimi-K2.6</dd></div>
          <div><dt>Programme</dt><dd>MSc, KI and KTH</dd></div>
        </dl>

        <div className="tldr">
          <p className="tl"><span>The bottom line</span></p>
          <p className="tt"><b className="yes">Yes, mostly.</b> The best agent kept lab results almost perfectly and medications about 91% of the time. <b className="not">Not yet</b> for real patients: this is a lab benchmark on synthetic data, and human oversight stays essential.</p>
          <ul className="stats">
            <li><b>3</b><span>agent designs compared</span></li>
            <li><b>2</b><span>models benchmarked</span></li>
            <li><b>5</b><span>stacked layers of messiness</span></li>
            <li><b>~91%</b><span>medication accuracy, best agent</span></li>
          </ul>
        </div>

        <Part n="01" title="The stakes" hook="A converted table can look valid and still be clinically wrong.">
          <p>Every hospital records data its own way. To pool it for research, the data has to be reshaped into a shared standard, and the risk is quiet: structural checks pass while the clinical meaning breaks.</p>
          <dl className="gloss">
            <div><dt>OMOP</dt><dd>A common data model: shared tables and rules so different hospitals&apos; data can be analysed together.</dd></div>
            <div><dt>ETL</dt><dd>Extract, transform, load. The pipeline that pulls data out, reshapes it and loads it into the target.</dd></div>
          </dl>
          <p>Lab results and medications carry their meaning across many fields at once: code, unit, value, dose, route and timing. That makes them the cases where getting it wrong costs the most.</p>
          <ol className="ex">
            <li className="ok"><span>Safe</span><h4>Lab unit conversion</h4><code>Glucose 65.5 mg/dL</code><code className="out">3.635213 mmol/L</code><p>Different text, same clinical value.</p></li>
            <li className="meh"><span>Ambiguous</span><h4>Medication instructions</h4><code>&quot;2.5 mg QD&quot;</code><code className="out">&quot;2,5 mg ORAL daily TABLET&quot;</code><p>Still readable, harder to compare.</p></li>
            <li className="bad"><span>Risky</span><h4>Drug specificity</h4><code>Metformin ER</code><code className="out">generic metformin code</code><p>The exact formulation is no longer traceable.</p></li>
          </ol>
        </Part>

        <Part n="02" title="The test" hook="A known answer for every record, so the grading is fair.">
          <p>Grading an agent needs the correct answer for every record, which real patients can&apos;t give you. So the benchmark is fully synthetic: the right answer is fixed first, then the source data is made messier in controlled steps.</p>
          <Figure
            flow={{ steps: [
              { label: "Generate", note: "synthetic patients", glyph: "doc" },
              { label: "Enrich", note: "lab and drug detail", glyph: "table" },
              { label: "Lock the truth", note: "fixed answer key", glyph: "check", hot: true },
              { label: "Add messiness", note: "five layers", glyph: "chips" },
              { label: "Score", note: "field by field", glyph: "code" },
            ] }}
            caption="Fig. 1 · Because the answer key is known and the data is synthetic, the whole pipeline is open and anyone can re-run it."
          />
          <Tech title="The dataset">
            <p>A Synthea-derived cohort (seed 42): 52 patients, 390 encounters, 1,222 lab rows, 213 medication orders and 6,450 medication administrations. Raw exports become five canonical tables, then deterministic OMOP CDM v5.4 truth for the measurement and drug_exposure targets, with person and visit_occurrence as controls.</p>
            <p>Ground-truth artifacts (schema map, term map, transform map, attainable mask, provenance manifests) ship with the data, so scoring never depends on human judgement after the fact. Labs keep LOINC truth and medications keep RxNorm truth.</p>
          </Tech>
        </Part>

        <Part n="03" title="Messiness" hook="Five layers of real-world mess, stacked one on the next.">
          <p>Hospital data is rarely random noise. It is locally sensible and confusing to everyone else. Each layer adds one family of variation, so every agent faces a harder version of the same records, and every layer stays recoverable.</p>
          <ol className="stairs">
            {LAYERS.map(([k, t, d], i) => (
              <li key={k} style={{ "--i": i } as React.CSSProperties}><b>{k}</b><div><h4>{t}</h4><p>{d}</p></div></li>
            ))}
          </ol>
          <p className="aside">Left out on purpose: broken record linkage, pipeline glitches and genuinely ambiguous data. Those need a human to decide.</p>
        </Part>

        <Part n="04" title="The agents" hook="Three designs, each given one more capability.">
          <p>The question a team lead would ask: does more tooling and autonomy make the agent better? Each design adds exactly one thing.</p>
          <ol className="agents">
            {AGENTS.map((a) => (
              <li key={a.k} className={a.best ? "best" : undefined}>
                <p className="ak"><b>{a.k}</b>{a.best && <span>Best overall</span>}</p>
                <h4>{a.name}</h4>
                <p>{a.line}</p>
                <ul>{a.caps.map((c) => <li key={c}>{c}</li>)}</ul>
              </li>
            ))}
          </ol>
          <Tech title="Architecture contracts">
            <p>A emits a mapping spec applied by a deterministic executor, which tests model knowledge alone. B keeps that contract and adds UMLS/LOINC and RxNorm/RxNav tools, so code lookup is the only new variable. C is a sandboxed single-agent workspace (shell, Python, local terminology tools, validation) with web search off, so it gets no browsing advantage.</p>
          </Tech>
        </Part>

        <Part n="05" title="Results" hook="More capability helped, unevenly, and at a cost.">
          <p>The workspace agent scored highest or tied on both targets. A single accuracy number hides what it cost to get there.</p>
          <figure className="bars">
            <p className="bars-h">Clinical fields kept, by agent</p>
            {BARS.map(([g, n, lo, hi, best], i) => (
              <div key={g + n} className={"bar" + (best ? " best" : "") + (i === 3 ? " gap" : "")}>
                {(i === 0 || i === 3) && <p className="bg">{g}</p>}
                <span>{n}</span>
                <div className="bt"><i style={{ width: pos(hi) + "%" }} /><u style={{ left: pos(lo) + "%", width: Math.max(pos(hi) - pos(lo), .8) + "%" }} /></div>
                <b>{lo === hi ? hi + "%" : `${lo}–${hi}%`}</b>
              </div>
            ))}
            <div className="bar ax"><span /><div><em>85%</em><em>90%</em><em>95%</em><em>100%</em></div><b /></div>
            <figcaption>Fig. 2 · Range across the two models. The 100% lab figure counts documented, clinically equivalent conversions as correct.</figcaption>
          </figure>
          <ul className="trade">
            <li className="up"><b>Accuracy rose</b> with capability. The workspace agent led on both data types.</li>
            <li className="dn"><b>Reliability fell.</b> The simplest agent never failed; tool-heavy agents hit rate limits and policy errors.</li>
            <li className="dn"><b>Cost climbed</b> steeply for a one-to-two point gain on medications.</li>
            <li className="up"><b>The models tied</b> on quality, but GPT-5.4 was more reliable and far cheaper to run.</li>
          </ul>
          <p className="obs"><span>The honest read</span>More agentic doesn&apos;t automatically mean better. It depends on the data, how reliable it has to be, and the budget.</p>
          <Tech title="Confidence intervals, robustness and cost">
            <p>Accepted (credits deterministic exceptions and reviewed unit equivalence) vs exact match: measurement exact was about 96–97% while accepted hit the ceiling; drug exact was about 90.7%. At full L1–L5, C beat A on accepted drug_exposure by 1.25 pp (GPT, CI 0.64–1.86) and 1.96 pp (Kimi, CI 0.24–4.81). C vs B was only 0.24 pp for GPT (CI −0.57–1.25).</p>
            <p>From L1 to the full stack, accepted-score retention stayed between 0.992 and 1.012: noise changed which errors appeared more than the score. Agent C used 11,639 tokens per source row on Kimi vs 3,986 on GPT for drugs, with average runtime 506.6 s vs 137.1 s.</p>
          </Tech>
        </Part>

        <Part n="06" title="Failure modes" hook="Labs and medications fail in different ways.">
          <p>Breaking errors down by type is the most useful finding for anyone deciding where to put human review.</p>
          <div className="fails">
            <section>
              <p className="fk ok">Lab results · mostly cosmetic</p>
              <ul>
                <li><b>Unit</b>Conversions that change the text, not the clinical value.</li>
                <li><b>Audit</b>Labels swapped for codes: right answer, weaker trail for a human.</li>
              </ul>
              <p className="aside">Code lookups cut likely-wrong mappings from about 32% to single digits.</p>
            </section>
            <section>
              <p className="fk bad">Medications · consequential</p>
              <ul>
                <li><b>Dose</b>Instructions reworded so they no longer compare cleanly.</li>
                <li><b>Drug</b>Product specificity lost, like extended-release mapped to a generic code.</li>
                <li><b>Route</b>Route of administration dropped on some rows.</li>
                <li><b>Time</b>Exposure dates shifted by a day.</li>
              </ul>
            </section>
          </div>
        </Part>

        <Part n="07" title="So what" hook="“The pipeline ran” doesn’t mean the data is correct.">
          <p>Quality has to be measured at the level of clinical meaning. What that means depends on who is deciding.</p>
          <div className="who">
            <section>
              <h4>Clinical leaders</h4>
              <ul>
                <li>Promising, not deployable: validated only on synthetic data with a known answer key.</li>
                <li>Keep a human on medications: dose, route, product and timing are where meaning slips.</li>
                <li>Ask for semantic checks and traceability you can audit, not just a successful load.</li>
              </ul>
            </section>
            <section>
              <h4>Technology leaders</h4>
              <ul>
                <li>More autonomy added cost, latency and failures for a small gain.</li>
                <li>Treat reliability as a metric. The simplest design never failed.</li>
                <li>Two strong models tied on quality but differed up to about three times on cost and runtime.</li>
              </ul>
            </section>
          </div>
        </Part>

        <ReadFoot
          title="A reproducible way to test clinical AI before it touches real patients."
          line="The generator, answer key, messiness layers, agents and scoring are all open source and run on synthetic data, so anyone can inspect, re-run or extend it."
          acts={[{ label: "Read the thesis", href: PDF, primary: true }, { label: "Benchmark on GitHub", href: REPO }]}
          limits={[
            "Synthetic data in a controlled benchmark, not a deployment.",
            "Only lab results and medications.",
            "Only messiness that can be recovered; truly ambiguous records are future work.",
            "Real use would need governed clinical data, approvals, security review and expert oversight.",
          ]}
          related={{ label: "The case study", title: "How I built the benchmark", href: "/work/thesis" }}
        />
      </article>
    </Shell>
  );
}
