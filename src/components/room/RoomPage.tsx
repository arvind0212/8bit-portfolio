"use client";

import { useEffect, useRef } from "react";
import { Instrument_Serif, Silkscreen } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { initRoomPage } from "./init";
import Sections from "./Sections";
import Tune from "./Tune";
import "./room.css";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--rf-instrument" });
const pix = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--rf-pix" });

export default function RoomPage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initRoomPage(ref.current) : undefined), []);
  return (
    <div ref={ref} className={["rp", instrument.variable, GeistSans.variable, GeistMono.variable, pix.variable].join(" ")}>
      <header className="top">
        <a className="who" href="#top" aria-label="Arvind Guruprasad, back to top"><i aria-hidden="true">AG</i><b>Arvind Guruprasad</b></a>
        <nav aria-label="Main">
          <a href="#work" data-sec="work">Work</a>
          <a href="#journey" data-sec="journey">Journey</a>
          <a href="#writing" data-sec="writing">Writing</a>
          <a href="#contact" data-sec="contact">Contact</a>
        </nav>
      </header>

      <div className="dock" id="dock" aria-hidden="true"><span className="dl" id="dockl">the desk</span></div>
      <div className="stage" id="stage">
        <div className="room" id="room" role="img" aria-label="Pixel art of Arvind's room in Stockholm, drawn in code: a desk, framed pictures of projects, a whiteboard, a window onto the city, a terminal and a door. A small character walks to the part of the room that matches the section you are reading."></div>
      </div>

      <Tune />
      <Sections room />
    </div>
  );
}
