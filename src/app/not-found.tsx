import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      {/* Placeholder for 404 Persona */}
      {/* <div className="mb-8">
        <Image
          src="/images/persona-404.png" // TODO: Replace with actual path when available
          alt="Confused 8-bit persona"
          width={150} // Adjust size
          height={150} // Adjust size
          className="object-contain"
        />
      </div> */}

      <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Oops! The page you are looking for does not seem to exist. Maybe it was moved or deleted.
      </p>
      <Button asChild>
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
