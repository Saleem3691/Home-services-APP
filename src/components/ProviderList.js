"use client";
import { useEffect, useState } from "react";
import ProviderCard from "./ProviderCard";
import { Skeleton } from "./ui/skeleton";
import BookingModal from "@/src/app/BookingModal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProvidersList({ serviceType }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/providers?service=${serviceType}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please login to view service providers");
          }
          throw new Error(data.error || "Failed to fetch providers");
        }

        if (data.success) {
          setProviders(data.providers);
        } else {
          throw new Error(data.error || "Failed to fetch providers");
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
        setError(error.message);
        if (error.message === "Please login to view service providers") {
          toast.error("Please login to view service providers");
        } else {
          toast.error("Failed to load service providers");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [serviceType]);

  const handleBookNow = async (provider) => {
    try {
      // Check if user is authenticated
      const response = await fetch("/api/auth/session");
      const data = await response.json();

      if (!response.ok || !data.user) {
        // User is not authenticated, redirect to login
        toast.error("Please login to book a service");
        router.push("/login");
        return;
      }

      // User is authenticated, proceed with booking
      setSelectedProvider(provider);
      setShowBookingModal(true);
    } catch (error) {
      console.error("Error checking authentication:", error);
      toast.error("Please login to book a service");
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden h-full"
          >
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg text-center shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {error === "Please login to view service providers"
            ? "Login Required"
            : "Error loading providers"}
        </h3>
        <p className="text-gray-600 mb-6">
          {error === "Please login to view service providers"
            ? "Please login to view and book service providers"
            : error}
        </p>
        {error === "Please login to view service providers" && (
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login Now
          </Link>
        )}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg text-center shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          No providers available
        </h3>
        <p className="text-gray-600">
          There are currently no service providers for this category. Please
          check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => (
        <ProviderCard
          key={provider._id}
          provider={provider}
          onBookNow={() => handleBookNow(provider)}
        />
      ))}

      {showBookingModal && selectedProvider && (
        <BookingModal
          serviceName={serviceType}
          providerId={selectedProvider._id}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            toast.success("Booking request sent successfully!");
          }}
        />
      )}
    </div>
  );
}
