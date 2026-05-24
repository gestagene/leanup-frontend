import { apiClient } from "@/lib/apiClient";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  reply: string;
};

export const chatService = {
  sendMessage: async (messages: ChatMessage[]): Promise<ChatResponse> => {
    return await apiClient("/chat/", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });
  },
};
