import { FONT_VARS } from "../room/fonts";
import TopBar from "../room/TopBar";
import Tune from "../room/Tune";
import SiteFooter from "../site/SiteFooter";
import "../room/room.css";
import "./work.css";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={"rp sub " + FONT_VARS}>
      <TopBar home={false} room />
      <Tune />
      <main className="col" id="top">{children}</main>
      <div className="col"><SiteFooter room home={false} /></div>
    </div>
  );
}
