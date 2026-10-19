"use client";

import { useEffect, useRef } from "react";
import { FONT_VARS } from "../room/fonts";
import Sections from "../room/Sections";
import TopBar from "../room/TopBar";
import Tune from "../room/Tune";
import { initDesk } from "./desk";
import { initHeroMotion } from "../site/heroMotion";
import "../room/room.css";
import "./desk.css";


export default function DeskPage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const w = window as Window & { __DK_TUNE?: boolean };
    const tune = !!w.__DK_TUNE || new URLSearchParams(location.search).has("tune") || process.env.NODE_ENV !== "production";
    const page = ref.current, endDesk = initDesk(page, { tune }), endHero = initHeroMotion(page);
    return () => { endHero(); endDesk(); };
  }, []);
  return (
    <div ref={ref} data-mode="scene" className={["rp", "dk", FONT_VARS].join(" ")}>
      <div className="scene" id="scene" role="img" aria-labelledby="roomdesc">
        <p className="sr" id="roomdesc">A voxel model of Arvind&apos;s room in Stockholm builds itself, and the view moves into the monitor on his desk, where the site is.</p>
        <button type="button" className="skip" id="skip">Skip<span aria-hidden="true"> »</span></button>
        <div className="roomhint" id="roomhint" hidden>
          <span>Click the monitor to sit back down.</span>
          <button type="button" id="sitback">Back to the desk</button>
        </div>
      </div>
      <canvas className="dissolve" id="dissolve" hidden aria-hidden="true"></canvas>
      <div className="screen" id="screen">
        <div className="site" id="site">
          <TopBar room />
          <Tune />
          <Sections room={false} back={<p className="backroom"><a href="#room" data-act="room" className="read">Step back into the room<span aria-hidden="true"> ↖</span></a></p>} />
        </div>
      </div>
    </div>
  );
}
