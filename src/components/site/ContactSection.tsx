import CopyEmail from "./CopyEmail";
import { DocIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";
import "./site.css";
import "./contact.css";

export const EMAIL = "arvindguruprasad33@gmail.com";
export const CV = "https://drive.google.com/file/d/1NuS61X_awnnDSR8uW-5jEng5P1QcZ2f3/view?usp=drive_link";

export const LINKEDIN = "https://www.linkedin.com/in/arvind-guruprasad-73479a142/";

/* the copy lives here so it is easy to swap */
const CONTACT = {
  status: "Open to new roles",
  where: "Stockholm · on site or remote in Europe",
  title: "Hiring an AI engineer?",
  sub: "Bring me the problem.",
  pick: "Pick what your team needs. It starts an email.",
  other: "Or write to me directly.",
};

/* label, email subject, prompts in the email body */
const PROBLEMS: [string, string, string][] = [
  ["An AI engineering role", "AI engineering role", "The company:\nThe role:\nLink to the posting:"],
  ["Agents and their tools", "Role: agents and tools", "The company:\nWhat the agents need to do:"],
  ["Evals and prompt workflow", "Role: evals", "The company:\nWhat you check today:"],
  ["AI on health data", "Role: AI on health data", "The company:\nThe data:"],
];

const mailto = (subject: string, body = "") =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}${body ? "&body=" + encodeURIComponent(body + "\n") : ""}`;

const LINKS: [string, string, () => React.JSX.Element][] = [
  ["LinkedIn", LINKEDIN, LinkedInIcon],
  ["GitHub", "https://github.com/arvind0212", GitHubIcon],
];

/* each problem lights a dot on the middle ring, on the arc facing its row */
const DOTS = [267, 256, 243, 229];

/* the page closes the way the hero opens: pill line, two-part heading, rings on the right; each problem row lights its dot on the rings */
export default function ContactSection({ room }: { room: boolean }) {
  return (
    <section className="sec cx cxo" id="contact" aria-labelledby="h-contact">
      <div className="cxr" aria-hidden="true">
        <span className="cxp"></span>
        <span className="cxp"></span>
        {["a", "b", "c"].map((r) => <span key={r} className={"cxo-r cxo-" + r}><span className="cxl"></span></span>)}
        {DOTS.map((a, i) => (
          <span key={i} className="cxd cxo-b" style={{ "--a": a + "deg" } as React.CSSProperties}><i data-k={i}></i></span>
        ))}
      </div>
      <p className="cx-role"><span className="cx-pill"><i></i>{CONTACT.status}</span> <span className="cx-where">{CONTACT.where}</span></p>
      <h2 id="h-contact"><span>{CONTACT.title}</span> <em>{CONTACT.sub}</em></h2>
      {room && <div className="slot cslot" id="cslot" aria-hidden="true"></div>}
      <p className="cx-pick">{CONTACT.pick}</p>
      <ul className="cx-list">
        {PROBLEMS.map(([label, subject, body], i) => (
          <li key={label}><a href={mailto(subject, body)} data-k={i}><i></i>{label}<span className="sr">, start an email</span><span aria-hidden="true">→</span></a></li>
        ))}
      </ul>
      <p className="cx-other">{CONTACT.other}</p>
      <div className="cx-acts">
      <div className="cx-mail">
        <a href={mailto("From your site")}><span className="cx-ic"><MailIcon /></span><span className="cx-v">{EMAIL}</span></a>
        <CopyEmail email={EMAIL} />
      </div>
      <a className="cx-cv" href={CV} target="_blank" rel="noopener noreferrer"><DocIcon />CV<span aria-hidden="true">↗</span></a>
      </div>
      <ul className="cx-links">
        {LINKS.map(([name, href, Icon]) => (
          <li key={name}><a href={href} target="_blank" rel="noopener noreferrer"><Icon />{name}</a></li>
        ))}
      </ul>
    </section>
  );
}
