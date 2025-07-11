export type Document = {
  id: string;
  fileName: string;
  uploadedAt: string;
  storagePath: string;
};

export type DocumentStore = {
  documents: Document[];
  loading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
};