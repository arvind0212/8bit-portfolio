// Import components
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import HeroSection from "@/app/(sections)/HeroSection";
import AboutSection from "@/app/(sections)/AboutSection";
import ProjectSection from "@/app/(sections)/ProjectSection";
import SkillsSection from "@/app/(sections)/SkillsSection";
import ExperienceSection from "@/app/(sections)/ExperienceSection";
import ContactSection from "@/app/(sections)/ContactSection"; // Added import

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
        <ProjectSection />
        <ContactSection /> {/* Added Contact section */}
      </main>

      <Footer />
    </div>
  );
}
