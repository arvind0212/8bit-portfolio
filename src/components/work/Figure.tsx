import type { Flow, Glyph } from "../room/work";

const G: Record<Glyph, React.ReactNode> = {
  doc: <path d="M7 6h18M7 12h12M7 18h15M7 24h9" />,
  agent: <><circle cx="16" cy="15" r="9" /><path d="M11 15h10M16 10v10" /></>,
  check: <path d="M7 16l6 6 12-13" />,
  cross: <path d="M9 9l14 14M23 9L9 23" />,
  code: <path d="M11 9l-6 7 6 7M21 9l6 7-6 7" />,
  table: <><rect x="5" y="6" width="22" height="20" rx="2" /><path d="M5 13h22M5 19h22M13 6v20" /></>,
  chips: <><rect x="3" y="11" width="12" height="10" rx="5" /><rect x="17" y="11" width="12" height="10" rx="5" /></>,
  hand: <path d="M10 17V9a2 2 0 014 0v6M14 14v-6a2 2 0 014 0v7M18 15v-4a2 2 0 014 0v8c0 5-3 8-8 8s-7-3-8-6l-2-4a2 2 0 013-2l3 3" />,
  paste: <><rect x="8" y="6" width="16" height="21" rx="2" /><path d="M12 4h8v4h-8zM12 14h8M12 19h6" /></>,
};

/* the system as a short flow; one light pulse walks the connectors */
export default function Figure({ flow, caption }: { flow: Flow; caption: string }) {
  return (
    <figure className="figwrap">
      <ol className="flow" aria-label={caption} style={{ "--n": flow.steps.length } as React.CSSProperties}>
        {flow.steps.map((s, i) => (
          <li key={s.label} className={s.hot ? "hot" : undefined} style={{ "--i": i } as React.CSSProperties}>
            <svg viewBox="0 0 32 32" aria-hidden="true">{G[s.glyph]}</svg>
            <b>{s.label}</b>
            {s.note && <small>{s.note}</small>}
          </li>
        ))}
      </ol>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
