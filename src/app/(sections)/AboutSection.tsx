import React from 'react';
import { cn } from '@/lib/utils';
import { Timeline } from '@/components/ui/timeline'; // Import the Timeline component
import { lifeTimelineData } from '@/lib/lifeTimelineData'; // Import the timeline data

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary"> {/* Added padding and background */}
      <div className="container mx-auto px-4 text-center">
        <h2 className={cn(          "font-heading text-4xl md:text-5xl font-bold mb-6",
          "text-primary"
        )}>
          Origin Story
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-500">
          From Muscat sands to Stockholm's tech scene, here's the journey that sparked my passion for improving lives through healthcare, data, and AI.
          {/* You can expand on this later */}
        </p>

        {/* Render the new Timeline component (it imports data internally) */}
        {/* Removed items prop, adjusted className for new layout */}
        <Timeline className="mt-12" />

      </div>
    </section>
  );
};

export default AboutSection;
