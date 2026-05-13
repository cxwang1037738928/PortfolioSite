// src/components/ChatbotModels/ChatbotWidget.jsx

import { useEffect, useState } from "react";

import { embedQuery } from "../../../lib/embedQuery.js";
import { searchDocuments } from "../../../lib/search.js";

export default function ChatbotWidget() {

  const [open, setOpen] = useState(false); 
  
  const [lastMessageTime, setLastMessageTime] = useState(0);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm Eric bot! Ask me anything about my projects. Note that responses may take up to ~10 seconds since I embed the user query and perform retrival in the browser instead of a dedicated backend server.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // stores embedded document chunks
  const [documents, setDocuments] = useState([]);

  // open chatbot 1.5 seconds after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // load embedded documents once
  useEffect(() => {

    async function loadDocuments() {

      try {

        const docsResponse = await fetch("/documents.json");

        const docs = await docsResponse.json();

        setDocuments(docs);

      } catch (err) {

        console.error("Failed to load documents.json", err);
      }
    }

    loadDocuments();

  }, []);

  async function sendMessage() {

    if (!input.trim()) return;
    const now = new Date();
    if (now - lastMessageTime < 1000) {
      return;
    }
    setLastMessageTime(now);


      // prevent spamming messages  

  //   // don't try to answer questions if documents aren't loaded yet, since we won't have any context to provide to the backend
  //   if (!documents.length) {

  //   setMessages((prev) => [
  //     ...prev,
  //     {
  //       role: "assistant",
  //       content:
  //         "Documents are still loading. Please wait a moment.",
  //     },
  //   ]);

  //   return;
  // }

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;

    setInput("");

    setLoading(true);

    try {

      // 1. embed the user query live in browser
      console.log("1. started embedding");

      const queryEmbedding = await embedQuery(currentInput);

      // 2. retrieve top K most relevant chunks
      console.log("2. started searching");

      const topChunks = searchDocuments(
        queryEmbedding,
        documents,
        5
      );

      // 3. combine retrieved context into one string
      console.log("3. combining context");

      const context = topChunks
        .map((doc) => doc.text)
        .join("\n\n");

      // 4. send user question + retrieved context
      console.log("4. sending to backend with context:");

      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          conversation: [
            ...messages, // entire conversation history for better context, not just latest question
            { role: "user", content: currentInput },
            ],
          context, // optional
          prompt: "You are a RAG assistant for the personal website of a fourth year CS major at the University of Toronto. Be enthusiastic and use ONLY the provided context chunks and conversation history. Do not use outside knowledge or guess. If the answer is not explicitly supported, say: “Not enough information in the provided context.” Treat chunks as partial but authoritative; combine them when relevant. Prefer the most specific and recent chunk if conflicts exist. Be concise and direct: answer first, then minimal supporting detail. If the query is ambiguous, ask one short clarification question or give up to two interpretations. Never fabricate projects, facts, or metrics. Keep responses brief and factual. Limit responses to a maximum of 200 words, and try to structure responses as bullet points.", // set prompt here or leave it to backend
        }),
      });

      console.log("Received response from backend");
      
      // buffer if response is not ok to get error message from backend
      if (!response.ok) {

        const text = await response.text();

        throw new Error(text);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

    } catch (err) {

      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "999px",
          border: "none",
          background: "#6d5dfc",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          zIndex: 9999,
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "24px",
            width: "360px",
            height: "520px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#6d5dfc",
              color: "white",
              padding: "12px 16px",
              fontWeight: "bold",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid white", // optional nice effect
                flexShrink: 0,
              }}
            >
              <img
                src="/images/BotPicture.jpg"
                alt="Eric Bot"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            <span>Eric bot</span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf:
                    msg.role === "user"
                      ? "flex-end"
                      : "flex-start",

                  background:
                    msg.role === "user"
                      ? "#6d5dfc"
                      : "#f1f1f1",

                  color:
                    msg.role === "user"
                      ? "white"
                      : "black",

                  padding: "12px 14px",
                  borderRadius: "14px",
                  maxWidth: "80%",
                  lineHeight: "1.4",
                }}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  background: "#f1f1f1",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  width: "fit-content",
                }}
              >
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              padding: "16px",
              borderTop: "1px solid #eee",
            }}
          >
            <input
              value={input}

              onChange={(e) => setInput(e.target.value)}

              placeholder="Ask about my projects..."

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}

              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                outline: "none",
                backgroundColor: "white",
                color: "black",
                fontSize: "14px",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                border: "none",
                background: "#6d5dfc",
                color: "white",
                borderRadius: "10px",
                padding: "0 16px",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}