"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import coverImage from "./assets/coverImage.png";
import {
  FaCloudUploadAlt,
  FaMagic,
  FaChartLine,
  FaBolt,
  FaRegSmileBeam,
  FaLock,
  FaSignInAlt,
  FaFileUpload,
  FaQuestionCircle,
} from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4 overflow-hidden pt-20">
      <div className="w-full max-w-5xl flex flex-col items-center gap-12 animate-fade-in">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-10 w-full">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col items-start md:items-start gap-6">
            <div className="flex gap-4 mb-2">
              <FaCloudUploadAlt className="text-blue-500 text-4xl animate-bounce" />
              <FaMagic className="text-purple-500 text-4xl animate-pulse" />
              <FaChartLine className="text-green-500 text-4xl animate-bounce" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 drop-shadow-lg animate-slide-down">
              Strategic Insight
            </h1>
            <p className="text-xl text-blue-500 max-w-xl font-medium animate-fade-in-slow">
              Transform your PDFs into actionable insights. Upload, analyze, and chat with your documents using AI-powered tools for smarter, faster decisions.
            </p>
            <Link href="/upload">
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white text-lg font-semibold px-10 py-4 rounded-2xl shadow-xl flex items-center gap-3 transition-transform duration-200 hover:scale-105 animate-pop"
                size="lg"
              >
                <FaCloudUploadAlt className="text-2xl" />
                Upload PDF
              </Button>
            </Link>
          </div>
          {/* Right: Cover Image */}
          <div className="flex-1 flex justify-center items-center animate-fade-in-slow">
            <Image
              src={coverImage}
              alt="Strategic Insight Cover"
              className="rounded-2xl shadow-2xl object-contain border-4 border-blue-100"
              style={{ maxHeight: 480, width: "auto" }}
              priority
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full flex flex-col items-center gap-8 mt-8">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-2 animate-slide-down">
            Why Choose Strategic Insight?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Feature 1 */}
            <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-lg p-8 border border-blue-100 hover:scale-105 transition-transform animate-fade-in">
              <FaBolt className="text-yellow-400 text-4xl mb-3 animate-bounce" />
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Lightning Fast</h3>
              <p className="text-blue-500 text-center">
                Get instant answers and summaries from your PDFs with our optimized AI engine.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-lg p-8 border border-blue-100 hover:scale-105 transition-transform animate-fade-in">
              <FaRegSmileBeam className="text-green-400 text-4xl mb-3 animate-pulse" />
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Completely Free</h3>
              <p className="text-blue-500 text-center">
                Enjoy all features at no cost. No hidden fees, no subscriptions, just pure productivity.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-lg p-8 border border-blue-100 hover:scale-105 transition-transform animate-fade-in">
              <FaLock className="text-blue-400 text-4xl mb-3 animate-bounce" />
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Secure & Private</h3>
              <p className="text-blue-500 text-center">
                Your documents are safe. We use industry-standard security to protect your data.
              </p>
            </div>
          </div>
        </section>

        {/* Tutorial Section */}
        <section className="w-full flex flex-col items-center gap-8 mt-16">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-2 animate-slide-down">
            How to Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-3xl shadow-2xl p-10 border-2 border-blue-200 hover:scale-105 transition-transform animate-fade-in min-h-[340px]">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-full p-5 shadow-lg border-4 border-white animate-pop">
                <FaSignInAlt className="text-4xl" />
              </div>
              <h4 className="text-2xl font-bold text-blue-700 mt-10 mb-3 text-center">Step 1: Login & Upload</h4>
              <p className="text-blue-500 text-center text-lg">
                Sign in to your account and upload your PDF document using our easy uploader.
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-3xl shadow-2xl p-10 border-2 border-blue-200 hover:scale-105 transition-transform animate-fade-in min-h-[340px]">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-full p-5 shadow-lg border-4 border-white animate-pop">
                <FaFileUpload className="text-4xl" />
              </div>
              <h4 className="text-2xl font-bold text-blue-700 mt-10 mb-3 text-center">Step 2: Go to Documents</h4>
              <p className="text-blue-500 text-center text-lg">
                Navigate to the Documents page to view all your uploaded PDFs in one place.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-3xl shadow-2xl p-10 border-2 border-blue-200 hover:scale-105 transition-transform animate-fade-in min-h-[340px]">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-full p-5 shadow-lg border-4 border-white animate-pop">
                <FaQuestionCircle className="text-4xl" />
              </div>
              <h4 className="text-2xl font-bold text-blue-700 mt-10 mb-3 text-center">Step 3: Ask AI Anything</h4>
              <p className="text-blue-500 text-center text-lg">
                Click on a PDF and start asking AI questions about your document for instant insights!
              </p>
            </div>
          </div>
        </section>
      </div>
      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes fade-in-slow {
          from { opacity: 0; transform: translateY(60px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes pop {
          0% { transform: scale(0.95);}
          60% { transform: scale(1.05);}
          100% { transform: scale(1);}
        }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-slow { animation: fade-in-slow 1.5s cubic-bezier(.4,0,.2,1) both; }
        .animate-slide-down { animation: slide-down 1.2s cubic-bezier(.4,0,.2,1) both; }
        .animate-pop { animation: pop 0.5s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
}