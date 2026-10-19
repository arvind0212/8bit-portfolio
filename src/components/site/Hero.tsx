import "./hero.css";

/* the copy lives here so it is easy to swap */
const HERO = {
  hello: "Hi, I'm Arvind,",
  role: "AI engineer",
  city: "Stockholm",
  question: "Curious where AI is taking us?",
  answer: "So am I.",
  line: "I find out by building, then write down what I learn.",
  cta: "Get in touch",
};

const RINGS = [
  { r: "a", dot: null },
  { r: "b", dot: "ink" },
  { r: "c", dot: "accent" },
];

/* centred hero over thin orbit rings that breathe and pulse; heroMotion.js plays the load-in */
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
        <p className="hi">
          <span data-in="hello">{HERO.hello}</span>{" "}
          <span data-in="role">an <b>{HERO.role}</b> in</span>{" "}
          <span className="city" data-in="city"><i></i>{HERO.city}</span>
        </p>
        <h1 id="h1">
          <span className="ln" data-in="q">{HERO.question}</span>{" "}
          <em className="ln" data-in="a">{HERO.answer}</em>
        </h1>
        <p className="value" data-in="line">{HERO.line}</p>
        {slot && <div className="slot" id="slot" aria-hidden="true"></div>}
        <div className="acts" data-in="cta">
          <a className="btn" href="#contact">{HERO.cta}<span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
