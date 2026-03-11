import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-6 py-20">
      <section className="w-full max-w-2xl text-center bg-white border border-slate-200 rounded-xl shadow-md p-8 md:p-12">
        <p className="text-sm md:text-base font-semibold tracking-[0.2em] text-amber-600 uppercase">Error 404</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-4 text-slate-600 text-base md:text-lg">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide uppercase bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide uppercase border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFound;
