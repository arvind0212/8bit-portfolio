# Portfolio v1 - Progress Log

This document tracks the development progress and key decisions made during the creation of the portfolio website using Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Phase 1-3: Project Setup & Initial Configuration

*   **Initialization:**
    *   Project created using `create-next-app` with TypeScript, Tailwind CSS, and ESLint enabled.
    *   Opted to use Turbopack (`--turbo`) for faster development builds.
    *   Initialized Git repository.
*   **UI Library:**
    *   Integrated `shadcn/ui` for pre-built, customizable components (Button, Card). This promotes consistency and accelerates UI development. Chosen components: `button`, `card`.
*   **Core Structure:**
    *   Standard Next.js App Router structure (`src/app/`).
    *   `layout.tsx`: Root layout configured.
    *   `page.tsx`: Main entry point for the home page.
    *   `globals.css`: Base Tailwind directives and custom global styles.
*   **Fonts:**
    *   `Inter`: Selected as the primary sans-serif font (`--font-sans`) for body text, configured via `next/font/google` in `layout.tsx`.
    *   `Jersey 20`: Selected as the pixelated heading font (`--font-heading`), configured via `next/font/google` in `layout.tsx`. Font variables are applied globally in the `<body>` tag using `cn` utility.
*   **Metadata:**
    *   Basic metadata (title, description) added in `layout.tsx` for SEO and browser tab information.
*   **Utilities:**
    *   `cn` utility from `shadcn/ui` (`@/lib/utils`) used for conditionally applying Tailwind classes, improving code readability.

## Phase 4-6: Component Implementation (Initial Pass)

*   **Component-Based Architecture:** The UI is broken down into reusable components located in `src/components/` and section-specific components in `src/app/(sections)/`. This enhances maintainability and scalability.
*   **`NavigationBar.tsx`:**
    *   Created as a client component (`'use client'`) to handle scroll-based state (`isSticky`).
    *   Implements sticky behavior: changes from `absolute` transparent to `fixed` with background (`bg-background`) on scroll using `useEffect` and `useState`.
    *   **Conditional Content:** Displays different content on the left side based on `isSticky` state (MSc/Location info initially, Name when sticky).
    *   Uses `lucide-react` for icons (GraduationCap, MapPin), promoting consistency with shadcn/ui.
    *   Navigation links implemented using shadcn/ui `Button` with `variant="ghost"` and Next.js `Link`.
    *   Pixelated font (`font-heading`) applied to relevant text elements. Debugged `React.Children.only` error related to `asChild` and font application, resolving it by applying font class directly to `Link`. Removed duplicate `'use client'` directive.
*   **`HeroSection.tsx`:**
    *   Full-screen section (`min-h-screen`) with a background image applied via inline `style`.
    *   Uses `relative` positioning on the section and `absolute` positioning for main content blocks (left/right) for precise layout control based on Figma design. `top-1/2 -translate-y-1/2` used for vertical centering.
    *   Left Block: Contains subtext ("Currently researching..."), icons (`lucide-react`: Plus, BarChart), and a primary CTA "PROJECTS" button. Pixelated font applied.
    *   Right Block: Contains the main name (`h1`).
    *   **Name Line Break:** Name split into two lines ("ARVIND", "GURUPRASAD") using `block` spans within the `h1`.
    *   **Persona Integration:**
        *   8-bit persona image (`Image` component) positioned absolutely relative to a specific character ('A' in "ARVIND").
        *   Used nested `span` with `relative inline-block` on the target character ('A') to create the positioning context.
        *   Persona container `span` uses `absolute bottom-full left-0` with negative `mb` and `ml` (using arbitrary values `mb-[-34px] ml-[-22px]`) for fine-tuned placement based on browser dev tools inspection.
        *   `z-index` applied to ensure persona appears above text.
        *   Addressed image transparency issue by ensuring correct PNG export settings from Figma.
    *   **CTA Button:** "PROJECTS" button styled using shadcn/ui `Button` (`variant="outline"`, custom background/text colors, increased size `py-3 px-6 text-lg`, pixelated font). Links to `#projects` section.
