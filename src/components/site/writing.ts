export type Post = {
  slug: string;
  date: string;
  topics: string[];
  title: string;
  dek: string;
  live: boolean;
  preview: string;
  long?: boolean;
  bottom?: string;
  parts?: { title: string; hook: string; body: string[] }[];
};

export const TOPICS = ["Agents", "Clinical data", "Evaluation", "How I work", "Career", "Building in public"];

export const POSTS: Post[] = [
  {
    slug: "thesis",
    date: "Jun 2026",
    topics: ["Agents", "Clinical data", "Evaluation"],
    title: "Can AI agents standardise clinical data without losing its meaning?",
    dek: "My master's thesis as a long read: three agent designs, five layers of messy hospital data, and where meaning breaks.",
    live: true,
    long: true,
    preview:
      '<p class="pk">Kept their meaning, best agent</p><div class="pm"><span>Lab results</span><b>~100%</b><i style="--w:100%"></i></div><div class="pm"><span>Medications</span><b>~91%</b><i style="--w:91%"></i></div>',
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
