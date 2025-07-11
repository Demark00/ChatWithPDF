import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthInit from "./AuthInit";

export const metadata: Metadata = {
  title: "Strategic Insight - Ask AI about your PDF",
  description:
    "Strategic Insight is an AI tool which helps users to understand the content of their pdf document efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Toaster position="top-center" reverseOrder={false} />
        {/* <AuthInit/> */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
