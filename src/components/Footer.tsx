import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image for potential persona later
import { Button } from '@/components/ui/button'; // Import Button for potential links
import { Linkedin, Github } from 'lucide-react'; // Import icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 md:py-8 border-t bg-muted/40"> {/* Added padding, border, and background */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Arvind Guruprasad. All rights reserved.
          </p>
        </div>

        {/* Placeholder for Persona */}
        {/* <div className="absolute bottom-0 left-4 hidden lg:block">
          <Image
            src="/images/persona-footer.png" // TODO: Replace with actual path when available
            alt="8-bit persona standing"
            width={70} // Adjust size
            height={100} // Adjust size
            className="object-contain"
          />
        </div> */}

        {/* Social Links */}
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://linkedin.com/in/arvind-guruprasad-73479a142/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span> {/* Screen reader text */}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" target="_blank" rel="noopener noreferrer"> {/* TODO: Add GitHub URL */}
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span> {/* Screen reader text */}
            </Link>
          </Button>
          {/* Add other relevant links here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
