import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BarChart, ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-cover bg-center text-white overflow-hidden bg-scroll md:bg-fixed flex flex-col items-center md:block"
      style={{ backgroundImage: "url('/images/hero-background.webp')" }}
    >
      <div className={cn(
        "w-full md:w-auto px-4 md:px-0",
        "order-2 md:order-none",
        "mt-8 md:mt-0",
        "md:absolute md:top-20 md:left-16 lg:left-24 z-10"
      )}>
        <div className="z-50 space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 font-heading text-xl md:text-2xl text-white text-shadow-[1px_1px_3px_rgba(0,0,0,0.4)]">
            <Image
              src="/images/grad_hat.png"
              alt="Degree"
              width={30}
              height={42}
            />
            <span>MSc Biostatistics & Data Science</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2 font-heading text-xl md:text-2xl text-white text-shadow-[1px_1px_3px_rgba(0,0,0,0.4)]">
            <Image
              src="/images/location.png"
              alt="Location"
              width={29}
              height={28}
            />
            <span>Stockholm, Sweden</span>
          </div>
        </div>
      </div>

      <div className={cn(
        "w-full md:w-auto px-4 md:px-0",
        "order-3 md:order-none",
        "mt-7 md:mt-0",
        "text-center md:text-left",
        "space-y-2 md:space-y-3 font-heading",
        "md:absolute md:top-1/2 md:-translate-y-1/2 md:left-16 lg:left-24 z-10"
      )}>
        <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold text-shadow-[1px_1px_5px_rgba(0,0,0,0.4)]">
          CURRENTLY RESEARCHING
        </p>
        <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold text-shadow-[1px_1px_5px_rgba(0,0,0,0.4)]">
          THE INTERSECTION OF
        </p>
        <div className="flex items-center justify-center md:justify-start space-x-2 text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold">
          <Image
            src="/images/Healthcare.png"
            alt="Healthcare Icon"
            width={28}
            height={28}
            className="inline-block"
          />
          <span className="text-white font-bold [-webkit-text-stroke:1px_#B91C1C]">HEALTHCARE</span>
        </div>
        <div className="flex items-center justify-center md:justify-start space-x-2 text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold">
          <Image
            src="/images/Data and AI.png"
            alt="Data and AI Icon"
            width={22}
            height={22}
            className="inline-block"
          />
          <span className="text-white font-bold [-webkit-text-stroke:1px_#1D4ED8]">&nbsp;DATA AND AI</span>
        </div>
        <div className="pt-4 md:pt-2 text-center md:text-left">
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-100 border-black font-heading py-3 px-6 text-lg inline-flex"
            asChild
          >
            <Link href="#projects">
              <>
                PROJECTS
                <ArrowDown className="ml-2 h-4 w-4" />
              </>
            </Link>
          </Button>
        </div>
      </div>

      <div className={cn(
        "z-10 w-full px-4",
        "order-1 md:order-none",
        "text-center md:text-right",
        "md:absolute md:top-1/2 md:-translate-y-1/2 md:right-16 lg:right-24 md:w-auto md:px-0"
      )}>
        <div className="mb-1 md:hidden">
          <Image
            src="/assets/persona/persona-hero.png"
            alt="8-bit persona"
            width={100}
            height={100}
            className="mx-auto object-contain pt-24"
          />
        </div>
        <h1 className={cn(
          "font-heading text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-none",
          "text-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]"
        )}>
          <div className="hidden md:block">
            <span className="block">
              <span className="relative inline-block">
                A
                <span className="absolute bottom-full left-0 z-20 mb-[-43px] ml-[-22px]">
                  <Image
                    src="/assets/persona/persona-hero.png"
                    alt="8-bit persona sitting on the letter A"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </span>
              </span>
              RVIND
            </span>
            <span className="block">GURUPRASAD</span>
          </div>

          <div className="md:hidden">
            <span className="block">ARVIND</span>
            <span className="block">GURUPRASAD</span>
          </div>
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;