"use client";
import { useEffect, useState } from "react";
import {
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [customers, setCustomers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProviders: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    revenue: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [customersRes, providersRes, bookingsRes] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/providers"),
        fetch("/api/bookings"),
      ]);

      if (!customersRes.ok) throw new Error("Failed to fetch customers");
      if (!providersRes.ok) throw new Error("Failed to fetch providers");
      if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");

      const [customersData, providersData, bookingsData] = await Promise.all([
        customersRes.json(),
        providersRes.json(),
        bookingsRes.json(),
      ]);

      setCustomers(customersData.customers || []);
      setProviders(providersData.providers || []);
      setBookings(bookingsData.bookings || []);

      // Calculate stats
      const completedBookings = (bookingsData.bookings || []).filter(
        (b) => b.status === "completed"
      );
      setStats({
        totalCustomers: (customersData.customers || []).length,
        totalProviders: (providersData.providers || []).length,
        totalBookings: (bookingsData.bookings || []).length,
        pendingBookings: (bookingsData.bookings || []).filter(
          (b) => b.status === "pending"
        ).length,
        completedBookings: completedBookings.length,
        revenue: completedBookings.reduce(
          (sum, b) => sum + (b.servicePrice || 0),
          0
        ),
      });
    } catch (error) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to update status");

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === data.booking.id ? data.booking : booking
        )
      );

      // Update stats
      setStats((prev) => {
        const newStats = { ...prev };
        if (data.booking.status === "completed") {
          newStats.completedBookings++;
          newStats.pendingBookings--;
          newStats.revenue += data.booking.servicePrice || 0;
        } else if (newStatus === "pending") {
          newStats.pendingBookings++;
          if (data.booking.status === "completed") {
            newStats.completedBookings--;
            newStats.revenue -= data.booking.servicePrice || 0;
          }
        }
        return newStats;
      });

      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message || "Failed to update booking");
    }
  };

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-indigo-600 rounded-lg p-2 mr-3">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={fetchAllData}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {["overview", "customers", "providers", "bookings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {[
                {
                  title: "Total Customers",
                  value: stats.totalCustomers,
                  icon: UsersIcon,
                  color: "bg-blue-500",
                },
                {
                  title: "Service Providers",
                  value: stats.totalProviders,
                  icon: UserGroupIcon,
                  color: "bg-green-500",
                },
                {
                  title: "Total Bookings",
                  value: stats.totalBookings,
                  icon: CalendarIcon,
                  color: "bg-amber-500",
                },
                {
                  title: "Total Revenue",
                  value: `$${stats.revenue.toFixed(2)}`,
                  icon: ChartBarIcon,
                  color: "bg-indigo-500",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white overflow-hidden shadow-md rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 ${stat.color} rounded-md p-3`}
                      >
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.title}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Distribution */}
            <div className="bg-white shadow-md rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Booking Status
                </h3>
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  {["pending", "confirmed", "completed", "rejected"].map(
                    (status) => (
                      <div key={status} className="text-center">
                        <div
                          className={`inline-flex rounded-full px-6 py-2 text-sm font-semibold ${getStatusColor(
                            status
                          )}`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                        <div className="mt-2 text-2xl font-semibold">
                          {bookings.filter((b) => b.status === status).length}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow-md rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h3>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all
                </button>
              </div>
              <div className="bg-white overflow-hidden">
                {bookings.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No bookings found
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => (
                      <li
                        key={booking.id}
                        className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                {booking.serviceName || "Unnamed Service"}
                              </p>
                              <p className="mt-1 flex items-center text-sm text-gray-500">
                                <span className="truncate">
                                  {booking.customerName || "Unknown Customer"} •{" "}
                                  {booking.customerEmail || "No email"}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex flex-shrink-0">
                            <p
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status || "unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {booking.date
                                ? new Date(booking.date).toLocaleDateString()
                                : "No date"}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <p>{booking.time || "No time specified"}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Customer Accounts
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {customers.length} total customers
              </p>
            </div>
            <div className="overflow-x-auto">
              {customers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No customers found
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Bookings
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="font-medium text-indigo-600">
                                {(customer.name || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.name || "Unnamed"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.email || "No email"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.phone || "No phone"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {bookings.filter(
                              (b) => b.customerEmail === customer.email
                            ).length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === "providers" && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Service Providers
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {providers.length} total service providers
              </p>
            </div>
            <div className="overflow-x-auto">
              {providers.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No service providers found
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Services
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Bookings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {providers.map((provider) => (
                      <tr
                        key={provider.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="font-medium text-green-600">
                                {(provider.name || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {provider.name || "Unnamed"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {provider.serviceType || "General"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {provider.email || "No email"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {provider.phone || "No phone"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {provider.servicesOffered?.join(", ") ||
                              "None listed"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {bookings.filter(
                              (b) => b.providerId === provider.id
                            ).length || 0}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    All Bookings
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {bookings.length} total bookings
                  </p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <label htmlFor="filter" className="sr-only">
                    Filter bookings
                  </label>
                  <select
                    id="filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {filteredBookings.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {filterStatus === "all"
                    ? "No bookings found"
                    : `No ${filterStatus} bookings found`}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Service
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Provider
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date & Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => {
                      const provider =
                        providers.find((p) => p.id === booking.providerId) ||
                        {};
                      return (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.serviceName || "Unnamed Service"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${booking.servicePrice?.toFixed(2) || "0.00"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.customerName || "Unknown Customer"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.customerEmail || "No email"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {provider.name || "Unknown Provider"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {provider.serviceType || ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.date
                                ? new Date(booking.date).toLocaleDateString()
                                : "No date"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.time || "No time"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status || "unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {booking.status === "pending" && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    updateBookingStatus(booking.id, "confirmed")
                                  }
                                  className="text-indigo-600 hover:text-indigo-900 font-medium"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() =>
                                    updateBookingStatus(booking.id, "rejected")
                                  }
                                  className="text-red-600 hover:text-red-900 font-medium"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {booking.status === "confirmed" && (
                              <button
                                onClick={() =>
                                  updateBookingStatus(booking.id, "completed")
                                }
                                className="text-green-600 hover:text-green-900 font-medium"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Service Booking Dashboard. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
