"use client";

import React, { useEffect, useState } from "react";
import { useDocumentStore } from "@/stores/documentStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FaFilePdf,
  FaRegClock,
  FaRobot,
  FaDownload,
  FaTrash,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DocumentPage() {
  const { documents, fetchDocuments, loading, error, deleteDocument } =
    useDocumentStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [deleteTarget, setDeleteTarget] = useState<null | {
    id: string;
    fileName: string;
  }>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
    // eslint-disable-next-line
  }, []);

  const handleCardClick = (id: string) => {
    router.push(`/chat?docId=${id}`);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await deleteDocument(deleteTarget.id);
      toast.success(`Deleted "${deleteTarget.fileName}"`);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700 flex items-center justify-center gap-2">
          <span role="img" aria-label="books">
            📚
          </span>
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
                onClick={() => handleCardClick(doc.id)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  handleCardClick(doc.id)
                }
                aria-label={`Open chat for ${doc.fileName}`}
              >
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

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({
                            id: doc.id,
                            fileName: doc.fileName,
                          });
                        }}
                        aria-label={`Delete ${doc.fileName}`}
                        className="ml-2 flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:from-red-600 hover:to-red-800 transition-all group/delete focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        <FaTrash className="w-5 h-5 text-white group-hover/delete:scale-110 transition-transform" />
                      </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-2xl shadow-2xl bg-white/95 border-none max-w-md"
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-blue-700 font-bold">
                          Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-blue-500">
                          This will permanently delete{" "}
                          <strong className="text-red-600">
                            {deleteTarget?.fileName}
                          </strong>
                          . This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 font-semibold shadow hover:from-gray-300 hover:to-gray-400 transition-all px-4 py-2">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={confirmDelete}
                          className="rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:from-red-600 hover:to-red-800 transition-all px-4 py-2"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>

                <CardContent className="flex flex-col gap-2 pt-0 pb-4">
                  <div className="flex items-center gap-2">
                    <FaRegClock className="text-blue-400 text-lg" />
                    <span className="text-blue-700 font-medium">
                      {new Date(doc.uploadedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-blue-400 text-xs">
                      {new Date(doc.uploadedAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
