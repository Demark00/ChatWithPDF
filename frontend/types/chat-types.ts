export type Message = {
  sender: "user" | "ai";
  text: string;
};

export type RawMessage = {
  id: string;
  documentId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type ChatStore = {
  documentId: string | null;
  messages: Message[];
  loading: boolean;
  setDocumentId: (id: string) => void;
  sendMessage: (message: string) => Promise<void>;
  fetchMessages: (userId: string) => Promise<void>;
};
