import { create } from "zustand";
import axios from "@/lib/axios"; // Use axios instance
import { UploadState } from "@/types/upload-types";
import toast from "react-hot-toast";

export const useUploadStore = create<UploadState>((set, get) => ({
  file: null,
  uploading: false,
  success: false,
  error: null,

  setFile: (file) => set({ file }),

  uploadFile: async () => {
    const { file } = get();
    if (!file) {
      set({ error: "No file selected" });
      return;
    }

    set({ uploading: true, error: null, success: false });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/upload", formData);

      if (res.status !== 200) throw new Error("Upload failed");

      set({ success: true, file: null , uploading: false}); // Reset file after success
      toast.success("File Uploaded Successfully")
    } catch (err: any) {
      set({ error: err.message });
      console.log("Error in Uploading File")
      toast.error("File couldn't Upload, Try Again!")
    } finally {
      set({ uploading: false });
    }
  },
}));
