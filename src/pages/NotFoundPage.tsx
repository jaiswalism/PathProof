import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <AlertTriangle size={64} className="mx-auto mb-6 text-amber-500" />
        <h1 className="mb-4 text-4xl font-bold">Page Not Found</h1>
        <p className="mb-8 text-lg text-slate-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="btn btn-primary inline-block px-8 py-3"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;