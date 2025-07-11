"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, signInWithGoogle } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.error("Credentials not provided");
        return;
      }
      await login(email, password);
      router.push("/upload");
    } catch (err) {
      console.log("Login failed. Check your credentials. ", err);
    }
  };

  const loginByGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push("/upload");
    } catch (error) {
      console.error("Google Login failed:", error);
      toast.error("Google Login failed, Try again or try with email & password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none bg-white/90 backdrop-blur-lg rounded-2xl">
        <CardContent className="px-8 py-8 space-y-8">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-blue-100 rounded-full p-3 mb-2 shadow">
              <FiLogIn className="text-blue-600 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-blue-700 text-center">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-center text-blue-400">
              Login to your account
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={loginByGoogle}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-200 rounded-xl shadow bg-white hover:bg-gray-100 transition font-medium"
            type="button"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-gray-800">Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-2">
            <div className="flex-grow h-px bg-blue-100" />
            <span className="mx-3 text-blue-300 text-xs font-semibold">OR</span>
            <div className="flex-grow h-px bg-blue-100" />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2 text-blue-700">
              <FiMail /> Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="bg-white/90 text-blue-900 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2 text-blue-700">
              <FiLock /> Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-white/90 text-blue-900 border border-blue-200 rounded-xl pr-10 focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-400 hover:text-blue-600 transition"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-md font-semibold rounded-xl py-3 shadow"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 mr-1 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiLogIn /> Login
              </span>
            )}
          </Button>

          <p className="text-center text-sm text-blue-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;