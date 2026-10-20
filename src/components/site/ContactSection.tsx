import ContactSprite from "./ContactSprite";
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
  pick: "Pick one to start an email.",
  other: "Or write to me directly.",
};

/* label, email subject, prompts in the email body */
const PROBLEMS: [string, string, string][] = [
  ["A role you're hiring for", "Role: AI engineer", "The company:\nYour name and role:\nThe role you're hiring for:\nLink to the posting (if there is one):"],
  ["My agent harness and software factory", "About your harness", "Your name:\nWhat you're building:\nWhat you'd like to know:"],
  ["AI on health data", "Role: AI engineer, health data", "The company:\nYour name and role:\nThe data you work with:"],
  ["Fika or a coffee chat", "Fika?", "Your name:\nWhat you'd like to talk about:\nIn Stockholm or a video call:"],
];

const mailto = (subject: string, body = "") =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}${body ? "&body=" + encodeURIComponent(body) : ""}`;

const LINKS: [string, string, () => React.JSX.Element][] = [
  ["CV", CV, DocIcon],
  ["LinkedIn", LINKEDIN, LinkedInIcon],
  ["GitHub", "https://github.com/arvind0212", GitHubIcon],
];


/* the page closes the way the hero opens (pill line, two-part heading) with the journey's Stockholm sprite standing on one of the hero's rings */
export default function ContactSection({ room }: { room: boolean }) {
  return (
    <section className="sec cx cxo" id="contact" aria-labelledby="h-contact">
      <p className="cx-role"><span className="cx-pill"><i></i>{CONTACT.status}</span> <span className="cx-where">{CONTACT.where}</span></p>
      <h2 id="h-contact"><span>{CONTACT.title}</span> <em>{CONTACT.sub}</em></h2>
      {room && <div className="slot cslot" id="cslot" aria-hidden="true"></div>}
      <p className="cx-pick">{CONTACT.pick}</p>
      <ul className="cx-list">
        {PROBLEMS.map(([label, subject, body], i) => (
          <li key={label}><a href={mailto(subject, body)} data-k={i}><i></i>{label}<span className="sr">, start an email</span><span aria-hidden="true">→</span></a></li>
        ))}
      </ul>
      <ContactSprite />
      <p className="cx-other">{CONTACT.other}</p>
      <div className="cx-mail">
        <a href={mailto("Hello from your site")}><span className="cx-ic"><MailIcon /></span><span className="cx-v">{EMAIL}</span></a>
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
