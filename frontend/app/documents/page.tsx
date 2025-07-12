"use client";

import React, { useEffect } from "react";
import { useDocumentStore } from "@/stores/documentStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaFilePdf, FaRegClock, FaRobot, FaDownload, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";

export default function DocumentPage() {
  const { documents, fetchDocuments, loading, error, deleteDocument } = useDocumentStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
    // eslint-disable-next-line
  }, []);

  const handleCardClick = (id: string) => {
    router.push(`/chat?docId=${id}`);
  };

  const handleCardDelete = async (id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    await deleteDocument(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700 flex items-center justify-center gap-2">
          <span role="img" aria-label="books">
            📚
          </span>{" "}
          Your Uploaded Documents
        </h1>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl bg-blue-100/60" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}

        {!loading && !documents && (
          <p className="text-center text-blue-400 text-lg mt-12">
            No documents uploaded yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.isArray(documents) &&
            documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="relative bg-white/90 border-none shadow-xl rounded-2xl cursor-pointer transition hover:scale-[1.03] hover:shadow-2xl hover:bg-blue-50/90 group overflow-hidden"
                  tabIndex={0}
                  role="button"
                  onClick={()=>{handleCardClick(doc.id)}}
                  aria-label={`Open chat for ${doc.fileName}`}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    handleCardClick(doc.id)
                  }
                >
                  {/* Decorative Accent */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 opacity-80" />

                  <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-red-100 group-hover:bg-red-200 transition shadow">
                      <FaFilePdf className="text-red-500 text-4xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate text-blue-700 group-hover:text-blue-900 font-semibold">
                        {doc.fileName}
                      </CardTitle>
                    </div>
                    {/* Download Button */}
                    {doc.storagePath && (
                      <Link
                        href={`https://dvz50l4qq1lty.cloudfront.net/${doc.storagePath}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto"
                        tabIndex={0}
                        aria-label={`Download ${doc.fileName}`}
                      >
                        <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all group/download">
                          <FaDownload className="w-5 h-5 text-white group-hover/download:scale-110 transition-transform" />
                        </span>
                      </Link>
                    )}
                    <button 
                    tabIndex={0} 
                    onClick={(e)=>handleCardDelete(doc.id, e)}
                    aria-label={`Delete ${doc.fileName}`}>
                      <span className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:from-red-600 hover:to-red-800 transition-all group/download">
                          <FaTrash className="w-5 h-5 text-white group-hover/download:scale-110 transition-transform" />
                        </span>
                    </button>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 pt-0 pb-4">
                    <div className="flex items-center gap-2">
                      <FaRegClock className="text-blue-400 text-lg" />
                      <span className="text-blue-700 font-medium">
                        {new Date(doc.uploadedAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <span className="text-blue-400 text-xs">
                        {new Date(doc.uploadedAt).toLocaleTimeString(
                          undefined,
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 shadow-sm border border-blue-200">
                      <FaRobot className="text-blue-500 text-lg animate-bounce" />
                      <span className="text-blue-700 font-semibold text-sm">
                        Click to{" "}
                        <span className="text-blue-600 underline underline-offset-2">
                          ask AI
                        </span>{" "}
                        about this PDF
                      </span>
                    </div>
                  </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
