import { create } from "zustand";
import axios from "@/lib/axios"; // our Axios instance that attaches token
import { ChatStore, RawMessage } from "@/types/chat-types"; // types: documentId, messages[], loading

export const useChatStore = create<ChatStore>((set, get) => ({
    documentId: null,
    messages: [],
    loading: false,

    setDocumentId: (id: string) => {
        set({ documentId: id, messages: [] }); // reset chat for new document
    },

    sendMessage: async (question: string) => {
        const { documentId, messages } = get();
        if (!documentId) {
            console.error("❌ No document ID selected");
            return;
        }

        // Step 1: Optimistically add user question to messages
        set({
            messages: [...messages, { sender: "user", text: question }],
            loading: true,
        });

        try {
            // Step 2: Send to backend
            const res = await axios.post("/chat", {
                documentId,
                question,
            });

            const answer = res.data.response || "⚠️ No response from LLM";

            // Step 3: Append AI answer
            set({
                messages: [
                    ...get().messages,
                    { sender: "ai", text: answer }
                ],
                loading: false,
            });
        } catch (err) {
            console.error("❌ Chat error:", err);
            set({
                messages: [
                    ...get().messages,
                    { sender: "ai", text: "❌ Error getting response from AI." }
                ],
                loading: false,
            });
        }
    },


    fetchMessages: async (userId: string) => {
        const { documentId } = get();
        if (!documentId) return;
        set({ loading: true })
        try {
            const res = await axios.get('/chat', {
                params: { documentId, userId }
            })

            const pastMessages = await res.data.messages.map((msg: RawMessage) => ({
                sender: msg.role === "user" ? "user" : "ai",
                text: msg.content,
            }))

            set({ messages: pastMessages, loading: false })
        } catch (error) {
            console.error("❌ Failed to fetch chat history:", error);
            set({ loading: false });
        }
    }
}));
