import "./site.css";

export default function SiteFooter() {
  return (
    <footer className="sf">
      <p className="sf-who">© 2026 Arvind Guruprasad<span>Stockholm</span></p>
      <nav aria-label="Footer">
        <a href="#work">Work</a>
        <a href="#journey">Journey</a>
        <a href="#how">How I work</a>
        <a href="#writing">Writing</a>
        <a href="#contact">Contact</a>
        <a href="#top">Top<span aria-hidden="true"> ↑</span></a>
      </nav>
      <p className="sf-note">The room is drawn in code.</p>
    </footer>
  );
}
