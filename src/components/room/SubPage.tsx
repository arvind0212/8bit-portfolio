import { FONT_VARS } from "./fonts";
import Tune from "./Tune";
import TopBar from "./TopBar";
import "./room.css";


export default function SubPage({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div className={["rp", "sub", FONT_VARS].join(" ")}>
      <TopBar home={false} />
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
