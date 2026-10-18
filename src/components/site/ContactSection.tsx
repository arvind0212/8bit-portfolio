import type { ReactNode } from "react";
import CopyEmail from "./CopyEmail";
import { LINKEDIN } from "./writing";
import "./site.css";

export const EMAIL = "arvindguruprasad33@gmail.com";
export const CV = "https://drive.google.com/file/d/1NuS61X_awnnDSR8uW-5jEng5P1QcZ2f3/view?usp=drive_link";

const ROLES: [string, string[]][] = [
  ["Solutions and deployment", ["AI Solutions Engineer", "Deployment Lead", "Applied AI Consultant"]],
  ["Product", ["Technical AI Product Manager", "Forward Deployed PM"]],
  ["Engineering", ["Forward Deployed Engineer", "Applied AI Engineer"]],
];

export default function ContactSection({ room, back }: { room: boolean; back?: ReactNode }) {
  return (
    <section className="sec cx" id="contact" aria-labelledby="h-contact">
      <p className="label"><span className="n">05</span>Contact</p>
      <h2 id="h-contact">Bring me a problem.</h2>
      {room && <div className="slot cslot" id="cslot" aria-hidden="true"></div>}
      <p className="cx-line">Based in Stockholm. Open to roles across Sweden and Europe, including remote.</p>
      <div className="cx-act">
        <div className="cx-mail">
          <a href={"mailto:" + EMAIL}><span className="cx-k">Email</span><span className="cx-v">{EMAIL}</span></a>
          <CopyEmail email={EMAIL} />
        </div>
        <ul className="cx-links">
          <li><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn<span aria-hidden="true"> ↗</span></a></li>
          <li><a href="https://github.com/arvind0212" target="_blank" rel="noopener noreferrer">GitHub<span aria-hidden="true"> ↗</span></a></li>
          <li><a href={CV} target="_blank" rel="noopener noreferrer">CV<span aria-hidden="true"> ↗</span></a></li>
        </ul>
      </div>
      <div className="cx-roles">
        <h3 className="cx-rh">Roles I fit</h3>
        <dl>
          {ROLES.map(([g, rs]) => (
            <div key={g}>
              <dt>{g}</dt>
              {rs.map((r) => <dd key={r}>{r}</dd>)}
            </div>
          ))}
        </dl>
      </div>
      {back && <div className="cx-back">{back}</div>}
    </section>
  );
}
