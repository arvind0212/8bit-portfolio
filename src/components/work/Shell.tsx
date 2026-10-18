import { Instrument_Serif, Silkscreen } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../room/room.css";
import "./work.css";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--rf-instrument" });
const pix = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--rf-pix" });

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={["rp", "sub", instrument.variable, GeistSans.variable, GeistMono.variable, pix.variable].join(" ")}>
      <header className="top">
        <a className="who" href="/" aria-label="Arvind Guruprasad, home"><i aria-hidden="true">AG</i><b>Arvind Guruprasad</b></a>
        <nav aria-label="Main">
          <a href="/work" className="on" aria-current="page">Work</a>
          <a href="/#journey">Journey</a>
          <a href="/#writing">Writing</a>
          <a href="/#contact">Contact</a>
        </nav>
      </header>
      <main className="col">{children}</main>
    </div>
  );
}
