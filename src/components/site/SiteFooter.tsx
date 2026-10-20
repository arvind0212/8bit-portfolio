import type { ReactNode } from "react";
import "./site.css";

export default function SiteFooter({ back }: { back?: ReactNode }) {
  return (
    <footer className="sf">
      <p className="sf-who">© 2026 Arvind Guruprasad<span>Stockholm</span></p>
      <nav aria-label="Footer">
        <a href="#work">Work</a>
        <a href="#journey">Journey</a>
        <a href="#writing">Writing</a>
        <a href="#top">Top<span aria-hidden="true"> ↑</span></a>
      </nav>
      <p className="sf-note">The room is drawn in code.</p>
      {back && <div className="sf-back">{back}</div>}
    </footer>
  );
}
