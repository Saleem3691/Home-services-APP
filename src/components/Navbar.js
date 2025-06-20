'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Check auth status on mount and route change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setUser(null);
      }
    };
    checkAuth();
  }, [pathname]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isHomePage = pathname === '/';
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isHomePage && !scrolled
          ? "bg-transparent"
          : "bg-rich-slate/95 backdrop-blur-sm shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <svg
              className="h-8 w-8 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-lightest-slate text-xl font-bold tracking-tight">
              ServiceHub
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/services"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/services' 
                  ? 'text-white bg-slate-700' 
                  : 'text-light-slate hover:text-white'
              }`}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/contact' 
                  ? 'text-white bg-slate-700' 
                  : 'text-light-slate hover:text-white'
              }`}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/about' 
                  ? 'text-white bg-slate-700' 
                  : 'text-light-slate hover:text-white'
              }`}
            >
              About
            </Link>

            <div className="ml-4 flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={user.avatar || '/default-avatar.png'}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-lightest-slate text-sm font-medium">
                      {user.name}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-rich-slate rounded-md shadow-lg py-1 z-50 border border-slate-700">
                      <Link
                        href={`/dashboard/${user.role === 'provider' ? 'provider' : 'user'}`}
                        className="block px-4 py-2 text-sm text-light-slate hover:bg-slate-700 hover:text-white"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/my-bookings"
                        className="block px-4 py-2 text-sm text-light-slate hover:bg-slate-700 hover:text-white"
                      >
                        My Bookings
                      </Link>
                     
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-light-slate hover:bg-slate-700 hover:text-white"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-light-slate hover:text-white border border-slate-600 hover:border-lightest-slate px-4 py-2 rounded-md text-sm font-medium transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-accent hover:bg-accent-dark text-white px-5 py-2 rounded-md text-sm font-medium transition-colors shadow-sm hover:shadow"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-light-slate hover:text-white focus:outline-none"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-rich-slate shadow-lg">
          <Link
            href="/services"
            className={`block px-3 py-3 rounded-md text-base font-medium border-b border-slate-700 ${
              pathname === '/services' 
                ? 'text-white bg-slate-700' 
                : 'text-light-slate hover:text-white'
            }`}
          >
            Services
          </Link>
          <Link
            href="/contact"
            className={`block px-3 py-3 rounded-md text-base font-medium border-b border-slate-700 ${
              pathname === '/contact' 
                ? 'text-white bg-slate-700' 
                : 'text-light-slate hover:text-white'
            }`}
          >
            Contact
          </Link>
          <Link
            href="/about"
            className={`block px-3 py-3 rounded-md text-base font-medium border-b border-slate-700 ${
              pathname === '/about' 
                ? 'text-white bg-slate-700' 
                : 'text-light-slate hover:text-white'
            }`}
          >
            About
          </Link>
          <div className="pt-4 pb-3 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 border-b border-slate-700">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-lightest-slate font-medium">{user.name}</p>
                    <p className="text-xs text-light-slate">{user.email}</p>
                  </div>
                </div>
               
            
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-light-slate hover:text-white hover:bg-slate-700"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-light-slate hover:text-white border border-slate-600 text-center px-3 py-2 rounded-md text-base font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-accent hover:bg-accent-dark text-white text-center px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}