import type { ReactNode } from "react";
import { WORK } from "./work";

export const CV = "https://drive.google.com/file/d/1NuS61X_awnnDSR8uW-5jEng5P1QcZ2f3/view?usp=drive_link";

/* the site itself: V7 draws the room into the hero and contact slots, the desk version shows it on the monitor */
export default function Sections({ room, back }: { room: boolean; back?: ReactNode }) {
  const featured = WORK.filter((w) => w.featured);
  return (
    <main className="col" id="top">
      <section className="hero" id="hero" aria-labelledby="h1">
        <p className="hi">Hi, I&apos;m Arvind.</p>
        <h1 id="h1"><span className="nb">Strategy<canvas className="px" id="wb" aria-hidden="true" width="0" height="0"></canvas></span> that <span className="nb"><em>ships.</em><canvas className="px" id="bx" aria-hidden="true" width="0" height="0"></canvas></span></h1>
        {room && <div className="slot" id="slot" aria-hidden="true"></div>}
        <p className="value">A <b>tech generalist</b> in Stockholm. I turn strategy into working systems, from scoping the deal to writing the agent.</p>
        <div className="acts">
          <a className="btn" href="#work">See the work<span aria-hidden="true">↓</span></a>
          <a className="read" href="#contact">Get in touch<span aria-hidden="true">→</span></a>
        </div>
        <p className="status"><i aria-hidden="true"></i>Open to new roles in Sweden and Europe</p>
      </section>

      <section className="sec" id="work" aria-labelledby="h-work">
        <div className="shead">
          <div>
            <p className="label"><span className="n">01</span>Selected work</p>
            <h2 id="h-work">Proof, with the limits written down.</h2>
          </div>
          <div className="lane" id="lane"></div>
          <div className="rownav" aria-label="Scroll the work">
            <button type="button" id="prev" aria-label="Previous">←</button>
            <button type="button" id="next" aria-label="Next">→</button>
          </div>
        </div>
        <ol className="cards" id="cards">
          {featured.map((w, i) => (
            <li className="card" key={w.slug}>
              <a className="cv" href={w.href} tabIndex={-1} aria-hidden="true">
                <div className={"frame " + w.frame}>
                  <div className="fr" dangerouslySetInnerHTML={{ __html: w.preview }} />
                </div>
              </a>
              <div className="ct">
                <p className="cmeta"><span className="n">0{i + 1}</span>{w.tag}</p>
                <h3><a href={w.href}>{w.hook}<em>{w.hookEm}</em></a></h3>
                <p className="cline">{w.line}</p>
                <a className="read" href={w.href} aria-label={"Read: " + w.hook + w.hookEm}>Read<span aria-hidden="true"> →</span></a>
              </div>
            </li>
          ))}
          <li className="card all">
            <a href="/work"><span className="k">All work</span><b>See everything I&apos;ve shipped, including team work.</b><span className="read">All work<span aria-hidden="true"> →</span></span></a>
          </li>
        </ol>
      </section>

      <section className="sec" id="journey" aria-labelledby="h-journey">
        <p className="label"><span className="n">02</span>Journey</p>
        <h2 id="h-journey">The road here.</h2>
        <p className="intro">Newest first. From consulting to building, by way of Stockholm.</p>
        <div className="jr" id="jroot">
          <div className="jrail" aria-hidden="true"></div>
          <ol className="jcards">
            <li className="jcard jnow" data-s="5" data-y="2026" data-act="with a coffee in the Stockholm snow">
              <div className="jmeta"><span className="jpill">Now</span><span className="jsr">2026</span></div>
              <h3>Building in public.</h3>
              <p className="jhook">I treat new AI tools as toys. I pick one up, build something real with it, and write up what I learn.</p>
              <div className="jlinks">
                <a href="https://github.com/arvind0212" target="_blank" rel="noopener noreferrer">My agent harness <span aria-hidden="true">↗</span></a>
                <a href="https://github.com/arvind0212" target="_blank" rel="noopener noreferrer">My wiki agent <span aria-hidden="true">↗</span></a>
                <a href="#writing">Notes from building <span aria-hidden="true">→</span></a>
              </div>
            </li>
            <li className="jcard" data-s="4" data-y="2025" data-to="–26" data-act="plugging in an agent">
              <div className="jmeta"><span className="jsr">2025 to 2026</span><span className="jlogos"><img src="/images/journey/arkus-ai.png" alt="Arkus AI" /></span></div>
              <h3>Founding AI engineer at a healthcare startup.</h3>
              <p className="jhook">I was the first AI engineer at Arkus AI, a no-code platform where clinicians describe a problem and an agent builds the workflow.</p>
              <ul className="jbul">
                <li><b>Built the agent tools</b> the platform runs on: one tool over three EHRs (Epic, AthenaOne, Kaddio), ICD-11 and SNOMED CT coding, PubMed and ClinicalTrials.gov search.</li>
                <li><b>Set up the evals</b> and the prompt workflow, so changes to agents were measured, not guessed.</li>
                <li><b>Shipped the web app</b> and presented the product at the May 2026 launch.</li>
              </ul>
              <p className="jcoda">I left in September to look for work that&apos;s more interesting to me and that I can sustain for the long run.</p>
            </li>
            <li className="jcard" data-s="3" data-y="2024" data-to="–26" data-act="at a laptop with a thesis chart">
              <div className="jmeta"><span className="jsr">2024 to 2026</span><span className="jlogos"><img src="/images/journey/karolinska.png" alt="Karolinska Institutet" /><img src="/images/journey/kth.png" alt="KTH" /><img src="/images/journey/stockholm-university.png" alt="Stockholm University" /></span></div>
              <h3>I hit my technical ceiling, so I went back to school.</h3>
              <p className="jhook">Four years of consulting taught me to scope and sell AI. I wanted to understand it deeply, so I turned down a go-to-market lead role and moved to Stockholm.</p>
              <ul className="jbul">
                <li><b>MSc Biostatistics &amp; Data Science,</b> a joint degree from KI, KTH and Stockholm University, focused on healthcare AI.</li>
                <li><b>Research assistant at KI:</b> an LLM pipeline that read 1,000+ Swedish prescriptions with 99.4% success.</li>
                <li><b>Thesis with Arkus AI:</b> benchmarking agent architectures for clinical data standardisation.</li>
                <li><b>Built the programme&apos;s degree-project portal,</b> where researchers post thesis ideas for students.</li>
              </ul>
            </li>
            <li className="jcard jghost" data-s="2" data-y="2020" data-to="and before" data-stack="" data-act="presenting at a whiteboard">
              <div className="jrow">
                <div><span className="jsr">2020 and before</span><h3>Quantiphi, Bangalore, Muscat.</h3></div>
                <button type="button" className="jmore" aria-expanded="false" aria-controls="jearly">See the full journey <span aria-hidden="true">↓</span></button>
              </div>
              <div className="jcollapse" id="jearly"><div><div className="jearlier">
                <div className="jerow"><canvas width={72} height={72} data-spr="2" role="img" aria-label="Arvind presenting at a whiteboard"></canvas><b>Quantiphi</b><span className="jyr">2020 – 24</span><p>Business Analyst to Senior BA. Healthcare data on Google Cloud, from delivery to deals.</p></div>
                <div className="jerow"><canvas width={72} height={72} data-spr="1" role="img" aria-label="Arvind reading"></canvas><b>BMS College of Engineering</b><span className="jyr">2016 – 20</span><p>B.E. Computer Science in Bangalore.</p></div>
                <div className="jerow"><canvas width={72} height={72} data-spr="0" role="img" aria-label="Arvind as a kid kicking a football"></canvas><b>Muscat, Oman</b><span className="jyr">Until 2016</span><p>Born and raised. Football first.</p></div>
              </div></div></div>
            </li>
          </ol>
        </div>
        <p className="cvline"><a className="read" href={CV} target="_blank" rel="noopener noreferrer">Full CV<span aria-hidden="true"> ↗</span></a></p>
      </section>

      <section className="sec" id="how" aria-labelledby="h-how">
        <p className="label"><span className="n">03</span>How I work</p>
        <h2 id="h-how">I own the intent and the checks.</h2>
        <ol className="mrows">
          <li><span className="n">01</span><h3>Frame</h3><p>Decide what done looks like.</p></li>
          <li><span className="n">02</span><h3>Design</h3><p>Pick the simplest system that works.</p></li>
          <li><span className="n">03</span><h3>Build</h3><p>Agents build. I own the intent and the checks.</p></li>
          <li><span className="n">04</span><h3>Check</h3><p>Test the real thing. Get a second reviewer.</p></li>
        </ol>
      </section>

      <section className="sec" id="writing" aria-labelledby="h-writing">
        <p className="label"><span className="n">04</span>Writing</p>
        <h2 id="h-writing">Notes from building.</h2>
        <ol className="posts">
          <li><span className="pt">Valid is not correct: what my thesis taught me about agents</span><span className="draft">Draft</span></li>
          <li><span className="pt">The harness: how I brief, check and review agent work</span><span className="draft">Draft</span></li>
          <li><span className="pt">From scoping deals to writing the agent</span><span className="draft">Draft</span></li>
        </ol>
        <a className="read" href="/writing">All writing<span aria-hidden="true"> →</span></a>
      </section>

      <section className="sec contact" id="contact" aria-labelledby="h-contact">
        <p className="label"><span className="n">05</span>Contact</p>
        <h2 id="h-contact">Bring me a problem.</h2>
        {room && <div className="slot cslot" id="cslot" aria-hidden="true"></div>}
        <div className="links">
          <a href="mailto:arvindguruprasad33@gmail.com">Email<span aria-hidden="true"> ↗</span></a>
          <a href="https://linkedin.com/in/arvind-guruprasad-73479a142/" target="_blank" rel="noopener noreferrer">LinkedIn<span aria-hidden="true"> ↗</span></a>
          <a href="https://github.com/arvind0212" target="_blank" rel="noopener noreferrer">GitHub<span aria-hidden="true"> ↗</span></a>
          <a href={CV} target="_blank" rel="noopener noreferrer">CV<span aria-hidden="true"> ↗</span></a>
        </div>
        <p className="fit">Open to applied AI, forward deployed and AI solutions roles in Sweden and Europe.</p>
        {back}
        <footer>The room and the people in it are drawn in code.</footer>
      </section>
    </main>
  );
}
