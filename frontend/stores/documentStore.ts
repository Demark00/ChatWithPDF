import { create } from "zustand";
import axios from "@/lib/axios";
import { DocumentStore } from "@/types/document-types";
import toast from "react-hot-toast";

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  loading: false,
  error: null,

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/documents");
      set({ documents: res.data.documents, loading: false });
      console.log(res.data)
      toast.success("Documents Fetched Successfully")
    } catch (err: any) {
      console.error("❌ Failed to fetch documents:", err);
      set({
        error: err.response?.data?.message || "Something went wrong",
        loading: false,
      });
      toast.error("Couldn't Fetch Documents, Try Again!")
    }
  },

  deleteDocument: async (documentId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/documents`, {
        data: { documentId }
      })

      // Remove the deleted document from state
      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== documentId),
        loading: false
      }))

      toast.success("Document deleted successfully")
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Something went wrong",
        loading: false,
      });
      toast.error("Couldn't delete the document, try again!");
    }
  }

}));
