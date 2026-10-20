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
  where: "in Stockholm, on site or remote in Europe",
  title: "Bring me a problem.",
  sub: "Or a role to fill.",
  pick: "Pick one and the email starts itself.",
  other: "Something else? Write to me.",
};

const PROBLEMS: [string, string, string][] = [
  ["A role on your team", "A role on our team", "We're hiring for an AI engineering role. Here's the team and the role:"],
  ["An agent for a workflow", "An agent for a workflow", "We have a workflow we'd like an agent to take on. Here's what it is:"],
  ["Evals for an AI product", "Evals for our AI product", "We ship an AI feature and can't tell if changes make it better. Here's the setup:"],
  ["A first version of an AI idea", "A first version of an AI idea", "We have an AI idea and want a working first version. Here's the idea:"],
];

const mailto = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Arvind,\n\n${body}\n\n`)}`;

const LINKS: [string, string, () => React.JSX.Element][] = [
  ["CV", CV, DocIcon],
  ["LinkedIn", LINKEDIN, LinkedInIcon],
  ["GitHub", "https://github.com/arvind0212", GitHubIcon],
];

/* the dot each problem lights: ring, angle */
const DOTS: [string, number][] = [["c", 212], ["b", 300], ["c", 18], ["a", 120]];

/* the page closes the way the hero opens: pill line, two-part heading, rings on the right; each problem row lights its dot on the rings */
export default function ContactSection({ room }: { room: boolean }) {
  return (
    <section className="sec cx cxo" id="contact" aria-labelledby="h-contact">
      <div className="cxr" aria-hidden="true">
        <span className="cxp"></span>
        <span className="cxp"></span>
        {["a", "b", "c"].map((r) => <span key={r} className={"cxo-r cxo-" + r}><span className="cxl"></span></span>)}
        {DOTS.map(([r, a], i) => (
          <span key={i} className={"cxd cxo-" + r} style={{ "--a": a + "deg" } as React.CSSProperties}><i data-k={i}></i></span>
        ))}
      </div>
      <p className="cx-role"><span className="cx-pill"><i></i>{CONTACT.status}</span> {CONTACT.where}</p>
      <h2 id="h-contact"><span>{CONTACT.title}</span> <em>{CONTACT.sub}</em></h2>
      {room && <div className="slot cslot" id="cslot" aria-hidden="true"></div>}
      <p className="cx-pick">{CONTACT.pick}</p>
      <ul className="cx-list">
        {PROBLEMS.map(([label, subject, body], i) => (
          <li key={label}><a href={mailto(subject, body)} data-k={i}><i></i>{label}<span aria-hidden="true">→</span></a></li>
        ))}
      </ul>
      <p className="cx-other">{CONTACT.other}</p>
      <div className="cx-mail">
        <a href={"mailto:" + EMAIL}><span className="cx-ic"><MailIcon /></span><span className="cx-v">{EMAIL.split("@")[0]}<wbr />@{EMAIL.split("@")[1]}</span></a>
        <CopyEmail email={EMAIL} />
      </div>
      <ul className="cx-links">
        {LINKS.map(([name, href, Icon]) => (
          <li key={name}><a href={href} target="_blank" rel="noopener noreferrer"><Icon />{name}</a></li>
        ))}
      </ul>
    </section>
  );
}
