"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/src/context/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  BookOpen,
  Phone,
  Settings,
} from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const router = useRouter();
  const { user, logout, checkAuth } = useAuth();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user?.role === "customer") {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBookings(data.bookings);
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleScroll = () => setScrolled(window.scrollY > 10);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        logout();
        router.push("/login");
        toast.success("Logged out successfully");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-gradient-to-r from-rich-slate to-slate-800 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className={`text-2xl font-bold transition-colors duration-300 flex items-center ${
              scrolled ? "text-teal-600" : "text-white"
            }`}
          >
            <Home className="mr-2 h-6 w-6" />
            <span
              className={
                scrolled
                  ? ""
                  : "bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
              }
            >
              HomePro
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 ${
                scrolled
                  ? "text-slate-700 hover:text-teal-600"
                  : "text-white hover:text-teal-400"
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/services"
              className={`group font-medium transition-colors duration-300 ${
                scrolled
                  ? "text-gray-600 hover:text-teal-600"
                  : "text-gray-200 hover:text-teal-400"
              }`}
            >
              Services
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-teal-500"></span>
            </Link>
            <Link
              href="/about"
              className={`group font-medium transition-colors duration-300 ${
                scrolled
                  ? "text-gray-600 hover:text-teal-600"
                  : "text-gray-200 hover:text-teal-400"
              }`}
            >
              About Us
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-teal-500"></span>
            </Link>
            <Link
              href="/contact"
              className={`group font-medium transition-colors duration-300 ${
                scrolled
                  ? "text-gray-600 hover:text-teal-600"
                  : "text-gray-200 hover:text-teal-400"
              }`}
            >
              Contact
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-teal-500"></span>
            </Link>

            {user ? (
              <>
                {user.role === "provider" && (
                  <Link
                    href="/provider-dashboard"
                    className={`font-medium flex items-center transition-colors duration-300 ${
                      scrolled
                        ? "text-gray-600 hover:text-teal-600"
                        : "text-gray-200 hover:text-teal-400"
                    }`}
                  >
                    <Settings className="mr-1 h-4 w-4" />
                    Dashboard
                  </Link>
                )}
                {user.role === "customer" && (
                  <Link
                    href="/my-bookings"
                    className={`font-medium flex items-center transition-colors duration-300 ${
                      scrolled
                        ? "text-gray-600 hover:text-teal-600"
                        : "text-gray-200 hover:text-teal-400"
                    }`}
                  >
                    <BookOpen className="mr-1 h-4 w-4" />
                    My Bookings
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    href="/Admin-dashboard"
                    className={`font-medium flex items-center transition-colors duration-300 ${
                      scrolled
                        ? "text-gray-600 hover:text-teal-600"
                        : "text-gray-200 hover:text-teal-400"
                    }`}
                  >
                    <Settings className="mr-1 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  href="/profile"
                  className={`font-medium flex items-center transition-colors duration-300 ${
                    scrolled
                      ? "text-gray-600 hover:text-teal-600"
                      : "text-gray-200 hover:text-teal-400"
                  }`}
                >
                  <User className="mr-1 h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className={`flex items-center font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                    scrolled
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-600/90 text-white hover:bg-red-700 border border-red-500/30"
                  }`}
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`font-medium flex items-center transition-colors duration-300 ${
                    scrolled
                      ? "text-gray-600 hover:text-teal-600"
                      : "text-gray-200 hover:text-teal-400"
                  }`}
                >
                  <User className="mr-1 h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    scrolled
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:brightness-110 shadow-md hover:shadow-lg"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } ${scrolled ? "bg-white" : "bg-slate-800"}`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          <Link
            href="/services"
            className={`block px-3 py-2 rounded-md font-medium ${
              scrolled
                ? "text-gray-700 hover:bg-teal-100"
                : "text-white hover:bg-slate-700"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/about"
            className={`block px-3 py-2 rounded-md font-medium ${
              scrolled
                ? "text-gray-700 hover:bg-teal-100"
                : "text-white hover:bg-slate-700"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className={`block px-3 py-2 rounded-md font-medium ${
              scrolled
                ? "text-gray-700 hover:bg-teal-100"
                : "text-white hover:bg-slate-700"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>

          {user ? (
            <>
              {user.role === "provider" && (
                <Link
                  href="/provider-dashboard"
                  className={`block px-3 py-2 rounded-md font-medium ${
                    scrolled
                      ? "text-gray-700 hover:bg-teal-100"
                      : "text-white hover:bg-slate-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {user.role === "customer" && (
                <Link
                  href="/my-bookings"
                  className={`block px-3 py-2 rounded-md font-medium ${
                    scrolled
                      ? "text-gray-700 hover:bg-teal-100"
                      : "text-white hover:bg-slate-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  href="/Admin-dashboard"
                  className={`block px-3 py-2 rounded-md font-medium ${
                    scrolled
                      ? "text-gray-700 hover:bg-teal-100"
                      : "text-white hover:bg-slate-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                className={`block px-3 py-2 rounded-md font-medium ${
                  scrolled
                    ? "text-gray-700 hover:bg-teal-100"
                    : "text-white hover:bg-slate-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className={`mt-2 w-full flex justify-center items-center px-3 py-2 rounded-md font-medium ${
                  scrolled
                    ? "bg-red-600 text-white"
                    : "bg-red-600/90 text-white border border-red-500/30"
                }`}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`block px-3 py-2 rounded-md font-medium ${
                  scrolled
                    ? "text-gray-700 hover:bg-teal-100"
                    : "text-white hover:bg-slate-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`mt-2 block text-center px-3 py-2 rounded-md font-medium ${
                  scrolled
                    ? "bg-teal-600 text-white"
                    : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
