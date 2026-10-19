import type { ReactNode } from "react";
import WorkSection from "../work/WorkSection";
import WritingSection from "../site/WritingSection";
import ContactSection from "../site/ContactSection";
import SiteFooter from "../site/SiteFooter";
import HowLoop from "../site/HowLoop";

export const CV = "https://drive.google.com/file/d/1NuS61X_awnnDSR8uW-5jEng5P1QcZ2f3/view?usp=drive_link";

/* the site itself: V7 draws the room into the hero and contact slots, the desk version shows it on the monitor */
export default function Sections({ room, back }: { room: boolean; back?: ReactNode }) {
  return (
    <main className="col" id="top">
      <section className="hero" id="hero" aria-labelledby="h1">
        <p className="hi">Hi, I&apos;m Arvind, an <b>AI-native tech generalist</b> in Stockholm.</p>
        <h1 id="h1"><span className="ln">I designed the <span className="nb">systems.<canvas className="px" id="wb" aria-hidden="true" width="0" height="0"></canvas></span></span> <span className="ln">Now I <span className="nb"><em>build</em> them too.<canvas className="px" id="bx" aria-hidden="true" width="0" height="0"></canvas></span></span></h1>
        {room && <div className="slot" id="slot" aria-hidden="true"></div>}
        <p className="value">As a consultant I drew the cloud architectures, wrote the proposals and unblocked the engineers. AI let me take the last step myself.</p>
        <div className="acts">
          <a className="btn" href="#work">See the work<span aria-hidden="true">↓</span></a>
          <a className="read" href="#contact">Get in touch<span aria-hidden="true">→</span></a>
        </div>
      </section>

      <WorkSection />

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
              <button type="button" className="jmore jdet" aria-expanded="false" aria-controls="jx-arkus">What I did <span aria-hidden="true">↓</span></button>
              <div className="jx" id="jx-arkus"><div>
              <ul className="jbul">
                <li><b>Built the agent tools</b> the platform runs on: one tool over three EHRs (Epic, AthenaOne, Kaddio), ICD-11 and SNOMED CT coding, PubMed and ClinicalTrials.gov search.</li>
                <li><b>Set up the evals</b> and the prompt workflow, so changes to agents were measured, not guessed.</li>
                <li><b>Shipped the web app</b> and presented the product at the May 2026 launch.</li>
              </ul>
              <p className="jcoda">I left in September to look for work that&apos;s more interesting to me and that I can sustain for the long run.</p>
              </div></div>
            </li>
            <li className="jcard" data-s="3" data-y="2024" data-to="–26" data-act="at a laptop with a thesis chart">
              <div className="jmeta"><span className="jsr">2024 to 2026</span><span className="jlogos"><img src="/images/journey/karolinska.png" alt="Karolinska Institutet" /><img src="/images/journey/kth.png" alt="KTH" /><img src="/images/journey/stockholm-university.png" alt="Stockholm University" /></span></div>
              <h3>I hit my technical ceiling, so I went back to school.</h3>
              <p className="jhook">Four years of consulting taught me to scope and sell AI. I wanted to understand it deeply, so I turned down a go-to-market lead role and moved to Stockholm.</p>
              <button type="button" className="jmore jdet" aria-expanded="false" aria-controls="jx-ki">What I did <span aria-hidden="true">↓</span></button>
              <div className="jx" id="jx-ki"><div>
              <ul className="jbul">
                <li><b>MSc Biostatistics &amp; Data Science,</b> a joint degree from KI, KTH and Stockholm University, focused on healthcare AI.</li>
                <li><b>Research assistant at KI:</b> an LLM pipeline that read 1,000+ Swedish prescriptions with 99.4% success.</li>
                <li><b>Thesis with Arkus AI:</b> benchmarking agent architectures for clinical data standardisation.</li>
                <li><b>Built the programme&apos;s degree-project portal,</b> where researchers post thesis ideas for students.</li>
              </ul>
              </div></div>
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
        <div className="howgrid">
          <div>
            <h2 id="h-how">People set the intent. Agents do the work.</h2>
            <p className="intro">I start from what people need and write the brief. Agents build it and check it against that brief, and what we learn starts the next round.</p>
          </div>
          <HowLoop />
        </div>
      </section>

      <WritingSection />

      <ContactSection room={room} back={back} />
      <SiteFooter />
    </main>
  );
}
