import type { ReactNode } from "react";
import WorkSection from "../work/WorkSection";

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
        <p className="intro"><span className="dt-only">Hover a stop to walk there.</span><span className="ph-only">Tap a stop to walk there.</span></p>
        <div className="journey" id="jroot"></div>
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
