'use client'; // Mark as a Client Component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// Import icons from lucide-react
import { Menu, X } from 'lucide-react'; // Added Menu and X icons

const NavigationBar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const handleScroll = () => {
      // Set sticky state when scrolled past a certain threshold (e.g., 100px)
      // Adjust threshold as needed
      setIsSticky(window.scrollY > 100);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <nav
      className={cn(
        "w-full transition-all duration-300 ease-in-out z-50",
        // Apply sticky styles conditionally
        isSticky
          ? "fixed top-0 left-0 bg-background shadow-md py-2" // Styles when sticky
          : "absolute top-0 left-0 bg-transparent py-4" // Styles when not sticky (initially transparent)
      )}
    >
      {/* Use wider padding for non-sticky, potentially less for sticky */}
      <div className={cn(
          "container mx-auto flex justify-between items-center",
          isSticky ? "px-4" : "px-8 md:px-16" // More padding when not sticky
      )}>
        {/* Left Content - Show favicon and name when sticky */}
        <div className="flex items-center space-x-4 text-sm">
          {isSticky && (
            <> {/* Use Fragment to group elements */}
              <Link href="/" legacyBehavior>
                <a className="flex items-center gap-2">
                <Image
                  src="/images/8bit-favicon.png"
                  alt="Favicon"
                  width={32} // Adjust size as needed
                  height={32} // Adjust size as needed
                  className="object-contain" // Ensure image scales correctly
                />
                <span className="text-lg font-heading"> {/* Keep name styling */}
                  ARVIND GURUPRASAD
                </span>
                </a>
              </Link>
            </>
          )}
        </div>

        {/* Right Content - Navigation Links & Mobile Menu Toggle */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Desktop Links - Hidden on mobile */}
          <div className="hidden md:flex md:space-x-2">
            {/* LinkedIn Button */}
            <Button
            variant="ghost"
            className={cn(
              "font-heading text-lg", // Increased font size
              !isSticky && "text-white hover:text-gray-800" // White text when not sticky, dark grey on hover
            )}
          >
            <Link href="https://linkedin.com/in/arvind-guruprasad-73479a142/" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
          </Button>
          {/* Resume Button */}
          <Button
            variant="ghost"
            className={cn(
              "font-heading text-lg", // Increased font size
              !isSticky && "text-white hover:text-gray-800" // White text when not sticky, dark grey on hover
            )}
            asChild
          >
            <Link href="https://drive.google.com/file/d/1NuS61X_awnnDSR8uW-5jEng5P1QcZ2f3/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Resume</Link>
          </Button>
          {/* Contact Button */}
          <Button
            variant="ghost"
            className={cn(
              "font-heading text-lg", // Increased font size
              !isSticky && "text-white hover:text-gray-800" // White text when not sticky, dark grey on hover
            )}
              asChild
            >
              <Link href="#contact">Contact</Link>
            </Button>
          </div>

          {/* Mobile Menu Button - Hidden on medium screens and up */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden", // Base class: Only show on mobile
              // When sticky: use default foreground color (contrasts with bg-background)
              // When not sticky: use white text
              isSticky ? "text-foreground hover:text-foreground/80" : "text-white hover:text-gray-300"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Toggle menu state
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} {/* Show X or Menu icon */}
          </Button>
        </div>
      </div>
      {/* Mobile Menu Dropdown - Conditionally rendered */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-background shadow-md md:hidden"> {/* Position below nav, hide on md+ */}
          <div className="container mx-auto flex flex-col items-center space-y-2 py-4 px-4">
            {/* LinkedIn Button */}
            <Button
              variant="ghost"
              className="font-heading text-lg w-full"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              asChild
            >
              <Link href="https://linkedin.com/in/arvind-guruprasad-73479a142/" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
            </Button>
            {/* Resume Button */}
            <Button
              variant="ghost"
              className="font-heading text-lg w-full"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              asChild
            >
              <Link href="https://drive.google.com/file/d/1NuS61X_awnnDSR8uW-5jEng5P1QcZ2f3/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Resume</Link>
            </Button>
            {/* Contact Button */}
            <Button
              variant="ghost"
              className="font-heading text-lg w-full"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              asChild
            >
              <Link href="#contact">Contact</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
