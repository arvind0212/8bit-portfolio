import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { ExperienceItem } from "@/lib/experienceData"; // Import the interface
import { cn } from "@/lib/utils"; // Import cn

interface ExperienceCardProps {
  item: ExperienceItem;
}

// Helper function to parse description and highlight keywords
const HighlightedDescription: React.FC<{ text: string }> = ({ text }) => {
  // Simple regex to find text between **
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={index} className="text-primary font-medium">
            {part.slice(2, -2)} {/* Remove the asterisks */}
          </strong>
        ) : (
          part // Render normal text parts
        )
      )}
    </>
  );
};

export default function ExperienceCard({ item }: ExperienceCardProps) {
  return (
    // Add hover effects and transitions
    <Card className={cn(
      "w-full font-sans",
      "transition-all duration-300 ease-in-out",
      "hover:shadow-lg hover:scale-[1.02]" // Scale and shadow on hover
    )}>
      <CardHeader>
        {/* Apply heading font and increase size */}
        <CardTitle className="font-heading text-xl">{item.title}</CardTitle> {/* Added text-xl */}
        <CardDescription>
          {item.institution} | {item.location} | {item.startDate} - {item.endDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Apply smaller font size to list items and use helper for highlighting */}
        <ul className="list-disc pl-5 space-y-1 mb-4">
          {item.description.map((point, index) => (
            <li key={index} className="text-sm"> {/* Added text-sm */}
              <HighlightedDescription text={point} /> {/* Use helper component */}
            </li>
          ))}
        </ul>
        {item.skills && item.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.skills.map((skill) => (
              // Change badge variant to outline
              (<Badge key={skill} variant="outline">
                {skill}
              </Badge>)
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
