"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import { POSTS, TOPICS } from "./writing";

export default function TopicFilter() {
  const [on, setOn] = useState<string | null>(null);
  const notes = POSTS.filter((p) => !p.long);
  const shown = on ? notes.filter((p) => p.topics.includes(on)) : notes;
  const used = TOPICS.filter((t) => notes.some((p) => p.topics.includes(t)));
  return (
    <>
      <div className="wr-topics" role="group" aria-label="Filter by topic">
        <button type="button" aria-pressed={!on} onClick={() => setOn(null)}>All<span>{notes.length}</span></button>
        {used.map((t) => (
          <button key={t} type="button" aria-pressed={on === t} onClick={() => setOn(on === t ? null : t)}>
            {t}<span>{notes.filter((p) => p.topics.includes(t)).length}</span>
          </button>
        ))}
      </div>
      <ol className="wcards">{shown.map((p) => <PostCard key={p.slug} p={p} />)}</ol>
    </>
  );
}
