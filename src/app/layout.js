import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/common/Footer";

export const metadata = {
  title: 'Service-Hub - The Ultimate solution of your home Services problems',
  description: 'The Ultimate solution of your home Services problems',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body>
      <Navbar/>
      <div className="h-20"></div>
        <main>
          {children}
        </main>   
        <Footer/>
      </body>
      
    </html>
  )
}