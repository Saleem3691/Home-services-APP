// app/page.jsx
import Link from "next/link";
import Image from "next/image";
import ServiceList from "../components/services/ServiceList";
import Button from "../components/common/Button";
import Testimonials from "../components/testimonials/Testimonials";
import Stats from "../components/stats/Stats";
import FeatureCards from "../components/features/FeatureCards";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Improved accessibility and performance */}
      <section className="bg-gradient-to-r from-rich-slate to-slate-800 py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-center opacity-10"
          aria-hidden="true"
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between gap-8">
            <div className="md:w-1/2 lg:w-3/5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Professional Services <br className="hidden md:block" />
                <span className="text-teal-400">At Your Doorstep</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl md:mx-0 mx-auto leading-relaxed">
                Book trusted professionals for all your home and vehicle needs
                with{" "}
                <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent font-medium">
                  guaranteed quality service
                </span>{" "}
                and customer satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/services">
                  <Button
                    variant="primary"
                    size="lg"
                    className="group w-full sm:w-auto"
                  >
                    Explore Services
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2 lg:w-2/5 mt-10 md:mt-0">
              <div className="bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 p-1.5 rounded-2xl border border-white/10 shadow-xl">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src="/services/homecleaning.jpg"
                    alt="Professional service provider helping a customer"
                    width={600}
                    height={600}
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges - Improved responsive layout */}
      <section className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 py-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-2">
            {[
              {
                icon: (
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ),
                text: "4.9/5 rating",
              },
              {
                icon: <CheckCircle className="h-5 w-5 text-teal-400" />,
                text: "Verified professionals",
              },
              { text: "10,000+ completed services" },
              { text: "100% satisfaction guarantee" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1.5">
                {item.icon && item.icon}
                <span className="text-white font-medium text-sm md:text-base">
                  {item.text}
                </span>
                {index < 3 && (
                  <span className="hidden md:inline-block h-5 w-px bg-gray-700 mx-2"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators - Added proper alt text for logos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 font-medium mb-8 uppercase tracking-wider text-sm">
            TRUSTED BY TOP COMPANIES
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {["Forbes", "TechCrunch", "TheVerge", "Wired", "Bloomberg"].map(
              (brand) => (
                <div
                  key={brand}
                  className="text-slate-400 font-bold text-lg md:text-xl opacity-80 hover:opacity-100 hover:text-slate-700 transition-all duration-300"
                  aria-label={brand}
                >
                  {brand}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features Section - Improved section spacing */}
      <section className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">
              Our Advantages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Why Choose Our Services
            </h2>
            <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide exceptional service with these key benefits that set us
              apart from the competition
            </p>
          </div>
          <FeatureCards />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional solutions for all your needs
            </p>
          </div>
          <ServiceList />
          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="primary" size="lg" className="group">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Improved contrast */}
      <section className="bg-slate-900 py-20 relative">
        <div
          className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-center opacity-10"
          aria-hidden="true"
        ></div>
        <div className="relative z-10">
          <Stats />
        </div>
      </section>

      {/* Testimonials - Added proper heading hierarchy */}
      <section className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">
              Customer Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              What Our Customers Say
            </h2>
            <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* FAQ Section - Improved accessibility */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">
              Questions & Answers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full mb-6"></div>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How do I book a service?",
                answer:
                  "Booking is simple! Browse our services, select what you need, choose a date and time that works for you, and confirm your booking. Our professional will arrive at your doorstep at the scheduled time.",
              },
              {
                question: "Are your professionals vetted?",
                answer:
                  "Yes, all our professionals undergo a thorough background check, skill assessment, and training before joining our platform. We ensure they meet our high standards of expertise and professionalism.",
              },
              {
                question: "What if I'm not satisfied with the service?",
                answer:
                  "Your satisfaction is guaranteed. If you're not completely happy with the service provided, contact us within 24 hours and we'll make it right - either by sending another professional or issuing a refund.",
              },
              {
                question: "How do I pay for services?",
                answer:
                  "We accept all major credit cards, digital wallets, and bank transfers. Payment is processed securely through our platform after the service is completed to your satisfaction.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-lg p-6 border border-teal-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <summary className="list-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <span className="text-teal-500 mr-2">Q:</span>
                    {faq.question}
                  </h3>
                </summary>
                <p className="text-slate-600 pl-6 pt-3">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/faq">
              <Button variant="secondary" size="md">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Improved button contrast */}
      <section className="bg-gradient-to-r from-teal-700 to-cyan-700 py-20 md:py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-center opacity-10"
          aria-hidden="true"
        ></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Convenient Services?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust our professional
            services for their home and vehicle needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="outline-white" size="lg" className="group ">
                Sign Up Now{" "}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
