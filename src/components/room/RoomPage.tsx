"use client";

import { useEffect, useRef } from "react";
import { Fraunces, Inter, Instrument_Serif, Silkscreen } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { initRoomPage } from "./init";
import "./room.css";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--rf-instrument" });
const pix = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--rf-pix" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--rf-inter", preload: false });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--rf-fraunces", preload: false });

export default function RoomPage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initRoomPage(ref.current) : undefined), []);
  return (
    <div ref={ref} className={["rp", instrument.variable, GeistSans.variable, GeistMono.variable, pix.variable, inter.variable, fraunces.variable].join(" ")}>
      <svg width="0" height="0" style={{'position':'absolute'} as React.CSSProperties} aria-hidden="true">
        <symbol id="i-arrow" viewBox="0 0 24 24"><path pathLength="1" d="M5 12h14M13 6l6 6-6 6"/></symbol>
        <symbol id="i-left" viewBox="0 0 24 24"><path pathLength="1" d="M15 6l-6 6 6 6"/></symbol>
        <symbol id="i-right" viewBox="0 0 24 24"><path pathLength="1" d="M9 6l6 6-6 6"/></symbol>
        <symbol id="i-globe" viewBox="0 0 24 24"><circle pathLength="1" cx="12" cy="12" r="9"/><path pathLength="1" d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></symbol>
        <symbol id="i-brief" viewBox="0 0 24 24"><rect pathLength="1" x="3" y="7" width="18" height="13" rx="2"/><path pathLength="1" d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/></symbol>
        <symbol id="i-spark" viewBox="0 0 24 24"><path pathLength="1" d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/></symbol>
        <symbol id="i-cross" viewBox="0 0 24 24"><rect pathLength="1" x="3" y="3" width="18" height="18" rx="5"/><path pathLength="1" d="M12 8v8M8 12h8"/></symbol>
        <symbol id="i-agent" viewBox="0 0 24 24"><rect pathLength="1" x="4" y="7" width="16" height="12" rx="3"/><path pathLength="1" d="M12 7V4M9 12v1M15 12v1M9 16h6"/><circle pathLength="1" cx="12" cy="3.5" r=".5"/></symbol>
        <symbol id="i-cap" viewBox="0 0 24 24"><path pathLength="1" d="M2 9l10-5 10 5-10 5z"/><path pathLength="1" d="M6 11v5c2 1.6 4 2.4 6 2.4s4-.8 6-2.4v-5M22 9v6"/></symbol>
        <symbol id="i-loop" viewBox="0 0 24 24"><path pathLength="1" d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path pathLength="1" d="M18 3v4h-4M6 21v-4h4"/></symbol>
        <symbol id="i-target" viewBox="0 0 24 24"><circle pathLength="1" cx="12" cy="12" r="9"/><circle pathLength="1" cx="12" cy="12" r="5"/><circle pathLength="1" cx="12" cy="12" r="1"/></symbol>
        <symbol id="i-build" viewBox="0 0 24 24"><path pathLength="1" d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><circle pathLength="1" cx="12" cy="12" r="9"/><path pathLength="1" d="M8 12.5l2.7 2.7L16 9.8"/></symbol>
        <symbol id="i-lock" viewBox="0 0 24 24"><rect pathLength="1" x="5" y="11" width="14" height="10" rx="2"/><path pathLength="1" d="M8 11V8a4 4 0 0 1 8 0v3"/></symbol>
        <symbol id="i-term" viewBox="0 0 24 24"><rect pathLength="1" x="3" y="4" width="18" height="16" rx="2"/><path pathLength="1" d="M7 9l3 3-3 3M12 15h5"/></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24"><rect pathLength="1" x="3" y="5" width="18" height="14" rx="2"/><path pathLength="1" d="M3 7l9 6 9-6"/></symbol>
        <symbol id="i-code" viewBox="0 0 24 24"><path pathLength="1" d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></symbol>
        <symbol id="i-user" viewBox="0 0 24 24"><circle pathLength="1" cx="12" cy="8" r="4"/><path pathLength="1" d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></symbol>
        <symbol id="i-doc" viewBox="0 0 24 24"><path pathLength="1" d="M6 3h8l4 4v14H6z"/><path pathLength="1" d="M14 3v4h4M9 12h6M9 16h6"/></symbol>
        <symbol id="i-tool" viewBox="0 0 24 24"><circle pathLength="1" cx="12" cy="12" r="3"/><path pathLength="1" d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></symbol>
        <symbol id="i-watch" viewBox="0 0 24 24"><circle pathLength="1" cx="12" cy="13.5" r="7.5"/><path pathLength="1" d="M12 13.5V9.5M10 2.5h4M12 2.5V6M18.5 6.5l1.5-1.5"/></symbol>
        <symbol id="i-lens" viewBox="0 0 24 24"><circle pathLength="1" cx="10.5" cy="10.5" r="6.5"/><path pathLength="1" d="M15.5 15.5L21 21"/></symbol>
        <symbol id="i-coins" viewBox="0 0 24 24"><ellipse pathLength="1" cx="9" cy="7" rx="6" ry="2.5"/><path pathLength="1" d="M3 7v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7"/><path pathLength="1" d="M9 16.5c-3.3 0-6-1.1-6-2.5"/><ellipse pathLength="1" cx="15" cy="15" rx="6" ry="2.5"/><path pathLength="1" d="M9 15v3c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-3"/></symbol>
        <symbol id="i-cabinet" viewBox="0 0 24 24"><rect pathLength="1" x="5" y="3" width="14" height="18" rx="2"/><path pathLength="1" d="M5 9h14M5 15h14M10 6h4M10 12h4M10 18h4"/></symbol>
        <symbol id="i-note" viewBox="0 0 24 24"><path pathLength="1" d="M4 4h16v11l-5 5H4z"/><path pathLength="1" d="M15 20v-5h5M8 9h8M8 13h5"/></symbol>
        <symbol id="i-clip" viewBox="0 0 24 24"><rect pathLength="1" x="5" y="4" width="14" height="17" rx="2"/><path pathLength="1" d="M9 4V3h6v1M9 4v2h6V4M8.5 11l1.5 1.5 3-3M8.5 16.5h7"/></symbol>
        <symbol id="i-wrench" viewBox="0 0 24 24"><path pathLength="1" d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/></symbol>
        <symbol id="i-hand" viewBox="0 0 24 24"><rect pathLength="1" x="3" y="5" width="18" height="14" rx="3"/><path pathLength="1" d="M7 10v4M5 12h4M15 11h.01M18 13h.01"/></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><path pathLength="1" d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle pathLength="1" cx="12" cy="10" r="2.3"/></symbol>
      </svg>

      <header className="top">
        <a className="who" href="#top" aria-label="Arvind Guruprasad, back to top"><i aria-hidden="true">AG</i><b>Arvind Guruprasad</b></a>
        <nav aria-label="Main">
          <a href="#work" data-sec="work">Work</a>
          <a href="#experience" data-sec="experience">Experience</a>
          <a href="#how" data-sec="how">How<span className="lg"> I work</span></a>
          <a href="#contact" data-sec="contact">Contact</a>
        </nav>
      </header>

      <div className="band" id="band" aria-hidden="true"></div>
      <div className="stage" id="stage">
        <div className="room" id="room" role="img" aria-label="Pixel art of Arvind's room in Stockholm, drawn in code: a desk, framed pictures of projects, a whiteboard and a workbench, a window onto the city, a terminal and a door. A small character walks to the part of the room that matches the section you are reading."></div>
      </div>
      <div className="where" id="where" aria-hidden="true"><i></i>At <b id="whereb">the desk</b><span className="tm" id="tm"></span></div>

      <main className="col" id="top">
        <section className="hero" id="hero" aria-labelledby="h1">
          <span className="name">Arvind Guruprasad · Stockholm</span>
          <h1 id="h1">Strategy that ships.</h1>
          <div className="slot" id="slot" aria-hidden="true"></div>
          <p className="value">I'm a <em>tech generalist</em>. I turn strategy into working systems, from scoping the deal to writing the agent.</p>
          <div className="ctas">
            <a className="btn dark" href="#work">See the work<svg className="ic"><use href="#i-arrow"/></svg></a>
            <a className="btn light" href="#agent">Ask my agent</a>
          </div>
          <p className="hproof">Proof: <b>a prescription pipeline at Karolinska Institutet with 99.4% success on 1,000+ records.</b> Four years scoping healthcare data deals at Quantiphi, then I moved to building because <span className="ph">[reason]</span>.</p>
        </section>

        <div className="reading">
          <section className="sec" id="work" aria-labelledby="h-work">
            <div className="label rv"><span className="n">01</span>Work<span className="at">the framed wall</span></div>
            <h2 id="h-work" className="rv">Proof, with the limits written down.</h2>
            <p className="intro rv">Three peeks into the real work: the problem, the call I made and what came of it. Lit layers are the ones I owned.</p>

            <div className="car rv" id="car" aria-roledescription="carousel" aria-label="Case studies">
              <div className="track" id="track" tabIndex={0}>
                <article className="case" aria-roledescription="slide" aria-label="1 of 3: thesis">
                  <div className="fig" aria-hidden="true"><span className="fn">FIG. 01</span><span className="fk">accepted accuracy</span>
                    <div className="bars pv"><div className="hi"><span>labs</span><i style={{'--w':'100%'} as React.CSSProperties}></i><span>~100</span></div><div className="hi"><span>meds</span><i style={{'--w':'91%'} as React.CSSProperties}></i><span>91</span></div></div>
                    <p className="pv mu">best agent, accepted accuracy %</p>
                    <p className="foot">52 synthetic patients, five layers of noise. The tool-heavy agents failed more often.</p></div>
                  <div className="cb">
                    <div className="meta"><span className="chip done">FINISHED</span><span className="who2"><svg className="ic"><use href="#i-cap"/></svg>Master's thesis · 2026</span><span>Shows: <b style={{'color':'var(--ink)','fontWeight':'500'} as React.CSSProperties}>I build it myself</b></span></div>
                    <h3>Mapped hospital data can look valid and still be clinically wrong.</h3>
                    <dl className="pdo"><dt>Decision</dt><dd>Generic prompts, so each agent differs by one capability only.</dd><dt>Outcome</dt><dd>~100% on labs and 91% on medications, on synthetic data.</dd></dl>
                    <ul className="layers" aria-label="Layers I owned"><li className="own">Discovery<span className="sr">, owned</span></li><li className="own">Strategy<span className="sr">, owned</span></li><li className="own">Architecture<span className="sr">, owned</span></li><li className="own">Build<span className="sr">, owned</span></li><li>Rollout<span className="sr">, not deployed</span></li></ul>
                    <div className="cfoot"><a className="more" href="/thesis-summary.html">Read the summary<svg className="ic"><use href="#i-arrow"/></svg></a></div>
                  </div>
                </article>
                <article className="case" aria-roledescription="slide" aria-label="2 of 3: Ambient Island">
                  <div className="fig" aria-hidden="true"><span className="fn">FIG. 02</span><span className="fk">sketch</span>
                    <div className="screen"><div className="ln" style={{'width':'44%','background':'#CDBFA8'} as React.CSSProperties}></div><div className="ln" style={{'width':'92%'} as React.CSSProperties}></div><div className="ln" style={{'width':'80%'} as React.CSSProperties}></div><div className="ln" style={{'width':'88%'} as React.CSSProperties}></div><div className="ln" style={{'width':'56%'} as React.CSSProperties}></div><div className="ln sel" style={{'width':'72%'} as React.CSSProperties}></div><div className="ln" style={{'width':'64%'} as React.CSSProperties}></div></div>
                    <div className="isl"><span>Ask</span><span className="cp">page ×</span><span className="cp">text ×</span><span className="ok">Approve</span></div>
                    <p className="foot">Context arrives as chips you can remove. Nothing is pasted until you approve. Live checks are still open.</p></div>
                  <div className="cb">
                    <div className="meta"><span className="chip wip">IN PROGRESS</span><span className="who2"><svg className="ic"><use href="#i-globe"/></svg>Ambient Island · <span className="ph">year</span></span><span>Shows: <b style={{'color':'var(--ink)','fontWeight':'500'} as React.CSSProperties}>I design for the person using it</b></span></div>
                    <h3>Asking an agent about your screen starts with copy and paste.</h3>
                    <dl className="pdo"><dt>Decision</dt><dd>Removable context chips, and no paste without approval.</dd><dt>Outcome</dt><dd>Chips and the approval gate pass every offline check.</dd></dl>
                    <ul className="layers" aria-label="Layers I owned"><li className="tbc">Discovery <span className="ph">tbc</span></li><li className="own">Strategy<span className="sr">, owned</span></li><li className="own">Architecture<span className="sr">, owned</span></li><li className="own">Build<span className="sr">, owned</span></li><li>Rollout<span className="sr">, not yet</span></li></ul>
                    <div className="cfoot"><span className="ph">link held: confirm Ambient can be shown</span></div>
                  </div>
                </article>
                <article className="case" aria-roledescription="slide" aria-label="3 of 3: HL7v2 to FHIR accelerator">
                  <div className="fig" aria-hidden="true"><span className="fn">FIG. 03</span><span className="fk">HL7v2 → FHIR</span>
                    <div className="map pv"><span className="seg">PID|1||48213^^^MRN</span><span className="to">→</span><span className="res">Patient</span><span className="seg">OBX|1|NM|2345-7^Glucose</span><span className="to">→</span><span className="res d2">Observation</span><span className="seg">RXE|1|00069^Amoxicillin</span><span className="to">→</span><span className="res d3">MedicationRequest</span></div>
                    <p className="foot">The mapping was done by hand for every hospital feed. A team accelerator drafted it first.</p></div>
                  <div className="cb">
                    <div className="meta"><span className="chip done">TEAM RESULT</span><span className="who2"><svg className="ic"><use href="#i-brief"/></svg>Quantiphi · 2022–2024</span><span>Shows: <b style={{'color':'var(--ink)','fontWeight':'500'} as React.CSSProperties}>I scope and lead the work</b></span></div>
                    <h3>Every hospital's HL7v2 feed had to be mapped to FHIR by hand.</h3>
                    <dl className="pdo"><dt>Decision</dt><dd>Led a GenAI accelerator as TPM; my part was design and delivery.</dd><dt>Outcome</dt><dd>65–70% accuracy on available samples; a projected 40–50% cut in mapping effort.</dd></dl>
                    <ul className="layers" aria-label="Layers I owned"><li className="own">Discovery<span className="sr">, owned</span></li><li className="own">Strategy<span className="sr">, owned</span></li><li className="tbc">Architecture <span className="ph">tbc</span></li><li>Build<span className="sr">, team</span></li><li className="own">Rollout<span className="sr">, owned</span></li></ul>
                    <div className="cfoot"><a className="more" href="#agent">Ask my agent about it<svg className="ic"><use href="#i-arrow"/></svg></a></div>
                  </div>
                </article>
              </div>
              <div className="ctrl">
                <div className="dots" id="dots" role="tablist" aria-label="Choose a case study"></div>
                <div className="arrows"><span className="kh">← → to switch</span><button type="button" id="prev" aria-label="Previous case study"><svg className="ic"><use href="#i-left"/></svg></button><button type="button" id="next" aria-label="Next case study"><svg className="ic"><use href="#i-right"/></svg></button></div>
              </div>
            </div>

          </section>

          <section className="sec" id="experience" aria-labelledby="h-exp">
            <div className="label rv"><span className="n">02</span>Experience<span className="at">the desk</span></div>
            <h2 id="h-exp" className="rv">From scoping deals to writing the agent.</h2>
            <p className="intro rv">Quantiphi, the AI boom, Stockholm, then building in public.</p>
            <ol className="chap">
              <li className="rv"><span className="badge" data-iso="stack"></span><h3>Quantiphi, analyst<small>2020–22</small></h3><p>Translated between clinicians, Google's healthcare data team and engineers.</p></li>
              <li className="rv"><span className="badge" data-iso="board"></span><h3>Quantiphi, TPM<small>2022–24</small></h3><p>Scoped SOWs, owned an NHS research-environment RFP and led a GenAI mapping accelerator.</p></li>
              <li className="rv"><span className="badge" data-iso="book"></span><h3>MSc, Stockholm<small>2024–26</small></h3><p>A thesis that found mapped data can be valid and still wrong.</p></li>
              <li className="rv"><span className="badge" data-iso="cross"></span><h3>Karolinska Institutet<small>2025 <span className="ph">month</span></small></h3><p>Built a prescription pipeline: 99.4% success on 1,000+ records.</p></li>
              <li className="rv"><span className="badge" data-iso="graph"></span><h3>Arkus AI <span className="ph">title</span><small>May 2025 – Sep 2026</small></h3><p>Built agent tools for EHRs, medical coding and clinical guidelines.</p></li>
              <li className="rv"><span className="badge" data-iso="term"></span><h3>Now: building in public<small>2026</small></h3><p>My own harness of skills, memory and agents. This site too.</p></li>
            </ol>
          </section>

          <section className="sec" id="how" aria-labelledby="h-how">
            <div className="label rv"><span className="n">03</span>How I work<span className="at">the whiteboard</span></div>
            <h2 id="h-how" className="rv">I own the intent and the checks.</h2>
            <p className="intro rv">Agents execute. The same four steps on every job.</p>
            <ol className="chap rows">
              <li className="rv"><span className="badge" data-iso="flag"></span><h3>Set the intent</h3><p>Who it is for, what we give up, what counts as done. Nothing is built until I confirm the brief.</p></li>
              <li className="rv"><span className="badge" data-iso="blocks"></span><h3>Let agents build</h3><p>One model orchestrates; cheaper ones do the legwork, each on an explicit model.</p></li>
              <li className="rv"><span className="badge" data-iso="check"></span><h3>Check before done</h3><p>Run it against the real thing, then a model from another family reviews the diff.</p></li>
              <li className="rv"><span className="badge" data-iso="lock"></span><h3>Stay in control</h3><p>Nothing is sent or deleted without my approval. A mistake I correct twice becomes a rule.</p></li>
            </ol>
            <div className="subhead" id="kit">
              <div className="label rv">The kit on the workbench<span className="at">tap a tool to see what it does</span></div>
              <ul className="tools rv" id="tools"></ul>
              <div className="benchnote" id="benchnote" aria-live="polite" hidden></div>
            </div>
          </section>

          <section className="sec" id="agent" aria-labelledby="h-agent">
            <div className="label rv"><span className="n">04</span>Ask my agent<span className="at">the terminal</span></div>
            <h2 id="h-agent" className="rv">What could you do for us? Ask.</h2>
            <p className="intro rv">In my words, from my own notes. <span className="ph">hosted agent not built</span></p>
            <div className="term rv" aria-label="Ask my agent, scripted preview">
              <div className="bar"><svg className="ic"><use href="#i-term"/></svg><span className="tt">arvind@room ~ ask</span><span>scripted · no model yet</span></div>
              <div className="tlog" id="tlog" aria-live="polite"></div>
              <div className="qs" id="qs"></div>
            </div>
          </section>

          <section className="sec" id="contact" aria-labelledby="h-contact">
            <div className="label rv"><span className="n">05</span>Contact<span className="at">the door</span></div>
            <h2 id="h-contact" className="rv">Bring me a problem.</h2>
            <p className="intro rv">A short note with the problem is enough.</p>
            <div className="links rv">
              <div><svg className="ic"><use href="#i-mail"/></svg><span className="k">Email</span><span className="v"><span className="ph">placeholder</span></span></div>
              <a href="https://github.com/arvind0212"><svg className="ic"><use href="#i-code"/></svg><span className="k">GitHub</span><span className="v">arvind0212 ↗</span></a>
              <div><svg className="ic"><use href="#i-user"/></svg><span className="k">LinkedIn</span><span className="v"><span className="ph">placeholder</span></span></div>
              <div><svg className="ic"><use href="#i-doc"/></svg><span className="k">CV</span><span className="v"><span className="ph">placeholder</span></span></div>
            </div>
            <p className="fit rv"><b>Roles I fit:</b> applied AI, forward deployed, AI solutions. Sweden and Europe.</p>
            <footer><span>The room is drawn in code. Draft, copy unreviewed.</span><div className="fonts" role="group" aria-label="Typeface pairing"><span>Type</span><button type="button" data-font="instrument" aria-pressed="true" aria-label="Instrument Serif and Geist" title="Instrument Serif + Geist">Aa</button><button type="button" data-font="inter" aria-pressed="false" aria-label="Inter only" title="Inter">Aa</button><button type="button" data-font="fraunces" aria-pressed="false" aria-label="Fraunces and Geist" title="Fraunces + Geist">Aa</button></div></footer>
          </section>
        </div>
      </main>
    </div>
  );
}
