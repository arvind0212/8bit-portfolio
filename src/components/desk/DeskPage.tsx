"use client";

import { useEffect, useRef } from "react";
import { Instrument_Serif, Silkscreen } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Sections from "../room/Sections";
import { initDesk } from "./desk";
import "../room/room.css";
import "./desk.css";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--rf-instrument" });
const pix = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--rf-pix" });

export default function DeskPage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const w = window as Window & { __DK_TUNE?: boolean };
    const tune = !!w.__DK_TUNE || new URLSearchParams(location.search).has("tune") || process.env.NODE_ENV !== "production";
    return initDesk(ref.current, { tune });
  }, []);
  return (
    <div ref={ref} data-mode="scene" className={["rp", "dk", instrument.variable, GeistSans.variable, GeistMono.variable, pix.variable].join(" ")}>
      <div className="scene" id="scene">
        <div className="room" id="room" role="img" aria-label="Pixel art of Arvind's room in Stockholm. It builds itself, Arvind walks in and sits at his desk, and the view moves into his monitor, where the site is."></div>
        <button type="button" className="skip" id="skip">Skip<span aria-hidden="true"> »</span></button>
        <div className="roomhint" id="roomhint" hidden>
          <span>Click the monitor to sit back down.</span>
          <button type="button" id="sitback">Back to the desk</button>
        </div>
      </div>
      <div className="screen" id="screen">
        <div className="site" id="site">
          <header className="top">
            <a className="who" href="#top" aria-label="Arvind Guruprasad, back to top"><i aria-hidden="true">AG</i><b>Arvind Guruprasad</b></a>
            <nav aria-label="Main">
              <a href="#work" data-sec="work">Work</a>
              <a href="#journey" data-sec="journey">Journey</a>
              <a href="#writing" data-sec="writing">Writing</a>
              <a href="#contact" data-sec="contact">Contact</a>
              <a href="#room" data-act="room" className="toroom" aria-label="Step back into the room"><span aria-hidden="true">⌂</span> Room</a>
            </nav>
          </header>
          <Sections room={false} back={<p className="backroom"><a href="#room" data-act="room" className="read">Step back into the room<span aria-hidden="true"> ↖</span></a></p>} />
        </div>
      </div>
    </div>
  );
}
