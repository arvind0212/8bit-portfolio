export type Post = {
  slug: string;
  date: string;
  where: string;
  title: string;
  dek: string;
  href?: string;
};

export const LINKEDIN = "https://www.linkedin.com/in/arvind-guruprasad-73479a142/";

export const PUBLISHED: Post[] = [
  {
    slug: "after-the-defence",
    date: "Jun 2026",
    where: "LinkedIn",
    title: "Meaning can survive. The benchmark shows where it breaks.",
    dek: "The thesis results after the defence, and why the harness around the agent matters.",
    href: "https://www.linkedin.com/posts/arvind-guruprasad_three-weeks-ago-i-shared-the-core-idea-behind-share-7474891112705318914-OX-O/",
  },
  {
    slug: "valid-not-correct",
    date: "May 2026",
    where: "LinkedIn",
    title: "A valid OMOP table can still be clinically wrong.",
    dek: "The question behind my thesis: do agents keep the meaning, or only the format?",
    href: LINKEDIN + "recent-activity/all/",
  },
];

export const DRAFTS: Post[] = [
  {
    slug: "the-harness",
    date: "Next",
    where: "Essay",
    title: "The harness: how I brief, check and review agent work.",
    dek: "What I hand the agent, what I check myself, and what I never skip.",
  },
  {
    slug: "deal-to-agent",
    date: "Later",
    where: "Essay",
    title: "From scoping deals to writing the agent.",
    dek: "Why I moved from consulting into building, and what carried over.",
  },
  {
    slug: "this-site",
    date: "Later",
    where: "Build log",
    title: "Building this site with agents.",
    dek: "A voxel room, a monitor and a lot of review rounds.",
  },
];