*   **`AboutSection.tsx`:**
    *   Basic section structure with placeholder content.
*   **`ProjectSection.tsx`:**
    *   Uses shadcn/ui `Card` components to display project details in an interactive carousel
    *   Implemented using Embla Carousel with Autoplay plugin
    *   Features:
        * Responsive layout (1 slide on mobile, 2 slides on desktop)
        * Auto-rotation with 5 second interval
        * Toggle switch to enable/disable auto-rotation
        * Navigation buttons with chevron icons
        * Maintains corner persona image on desktop view
*   **`Footer.tsx`:**
    *   Basic footer structure with copyright notice (dynamic year) and placeholder social links using shadcn/ui `Button` (`variant="ghost"`).

## Phase 7: Additional Pages & Styling

*   **Custom 404 Page (`not-found.tsx`):**
    *   Created a custom page for handling 404 errors, providing a user-friendly message and a link back home. Includes placeholder for a 404-specific persona image.
*   **Smooth Scrolling:**
    *   Enabled smooth scrolling for anchor links (`#projects`, etc.) globally by adding `html { scroll-behavior: smooth; }` to `globals.css`.
*   **Asset Management:**
    *   Images placed in the `public` directory (`public/images/` for general images, `public/assets/persona/` for persona variants).
    *   Resolved initial 404 errors caused by incorrect download paths/server cache issues by re-downloading/manually placing images in the correct project subdirectories and restarting the dev server.

## Scalability & Best Practices Summary

*   **Componentization:** Breaking down the UI into smaller, reusable components (`NavigationBar`, `Button`, `Card`, section components) makes the codebase easier to manage, test, and scale.
*   **TypeScript:** Provides static typing, reducing runtime errors and improving code maintainability, especially in larger projects.
*   **Tailwind CSS:** Utility-first approach allows for rapid styling directly in the JSX, reducing the need for separate CSS files and potential style conflicts. `cn` utility helps manage conditional styles cleanly.
*   **shadcn/ui:** Leverages a curated set of accessible and customizable components, ensuring UI consistency and reducing boilerplate code.
*   **Next.js App Router:** Utilizes server components by default where possible, potentially improving performance. Client components (`'use client'`) are used explicitly when browser-specific APIs or hooks (`useState`, `useEffect`) are needed.
*   **File-based Routing:** Next.js provides an intuitive routing system based on the file structure within the `app` directory.
*   **Code Readability:** Use of descriptive variable names, comments, and consistent formatting (aided by ESLint/Prettier).
*   **Accessibility:** While not explicitly audited yet, using `shadcn/ui` provides a good foundation for accessible components. Semantic HTML elements (`nav`, `section`, `h1`, `button`) are used. Alt text added for images.
*   **Performance:** Smooth scrolling implemented via CSS. Next.js offers various performance optimizations (code splitting, image optimization via `<Image>`). Turbopack used for faster development builds.

## Phase 8: Experience & Skills Sections Implementation

* **Experience Section (`ExperienceSection.tsx`):**
  * Created a dual-view experience section with:
    * **Desktop:** Timeline view showing both professional and academic experience in a visually connected layout
    * **Mobile:** Tabbed interface allowing users to toggle between professional and academic views
  * Uses `shadcn/ui` components (`Tabs`, `Card`) for consistent styling
  * Data is structured in `src/lib/experienceData.ts` with:
    * Reverse chronological sorting (newest first)
    * Clear separation between work and academic items
    * Detailed descriptions with bullet points
    * Relevant skills for each position
  * Visual timeline elements include:
    * Vertical connecting line
    * Position indicator dots
    * Responsive spacing

