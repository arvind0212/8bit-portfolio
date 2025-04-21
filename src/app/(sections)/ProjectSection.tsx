'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react'; // Import useRef
import Image from "next/image";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, DatabaseZap, Users, ShieldAlert } from "lucide-react"; // Import icons

const projects = [
  {
    title: "AI-Powered FHIR Mapping",
    icon: DatabaseZap,
    description: "Developed an automated pipeline using LLMs (Gemini) and Retrieval-Augmented Generation (RAG) to map unstructured EHR data elements to standardized FHIR resources.",
    tech: ["LLM", "RAG", "Python", "Google Cloud", "BigQuery"],
    impact: "Cut manual coding by 50%, achieved 95% accuracy.",
    link: "#"
  },
  {
    title: "Predictive Nurse Staffing",
    icon: Users,
    description: "Engineered an LSTM time-series model trained on over 550 million historical records to accurately forecast nurse workload demands and optimize staffing levels.",
    tech: ["LSTM", "Time-Series", "Python", "Vertex AI", "BigQuery"],
    impact: "Reduced overstaffing costs by 40% ($1M+ annual savings), 95% accuracy.",
    link: "#"
  },
  {
    title: "Proactive Patient Risk Modeling",
    icon: ShieldAlert,
    description: "Built advanced machine learning models integrating Social Determinants of Health (SDOH) and CDC SVI data to enable earlier identification of high-risk patient populations.",
    tech: ["Machine Learning", "Risk Modeling", "Python", "SQL", "BigQuery"],
    impact: "Identified high-risk patients 15% earlier.",
    link: "#"
  },
];

const ProjectSection = () => {
  // Create a stable ref for the Autoplay plugin instance, set stopOnInteraction to true
  const autoplayRef = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: true, // Enable looping for smoother rotation with 3 cards
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 }, // Medium screens scroll 2
      '(min-width: 1024px)': { slidesToScroll: 1 }  // Large screens scroll 1 when 3 are visible
    }
  }, [autoplayRef.current]); // Pass the stable ref's current value

  // No custom useEffect needed to manage play/stop - let the plugin handle it.
  // State for potential UI toggle can remain if needed.
  const [autoPlay, setAutoPlay] = useState(true);

  // Callback for potential UI toggle (if re-enabled later)
  const toggleAutoPlay = useCallback(() => {
    const autoplay = autoplayRef.current;
    if (!autoplay) return;
    const playing = autoplay.isPlaying();
    if (playing) autoplay.stop();
    else autoplay.play();
    setAutoPlay(!playing);
  }, []);


  return (
    <section id="projects" className="relative py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className={cn(
          "font-heading text-4xl md:text-5xl font-bold mb-12 text-center",
          "text-primary"
        )}>
          Projects
        </h2>

        {/* Further reduced max-width container */}
        <div className="max-w-6xl mx-auto"> 
          <div className="relative">
            {/* <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-accent/50 transition-colors hidden lg:block" // Adjusted position again
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6 text-foreground/70" />
          </button> */}
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {projects.map((project, index) => (
                // Ensure consistent padding for spacing
                (<div key={index} className="mb-8 embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4"> {/* Adjusted md width back, use padding */}
                  <Card className="flex flex-col h-full min-h-[320px]"> {/* Added min-height */}
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <project.icon className="w-6 h-6 text-primary" /> {/* Added Icon */}
                        <CardTitle className="font-sans font-semibold">{project.title}</CardTitle>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow mt-auto"> {/* Pushed content down */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-1 text-sm">Tech Stack:</h4>
                        <p className="text-sm text-muted-foreground">{project.tech.join(', ')}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-sm">Impact:</h4>
                        <p className="text-sm text-muted-foreground">{project.impact}</p>
                      </div>
                    </CardContent>
                    {/* <CardFooter>
                      <Button variant="outline" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">Learn More</a>
                      </Button>
                    </CardFooter> */}
                  </Card>
                </div>)
              ))}
            </div>
          </div>
          {/* <button 
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-accent/50 transition-colors hidden lg:block" // Adjusted position again
              aria-label="Next project"
            >
              <ChevronRight className="w-6 h-6 text-foreground/70" />
            </button> */}
          </div>
        </div> {/* End of max-width container */}

        {/* <div className="flex justify-center mt-8 items-center gap-4">
          <Switch
            checked={autoPlay} 
            onCheckedChange={toggleAutoPlay}
            aria-label="Auto-rotate projects"
          />
          <span className="text-sm">Auto-rotate</span>
        </div> */}
      </div>
    </section>
  );
};

export default ProjectSection;
