"use client";

import { useEffect, useRef } from "react";

const LINKS = [["work", "Work"], ["journey", "Journey"], ["writing", "Writing"], ["contact", "Contact"]];

/* the one top bar: name on the left, sections on the right; on the home page it lights the section you are in */
export default function TopBar({ home = true, room = false }: { home?: boolean; room?: boolean }) {
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!home || !nav.current) return;
    const links = [...nav.current.querySelectorAll<HTMLAnchorElement>("a[data-sec]")];
    let raf = 0;
    const spy = () => {
      raf = 0;
      const y = innerHeight * 0.4;
      let on = "";
      for (const a of links) {
        const s = document.getElementById(a.dataset.sec!);
        if (s && s.getBoundingClientRect().top <= y) on = a.dataset.sec!;
      }
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) on = "contact";
      for (const a of links) {
        a.classList.toggle("on", a.dataset.sec === on);
        if (a.dataset.sec === on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      }
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(spy); };
    addEventListener("scroll", ask, { passive: true });
    addEventListener("resize", ask);
    spy();
    return () => { removeEventListener("scroll", ask); removeEventListener("resize", ask); cancelAnimationFrame(raf); };
  }, [home]);
  const to = home ? "#" : "/#";
  return (
    <header className="top">
      <a className="who" href={home ? "#top" : "/"} aria-label={home ? "Arvind Guruprasad, back to top" : "Arvind Guruprasad, home"}><i aria-hidden="true">AG</i><b>Arvind Guruprasad</b></a>
      <nav aria-label="Main" ref={nav}>
        {LINKS.map(([id, name]) => <a key={id} href={to + id} data-sec={home ? id : undefined}>{name}</a>)}
        {room && <span className="sep" aria-hidden="true"></span>}
        {room && <a href="#room" data-act="room" className="toroom" aria-label="Step back into the room"><span aria-hidden="true">⌂</span> Room</a>}
      </nav>
    </header>
  );
}
