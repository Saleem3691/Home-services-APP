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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Only fetch data on initial mount
  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      try {
        setIsInitialLoading(true);
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();

        if (!sessionRes.ok || !session?.user) {
          router.push("/login");
          return;
        }

        if (session.user.role !== "admin") {
          router.push("/unauthorized");
          return;
        }

        // If we get here, user is authenticated and is admin
        await fetchAllData();
      } catch (error) {
        console.error("Error checking session:", error);
        setError("Failed to authenticate. Please try again.");
        router.push("/login");
      } finally {
        setIsInitialLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, []); // Empty dependency array means it only runs once on mount

  const fetchAllData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      console.log("Fetching data...");

      // Fetch all data in parallel
      const [bookingsRes, customersRes, providersRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/customers"),
        fetch("/api/providers"),
      ]);

      const [bookingsData, customersData, providersData] = await Promise.all([
        bookingsRes.json(),
        customersRes.json(),
        providersRes.json(),
      ]);

      console.log("Received data:", {
        bookings: bookingsData,
        customers: customersData,
        providers: providersData,
      });

      if (!bookingsRes.ok) {
        throw new Error(bookingsData.error || "Failed to fetch bookings");
      }
      if (!customersRes.ok) {
        throw new Error(customersData.error || "Failed to fetch customers");
      }
      if (!providersRes.ok) {
        throw new Error(providersData.error || "Failed to fetch providers");
      }

      // Update state with new data
      const bookings = bookingsData.bookings || [];
      const customers = customersData.customers || [];
      const providers = providersData.providers || [];

      console.log("Setting state with:", {
        bookingsCount: bookings.length,
        customersCount: customers.length,
        providersCount: providers.length,
      });

      setBookings(bookings);
      setCustomers(customers);
      setProviders(providers);

      // Calculate stats
      const stats = {
        totalBookings: bookings.length,
        totalCustomers: customers.length,
        totalProviders: providers.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        completedBookings: bookings.filter((b) => b.status === "completed")
          .length,
        revenue: bookings
          .filter((b) => b.status === "completed")
          .reduce((sum, b) => sum + (Number(b.price) || 0), 0),
      };

      console.log("Calculated stats:", stats);
      setStats(stats);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load dashboard data");
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setIsRefreshing(false);
      setIsInitialLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    if (!bookingId || !newStatus) {
      toast.error("Invalid booking or status");
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Update local state without reloading
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      // Update stats without reloading
      setStats((prev) => {
        const newStats = { ...prev };
        if (newStatus === "completed") {
          newStats.completedBookings++;
          newStats.pendingBookings--;
          newStats.revenue += data.booking.price || 0;
        } else if (newStatus === "pending") {
          newStats.pendingBookings++;
          if (data.booking.status === "completed") {
            newStats.completedBookings--;
            newStats.revenue -= data.booking.price || 0;
          }
        }
        return newStats;
      });

      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(error.message || "Failed to update booking");
    }
  };

  // Filter and sort functions
  const filteredBookings = bookings
    .filter((booking) => {
      if (filterStatus === "all") return true;
      return booking.status === filterStatus;
    })
    .filter((booking) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        booking.serviceName?.toLowerCase().includes(searchLower) ||
        booking.customerName?.toLowerCase().includes(searchLower) ||
        booking.customerEmail?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) => Object.values(item).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExport = (type) => {
    switch (type) {
      case "bookings":
        const bookingData = bookings.map((b) => ({
          ID: b._id,
          Service: b.serviceName,
          Customer: b.customerName,
          Provider: providers.find((p) => p._id === b.providerId)?.name,
          Date: new Date(b.date).toLocaleDateString(),
          Time: b.time,
          Status: b.status,
          Price: b.price || 0,
        }));
        exportToCSV(bookingData, "bookings.csv");
        break;
      case "customers":
        const customerData = customers.map((c) => ({
          ID: c._id,
          Name: c.name,
          Email: c.email,
          Phone: c.phone || "",
          Bookings: bookings.filter((b) => b.customerId === c._id).length,
        }));
        exportToCSV(customerData, "customers.csv");
        break;
      case "providers":
        const providerData = providers.map((p) => ({
          ID: p._id,
          Name: p.name,
          Business: p.businessName,
          Email: p.email,
          Phone: p.phone || "",
          Services: p.services?.join(", ") || "",
          Bookings: bookings.filter((b) => b.providerId === p._id).length,
        }));
        exportToCSV(providerData, "providers.csv");
        break;
    }
  };

  // Add new functions for user management
  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      // Update local state without reloading
      setCustomers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isActive: newStatus } : user
        )
      );

      toast.success(
        `User status updated to ${newStatus ? "active" : "inactive"}`
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleVerifyProvider = async (providerId) => {
    try {
      const response = await fetch(`/api/providers/${providerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true, isActive: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify provider");
      }

      // Update local state without reloading
      setProviders((prevProviders) =>
        prevProviders.map((provider) =>
          provider._id === providerId
            ? { ...provider, isVerified: true, isActive: true }
            : provider
        )
      );

      // Update stats without reloading
      setStats((prevStats) => ({
        ...prevStats,
        totalProviders: prevStats.totalProviders + 1,
      }));

      toast.success("Provider verified successfully");
    } catch (error) {
      console.error("Error verifying provider:", error);
      toast.error(error.message || "Failed to verify provider");
    }
  };

  // Add new functions for data export
  const exportUserData = () => {
    const userData = customers.map((user) => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone || "N/A",
      Status: user.isActive ? "Active" : "Inactive",
      "Created At": new Date(user.createdAt).toLocaleDateString(),
    }));
    exportToCSV(userData, "users.csv");
  };

  const exportProviderData = () => {
    const providerData = providers.map((provider) => ({
      Name: provider.name,
      "Business Name": provider.businessName,
      Email: provider.email,
      Phone: provider.phone,
      Location: provider.location,
      "Verification Status": provider.isVerified ? "Verified" : "Pending",
      "Created At": new Date(provider.createdAt).toLocaleDateString(),
    }));
    exportToCSV(providerData, "providers.csv");
  };

  // Add new functions for analytics
  const getProviderAnalytics = () => {
    const verifiedProviders = providers.filter((p) => p.isVerified).length;
    const pendingProviders = providers.filter((p) => !p.isVerified).length;
    const activeProviders = providers.filter((p) => p.isActive).length;

    return {
      verifiedProviders,
      pendingProviders,
      activeProviders,
    };
  };

  const getCustomerAnalytics = () => {
    const activeCustomers = customers.filter((c) => c.isActive).length;
    const inactiveCustomers = customers.filter((c) => !c.isActive).length;
    const newCustomers = customers.filter(
      (c) =>
        new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      activeCustomers,
      inactiveCustomers,
      newCustomers,
    };
  };

  // Add new render functions for tabs
  const renderUsersTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <button
          onClick={exportUserData}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Users
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone || "No phone"}</p>
            <div className="mt-2 flex justify-between items-center">
              <span
                className={`px-2 py-1 rounded ${
                  user.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => handleUserStatusChange(user._id, !user.isActive)}
                className={`px-3 py-1 rounded ${
                  user.isActive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {user.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProvidersTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Provider Management</h2>
        <button
          onClick={exportProviderData}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Providers
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <div
            key={provider._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">{provider.businessName}</h3>
            <p className="text-gray-600">{provider.name}</p>
            <p className="text-gray-600">{provider.email}</p>
            <p className="text-gray-600">{provider.location}</p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded ${
                    provider.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {provider.isVerified ? "Verified" : "Pending"}
                </span>
                {!provider.isVerified && (
                  <button
                    onClick={() => handleVerifyProvider(provider._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Verify
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded ${
                    provider.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {provider.isActive ? "Active" : "Inactive"}
                </span>
                <button
                  onClick={() =>
                    handleUserStatusChange(provider._id, !provider.isActive)
                  }
                  className={`px-3 py-1 rounded ${
                    provider.isActive
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {provider.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Add dashboard button to admin profile
  const renderDashboardButton = () => (
    <button
      onClick={() => router.push("/Admin-dashboard")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      Admin Dashboard
    </button>
  );

  // Show loading state only during initial load
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Debug render
  console.log("Rendering dashboard with:", {
    bookings: bookings.length,
    customers: customers.length,
    providers: providers.length,
    stats,
    isInitialLoading,
    isRefreshing,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {lastRefresh && (
              <span className="text-sm text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchAllData}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon
                className={`h-5 w-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "users"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("providers")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "providers"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Providers
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "bookings"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bookings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isRefreshing ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Total Users
                        </h3>
                        <p className="text-3xl font-bold text-blue-600">
                          {stats.totalCustomers}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Total Providers
                        </h3>
                        <p className="text-3xl font-bold text-green-600">
                          {stats.totalProviders}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Total Bookings
                        </h3>
                        <p className="text-3xl font-bold text-purple-600">
                          {stats.totalBookings}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Total Revenue
                        </h3>
                        <p className="text-3xl font-bold text-yellow-600">
                          Rs.{stats.revenue.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Graphs Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Bookings Status Chart */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Booking Status Distribution
                        </h3>
                        <div className="h-64">
                          <Doughnut
                            data={{
                              labels: ["Pending", "Completed", "Cancelled"],
                              datasets: [
                                {
                                  data: [
                                    bookings.filter(
                                      (b) => b.status === "pending"
                                    ).length,
                                    bookings.filter(
                                      (b) => b.status === "completed"
                                    ).length,
                                    bookings.filter(
                                      (b) => b.status === "cancelled"
                                    ).length,
                                  ],
                                  backgroundColor: [
                                    "#FCD34D",
                                    "#34D399",
                                    "#F87171",
                                  ],
                                  borderColor: [
                                    "#F59E0B",
                                    "#10B981",
                                    "#EF4444",
                                  ],
                                  borderWidth: 1,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: "bottom",
                                },
                              },
                            }}
                          />
                        </div>
                      </div>

                      {/* Monthly Bookings Chart */}
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Monthly Bookings
                        </h3>
                        <div className="h-64">
                          <Bar
                            data={{
                              labels: [
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                              ],
                              datasets: [
                                {
                                  label: "Bookings",
                                  data: [12, 19, 3, 5, 2, 3],
                                  backgroundColor: "#60A5FA",
                                  borderColor: "#3B82F6",
                                  borderWidth: 1,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  ticks: {
                                    stepSize: 1,
                                  },
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "users" && renderUsersTab()}
                {activeTab === "providers" && renderProvidersTab()}
                {activeTab === "bookings" && (
                  <div className="space-y-4">
                    {/* Bookings content */}
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Booking Management
                      </h2>
                      <button
                        onClick={() => handleExport("bookings")}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Export Bookings
                      </button>
                    </div>

                    {/* Bookings Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Service
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Provider
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {booking.serviceName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {booking.customerName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {providers.find(
                                  (p) => p._id === booking.providerId
                                )?.name || "N/A"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(booking.date).toLocaleDateString()}{" "}
                                {booking.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                    booking.status
                                  )}`}
                                >
                                  {booking.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                Rs.{booking.price || 0}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  {booking.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          updateBookingStatus(
                                            booking._id,
                                            "confirmed"
                                          )
                                        }
                                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() =>
                                          updateBookingStatus(
                                            booking._id,
                                            "cancelled"
                                          )
                                        }
                                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  )}
                                  {booking.status === "confirmed" && (
                                    <button
                                      onClick={() =>
                                        updateBookingStatus(
                                          booking._id,
                                          "completed"
                                        )
                                      }
                                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                      Complete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
