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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check session first
        const sessionRes = await fetch("/api/auth/session");
        if (!sessionRes.ok) {
          throw new Error("Failed to fetch session");
        }
        const session = await sessionRes.json();

        if (!session?.user) {
          router.push("/login");
          return;
        }

        if (session.user.role !== "provider") {
          router.push("/unauthorized");
          return;
        }

        // Fetch provider data with retry mechanism
        let retryCount = 0;
        const maxRetries = 3;
        let providerData;

        while (retryCount < maxRetries) {
          try {
            const providerRes = await fetch(
              `/api/providers/${session.user._id}`
            );
            if (!providerRes.ok) {
              const errorData = await providerRes.json();
              throw new Error(
                errorData.error || "Failed to fetch provider data"
              );
            }
            providerData = await providerRes.json();
            break;
          } catch (err) {
            retryCount++;
            if (retryCount === maxRetries) throw err;
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          }
        }

        if (!providerData) {
          throw new Error(
            "Failed to fetch provider data after multiple attempts"
          );
        }

        setProviderData(providerData);

        // Fetch bookings with error handling
        const bookingsRes = await fetch("/api/bookings");
        if (!bookingsRes.ok) {
          const errorData = await bookingsRes.json();
          throw new Error(errorData.error || "Failed to fetch bookings");
        }
        const bookingsData = await bookingsRes.json();

        if (!Array.isArray(bookingsData.bookings)) {
          throw new Error("Invalid bookings data received");
        }

        // Filter and validate bookings
        const providerBookings = bookingsData.bookings
          .filter((booking) => {
            // Validate booking data
            if (!booking || !booking._id || !booking.serviceName) {
              console.warn("Invalid booking data:", booking);
              return false;
            }
            // Check if providerId is an object (populated) or string
            const providerId =
              typeof booking.providerId === "object"
                ? booking.providerId._id
                : booking.providerId;
            return providerId === session.user._id;
          })
          .map((booking) => ({
            ...booking,
            date: new Date(booking.date),
            status: booking.status || "pending",
            price: Number(booking.price) || 0,
          }));

        setBookings(providerBookings);
        updateStats(providerBookings);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Unable to load dashboard");
        toast.error(err.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const updateStats = (bookings) => {
    const totalJobs = bookings.length;
    const pendingRequests = bookings.filter(
      (b) => b.status === "pending"
    ).length;

    setStats({ totalJobs, pendingRequests });
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    if (!bookingId || !newStatus) {
      toast.error("Invalid booking or status");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update booking status");
      }

      const data = await response.json();

      // Validate the response data
      if (!data.booking || !data.booking._id) {
        throw new Error("Invalid response data");
      }

      // Update local state with the updated booking
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      // Update stats after status change
      const updatedBookings = bookings.map((booking) =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      );
      updateStats(updatedBookings);

      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
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
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              <StarIcon className="h-4 w-4 mr-1" />
              {providerData.rating?.toFixed(1) || "New"} (
              {providerData.reviewsCount || 0} reviews)
            </span>
          </div>
        </div>

        {/* Provider Information Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{providerData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <BriefcaseIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Business</p>
                <p className="font-medium">{providerData.businessName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <PhoneIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{providerData.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <MapPinIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{providerData.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Jobs</p>
                <p className="text-2xl font-bold">{stats.totalJobs}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ClipboardDocumentIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold">{stats.pendingRequests}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Requests */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
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
                        {booking.customerId?.name} • {booking.customerId?.email}
                      </span>
                    </div>
                    {booking.message && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Customer Message
                            </p>
                            <p className="mt-1 text-gray-600 text-sm whitespace-pre-wrap">
                              {booking.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {booking.address && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Service Address
                            </p>
                            <p className="mt-1 text-gray-600 text-sm">
                              {booking.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-3 text-gray-600">
                      <span className="font-medium">Price:</span> Rs.
                      {booking.price || 0}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(booking._id, "confirmed")
                          }
                          className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 flex items-center justify-center gap-1 transition-colors"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          <span>Confirm</span>
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(booking._id, "rejected")
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
                          handleStatusChange(booking._id, "completed")
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