* **Skills Section (`SkillsSection.tsx`):**
  * Implemented grouped skill display using Approach 2 (Grouped Minimalist Badges)
  * Features:
    * Categorized skills (Programming, Cloud, Healthcare, Certifications)
    * `shadcn/ui Badge` components for individual skills
    * `lucide-react` icons for each category
    * Responsive flex layout
  * Design elements:
    * Main title in pixel font (`font-heading`)
    * Category titles in sans-serif (`font-sans`) at reduced size (`text-lg`)
    * Icons from `lucide-react` (Code, CloudCog, DatabaseZap, Award)
    * Secondary variant badges for clean, readable display

## Current State & Next Steps

The portfolio now includes complete Experience and Skills sections with:
* Responsive designs for all screen sizes
* Consistent use of the design system (fonts, colors, components)
* Real content extracted from the resume
* Visual hierarchy and organization

Future refinements may include:
* Adding interactive elements to the Experience timeline
* Further visual polish on the Skills badges
* Potential animations/transitions
* Content updates as experience grows

## Phase 9: About Section Enhancements

* **Timeline Component Integration:**
  * Enhanced `AboutSection.tsx` with a new playful timeline view showcasing life's journey
  * Created `TimelineEntry` and `Timeline` components in `src/components/ui/timeline.tsx`
  * Features:
    * Alternating left/right layout on desktop, single column on mobile
    * Fixed-height cards for consistent appearance
    * Dashed line connectors between timeline entries
    * 8-bit persona placeholders for each life stage
  * Data Structure:
    * Timeline data managed in `src/lib/lifeTimelineData.ts`
    * Each entry includes:
      * Year range
      * Title
      * Description
      * Image path (for 8-bit persona variants)
      * Alt text for accessibility
  * Visual Elements:
    * Cards with consistent height and text formatting
    * Pixelated dashed connectors between entries
    * Left/right alternating pattern on desktop
    * Responsive design with mobile-optimized single column view

## Phase 10: Styling Refinements & Bug Fixes

*   **Error Resolution:**
    *   Addressed hydration error ("whitespace text nodes cannot be a child of <html>") by investigating `layout.tsx` and `page.tsx`. Initial attempts to modify `layout.tsx` were reverted. The error seemed intermittent or resolved implicitly.
    *   Resolved `TypeError` in `ProjectSection.tsx` related to Embla Carousel Autoplay plugin initialization during hydration. Implemented a `setTimeout` delay in the `useEffect` hook to ensure the plugin was ready before calling `.play()`.
*   **About Section Timeline Styling (`timeline.tsx`):**
    *   Adjusted card dimensions (`w-96`, `min-h-56`) for consistent width and flexible height.
    *   Increased image size (`width/height={96}`).
    *   Removed background color (`bg-secondary`) and circular styling/border (`rounded-full`, `border-2`) from images for a cleaner look.
    *   Reduced vertical spacing between timeline cards (`gap-y-4`) and shortened dashed connectors (`h-6` mobile, `h-4` desktop) to decrease whitespace.
*   **Navigation Bar Styling (`NavigationBar.tsx`):**
    *   Added the 8-bit favicon (`/images/8bit-favicon.png`) next to the name, conditionally displayed only when the navbar is sticky (`isSticky` state is true).
*   **Skills Section Styling (`SkillsSection.tsx`):**
    *   Replaced text badges for "Certifications" with corresponding image badges (`Image` component).
    *   Initially centered the "Certifications" title and badges, then reverted to left alignment for consistency with other skill categories based on feedback.
