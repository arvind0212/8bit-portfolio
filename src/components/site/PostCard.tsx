import type { Post } from "./writing";

export default function PostCard({ p }: { p: Post }) {
  const href = "/writing/" + p.slug;
  const Wrap = p.live ? "a" : "div";
  return (
    <li className={"wc" + (p.live ? "" : " soon")} data-topics={p.topics.join("|")}>
      <Wrap className="wc-in" {...(p.live ? { href } : {})}>
        <div className="wc-frame"><div className="wc-fr" dangerouslySetInnerHTML={{ __html: p.preview }} /></div>
        <p className="wc-meta">{p.long && <span className="fk-l">Long read</span>}<time>{p.date}</time>{!p.live && <span className="wc-soon">Soon</span>}</p>
        <h3 className="wc-t">{p.title}</h3>
        <p className="wc-d">{p.dek}</p>
        <ul className="wc-tags" aria-label="Topics">{p.topics.map((t) => <li key={t}>{t}</li>)}</ul>
      </Wrap>
    </li>
  );
}
