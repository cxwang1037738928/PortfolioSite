import { useState } from "react";

export default function ChatbotWidget() {

  const [open, setOpen] = useState(false); // manages whether the chat window is open or closed
  const [messages, setMessages] = useState([ // starting mnessage from the assistant
    {
      role: "assistant",
      content: "Hi! Ask me anything about my projects.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    /* set the user's message to have the user role */
    const userMessage = {
      role: "user",
      content: input,
    };

    /* chat log of all messages, display only, will not be sent to the API */
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput, /* only send input, not the whole chat log */
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    }
    /* sets to false after the fetch is complete */
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
              padding: "16px",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            AI Assistant
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
              style={{
                border: "none",
                background: "#6d5dfc",
                color: "white",
                borderRadius: "10px",
                padding: "0 16px",
                cursor: "pointer",
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