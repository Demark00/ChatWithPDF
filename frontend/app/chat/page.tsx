"use client";

import { useChatStore } from "@/stores/chatStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { FiSend } from "react-icons/fi";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import { FaFilePdf, FaRegClock } from "react-icons/fa";
import { useDocumentStore } from "@/stores/documentStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

const ChatWrapper = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("docId");
  const { user } = useAuthStore();

  const { messages, loading, sendMessage, setDocumentId, fetchMessages } =
    useChatStore();

  const { documents } = useDocumentStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentDoc = Array.isArray(documents)
    ? documents.find((doc) => doc.id === docId)
    : null;

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (docId) {
      setDocumentId(docId);
    }
  }, [docId, setDocumentId]);

  useEffect(() => {
    if (docId && user) {
      setDocumentId(docId);
      fetchMessages(user.uid); // ✅ Fetch chat history
    }
  }, [docId, user, fetchMessages, setDocumentId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const fixMathMessages = (text: string): string => {
  // Convert double dollar ($$...$$) blocks to inline math if they're short
  text = text.replace(/\$\$([^$]+?)\$\$/g, (match, expr) => {
    const trimmed = expr.trim();
    if (trimmed.length < 25 && !trimmed.includes("\n")) {
      return `\\(${trimmed}\\)`; // Inline math
    } else {
      return `$$${trimmed}$$`; // Keep as block math
    }
  });

  // Fix any standalone `$...$` that should also be inline LaTeX
  text = text.replace(/(?<!\$)\$([^\$]+?)\$(?!\$)/g, (_, expr) => `\\(${expr.trim()}\\)`);

  return text;
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-start p-2 sm:p-4">
      <div className="w-full max-w-5xl space-y-6 sm:space-y-8 mt-4 sm:mt-8">
        {/* Document Info */}
        {currentDoc && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white/80 rounded-2xl shadow p-4 sm:p-6 mb-2 border border-blue-100">
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-0 w-full sm:w-auto">
              <FaFilePdf className="text-red-500 text-2xl sm:text-3xl" />
              <span className="text-lg sm:text-xl font-semibold text-blue-700 truncate">
                {currentDoc.fileName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-blue-500 text-xs sm:text-sm w-full sm:w-auto">
              <FaRegClock className="text-blue-400" />
              <span>
                Uploaded at:{" "}
                <span className="font-medium text-blue-700">
                  {new Date(currentDoc.uploadedAt).toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        )}

        <h2 className="text-2xl sm:text-4xl font-bold text-center flex items-center justify-center gap-2 sm:gap-3 text-blue-700 mb-2 mt-4 sm:mt-6">
          <MdOutlineQuestionAnswer className="text-blue-500 text-2xl sm:text-4xl" />
          Ask your PDF
        </h2>

        <ScrollArea className="h-[65vh] sm:h-[80vh] rounded-2xl border-none shadow-xl bg-white/80 backdrop-blur-lg p-2 sm:p-8 flex flex-col gap-2">
          {messages.length === 0 ? (
            <p className="text-center text-blue-400 text-base sm:text-lg mt-8 sm:mt-12">
              Start by asking a question
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`mb-2 px-0 py-0 border-none shadow-none max-w-[95vw] sm:max-w-[80%] w-fit ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-t-xl rounded-bl-xl"
                      : "bg-blue-100 text-blue-900 rounded-t-xl rounded-br-xl"
                  }`}
                >
                  <CardContent
                    className={`p-3 sm:p-4 text-sm sm:text-base break-words whitespace-pre-wrap w-full overflow-hidden ${
                      msg.sender !== "user" ? "overflow-x-auto" : ""
                    }`}
                    style={
                      msg.sender !== "user"
                        ? { WebkitOverflowScrolling: "touch" }
                        : {}
                    }
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeMathjax]}
                    >
                      {fixMathMessages(msg.text)}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </ScrollArea>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white/90 border border-blue-200 rounded-xl text-blue-900 placeholder:text-blue-300 focus:ring-2 focus:ring-blue-400 text-base sm:text-lg px-4 sm:px-6 py-3 sm:py-4"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            disabled={loading}
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 sm:px-6 py-3 sm:py-4 flex items-center gap-2 font-semibold shadow text-lg"
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
                Thinking...
              </span>
            ) : (
              <FiSend className="text-xl" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  return (
    <Suspense
      fallback={
        <div className="text-center text-blue-500 mt-20 text-xl">
          Loading chat...
        </div>
      }
    >
      <ChatWrapper />
    </Suspense>
  );
};

export default ChatPage;
