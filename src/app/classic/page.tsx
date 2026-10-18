// Import components
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import HeroSection from "@/app/(sections)/HeroSection";
import AboutSection from "@/app/(sections)/AboutSection";
import ProjectSection from "@/app/(sections)/ProjectSection";
import SkillsSection from "@/app/(sections)/SkillsSection";
import ExperienceSection from "@/app/(sections)/ExperienceSection";
import ThesisSection from "@/app/(sections)/ThesisSection"; // Master's thesis highlight
import ContactSection from "@/app/(sections)/ContactSection"; // Added import
import BackToTopButton from "@/components/BackToTopButton";
import type { Metadata } from "next";

// The previous 8-bit home page, kept for comparison while the room redesign is reviewed
export const metadata: Metadata = { robots: { index: false } };

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar will be rendered here (potentially conditionally or within Hero initially) */}
      <NavigationBar />

      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <SkillsSection /> {/* Added Skills section */}
        <ExperienceSection />
        <ThesisSection /> {/* Master's thesis highlight + link to detailed brief */}
        <ProjectSection />
        <ContactSection /> {/* Added Contact section */}
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  );
}
