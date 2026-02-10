import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExperienceItem } from "@/lib/experienceData";
import { cn } from "@/lib/utils";

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
        <div className="flex items-start gap-4">
          {item.icons && item.icons.length > 0 && (
            <div className="flex shrink-0 items-center gap-1">
              {item.icons.map((icon) => {
                const isMultiple = item.icons!.length > 1;
                const size = isMultiple ? 32 : 48;
                return (
                  <div
                    key={icon}
                    className={cn(
                      "rounded-md bg-white p-1",
                      isMultiple ? "h-[32px] w-[32px]" : "h-[48px] w-[48px]"
                    )}
                  >
                    <Image
                      src={`/images/logos/${icon}`}
                      alt=""
                      width={size}
                      height={size}
                      unoptimized
                      className="h-full w-full rounded bg-white object-contain"
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="min-w-0">
            <CardTitle className="font-heading text-xl">{item.title}</CardTitle>
            <CardDescription>
              {item.institution} | {item.location} | {item.startDate} - {item.endDate}
            </CardDescription>
          </div>
        </div>
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
