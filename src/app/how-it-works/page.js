// app/how-it-works/page.jsx
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Clock,
  UserPlus,
  Home,
  Shield,
  Calendar,
  MessageSquare,
  CreditCard,
  Star,
} from "lucide-react";
import Button from "@/src/components/common/Button";

export default function HowItWorks() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rich-slate to-slate-800 py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-center opacity-10"
          aria-hidden="true"
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              How Our <span className="text-teal-400">Service Works</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Getting professional help for your home has never been easier.
              Here&apos;s how our platform connects you with trusted service
              providers in just a few simple steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="group">
                  Get Started
                  <UserPlus className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline-white" size="lg">
                  Browse Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Customers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">
              For Customers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              How to Get Services
            </h2>
            <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Follow these simple steps to book a professional service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 cursor-pointer">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-teal-300 transition-all group">
              <div className="flex items-center mb-4">
                <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-800">Sign Up</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Create your free account in less than a minute. No commitments,
                no hidden fees.
              </p>
              <div className="flex items-center text-sm text-teal-600 font-medium">
                <UserPlus className="h-4 w-4 mr-2" />
                Quick and easy registration
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-teal-300 transition-all group">
              <div className="flex items-center mb-4">
                <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Browse Services
                </h3>
              </div>
              <p className="text-slate-600 mb-4">
                Explore our wide range of home services from cleaning to
                repairs, all categorized for easy navigation.
              </p>
              <div className="flex items-center text-sm text-teal-600 font-medium">
                <Home className="h-4 w-4 mr-2" />
                50+ service categories available
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-teal-300 transition-all group">
              <div className="flex items-center mb-4">
                <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-800">Book & Pay</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Select your preferred time slot and professional. Payment is
                only processed after service completion.
              </p>
              <div className="flex items-center text-sm text-teal-600 font-medium">
                <CreditCard className="h-4 w-4 mr-2" />
                Secure payment processing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Professionals Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">
              For Service Providers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              How to Offer Services
            </h2>
            <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join our platform and grow your business with these simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 cursor-pointer">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 transition-all group shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-800">Apply</h3>
              </div>
              <p className="text-slate-600 mb-4">
                Complete our professional application form with your details,
                skills, and experience.
              </p>
              <div className="flex items-center text-sm text-teal-600 font-medium">
                <Shield className="h-4 w-4 mr-2" />
                Rigorous verification process
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 transition-all group shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Get Approved
                </h3>
              </div>
              <p className="text-slate-600 mb-4">
                Our team will review your application and schedule a skills
                assessment if needed.
              </p>
              <div className="flex items-center text-sm text-teal-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Typically within 2 business days
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-300 transition-all group shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Start Earning
                </h3>
              </div>
              <p className="text-slate-600 mb-4">
                Once approved, set up your profile, availability, and start
                receiving booking requests.
              </p>
              <div className="flex items-center text-sm text-teal-600 font-medium">
                <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                Build your reputation with reviews
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/signup/provider">
              <Button variant="primary" size="lg">
                Apply as a Professional
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Visualization */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-rich-slate text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Complete Process
            </h2>
            <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              From booking to completion, here&apos;s how the magic happens
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-teal-500/30 transform -translate-x-1/2 "></div>

            {/* Steps */}
            <div className="space-y-16 md:space-y-0 ">
              {/* Step 1 */}
              <div className="relative md:flex md:items-center md:justify-between md:odd:flex-row-reverse cursor-pointer">
                <div className="md:w-5/12 mb-6 md:mb-0">
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                        1
                      </div>
                      <h3 className="text-xl font-bold cursor-pointer">
                        Customer Books Service
                      </h3>
                    </div>
                    <p className="text-slate-300 cursor-pointer ">
                      The customer selects a service, time, and provides details
                      about their needs.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex md:items-center md:justify-center md:w-2/12">
                  <div className="bg-teal-500 rounded-full p-3 border-4 border-slate-900 shadow-lg">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="md:w-5/12"></div>
              </div>

              {/* Step 2 */}
              <div className="relative md:flex md:items-center md:justify-between md:odd:flex-row-reverse cursor-pointer">
                <div className="md:w-5/12"></div>
                <div className="hidden md:flex md:items-center md:justify-center md:w-2/12">
                  <div className="bg-teal-500 rounded-full p-3 border-4 border-slate-900 shadow-lg">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="md:w-5/12 mb-6 md:mb-0 cursor-pointer">
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3 cursor-pointer">
                        2
                      </div>
                      <h3 className="text-xl font-bold">
                        Professional Accepts
                      </h3>
                    </div>
                    <p className="text-slate-300">
                      Our system matches the job with the best available
                      professional who confirms the booking.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative md:flex md:items-center md:justify-between md:odd:flex-row-reverse cursor-pointer">
                <div className="md:w-5/12 mb-6 md:mb-0">
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                        3
                      </div>
                      <h3 className="text-xl font-bold">
                        Service is Performed
                      </h3>
                    </div>
                    <p className="text-slate-300">
                      The professional arrives on time, completes the service to
                      our high standards.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex md:items-center md:justify-center md:w-2/12">
                  <div className="bg-teal-500 rounded-full p-3 border-4 border-slate-900 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="md:w-5/12"></div>
              </div>

              {/* Step 4 */}
              <div className="relative md:flex md:items-center md:justify-between md:odd:flex-row-reverse cursor-pointer ">
                <div className="md:w-5/12"></div>
                <div className="hidden md:flex md:items-center md:justify-center md:w-2/12">
                  <div className="bg-teal-500 rounded-full p-3 border-4 border-slate-900 shadow-lg">
                    <Star className="h-8 w-8 text-white fill-white" />
                  </div>
                </div>
                <div className="md:w-5/12 mb-6 md:mb-0 cursor-pointer">
                  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
                        4
                      </div>
                      <h3 className="text-xl font-bold">Customer Reviews</h3>
                    </div>
                    <p className="text-slate-300">
                      After service completion, the customer rates their
                      experience and provides feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and professionals who trust our
            platform for their service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="white" size="lg">
                Sign Up as Customer
              </Button>
            </Link>
            <Link href="/signup/provider">
              <Button variant="outline-white" size="lg">
                Apply as Professional
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
