'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) { // Show after scrolling 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll smoothly to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="outline"
      size="icon" // Use icon size for a smaller button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-4 right-4 md:bottom-8 md:right-8', // Position bottom-right, adjust for md screens
        'h-10 w-10 md:h-12 md:w-12', // Slightly larger on md screens
        'rounded-full', // Make it circular
        'border-2 border-primary', // 8-bit style border
        'bg-background/80 backdrop-blur-sm', // Semi-transparent background
        'hover:bg-primary hover:text-primary-foreground', // Hover effect
        'transition-opacity duration-300 ease-in-out', // Fade transition
        'shadow-md', // Subtle shadow
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none' // Show/hide logic
      )}
      aria-label="Scroll back to top"
    >
      <ArrowUp className="h-5 w-5 md:h-6 md:w-6" />
    </Button>
  );
};

export default BackToTopButton;
