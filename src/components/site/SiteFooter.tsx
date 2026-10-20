import "./site.css";

/* one sign-off row; on the desk page the note doubles as the way back into the room */
export default function SiteFooter({ room = false }: { room?: boolean }) {
  return (
    <footer className="sf">
      <p className="sf-who">© 2026 Arvind Guruprasad</p>
      <nav aria-label="Footer">
        <a href="#work">Work</a>
        <a href="#journey">Journey</a>
        <a href="#writing">Writing</a>
        <a href="#top">Top<span aria-hidden="true"> ↑</span></a>
      </nav>
      <p className="sf-note">The room is drawn in code.{room && <> <a href="#room" data-act="room" aria-label="Step back into the room">Step back into it<span aria-hidden="true"> ↖</span></a></>}</p>
    </footer>
  );
}
