"use client";

import { useEffect, useRef } from "react";
import { initRoomPage } from "./init";
import { initHero } from "./heroPixels";
import { FONT_VARS } from "./fonts";
import Sections from "./Sections";
import Tune from "./Tune";
import TopBar from "./TopBar";
import "./room.css";


export default function RoomPage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const endRoom = initRoomPage(ref.current), endHero = initHero(ref.current);
    return () => { endHero(); endRoom(); };
  }, []);
  return (
    <div ref={ref} className={["rp", FONT_VARS].join(" ")}>
      <TopBar />

      <div className="dock" id="dock" aria-hidden="true"><span className="dl" id="dockl">the desk</span></div>
      <div className="stage" id="stage">
        <div className="room" id="room" role="img" aria-label="Pixel art of Arvind's room in Stockholm, drawn in code: a desk, framed pictures of projects, a whiteboard, a window onto the city, a terminal and a door. A small character walks to the part of the room that matches the section you are reading."></div>
      </div>

      <Tune />
      <Sections room />
    </div>
  );
}
