import "./site.css";
import "./contact.css";

/* one sign-off row; the note is the way back into the room, which lives on the home page */
export default function SiteFooter({ room = false, home = true }: { room?: boolean; home?: boolean }) {
  const to = home ? "#" : "/#";
  return (
    <footer className="sf">
      <p className="sf-who">© 2026 Arvind Guruprasad</p>
      <nav aria-label="Footer">
        <a href={to + "work"}>Work</a>
        <a href={to + "journey"}>Journey</a>
        <a href={to + "writing"}>Writing</a>
        <a href="#top">Top<span aria-hidden="true"> ↑</span></a>
      </nav>
      {room && <p className="sf-note">The room is drawn in code. <a href={to + "room"} data-act={home ? "room" : undefined}>Step back into the room<span aria-hidden="true"> ↖</span></a></p>}
    </footer>
  );
}
