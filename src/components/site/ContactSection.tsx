import type { ReactNode } from "react";
import CopyEmail from "./CopyEmail";
import { DocIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";
import "./site.css";

export const EMAIL = "arvindguruprasad33@gmail.com";
export const CV = "https://drive.google.com/file/d/1NuS61X_awnnDSR8uW-5jEng5P1QcZ2f3/view?usp=drive_link";

export const LINKEDIN = "https://www.linkedin.com/in/arvind-guruprasad-73479a142/";

const LINKS: [string, string, string, () => React.JSX.Element][] = [
  ["LinkedIn", "Arvind Guruprasad", LINKEDIN, LinkedInIcon],
  ["GitHub", "arvind0212", "https://github.com/arvind0212", GitHubIcon],
  ["CV", "PDF", CV, DocIcon],
];

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
          <a href={"mailto:" + EMAIL}><span className="cx-ic"><MailIcon /></span><span className="cx-mt"><span className="cx-k">Email me</span><span className="cx-v">{EMAIL.split("@")[0]}@<wbr />{EMAIL.split("@")[1]}</span></span></a>
          <CopyEmail email={EMAIL} />
        </div>
        <ul className="cx-links">
          {LINKS.map(([name, sub, href, Icon]) => (
            <li key={name}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <span className="cx-ic"><Icon /></span>
                <span className="cx-ln"><b>{name}</b><span>{sub}</span></span>
                <span className="cx-go" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
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
