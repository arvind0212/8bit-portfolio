// Define the structure for each timeline event (Adventure Map Style)
export interface TimelineEntryData {
    id: number;
    year: string;
    title: string;
    description: string;
    imageSrc: string; // Path relative to the /public folder
    altText: string;
  }

// Populate with example life events (Replace/Add your actual milestones and image paths)
export const lifeTimelineData: TimelineEntryData[] = [
  {
    id: 1,
    year: "Childhood", // Adjust Year
    title: "Muscat Beginnings",
    description: "Growing up in sunny Muscat with Indian roots - a world of cultures sparking early curiosity!",
    imageSrc: "/images/8bit-muscat-childhood-me.png", // Placeholder image path
    altText: "Pixel art version of me growing up in Muscat",
  },
  {
    id: 2,
    year: "2016-2020", // Adjust Year
    title: "Bangalore Bound (B.Eng CSE)",
    description: "Off to Bangalore for a CS degree! Knew I loved tech, just needed to find my quest...",
    imageSrc: "/images/8bit-college.png", // Assumes existing image is for college
    altText: "Pixel art version of me during Bachelors in Bangalore",
  },
  {
    id: 3,
    year: "2020", // Adjust Year
    title: "AI Consulting at Quantiphi",
    description: "Leveled up into the corporate world at Quantiphi. Learned the rules of the game!",
    imageSrc: "/images/8bit-consultant-me.png", // Placeholder image path
    altText: "Pixel art version of me starting at Quantiphi",
  },
   {
    id: 4,
    year: "2021", // Adjust Year
    title: "R&D Side Quest",
    description: "Plot twist! Mentorship unlocked an R&D side quest in Healthcare tech. Challenge accepted!",
    imageSrc: "/images/8bit-consultant2-me.png", // Placeholder image path
    altText: "Pixel art version of me leading R&D",
  },
   {
    id: 5,
    year: "2022-2024", // Adjust Year (End of Quantiphi)
    title: "Finding the Mission",
    description: "Led client quests, wielding tech for good in Healthcare. Discovered my core mission: improving lives with code!",
    imageSrc: "/images/8bit-passion-me2.png", // Placeholder image path
    altText: "Pixel art version of me using tech for healthcare",
  },
  {
    id: 6,
    year: "Present", // Adjust Year (Start of Masters)
    title: "Stockholm Chapter: M.Sc.",
    description: "New chapter unlocked: Stockholm. Pursuing an MSc in Biostatistics & Data Science while building production, agentic healthcare AI systems from the ground up.",
    imageSrc: "/images/8bit-current-me.png", // Assumes existing image is for current phase
    altText: "Pixel art version of me pursuing Masters in Stockholm",
  },
  // Add more entries here following the same structure if needed
];
