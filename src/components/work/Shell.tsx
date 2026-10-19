import { FONT_VARS } from "../room/fonts";
import TopBar from "../room/TopBar";
import Tune from "../room/Tune";
import "../room/room.css";
import "./work.css";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={"rp sub " + FONT_VARS}>
      <TopBar home={false} />
      <Tune />
      <main className="col">{children}</main>
    </div>
  );
}
