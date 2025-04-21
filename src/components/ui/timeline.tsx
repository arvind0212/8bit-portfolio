import React from 'react';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { lifeTimelineData } from '@/lib/lifeTimelineData';
import type { TimelineEntryData } from '@/lib/lifeTimelineData';

interface TimelineEntryProps extends TimelineEntryData {}

const TimelineEntry: React.FC<TimelineEntryProps> = ({
  year, title, description, imageSrc, altText
}) => (
  <Card className="w-full max-w-md h-auto min-h-45 shadow-md hover:shadow-lg transition-shadow duration-300"> {/* Changed w-110 to w-full max-w-md */}
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 h-full">
      <div className="flex-shrink-0">
        <Image
          src={imageSrc}
          alt={altText}
          width={96} // Increased image size
          height={96} // Increased image size
          className="object-cover" // Removed rounded-full, border-2, border-muted
        />
      </div>
      <div className="text-center md:text-left flex-1"> {/* Added flex-1 to allow text div to grow */}
        <h3 className="text-xl font-semibold font-heading mb-1">
          {title} ({year})
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </Card>
);

interface TimelineProps {
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ className }) => (
  <div className={cn("flex flex-col gap-y-4", className)}> {/* Reduced gap-y from 8 to 4 */}
    {lifeTimelineData.map((entry, index) => {
      const isLeft = index % 2 === 0;
      return (
        <React.Fragment key={entry.id}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 items-center">
            {isLeft && (
              <div className="md:col-start-1 md:justify-self-end">
                <TimelineEntry {...entry} />
              </div>
            )}

            {/* Center line for desktop */}
            <div className="relative">
              <div
                className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-muted-foreground/30"
                aria-hidden="true"
              />
              {/* Mobile dashed connector */}
              {index < lifeTimelineData.length - 1 && (
                <div className="mt-4 flex justify-center md:hidden" aria-hidden="true">
                  <div className="h-6 w-px border-l-2 border-dashed border-muted-foreground/50" /> {/* Reduced h from 12 to 6 */}
                </div>
              )}
            </div>

            {!isLeft && (
              <div className="md:col-start-2 md:justify-self-start">
                <TimelineEntry {...entry} />
              </div>
            )}
          </div>
          {/* Desktop dashed connector between cards */}
          {index < lifeTimelineData.length - 1 && (
            <div className="hidden md:flex justify-center">
              <div className="h-4 w-px border-l-2 border-dashed border-muted-foreground/50" /> {/* Reduced h from 8 to 4 */}
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default Timeline;
export { Timeline };
