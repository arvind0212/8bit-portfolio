import type { ReactNode } from "react";
import Hero from "../site/Hero";
import WorkSection from "../work/WorkSection";
import WritingSection from "../site/WritingSection";
import ContactSection from "../site/ContactSection";
import SiteFooter from "../site/SiteFooter";

/* the site itself: V7 draws the room into the hero and contact slots, the desk version shows it on the monitor */
export default function Sections({ room, back }: { room: boolean; back?: ReactNode }) {
  return (
    <main className="col" id="top">
      <Hero slot={room} />

      <WorkSection />

      <section className="sec" id="journey" aria-labelledby="h-journey">
        <h2 id="h-journey">From drawing the systems to building them.</h2>
        <p className="intro">As a consultant at Quantiphi I drew the cloud architectures, wrote the proposals and unblocked the engineers. Then I moved to Stockholm to study AI properly, and AI let me take the last step myself.</p>
        <div className="jr" id="jroot">
          <div className="jrail" aria-hidden="true"></div>
          <ol className="jcards">
            <li className="jcard" data-s="4" data-y="2025" data-to="–26" data-act="plugging in an agent">
              <div className="jmeta"><span className="jsr">2025 to 2026</span><span className="jlogos"><img src="/images/journey/arkus-ai.png" alt="Arkus AI" /></span></div>
              <h3>Founding AI engineer at Arkus AI.</h3>
              <button type="button" className="jmore jdet" aria-expanded="false" aria-controls="jx-arkus">What I did <span aria-hidden="true">↓</span></button>
              <div className="jx" id="jx-arkus"><div>
              <ul className="jbul">
                <li><b>Built the agent tools</b> behind its no-code clinical workflows: one tool over three EHRs (Epic, AthenaOne, Kaddio), ICD-11 and SNOMED CT coding, PubMed and ClinicalTrials.gov search.</li>
                <li><b>Set up the evals</b> and the prompt workflow, so changes to agents were measured, not guessed.</li>
                <li><b>Shipped the web app</b> and presented the product at the May 2026 launch.</li>
              </ul>
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
            <li className="jghost">
              <div className="jrow">
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
      </section>

      <WritingSection />

      <ContactSection room={room} back={back} />
      <SiteFooter />
    </main>
  );
}
