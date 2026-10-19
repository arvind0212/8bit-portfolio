export type Post = {
  slug: string;
  date: string;
  topics: string[];
  title: string;
  dek: string;
  live: boolean;
  preview: string;
};

export const TOPICS = ["Agents", "Clinical data", "Evaluation", "How I work", "Career", "Building in public"];

export const POSTS: Post[] = [
  {
    slug: "where-meaning-breaks",
    date: "Jun 2026",
    topics: ["Agents", "Clinical data", "Evaluation"],
    title: "Meaning can survive. The benchmark shows where it breaks.",
    dek: "What the thesis showed once it was defended, and why the harness around the agent matters.",
    live: true,
    preview:
      '<p class="pk">Agent output</p><div class="pf"><span>Agent</span><i>→</i><span class="acc">Validation loop</span><i>→</i><span>Human review</span></div><p class="pq">Meaning <em>survives</em> when every step is checked.</p>',
  },
  {
    slug: "valid-not-correct",
    date: "May 2026",
    topics: ["Clinical data", "Evaluation"],
    title: "A valid OMOP table can still be clinically wrong.",
    dek: "The question behind my thesis: do agents keep the meaning, or only the format?",
    live: true,
    preview:
      '<p class="pk">One lab result, mapped</p><div class="pt"><div><span>Format</span><b>Valid</b></div><div><span>Unit</span><b class="no">Lost</b></div><div><span>Meaning</span><b class="no">Wrong</b></div></div>',
  },
  {
    slug: "the-harness",
    date: "Next",
    topics: ["Agents", "How I work"],
    title: "The harness: how I brief, check and review agent work.",
    dek: "What I hand the agent, what I check myself, and what I never skip.",
    live: false,
    preview:
      '<p class="pk">The loop</p><div class="pf"><span>Brief</span><i>→</i><span>Build</span><i>→</i><span class="acc">Check</span><i>→</i><span>Review</span></div>',
  },
  {
    slug: "deal-to-agent",
    date: "Later",
    topics: ["Career"],
    title: "From scoping deals to writing the agent.",
    dek: "Why I moved from consulting into building, and what carried over.",
    live: false,
    preview:
      '<p class="pk">Same problem, closer to the code</p><div class="pf"><span>Deal</span><i>→</i><span>Scope</span><i>→</i><span>Design</span><i>→</i><span class="acc">Agent</span></div>',
  },
  {
    slug: "this-site",
    date: "Later",
    topics: ["Building in public", "Agents"],
    title: "Building this site with agents.",
    dek: "A voxel room, a monitor and a lot of review rounds.",
    live: false,
    preview:
      '<p class="pk">Build log</p><div class="pf"><span>Room</span><i>→</i><span>Monitor</span><i>→</i><span class="acc">Site</span></div>',
  },
];
