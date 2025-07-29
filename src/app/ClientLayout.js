"use client";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/common/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      {pathname !== "/" && <div className="h-20"></div>}
      <main>{children}</main>
      <Footer />
    </>
  );
}
