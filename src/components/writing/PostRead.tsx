import Shell from "../work/Shell";
import { POSTS, type Post } from "../site/writing";
import { Part, ReadFoot } from "./parts";

export default function PostRead({ p }: { p: Post }) {
  const live = POSTS.filter((x) => x.live && !x.long);
  const next = live[(live.indexOf(p) + 1) % live.length];
  return (
    <Shell>
      <article className="lr" aria-labelledby="lr-h">
        <p className="crumb"><a href="/writing">← All writing</a><a href="/">Home</a></p>

        <header className="lr-hero">
          <div className="lr-copy">
            <p className="label"><span className="n">Note</span>· {p.date}</p>
            <h1 id="lr-h">{p.title}</h1>
            <p className="dek">{p.dek}</p>
            <ul className="wc-tags post-tags" aria-label="Topics">{p.topics.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="wc-frame lr-art"><div className="wc-fr" dangerouslySetInnerHTML={{ __html: p.preview }} /></div>
        </header>

        <div className="tldr">
          <p className="tl"><span>In one line</span></p>
          <p className="tt">{p.bottom ?? <span className="ph">[The post&apos;s main point, from the LinkedIn text]</span>}</p>
        </div>

        {p.parts
          ? p.parts.map((s, i) => (
              <Part key={s.title} n={String(i + 1).padStart(2, "0")} title={s.title} hook={s.hook}>
                {s.body.map((t) => <p key={t}>{t}</p>)}
              </Part>
            ))
          : (["The question", "What I found", "What it changes"] as const).map((t, i) => (
              <Part key={t} n={String(i + 1).padStart(2, "0")} title={t} hook="A one-line hook for this part.">
                <p className="ph">[Text from the LinkedIn post goes here once it arrives.]</p>
              </Part>
            ))}

        <ReadFoot
          title="The full study behind this note."
          line="Three agent designs, two models and five layers of messiness, graded field by field against a locked answer key."
          acts={[{ label: "Read the long read", href: "/writing/thesis", primary: true }]}
          related={next !== p ? { label: "Next note", title: next.title, href: "/writing/" + next.slug } : undefined}
        />
      </article>
    </Shell>
  );
}
