import axios from "axios";
import { cleanCohereResponse } from "./cleanResponse";

export const getLLMResponse = async (prompt: string, chatHistory: {role:string ; message: string}[]): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        model: "command-r-plus",
        message: prompt,
        connectors: [], // optional, use this for search-enabled
        chat_history: chatHistory,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return cleanCohereResponse(response.data.text) || "No response from Cohere.";
  } catch (error: any) {
    console.error("❌ Error from Cohere API:", error.response?.data || error.message);
    throw new Error("Failed to get response from Cohere API.");
  }
};
