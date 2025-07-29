import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/src/context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/common/Footer";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HomePro - Your Home Service Solution",
  description: "Find and book trusted home service providers in your area",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
