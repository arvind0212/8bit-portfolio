import React from "react";
import { experienceData } from "@/lib/experienceData";
import ExperienceCard from "@/components/ExperienceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Helper function to render timeline items
const renderTimelineItems = (items: typeof experienceData) => {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border -ml-[1px]" aria-hidden="true"></div>
      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={`${item.type}-${index}`} className="relative pl-12">
            <div className="absolute left-4 top-5 -ml-[calc(0.5rem+1px)] w-4 h-4 bg-background border-2 border-primary" aria-hidden="true"></div>
            <ExperienceCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ExperienceSection() {
  const sortedExperience = [...experienceData].sort((a, b) => {
    if (a.endDate === 'Present' && b.endDate !== 'Present') return -1;
    if (a.endDate !== 'Present' && b.endDate === 'Present') return 1;
    return b.startDate.localeCompare(a.startDate);
  });

  const academicItems = sortedExperience.filter((item) => item.type === 'academic');
  const workItems = sortedExperience.filter((item) => item.type === 'work');

  return (
    <section id="experience" className="py-16 md:py-24 bg-muted/40">
      <h2 className={cn(
        "font-heading text-4xl md:text-5xl font-bold mb-12 text-center",
        "text-primary"
      )}>Experience</h2>

      <div className="max-w-4xl mx-auto px-4">
        <Tabs defaultValue="work" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
          </TabsList>
          <TabsContent value="work">
            {renderTimelineItems(workItems)}
          </TabsContent>
          <TabsContent value="academic">
            {renderTimelineItems(academicItems)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
