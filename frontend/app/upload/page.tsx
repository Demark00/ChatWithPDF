"use client";

import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUploadStore } from "@/stores/uploadStore";
import { FiUpload, FiFileText, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { file, setFile, uploading, uploadFile } = useUploadStore();
  const {user} = useAuthStore()
  const router = useRouter();

  useEffect(()=>{
    if(!user){
      router.replace('/login');
    }
  }, [user, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    await uploadFile();
    router.push("/documents");
  };

  // Prevent scrolling on this page
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <Card className="w-full max-w-lg border-none shadow-2xl bg-white/80 backdrop-blur-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3 text-blue-700 font-bold">
            <FiFileText className="text-blue-500" /> Upload Document
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Upload Area */}
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:bg-blue-100 transition p-8 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            tabIndex={0}
            role="button"
            aria-label="Select a file to upload"
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") &&
              fileInputRef.current?.click()
            }
          >
            <FiUpload className="text-4xl text-blue-400 mb-2" />
            <span className="text-blue-700 font-medium">
              {file ? "Change File" : "Click here to upload a file"}
            </span>
            <Input
              type="file"
              accept=".pdf,.txt"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-xs text-blue-400 mt-1">
              PDF or TXT only, max 10MB
            </span>
          </div>

          {/* File Info */}
          {file && (
            <div className="flex items-center gap-2 bg-blue-100 rounded-lg px-4 py-2 text-blue-700">
              <FiCheckCircle className="text-green-500" />
              <span className="font-medium">{file.name}</span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3 rounded-xl shadow transition"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiUpload /> Upload File
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPage;
