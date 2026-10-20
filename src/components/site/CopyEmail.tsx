"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      location.href = "mailto:" + email;
    }
  };
  return (
    <button type="button" className="cx-copy" onClick={copy} aria-label={done ? "Email address copied" : "Copy email address"} aria-live="polite">
      {done ? "Copied" : "Copy"}
    </button>
  );
}
