// app/provider-dashboard/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  BriefcaseIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState([]);
  const [providerData, setProviderData] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingRequests: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Check session first
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();

        if (!sessionRes.ok || !session?.user) {
          router.push("/login");
          return;
        }

        if (session.user.role !== "provider") {
          router.push("/unauthorized");
          return;
        }

        // Fetch provider details
        const providerRes = await fetch(`/api/providers/${session.user._id}`);
        if (!providerRes.ok) {
          throw new Error("Failed to fetch provider data");
        }
        const provider = await providerRes.json();
        setProviderData(provider);

        // Fetch bookings
        await fetchBookings(session.user._id);
      } catch (err) {
        console.error("Initial fetch error:", err);
        toast.error(err.message || "Unable to load dashboard");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const fetchBookings = async (providerId) => {
    try {
      const response = await fetch(`/api/bookings?providerId=${providerId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch bookings");
      }

      const data = await response.json();
      const normalizedBookings = data.bookings.map((booking) => ({
        ...booking,
        id: booking.id || booking._id,
      }));

      setBookings(normalizedBookings);
      updateStats(normalizedBookings);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      toast.error(error.message);
    }
  };

  const updateStats = (bookings) => {
    const totalJobs = bookings.length;
    const pendingRequests = bookings.filter(
      (b) => b.status === "pending"
    ).length;
    const earnings = bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (b.servicePrice || 0), 0);

    setStats({ totalJobs, pendingRequests, earnings });
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      if (!bookingId) {
        throw new Error("Booking ID is missing");
      }

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === data.booking.id
            ? { ...data.booking, id: data.booking.id || data.booking._id }
            : booking
        )
      );

      updateStats(bookings.map(b => 
        b.id === data.booking.id ? {...b, status: newStatus} : b
      ));

      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>Failed to load provider data</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Provider Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your service bookings</p>
          </div>
        </div>

        {/* Provider Information Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-blue-600" />
            My Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="text-gray-900">{providerData.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Business Name</h3>
                  <p className="text-gray-900">{providerData.businessName}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-gray-900">{providerData.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <PhoneIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="text-gray-900">{providerData.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MapPinIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Service Area</h3>
                  <p className="text-gray-900">{providerData.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <StarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                  <p className="text-gray-900">
                    {providerData.experience} {providerData.experience === 1 ? 'year' : 'years'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClipboardDocumentIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500">Services Offered</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {providerData.services.map((service, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {providerData.description && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">About My Business</h3>
              <p className="text-gray-700">{providerData.description}</p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Total Jobs</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalJobs}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">
              Pending Requests
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.pendingRequests}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Earnings
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              ${stats.earnings.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Booking Requests */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {booking.serviceName}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at {booking.time}
                    </p>
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {booking.customerName} • {booking.customerEmail}
                      </span>
                    </div>
                    {booking.message && (
                      <p className="mt-3 text-gray-600 text-sm">
                        <span className="font-medium">Customer Notes:</span>{" "}
                        {booking.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(booking.id, "confirmed")
                          }
                          className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 flex items-center justify-center gap-1 transition-colors"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(booking.id, "rejected")
                          }
                          className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 flex items-center justify-center gap-1 transition-colors"
                        >
                          <XCircleIcon className="h-5 w-5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "completed")
                        }
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1 transition-colors"
                      >
                        <ClockIcon className="h-5 w-5" />
                        <span>Mark Complete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No booking requests found
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}