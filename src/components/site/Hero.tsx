import "./hero.css";

/* the copy lives here so it is easy to swap */
const HERO = {
  role: "AI engineer",
  city: "Stockholm",
  name: "I'm Arvind.",
  question: ["Curious where AI is taking us?"],
  answer: "So am I.",
  line: ["Founding engineer at Arkus\u00a0AI, a\u00a0healthcare\u00a0AI\u00a0startup.", "I build agents, measure them, and write down what\u00a0I\u00a0learn."],
  cta: "Get in touch",
  more: "See my work",
};

const RINGS = [
  { r: "a", dot: null },
  { r: "b", dot: "ink" },
  { r: "c", dot: "accent" },
];

/* left-aligned hero over thin orbit rings that breathe and pulse; heroMotion.js plays the load-in */
export default function Hero({ slot = false }: { slot?: boolean }) {
  return (
    <section className="hero oh" id="hero" aria-labelledby="h1">
      <div className="orbits" aria-hidden="true">
        <span className="pulse"></span>
        <span className="pulse"></span>
        {RINGS.map(({ r, dot }) => (
          <span key={r} className={"orb orb-" + r} data-in="orb">
            <span className="oline">
              {dot && <span className={"spin spin-" + r}><span className={"dot " + dot} data-in="dot"></span></span>}
              {r === "b" && <span className="spin spin-b2"><span className="dot ink small" data-in="dot"></span></span>}
            </span>
          </span>
        ))}
      </div>
      <div className="hcore">
        <p className="role" data-in="role"><b>{HERO.role}</b> in <span className="city"><i></i>{HERO.city}</span></p>
        <h1 id="h1">
          <span className="ln me" data-in="hello">{HERO.name}</span>{" "}
          {HERO.question.map((q) => <span key={q} className="ln q" data-in="q">{q} </span>)}
          <em className="ln q" data-in="a">{HERO.answer}</em>
        </h1>
        <p className="value" data-in="line">{HERO.line.map((l, i) => <span key={i}>{l} </span>)}</p>
        {slot && <div className="slot" id="slot" aria-hidden="true"></div>}
        <div className="acts" data-in="cta">
          <a className="btn" href="#contact">{HERO.cta}<span aria-hidden="true">→</span></a>
          <a className="read" href="#work">{HERO.more}<span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}
