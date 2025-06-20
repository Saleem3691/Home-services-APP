// app/services/page.jsx
"use client";
import ServiceList from "@/src/components/services/ServiceList";
import Link from "next/link";

export default function Services() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Original rich-slate color scheme */}
      <section className="bg-gradient-to-r from-rich-slate to-slate-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-lightest-slate mb-6">
            Our Professional Services
          </h1>
          <p className="text-xl text-light-slate max-w-3xl mx-auto">
            Choose from our comprehensive range of services, all delivered by verified professionals with guaranteed quality.
          </p>
        </div>
      </section>

      {/* Services Grid - Original white background */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Browse Our Services
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              All services come with our satisfaction guarantee
            </p>
          </div>
          <ServiceList />
        </div>
      </section>

      {/* CTA Section - Original slate-50 background */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Need something special?
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Contact us and we'll help arrange the perfect service for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-rich-slate text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
              >
                Contact Our Team
              </Link>
              <Link
                href="/how-it-works"
                className="px-6 py-3 bg-white text-rich-slate border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}