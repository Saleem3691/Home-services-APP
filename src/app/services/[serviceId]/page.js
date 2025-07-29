"use client";
import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProvidersList from "@/src/components/ProviderList";
import BookingModal from "../../BookingModal";

const serviceData = {
  "ac-repair": {
    title: "AC Repair",
    description:
      "Professional air conditioning repair and maintenance services for your comfort",
    iconPath:
      "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15 9a3 3 0 11-6 0 3 3 0 016 0z",
    features: [
      "AC unit repair and maintenance",
      "Refrigerant recharge",
      "Thermostat installation",
      "System tune-ups",
      "Emergency repair services",
    ],
    image: "/services/Ac_reapir.jpg",
  },
  plumbing: {
    title: "Plumbing",
    description: "Expert plumbing solutions for homes and businesses",
    iconPath:
      "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26",
    features: [
      "Leak detection and repair",
      "Pipe installation",
      "Drain cleaning",
      "Water heater services",
      "Bathroom plumbing",
      "Emergency plumbing services",
    ],
    image: "/services/plumber_04.jpg",
  },

  "home-cleaning": {
    title: "Home Cleaning",
    description:
      "Professional cleaning services to transform your space into a pristine sanctuary",
    iconPath:
      "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
    features: [
      "Deep cleaning services",
      "Regular maintenance cleaning",
      "Move-in/move-out cleaning",
      "Carpet and upholstery cleaning",
      "Window washing",
      "Kitchen and bathroom detailing",
    ],
    image: "/services/homecleaning.jpg",
  },
  electrical: {
    title: "Electrical Repairs",
    description:
      "Professional electrical services with licensed technicians for residential and commercial properties",
    iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    features: [
      "Wiring and rewiring",
      "Outlet and switch installation",
      "Circuit breaker repairs",
      "Light fixture installation",
      "Electrical safety inspections",
      "Panel upgrades",
      "Surge protection",
    ],
    image: "/services/electrical.jpg",
  },

  "appliance-repair": {
    title: "Appliance Repair",
    description:
      "Expert repair and maintenance services for all your household appliances",
    iconPath:
      "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
    features: [
      "Refrigerator and freezer repair",
      "Washer and dryer repair",
      "Dishwasher repair",
      "Oven and stove repair",
      "Microwave repair",
    ],
    image: "/services/Appliance_reapir.jpg",
  },
  "car-maintenance": {
    title: "Car Maintenance",
    description:
      "Professional vehicle maintenance services to keep your car running smoothly",
    iconPath:
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    features: [
      "Oil changes and fluid checks",
      "Brake inspections and repairs",
      "Tire rotations and balancing",
      "Battery testing and replacement",
      "Preventative maintenance",
    ],
    image: "/services/car.jpg",
  },
};

export default function ServicePage({ params }) {
  const { serviceId } = use(params); // ✅ unwrap the Promise

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const service = serviceData[serviceId];
  const router = useRouter();

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Service not found
      </div>
    );
  }

  const handleBookingSuccess = () => {
    setNotification({
      type: "success",
      message:
        "Your service booking request has been received! The provider will review it and notify you soon.",
    });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <>
      <div className="min-h-screen pt-16 bg-gradient-to-b from-white to-gray-50">
        {notification && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white flex items-center`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4">
              ✕
            </button>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-12">
          <header className="mb-12 text-center md:text-left">
            <div className="inline-block mb-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
                  <svg
                    className="h-8 w-8"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={service.iconPath}
                    />
                  </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  {service.title}
                </h1>
              </div>
              <div className="h-1 w-24 bg-blue-600 mt-2 md:mt-3"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl md:mx-0">
              {service.description}
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div className="relative rounded-xl overflow-hidden shadow-2xl h-96">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {service.title === "Plumbing"
                      ? "Licensed Plumbers"
                      : "Expert Technicians"}
                  </span>
                  <h3 className="text-2xl font-bold mt-2">
                    Quality {service.title} Services
                  </h3>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Service Details
                </h2>
                <p className="text-gray-600 mb-6">
                  Our certified technicians provide comprehensive{" "}
                  {service.title.toLowerCase()} solutions.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Our {service.title} Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  <span>Book {service.title} Service</span>
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <section className="mt-16 mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our {service.title} Services?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Trust our certified technicians to deliver reliable solutions
                with prompt service and quality results.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.title === "Plumbing" ? (
                <>
                  <FeatureCard
                    icon="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    title="Licensed & Insured"
                    description="All our plumbers are fully licensed, bonded, and insured for your protection."
                  />
                  <FeatureCard
                    icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    title="24/7 Emergency Service"
                    description="Plumbing emergencies don't wait for business hours. We're available around the clock."
                  />
                  <FeatureCard
                    icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    title="Satisfaction Guaranteed"
                    description="We stand behind our work with a 100% satisfaction guarantee."
                  />
                </>
              ) : (
                <>
                  <FeatureCard
                    icon="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    title="Certified Technicians"
                    description="Our specialists are fully certified and trained in all brands and systems."
                  />
                  <FeatureCard
                    icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    title="Fast Response Times"
                    description="We provide prompt service to ensure your issue is resolved quickly."
                  />
                  <FeatureCard
                    icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    title="Quality Guarantee"
                    description="We use only high-quality parts and stand behind our work."
                  />
                </>
              )}
              <FeatureCard
                icon="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
                title="Transparent Pricing"
                description="No hidden fees or surprise costs. We provide upfront pricing."
              />
              <FeatureCard
                icon="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                title="Emergency Services"
                description="Available 24/7 for urgent repairs and critical situations."
              />
              <FeatureCard
                icon="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                title="Modern Equipment"
                description="We use the latest tools and technology for efficient service."
              />
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="mt-16 bg-gray-50 rounded-2xl p-8 shadow-inner">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                What Our Customers Say
              </h2>
              <blockquote className="text-lg text-gray-700 italic">
                {service.title === "Plumbing"
                  ? '"The plumber arrived quickly, diagnosed our issue correctly, and fixed our leaking pipe with minimal disruption. The service was excellent!"'
                  : '"The technician was professional, knowledgeable, and fixed our issue quickly. Highly recommend their services!"'}
              </blockquote>
              <div className="mt-4 font-medium text-gray-900">
                -{" "}
                {service.title === "Plumbing"
                  ? "Michael Thompson"
                  : "Sarah Johnson"}
                , Homeowner
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <section className="mt-16 bg-blue-600 rounded-xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold">
                  {service.title === "Plumbing"
                    ? "Need plumbing help right away?"
                    : `Need ${service.title} service now?`}
                </h2>
                <p className="text-blue-100 mt-2">
                  Schedule a service call today and get a free inspection
                </p>
              </div>
              <button
                onClick={() => setShowBookingModal(true)}
                className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Schedule Now
              </button>
            </div>
          </section>
        </div>

        {showBookingModal && (
          <BookingModal
            serviceName={service.title}
            onClose={() => setShowBookingModal(false)}
            onSuccess={handleBookingSuccess}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => router.push("/provider-dashboard")}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Provider Dashboard
        </button>
        <button
          onClick={() => router.push("/my-bookings")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          View My Bookings
        </button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Available {service.title} Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our verified service providers
            </p>
          </div>

          <ProvidersList serviceType={serviceId} />
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-t-4 border-blue-600">
      <div className="mb-4">
        <svg
          className="w-9 h-9 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
