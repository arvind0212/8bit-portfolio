"use client";

import { useEffect, useRef } from "react";
import { paint, SW, SH } from "../room/journey";

/* the journey's Stockholm stop closes the page: snow falls, he holds a coffee, and the fika row makes him sip */
export default function ContactSprite() {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!, sec = c.closest("section")!, still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = 5;
    let hold = -1, k = 0;
    const draw = () => paint(c, scene, hold >= 0 ? hold : k);
    const on = (e: Event) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.k);
      hold = i === 3 ? 2 : -1; draw();
    };
    const off = () => { hold = -1; draw(); };
    const rows = [...sec.querySelectorAll<HTMLElement>(".cx-list a[data-k]")];
    rows.forEach((a) => { a.addEventListener("pointerenter", on); a.addEventListener("focus", on); a.addEventListener("pointerleave", off); a.addEventListener("blur", off); });
    draw();
    const t = still ? 0 : window.setInterval(() => { k = (k + 1) % 4; if (k === 2) k = 3; draw(); }, 520);
    return () => { clearInterval(t); rows.forEach((a) => { a.removeEventListener("pointerenter", on); a.removeEventListener("focus", on); a.removeEventListener("pointerleave", off); a.removeEventListener("blur", off); }); };
  }, []);
  return (
    <div className="cx-spr">
      <canvas ref={cv} width={SW} height={SH} role="img" aria-label="Arvind in the Stockholm snow with a coffee" />
    </div>
  );
}
