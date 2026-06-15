import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FlaskConical, GraduationCap, ArrowUpRight, FileText } from 'lucide-react';

// Google Drive link to the full thesis PDF
const THESIS_PDF_URL = 'https://drive.google.com/file/d/1B08Fza-tUPzirZH96MxiefAJnih5meNo/view?usp=drive_link';

// High-level stats surfaced from the full thesis brief (see /thesis-summary.html)
const stats = [
  { value: '3', label: 'Agent designs compared' },
  { value: '2', label: 'Frontier models benchmarked' },
  { value: '5', label: 'Layers of data messiness' },
  { value: '~100%', label: 'Lab accuracy (best agent)' },
  { value: '~91%', label: 'Medication accuracy (best agent)' },
];

const tech = ['LLM Agents', 'OMOP CDM', 'Clinical ETL', 'Synthea', 'LOINC / RxNorm', 'Python'];

const ThesisSection = () => {
  return (
    <section id="thesis" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className={cn(
          'font-heading text-4xl md:text-5xl font-bold mb-4 text-center',
          'text-primary'
        )}>
          Master&apos;s Thesis
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-center text-gray-500 mb-12">
          Freshly defended at Karolinska Institutet. I stress-tested whether AI agents can clean up
          messy clinical data without quietly corrupting what it actually means.
        </p>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>Karolinska Institutet &middot; MSc Biostatistics &amp; Data Science</span>
            </div>
            <div className="flex items-start gap-3">
              <FlaskConical className="w-6 h-6 text-primary shrink-0 mt-1" />
              <CardTitle className="font-sans text-2xl md:text-3xl font-bold leading-tight">
                Can AI agents standardise clinical data without losing its meaning?
              </CardTitle>
            </div>
            <CardDescription className="text-base md:text-lg leading-relaxed mt-3">
              Every hospital records lab results and medications in its own way: local codes, units, and
              formats. To power research, all of it has to be reshaped into a shared standard (OMOP) without
              corrupting a single clinical fact. So I built a fully synthetic, reproducible benchmark that
              stacks five layers of real-world &ldquo;messiness&rdquo; and grades three increasingly capable
              LLM agents against a known answer key. The verdict: more capability did lift accuracy, but it
              also piled on cost and new failure modes. <span className="font-semibold text-foreground">&ldquo;More agentic&rdquo; is not automatically &ldquo;better.&rdquo;</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Key numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 border-y py-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-heading text-3xl md:text-4xl text-primary leading-none">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-2 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tech */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tech.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="font-heading text-lg">
                <Link href="/thesis-summary.html" target="_blank" rel="noopener noreferrer">
                  Read the full story
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="font-heading text-lg">
                <Link href={THESIS_PDF_URL} target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-1 h-4 w-4" />
                  Read the thesis (PDF)
                </Link>
              </Button>
              <Button asChild variant="outline" className="font-heading text-lg">
                <Link
                  href="https://github.com/arvind0212/agentic-clinical-etl-benchmark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the repo
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ThesisSection;
