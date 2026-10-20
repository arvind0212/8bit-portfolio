import type { Post } from "./writing";

export default function FeatPost({ p, h: H = "h2" }: { p: Post; h?: "h2" | "h3" }) {
  return (
    <a className="feat" href={"/writing/" + p.slug}>
      <div className="feat-c">
        <p className="wc-meta"><span className="fk-l">Long read</span><time>{p.date}</time></p>
        <H>{p.title}</H>
        <p>{p.dek}</p>
        <span className="read">Read it<span aria-hidden="true"> →</span></span>
      </div>
      <div className="wc-frame feat-art"><div className="wc-fr" dangerouslySetInnerHTML={{ __html: p.preview }} /></div>
    </a>
  );
}
