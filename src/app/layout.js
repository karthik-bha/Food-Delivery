// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the Toastify styles

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Food Delivery",
  description: "Food delivery application",
};

export default async function RootLayout({ children }) {  
  // Check if Admin office and SuperAdmin exist on first load 
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/init-db`, { method: "POST" });

  return (
    <html lang="en">
      <body
        className={`font-[Roboto] antialiased  bg-home-bg`}
      >
              <ToastContainer />
        {children}
      </body>
    </html>
  );
}
