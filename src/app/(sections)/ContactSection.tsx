'use client'; // Required for form handling

import React, { useState, ChangeEvent, FormEvent } from 'react'; // Added ChangeEvent, FormEvent
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Send, Linkedin } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

// Define state types
type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const ContactSection = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus('loading');
    setStatusMessage(''); // Clear previous messages

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setStatusMessage('Message sent successfully!');
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setStatusMessage(`Failed to send message: ${result.error || 'Unknown error'}`);
        console.error('API Error:', result);
      }
    } catch (error) {
      console.error('Form Submission Error:', error);
      setSubmitStatus('error');
      setStatusMessage('An error occurred while sending the message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-background text-foreground">
      <div className="container mx-auto px-4">
        {/* Centered Header */}        
        <div className="flex items-center justify-center gap-4 mb-12">
          <Image
            src="/assets/persona/persona-corner.png"
            alt="8-bit avatar"
            width={64}
            height={64}
            className="object-contain"
          />
          <h2 className={cn(
            "font-heading text-4xl md:text-5xl font-bold",
            "text-primary"
          )}>
            Get in Touch
          </h2>
        </div>

        {/* Grid Layout - Constrained Width */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-start">

          {/* Left Column: Contact Form */}
          {/* Wrapped in Card for styling */}
          <Card className="p-6 md:p-8">
            <CardContent className="p-0"> {/* Remove default CardContent padding */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="mb-1.5 block">Name</Label> {/* Added margin */}
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={submitStatus === 'loading'}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1.5 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={submitStatus === 'loading'}
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="mb-1.5 block">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={submitStatus === 'loading'}
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="mb-1.5 block">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message here..."
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={submitStatus === 'loading'}
                  />
                </div>
                {/* Status Message Display */}
                {statusMessage && (
                  <p className={cn(
                    "text-sm text-center",
                    submitStatus === 'success' ? 'text-green-600' : '',
                    submitStatus === 'error' ? 'text-red-600' : ''
                  )}>
                    {statusMessage}
                  </p>
                )}
                <Button
                  type="submit"
                  variant="outline"
                  disabled={submitStatus === 'loading'} // Disable button when loading
                  size="lg"
                  className={cn(
                    "w-full font-heading text-lg",
                    "border-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200",
                    submitStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : '' // Style when loading
                  )}
                >
                  {submitStatus === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
                  {submitStatus !== 'loading' && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Column: Direct Contact Info */}
          {/* Added text-center items-center for mobile, md:text-left md:items-start for larger screens */}
          <div className="flex flex-col justify-center items-center text-center space-y-6 pt-4 md:pt-0 md:items-start md:text-left">
            <p className="text-lg leading-relaxed text-muted-foreground"> {/* Relaxed leading, muted color */}
              Have a question, a project idea, or just want to connect? Feel free to reach out directly or use the form. I&apos;m always open to discussing new opportunities and collaborations.
            </p>
            {/* Added items-center for mobile centering of links, md:items-start for larger screens */}
            <div className="flex flex-col items-center space-y-3 md:items-start">
               <Link
                 href="mailto:arvindguruprasad33@gmail.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-base hover:text-primary transition-colors" // Adjusted text size
               >
                 <Mail size={20} /> {/* Slightly smaller icon */}
                 <span>arvindguruprasad33@gmail.com</span>
               </Link>
               <Link
                 href="https://linkedin.com/in/arvind-guruprasad-73479a142/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 text-base hover:text-primary transition-colors"
               >
                 <Linkedin size={20} />
                 <span>LinkedIn Profile</span>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
