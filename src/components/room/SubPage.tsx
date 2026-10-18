import { Instrument_Serif, Silkscreen } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Tune from "./Tune";
import "./room.css";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--rf-instrument" });
const pix = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--rf-pix" });

export default function SubPage({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div className={["rp", "sub", instrument.variable, GeistSans.variable, GeistMono.variable, pix.variable].join(" ")}>
      <header className="top">
        <a className="who" href="/" aria-label="Arvind Guruprasad, home"><i aria-hidden="true">AG</i><b>Arvind Guruprasad</b></a>
        <nav aria-label="Main">
          <a href="/#work">Work</a>
          <a href="/#journey">Journey</a>
          <a href="/#writing">Writing</a>
          <a href="/#contact">Contact</a>
        </nav>
      </header>
      <Tune />
      <main className="col">
        <section className="sec">
          <p className="label">{label}</p>
          <h2>{title}</h2>
          {children}
          <p className="back"><a className="read" href="/">← Back home</a></p>
        </section>
      </main>
    </div>
  );
}
