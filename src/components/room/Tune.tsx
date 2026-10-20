"use client";

import { useEffect } from "react";
import { initTune } from "./tune";

export default function Tune() {
  useEffect(() => {
    const asked = new URLSearchParams(location.search).has("tune");
    if (process.env.NODE_ENV === "production" && !asked) return;
    return initTune(document.querySelector(".rp") as HTMLElement, { open: asked });
  }, []);
  return null;
}
