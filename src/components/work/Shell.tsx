import { Instrument_Serif, Silkscreen } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import TopBar from "../room/TopBar";
import Tune from "../room/Tune";
import "../room/room.css";
import "./work.css";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--rf-instrument" });
const pix = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--rf-pix" });

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={["rp", "sub", instrument.variable, GeistSans.variable, GeistMono.variable, pix.variable].join(" ")}>
      <TopBar home={false} />
      <Tune />
      <main className="col">{children}</main>
    </div>
  );
}
