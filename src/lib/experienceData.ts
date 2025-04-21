// portfolio-nextjs/src/lib/experienceData.ts

export interface ExperienceItem {
  type: 'academic' | 'work';
  title: string;
  institution: string;
  location: string;
  startDate: string; // Format: "Month. YYYY" or "YYYY-MM"
  endDate: string;   // Format: "Month. YYYY", "YYYY-MM", or "Present"
  description: string[]; // Array of bullet points
  skills?: string[]; // Optional array of relevant skills/technologies
}

export const experienceData: ExperienceItem[] = [
  // Work Experience (Newest First)
  {
    type: 'work',
    title: 'Research Assistant',
    institution: 'Karolinska Institutet',
    location: 'Stockholm, Sweden',
    startDate: 'March 2025',
    endDate: 'Present',
    description: [
      'Researching & designing an **LLM/RAG** solution for parsing **unstructured prescription data**.',
      'Architecting an **automated parsing pipeline**, defining data flow and **LLM integration** points.'
    ],
    skills: ['LLM', 'RAG', 'System Architecture', 'Healthcare Data']
  },
  {
    type: 'work',
    title: 'Senior Data & AI Solutions Consultant - Healthcare',
    institution: 'Quantiphi',
    location: 'Bangalore, India',
    startDate: 'Sep. 2022',
    endDate: 'Aug 2024',
    description: [
      'Led healthcare **ML project deliveries** ($5M+ value), managing **20+ engineers/scientists**.',
      'Built **LSTM nurse staffing model** (550M+ records), reducing **overstaffing costs by 40%** ($1M+/year).',
      'Deployed **LLM/RAG solution** mapping EHR to FHIR, achieving **95% accuracy** & **50% less manual coding**.',
      'Drove **presales/GTM** (US, EU, APAC), securing **10+ deals** ($15M+) via tailored AI demos.',
      'Optimized **cloud data pipelines** (Python, SQL, GCP), cutting **analytics time by 30%**.'
    ],
    skills: ['Machine Learning', 'LSTM', 'LLM', 'RAG', 'Gemini', 'FHIR', 'EHR', 'Presales', 'GTM', 'Python', 'SQL', 'Google Cloud', 'Dataflow', 'Looker', 'Leadership']
  },
  {
    type: 'work',
    title: 'Data & AI Solutions Consultant',
    institution: 'Quantiphi',
    location: 'Bangalore, India',
    startDate: 'Sep. 2020',
    endDate: 'Aug. 2022',
    description: [
      'Led **R&D** for a cloud healthcare solution, translating **clinical needs** into user stories.',
      'Developed **dashboards** (Looker, BigQuery) enhancing **health equity tracking** & cutting **reporting time by 40%**.',
      '**Automated workflows** (Google Apps Script), saving **8+ hrs/month** & accelerating decisions.',
      'Enhanced **risk models** with **SDOH/SVI data**, enabling **15% earlier** high-risk patient identification.',
      'Contributed to an **NLP pipeline** for EHR text, reducing **manual chart review time**.'
    ],
    skills: ['R&D', 'Looker', 'BigQuery', 'Google App Scripts', 'Healthcare Analytics', 'SDOH', 'Risk Modeling', 'NLP', 'EHR', 'Stakeholder Management']
  },
  // Academic Experience (Newest First)
  {
    type: 'academic',
    title: 'Master of Science in Biostatistics and Data Science',
    institution: 'Karolinska Institutet, KTH Institute of Technology, Stockholm University',
    location: 'Stockholm, Sweden',
    startDate: 'Aug. 2024',
    endDate: 'Present',
    description: ['Pursuing **advanced statistical methods** and **data science techniques** for **biological & health data**.'],
    skills: ['Biostatistics', 'Data Science', 'R', 'Python'] // Added example skills
  },
  {
    type: 'academic',
    title: 'Bachelor of Engineering in Computer Science and Engineering',
    institution: 'BMS College of Engineering',
    location: 'Bangalore, India',
    startDate: 'Sep. 2016',
    endDate: 'Aug. 2020',
    description: ['Completed comprehensive program in **core computer science**, **software development**, and **engineering practices**.'],
    skills: ['Computer Science', 'Software Engineering', 'Data Structures', 'Algorithms'] // Added example skills
  }
];