*   **Experience Section Styling & UX (`ExperienceSection.tsx`, `ExperienceCard.tsx`, `experienceData.ts`):**
    *   **Card Enhancements (`ExperienceCard.tsx`):** Applied heading font (`font-heading`) and increased size (`text-xl`) to titles. Added subtle hover effect (scale/shadow). Changed skill badge variant to `outline`.
    *   **Timeline Marker (`ExperienceSection.tsx`):** Replaced default circular dot with a square marker (`w-4 h-4 border-2 border-primary`) for thematic consistency.
    *   **Description Conciseness (`experienceData.ts`):** Rewrote description bullet points to be more concise and action-oriented.
    *   **Keyword Highlighting (`ExperienceCard.tsx`, `experienceData.ts`):** Marked keywords in descriptions (`**keyword**`) and implemented a helper component (`HighlightedDescription`) in the card to render these keywords with primary color and medium weight. Reduced description font size (`text-sm`).

## Phase 11: Contact Section Implementation & Navigation Updates

*   **Shadcn Component Installation:**
    *   Added `label`, `input`, and `textarea` components using `npx shadcn@latest add`. Resolved initial issues with deprecated package name (`shadcn-ui`) and command chaining syntax for PowerShell.
*   **Contact Section (`ContactSection.tsx`):**
    *   Created a new section component `src/app/(sections)/ContactSection.tsx`.
    *   Implemented a two-column layout using Tailwind Grid (`grid grid-cols-1 md:grid-cols-2`).
    *   **Header:** Added "GET IN TOUCH" title using the pixelated font (`font-heading`).
    *   **Form (Left Column):**
        *   Built using Shadcn `Card`, `Label`, `Input`, `Textarea`, and `Button`.
        *   Styled the submit button (`variant="outline"`, `size="lg"`, `font-heading`) with a `Send` icon (`lucide-react`) and hover effects.
        *   Includes basic `onSubmit` handler (logs to console).
    *   **Info Panel (Right Column):**
        *   Added introductory text (`text-muted-foreground`, `leading-relaxed`).
        *   Included direct links for Email (`mailto:`) and LinkedIn using `lucide-react` icons (`Mail`, `Linkedin`) with hover effects.
    *   **Styling Refinements:**
        *   Constrained the maximum width of the grid (`max-w-6xl mx-auto`) to improve appearance on large screens.
        *   Adjusted spacing, font sizes, and component usage based on feedback for a playful yet professional aesthetic.
*   **Page Integration (`page.tsx`):**
    *   Imported and added `<ContactSection />` to the main page flow after `<ProjectSection />`.
*   **Navigation Bar Updates (`NavigationBar.tsx`):**
    *   Updated the existing "Contact" link's `href` to point to `#contact`.
    *   Modified the LinkedIn and Resume links to open in a new tab by adding `target="_blank"` and `rel="noopener noreferrer"`.

## Phase 12: Mobile Responsiveness Fixes

*   **Section Content Containment:**
    *   Analyzed `AboutSection`, `SkillsSection`, `ExperienceSection`, `ProjectSection`, and `ContactSection` for mobile layout issues where content might overflow the alternating background colors.
    *   Identified that `AboutSection`'s timeline cards (`TimelineEntry` in `timeline.tsx`) had a fixed width (`w-110`) causing overflow.
    *   **Fix:** Modified `timeline.tsx` to use `w-full max-w-md` for the `Card` in `TimelineEntry`, making it responsive and respecting the container padding.
    *   Confirmed other sections used appropriate container structures (`container mx-auto px-4`) and did not require changes for this specific issue.
*   **Sticky Navigation Bar (Mobile):**
    *   Identified layout issue on mobile when the navigation bar is sticky: the left content (favicon + name) and right content (buttons) conflicted due to limited space.
    *   **Fix:** Implemented a hamburger menu (`NavigationBar.tsx`):
        *   Added state (`isMobileMenuOpen`) to manage menu visibility.
        *   Hid desktop navigation links (`LinkedIn`, `Resume`, `Contact`) on mobile (`md:` breakpoint).
        *   Displayed a `Menu`/`X` icon button to toggle the mobile menu.
        *   Created a dropdown overlay for mobile links, positioned below the navbar.
        *   Ensured desktop layout remains unchanged.
