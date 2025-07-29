"use client";
import { useEffect, useState } from "react";
import {
  CheckIcon,
  ClockIcon,
  XMarkIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { getLocalStorage } from "@/src/lib/localStorage";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState("");
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();

        if (response.ok && data.success) {
          setBookings(data.bookings);
        } else {
          throw new Error(data.error || "Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = emailFilter
    ? bookings.filter((booking) =>
        booking.email?.toLowerCase().includes(emailFilter.toLowerCase())
      )
    : bookings;

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckIcon className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XMarkIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/bookings/${selectedBooking._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          cancellationReason: cancelReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBooking._id
            ? {
                ...booking,
                status: "cancelled",
                cancellationReason: cancelReason,
              }
            : booking
        )
      );

      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            My Service Bookings
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage your service appointments
          </p>
          <div className="mt-6 w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <label
              htmlFor="email-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Bookings by Email
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="email-filter"
                type="email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                placeholder="your@email.com"
                className="block w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-sm text-black bg-white transition-all duration-200 ease-in-out"
              />
              {emailFilter && (
                <button
                  onClick={() => setEmailFilter("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-16 bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-t-2 border-blue-500 mx-auto"></div>
                  <p className="mt-6 text-lg text-gray-600">
                    Loading your bookings...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-8 text-center rounded-lg m-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <XMarkIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-medium text-red-800">{error}</h3>
                <p className="mt-3 text-red-600">
                  Please refresh the page or try again later.
                </p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-gray-50 p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <ClockIcon className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="mt-3 text-gray-600">
                  {emailFilter
                    ? `No bookings found for "${emailFilter}"`
                    : "You don't have any service bookings yet."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <li
                    key={booking._id}
                    className="transition-all duration-200 hover:bg-blue-50"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                            {booking.serviceName}
                          </h3>
                          <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {new Date(booking.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            {booking.email && (
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {booking.email}
                              </div>
                            )}
                            {booking.providerName && (
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className="font-medium">Provider:</span>{" "}
                                {booking.providerName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeStyle(
                              booking.status
                            )} shadow-sm`}
                          >
                            <StatusIcon status={booking.status} />
                            <span className="ml-1.5 capitalize">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {(booking.date || booking.time) && (
                        <div className="mt-5 p-4 rounded-lg bg-blue-50 border border-blue-100 shadow-sm">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <ClockIcon
                                className="h-6 w-6 text-blue-500"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">
                                Appointment Details
                              </h3>
                              <div className="mt-2 text-sm text-blue-700">
                                <p>
                                  {booking.date &&
                                    `Date: ${new Date(
                                      booking.date
                                    ).toLocaleDateString()}`}
                                  {booking.time && ` at ${booking.time}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {booking.message && (
                        <div className="mt-5 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="flex items-start">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">
                                Notes:
                              </p>
                              <p className="mt-1">{booking.message}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {booking.status === "pending" && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleCancelClick(booking)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XMarkIcon className="h-5 w-5 mr-2" />
                            Cancel Booking
                          </button>
                        </div>
                      )}

                      {booking.status === "cancelled" &&
                        booking.cancellationReason && (
                          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-start">
                              <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium text-red-800">
                                  Cancellation Reason:
                                </p>
                                <p className="mt-1 text-red-700">
                                  {booking.cancellationReason}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="text-center mt-10 bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Need assistance?
          </h4>
          <p className="text-gray-600">
            Our customer support team is here to help with your booking
            questions.
          </p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
            Contact Support
          </button>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Booking
              </h3>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label
                htmlFor="cancelReason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reason for Cancellation
              </label>
              <textarea
                id="cancelReason"
                rows="4"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please provide a reason for cancelling this booking..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                disabled={isCancelling}
              >
                Back
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={isCancelling}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
