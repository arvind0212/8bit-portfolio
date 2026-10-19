import type { ReactNode } from "react";
import CopyEmail from "./CopyEmail";
import { DocIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";
import "./site.css";

export const EMAIL = "arvindguruprasad33@gmail.com";
export const CV = "https://drive.google.com/file/d/1NuS61X_awnnDSR8uW-5jEng5P1QcZ2f3/view?usp=drive_link";

export const LINKEDIN = "https://www.linkedin.com/in/arvind-guruprasad-73479a142/";

const LINKS: [string, string, () => React.JSX.Element][] = [
  ["LinkedIn", LINKEDIN, LinkedInIcon],
  ["GitHub", "https://github.com/arvind0212", GitHubIcon],
  ["CV", CV, DocIcon],
];

export default function ContactSection({ room, back }: { room: boolean; back?: ReactNode }) {
  return (
    <section className="sec cx" id="contact" aria-labelledby="h-contact">
      <p className="label"><span className="n">05</span>Contact</p>
      <h2 id="h-contact">Bring me a problem.</h2>
      {room && <div className="slot cslot" id="cslot" aria-hidden="true"></div>}
      <p className="cx-line">Good fit when you need one person to take an AI idea from the first client conversation to a working system.</p>
      <dl className="cx-facts">
        <div><dt>Status</dt><dd><i className="cx-dot" aria-hidden="true"></i>Open to new roles</dd></div>
        <div><dt>Based in</dt><dd>Stockholm, Sweden</dd></div>
        <div><dt>Works across</dt><dd>Europe, on site or remote</dd></div>
      </dl>
      <div className="cx-act">
        <div className="cx-mail">
          <a href={"mailto:" + EMAIL}><span className="cx-ic"><MailIcon /></span><span className="cx-v">{EMAIL.split("@")[0]}@<wbr />{EMAIL.split("@")[1]}</span></a>
          <CopyEmail email={EMAIL} />
        </div>
        <ul className="cx-links">
          {LINKS.map(([name, href, Icon]) => (
            <li key={name}>
              <a href={href} target="_blank" rel="noopener noreferrer"><Icon />{name}</a>
            </li>
          ))}
        </ul>
        {back && <div className="cx-back">{back}</div>}
      </div>
    </section>
  );
}
