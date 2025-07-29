// app/profile/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaSpinner,
  FaCalendarAlt,
  FaIdBadge,
  FaClipboardList,
} from "react-icons/fa";
import Layout from "@/src/components/Layout";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Unauthorized");
        const data = await response.json();
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          avatar:
            data.user.avatar ||
            `https://ui-avatars.com/api/?name=${data.user.name}&background=random`,
        });

        // Fetch bookings if user is a customer
        if (data.user.role === "customer") {
          const bookingsResponse = await fetch("/api/bookings");
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            if (bookingsData.success) {
              setBookings(bookingsData.bookings);
            }
          }
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setIsLoading(false);
        setIsLoadingBookings(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/users/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload avatar");
      }

      const { url } = await response.json();
      setFormData((prev) => ({ ...prev, avatar: url }));
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload avatar");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsUpdating(true);
      setError(null);

      const response = await fetch("/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
      });
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);
      setError("Failed to sign out");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow">
            <p className="font-medium">{error || "Error loading profile"}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-12 px-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/80 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shadow-lg mx-auto">
                    <img
                      src={formData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                      <FaCamera className="text-indigo-600 text-lg md:text-xl" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {user.name}
                </h1>
                <p className="text-indigo-100">{user.email}</p>
                {user.role === "admin" && (
                  <button
                    onClick={() => router.push("/Admin-dashboard")}
                    className="mt-4 px-6 py-2 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-colors shadow-md"
                  >
                    Admin Dashboard
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                  <p>{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b gap-4">
                <h2 className="text-lg md:text-xl font-bold flex items-center">
                  <FaUser className="mr-2 text-indigo-600 bg-indigo-100 p-2 rounded-lg" />
                  Profile Information
                </h2>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSubmit}
                        disabled={isUpdating}
                        className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:opacity-70 transition-colors"
                      >
                        {isUpdating ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name,
                            email: user.email,
                            avatar:
                              user.avatar ||
                              `https://ui-avatars.com/api/?name=${user.name}&background=random`,
                          });
                        }}
                        className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Bookings Section */}
              {user?.role === "customer" && (
                <div className="mt-8">
                  <h2 className="text-lg md:text-xl font-bold flex items-center mb-4">
                    <FaCalendarAlt className="mr-2 text-indigo-600 bg-indigo-100 p-2 rounded-lg" />
                    My Bookings
                  </h2>

                  {isLoadingBookings ? (
                    <div className="flex justify-center items-center py-8">
                      <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {booking.serviceName}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {new Date(booking.date).toLocaleDateString()} at{" "}
                                {booking.time}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Provider:{" "}
                                {booking.providerId?.businessName ||
                                  booking.providerId?.name}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          {booking.message && (
                            <p className="mt-2 text-gray-600 text-sm">
                              <span className="font-medium">Notes:</span>{" "}
                              {booking.message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FaClipboardList className="mx-auto text-4xl text-gray-400 mb-3" />
                      <p className="text-gray-600">No bookings found</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <FaIdBadge className="mr-2 text-indigo-600" />
                    Account Details
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-2">Account Type</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm ${
                          user.role === "admin"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-2">Member Since</p>
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="mr-2 text-gray-500" />
                        <span className="text-sm md:text-base">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <FaClipboardList className="mr-2 text-indigo-600" />
                    Activity Summary
                  </h3>
                  <div className="bg-white p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-2">
                      Services Booked
                    </p>
                    <div className="flex items-center">
                      <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        {user.services?.length || 0}
                      </div>
                      <span className="text-gray-700 text-sm md:text-base">
                        {!user.services?.length
                          ? "No services booked"
                          : user.services.length === 1
                          ? "1 service booked"
                          : `${user.services.length} services booked`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
