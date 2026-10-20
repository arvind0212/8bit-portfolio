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
        <h2 id="h-journey">Consultant first. Engineer now.</h2>
        <p className="intro">At Quantiphi I led our R&amp;D on Google Cloud&apos;s Healthcare Data Engine with Google&apos;s product team. Then I moved to Stockholm to learn to build.</p>
        <div className="jr" id="jroot">
          <div className="jrail" aria-hidden="true"></div>
          <ol className="jcards">
            <li className="jcard" data-s="4" data-y="2025" data-to="–26" data-act="plugging in an agent">
              <div className="jmeta"><span className="jsr">2025 to 2026</span><span className="jlogos"><img src="/images/journey/arkus-ai.png" alt="Arkus AI" /></span></div>
              <h3>Founding AI engineer at Arkus AI.</h3>
              <button type="button" className="jmore jdet" aria-expanded="false" aria-controls="jx-arkus">What I did <span aria-hidden="true">↓</span></button>
              <div className="jx" id="jx-arkus"><div>
              <ul className="jbul">
                <li><b>Built the multi-agent framework</b> behind the builder: main, build and evaluation agents.</li>
                <li><b>Gave them tools</b> for medical codes, papers and trials, and sandbox EHRs (Epic, AthenaOne, Kaddio).</li>
                <li><b>Built a local-LLM pipeline</b> to strip patient details from clinical text, with human review.</li>
                <li><b>Set up LangSmith evals</b> with golden datasets, so prompt changes were scored.</li>
                <li><b>Led the web platform build</b> through our public launch to customers in May 2026.</li>
              </ul>
              </div></div>
            </li>
            <li className="jcard" data-s="3" data-y="2024" data-to="–26" data-act="at a laptop with a thesis chart">
              <div className="jmeta"><span className="jsr">2024 to 2026</span><span className="jlogos"><img src="/images/journey/karolinska.png" alt="Karolinska Institutet" /><img src="/images/journey/kth.png" alt="KTH" /><img src="/images/journey/stockholm-university.png" alt="Stockholm University" /></span></div>
              <h3>I went back for a master&apos;s in healthcare AI.</h3>
              <p className="jhook">MSc Biostatistics &amp; Data Science, a joint degree from KI, KTH and Stockholm University. I turned down a go-to-market lead role to do it.</p>
              <button type="button" className="jmore jdet" aria-expanded="false" aria-controls="jx-ki">What I did <span aria-hidden="true">↓</span></button>
              <div className="jx" id="jx-ki"><div>
              <ul className="jbul">
                <li><b>KI research:</b> built a prescription pipeline solo, from labelling rules to validation.</li>
                <li><b>Thesis with Arkus AI:</b> graded agents field by field on synthetic hospital data.</li>
                <li><b>Portal:</b> built my programme&apos;s degree-project portal on the side.</li>
              </ul>
              </div></div>
            </li>
            <li className="jghost">
              <div className="jrow">
                <button type="button" className="jmore" aria-expanded="false" aria-controls="jearly">See the full journey <span aria-hidden="true">↓</span></button>
              </div>
              <div className="jcollapse" id="jearly"><div><div className="jearlier">
                <div className="jerow"><canvas width={72} height={72} data-spr="2" role="img" aria-label="Arvind presenting at a whiteboard"></canvas><b>Quantiphi</b><span className="jyr">2020 – 24</span><p>Business Analyst to Senior BA. Helped found the Healthcare Insights practice and led delivery on $5M+ of work.</p></div>
                <div className="jerow"><canvas width={72} height={72} data-spr="1" role="img" aria-label="Arvind reading"></canvas><b>BMS College of Engineering</b><span className="jyr">2016 – 20</span><p>B.E. Computer Science.</p></div>
                <div className="jerow"><canvas width={72} height={72} data-spr="0" role="img" aria-label="Arvind as a kid kicking a football"></canvas><b>Muscat, Oman</b><span className="jyr">Until 2016</span><p>Born and raised. Moved to Bangalore in 2016.</p></div>
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
