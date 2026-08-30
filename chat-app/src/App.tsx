import { useState } from "react";
import { PromptForm } from "./components/PromptForm";
import { ChatMessage, MessagePart } from "./components/ChatMessage";
import { sendChatMessage } from "./api/chat";

interface Message {
  role: "user" | "assistant";
  parts: MessagePart[];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  async function handleSubmit(prompt: string) {
    setMessages((prev) => [...prev, { role: "user", parts: [{ type: "text", text: prompt }] }]);
    try {
      const res = await sendChatMessage(prompt);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", parts: [{ type: "text", text: res.reply }] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", parts: [{ type: "error", message: "Something went wrong." }] },
      ]);
    }
  }

  return (
    <main>
      <h1>Chat</h1>
      <div aria-label="conversation">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} parts={m.parts} />
        ))}
      </div>
      <PromptForm onSubmit={handleSubmit} />
    </main>
  );
}
