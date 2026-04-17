import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-pattern">
      <div className="text-center">
        <h1 className="text-9xl font-bold font-heading text-primary/20">404</h1>
        <h2 className="text-3xl font-bold font-heading text-foreground mt-4 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-sm mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
