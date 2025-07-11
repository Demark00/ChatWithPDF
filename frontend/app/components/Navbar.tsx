"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger , SheetTitle} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUpload,
  FaFileAlt,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
const navLinks = [
  { label: "Home", href: "/", icon: <FaHome /> },
  { label: "Upload", href: "/upload", icon: <FaUpload /> },
  { label: "Documents", href: "/documents", icon: <FaFileAlt /> },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [avatarMenu, setAvatarMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.04)] border-b">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600 tracking-tight hover:opacity-90 transition"
        >
          <FaFileAlt className="text-blue-500 text-2xl" />
          Strategic Insight
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition group relative"
            >
              <span className="text-lg">{link.icon}</span>
              <span className="relative">
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </span>
            </Link>
          ))}

          {user ? (
            <div className="relative ml-4">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                onClick={() => setAvatarMenu((v) => !v)}
              >
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase text-lg shadow">
                  {user.email?.charAt(0)}
                </span>
                {/* <FaUserCircle className="text-blue-600 text-xl" /> */}
              </button>
              {avatarMenu && (
                <div className="absolute right-0 mt-2 w-50 bg-white border rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {user.email}
                  </div>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="ml-4">
              <Button className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
                <FaSignInAlt /> Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-gray-200 shadow"
              >
                {open ? (
                  <FaTimes className="h-5 w-5" />
                ) : (
                  <FaBars className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pt-10 px-6 bg-white">
              {/* Add a visually hidden title for accessibility */}
              <SheetTitle className="sr-only">Main Navigation</SheetTitle>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-blue-600 transition"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}

                <div className="border-t my-4"></div>

                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase text-lg shadow">
                        {user.email?.charAt(0)}
                      </span>
                      <span className="text-gray-700 text-sm">
                        {user.email}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 w-full mt-2 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                    >
                      <FaSignOutAlt /> Logout
                    </Button>
                  </>
                ) : (
                  <Link href="/login">
                    <Button
                      className="flex items-center gap-2 w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setOpen(false)}
                    >
                      <FaSignInAlt /> Login
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
