import React from "react";
import Image from "next/image"; // Import Image
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Code, CloudCog, DatabaseZap, Award } from "lucide-react"; // Import icons
import { cn } from "@/lib/utils"; // Import cn

// Define skill categories and skills based on resume
// Define certification images mapping
const certificationImages = {
  "Google Cloud Associate Cloud Engineer": { src: "/images/ace.png", alt: "Google Cloud Associate Cloud Engineer Badge", width: 100, height: 100 },
  "Looker LookML Developer": { src: "/images/Looker.png", alt: "Looker LookML Developer", width: 100, height: 100 },
  "Professional Scrum Master": { src: "/images/psm1.png", alt: "Professional Scrum Master I Badge", width: 100, height: 100 },
  // Add Looker if needed, currently not listed in skills array for Certifications
  // "Looker": { src: "/images/Looker.png", alt: "Looker Badge", width: 120, height: 120 },
};

const skillCategories = [
  {
    title: "Programming & Analytics",
    icon: Code, // Add icon component
    skills: ["Python", "R", "SQL", "Large Language Models (LLMs)", "LangChain", "Model Context Protocol (MCP)", "Agent Architecture", "RAG", "Scikit-learn", "TensorFlow", "PyTorch", "Looker"],
  },
  {
    title: "Cloud & Data Engineering",
    icon: CloudCog, // Add icon component
    skills: ["Vertex AI", "Dataflow", "BigQuery", "Pub/Sub", "Cloud Storage", "Cloud Functions", "Git", "CI/CD"]
  },
  {
    title: "Healthcare Data & Interoperability",
    icon: DatabaseZap, // Add icon component
    skills: ["HL7v2", "FHIR", "DICOM", "ICD-10", "GDPR", "HIPAA", "PHI handling", "Data Governance"]
  },
  {
    title: "Certifications",
    icon: Award, // Add icon component
    skills: ["Google Cloud Associate Cloud Engineer", "Looker LookML Developer", "Professional Scrum Master"]
  }
];

export default function SkillsSection() {
  return (    <section id="skills" className="py-16 md:py-24 bg-background">
      <h2 className={cn(
        "font-heading text-4xl md:text-5xl font-bold mb-12 text-center",
        "text-primary"
      )}>Skills</h2>
      <div className="max-w-4xl mx-auto space-y-8"> {/* Increased spacing */}
        {skillCategories.map((category) => {
          const isCertCategory = category.title === "Certifications";
          return (
            <div key={category.title}>
              {/* Container for icon and title */}
              <div className={cn(
                "flex items-center gap-2 mb-3 mt-6" // Removed conditional justify-center
              )}>
                <category.icon className="w-5 h-5 text-primary" aria-hidden="true" /> {/* Render icon */}
                <h3 className="text-lg font-sans font-semibold">{category.title}</h3> {/* Reduced size */}
              </div>
              {/* Render Badges or Images */}
              <div className={cn(
                "flex flex-wrap", // Base flex styles
                isCertCategory ? "gap-4" : "gap-2" // Larger gap for images, smaller for text badges
              )}>
                {isCertCategory ? (
                  // Render Images for Certifications
                  (category.skills.map((skill) => {
                    const imgData = certificationImages[skill as keyof typeof certificationImages];
                    return imgData ? (
                      <Image
                        key={skill}
                        src={imgData.src}
                        alt={imgData.alt}
                        width={imgData.width}
                        height={imgData.height}
                        className="object-contain" // Use contain to prevent distortion
                      />
                    ) : null; // Handle case where image might not be defined
                  }))
                ) : (
                  // Render Text Badges for other skills
                  (category.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="font-sans">
                      {skill}
                    </Badge>
                  )))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
