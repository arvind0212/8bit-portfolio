"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import { POSTS, TOPICS } from "./writing";

export default function TopicFilter() {
  const [on, setOn] = useState<string | null>(null);
  const shown = on ? POSTS.filter((p) => p.topics.includes(on)) : POSTS;
  const used = TOPICS.filter((t) => POSTS.some((p) => p.topics.includes(t)));
  return (
    <>
      <div className="wr-topics" role="group" aria-label="Filter by topic">
        <button type="button" aria-pressed={!on} onClick={() => setOn(null)}>All<span>{POSTS.length}</span></button>
        {used.map((t) => (
          <button key={t} type="button" aria-pressed={on === t} onClick={() => setOn(on === t ? null : t)}>
            {t}<span>{POSTS.filter((p) => p.topics.includes(t)).length}</span>
          </button>
        ))}
      </div>
      <ol className="wcards">{shown.map((p) => <PostCard key={p.slug} p={p} />)}</ol>
    </>
  );
}
