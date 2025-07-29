"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update booking status");

      const updatedBooking = await response.json();
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? updatedBooking.booking : booking
        )
      );
      toast.success("Booking status updated successfully");
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Bookings</h1>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-4 py-2 rounded-lg ${
              filter === "confirmed"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg ${
              filter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg ${
              filter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {booking.serviceName}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">
                    <CalendarIcon className="h-5 w-5 inline-block mr-1" />
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <ClockIcon className="h-5 w-5 inline-block mr-1" />
                    {booking.time}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    <UserIcon className="h-5 w-5 inline-block mr-1" />
                    Customer Details
                  </h4>
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span>{" "}
                    {booking.customerId.name}
                  </p>
                  <p className="text-gray-600">
                    <PhoneIcon className="h-5 w-5 inline-block mr-1" />
                    {booking.customerId.phone}
                  </p>
                  <p className="text-gray-600">
                    <EnvelopeIcon className="h-5 w-5 inline-block mr-1" />
                    {booking.customerId.email}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    <BuildingOfficeIcon className="h-5 w-5 inline-block mr-1" />
                    Provider Details
                  </h4>
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span>{" "}
                    {booking.providerId.name}
                  </p>
                  <p className="text-gray-600">
                    <PhoneIcon className="h-5 w-5 inline-block mr-1" />
                    {booking.providerId.phone}
                  </p>
                  <p className="text-gray-600">
                    <EnvelopeIcon className="h-5 w-5 inline-block mr-1" />
                    {booking.providerId.email}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    <MapPinIcon className="h-5 w-5 inline-block mr-1" />
                    Service Details
                  </h4>
                  <p className="text-gray-600">
                    <MapPinIcon className="h-5 w-5 inline-block mr-1" />
                    {booking.address}
                  </p>
                  {booking.message && (
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Notes:</span>{" "}
                      {booking.message}
                    </p>
                  )}
                </div>
              </div>

              {booking.status === "pending" && (
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircleIcon className="h-5 w-5 inline-block mr-1" />
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking._id, "rejected")}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircleIcon className="h-5 w-5 inline-block mr-1" />
                    Reject
                  </button>
                </div>
              )}

              {booking.status === "confirmed" && (
                <div className="mt-4">
                  <button
                    onClick={() => handleStatusUpdate(booking._id, "completed")}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircleIcon className="h-5 w-5 inline-block mr-1" />
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
