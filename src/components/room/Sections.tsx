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
        <p className="intro">From Muscat to Stockholm, and from consulting to building. <span className="dt-only">Hover a stop to walk there.</span><span className="ph-only">Tap a stop to walk there.</span></p>
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
