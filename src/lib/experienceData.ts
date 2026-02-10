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
    title: 'Founding AI Engineer',
    institution: 'Arkus AI',
    location: 'Stockholm, Sweden',
    startDate: 'May 2025',
    endDate: 'Present',
    description: [
      'Joined as the first AI engineer to build an **agentic AI platform** for clinical, administrative, and wellness workflows from the ground up.',
      'Architected and own the **multi-agent orchestration** layer enabling no-code workflow creation for healthcare use cases.',
      'Built a **tool-use framework** for builder agents to discover and orchestrate platform components into end-to-end workflows.',
      'Shipped a production **clinical guidelines agent** (Claude) for Swedish oncology guideline parsing, used in customer demos.',
      'Designed **LLMOps** foundations: evaluation metrics, benchmark datasets, and prompt iteration pipelines.',
      'Implemented **privacy/PII protection** guardrails with human-in-the-loop review workflows for sensitive healthcare data.'
    ],
    skills: [
      'Multi-Agent Systems',
      'Tool-Use Frameworks',
      'LLMOps',
      'Claude',
      'Prompt Engineering',
      'Python',
      'Privacy/PII'
    ]
  },
  {
    type: 'work',
    title: 'Research Assistant',
    institution: 'Karolinska Institutet',
    location: 'Stockholm, Sweden',
    startDate: 'March 2025',
    endDate: 'Oct. 2025',
    description: [
      'Built a production pipeline to extract structured data from **unstructured Swedish prescriptions** using LLM-based parsing and validation.',
      'Achieved **99.4% success rate** across 1,000+ records, eliminating **90% data loss** from a legacy process.',
      'Engineered hybrid AI + rule-based validation for **Swedish-to-English** medical terminology normalization.',
      'Optimized cost and QA with **1.1% manual review** and roughly **$300 per million records** processing cost.',
      'Added automatic flagging for **high-dose regimens** and complex titration schedules.'
    ],
    skills: ['LLM', 'RAG', 'Multi-Agent Systems', 'Medical NLP', 'Python', 'Healthcare Data']
  },
  {
    type: 'work',
    title: 'Senior Data & AI Solutions Consultant - Healthcare',
    institution: 'Quantiphi',
    location: 'Bangalore, India',
    startDate: 'Sep. 2022',
    endDate: 'Aug 2024',
    description: [
      'Led end-to-end delivery of healthcare ML engagements totaling **$5M+ contract value**, managing **20+ engineers and data scientists**.',
      'Built an **LSTM nurse staffing forecast model** (550M+ records), reducing **overstaffing costs by 40%** (~$1M+ annual savings).',
      'Implemented **LLM + RAG** FHIR mapping to convert unstructured EHR data to standardized resources, achieving **95% accuracy** and cutting manual coding by **50%**.',
      'Led presales, solutioning, and **GTM** across US, EU, and APAC, contributing to **10+ deals** worth **$15M+**.',
      'Coordinated cloud data pipelines (Python, SQL, GCP) for large-scale patient data integrations.'
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
