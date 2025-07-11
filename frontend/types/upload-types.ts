export type UploadState = {
  file: File | null;
  uploading: boolean;
  success: boolean;
  error: string | null;

  setFile: (file: File | null) => void;
  uploadFile: () => Promise<void>;
};