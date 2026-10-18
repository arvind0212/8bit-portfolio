import type { Post } from "./writing";

export default function PostRow({ p }: { p: Post }) {
  const body = (
    <>
      <span className="wr-meta"><time>{p.date}</time><span>{p.where}</span></span>
      <span className="wr-main">
        <span className="wr-t">{p.title}</span>
        <span className="wr-d">{p.dek}</span>
      </span>
      <span className="wr-go" aria-hidden="true">{p.href ? "↗" : "Soon"}</span>
    </>
  );
  return (
    <li className={p.href ? "wr-row" : "wr-row wr-soon"}>
      {p.href ? <a href={p.href} target="_blank" rel="noopener noreferrer">{body}</a> : <div>{body}</div>}
    </li>
  );
}
