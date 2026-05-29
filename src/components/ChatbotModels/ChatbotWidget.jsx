// src/components/ChatbotModels/ChatbotWidget.jsx

import { useEffect, useRef, useState } from "react";

import { embedQuery } from "../../../lib/embedQuery.js";
import { searchDocuments } from "../../../lib/search.js";

export default function ChatbotWidget() {

  const [open, setOpen] = useState(false); 
  
  const [lastMessageTime, setLastMessageTime] = useState(0);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm Eric bot! Ask me anything about my projects, coursework, or hobbies.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // stores embedded document chunks
  const [documents, setDocuments] = useState([]);

  // stores embedded assistant response chunks so they can be searched
  // alongside document chunks in future queries, giving the model memory
  // of what it has already said without sending the full message history.
  // each entry mirrors the document chunk shape: { text, embedding, source }
  const assistantChunksRef = useRef([]);

  // open chatbot 3 seconds after page load
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

    if (!input.trim()) return; // return if no input
    const now = new Date();
    if (now - lastMessageTime < 1000) {
      return; // prevent sending if last message was less than 1 second ago
    }
    setLastMessageTime(now);


    // format user message as a json object with role and content
    const userMessage = {
      role: "user",
      content: input,
    };


    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;

    setInput("");

    setLoading(true);

    try {

      // 1. embed only the user's latest query (not the last four messages).
      //    prior context is handled by searching assistant response chunks instead.
      console.log("1. started embedding");

      const queryEmbedding = await embedQuery(currentInput);

      console.log("retrieval query:", currentInput);

      // 2. retrieve top K most relevant chunks
      console.log("2. started searching");

      // perform cosine similary search betweeen the embedded user query and documents
      const topChunks = searchDocuments(
        currentInput,
        queryEmbedding,
        documents,
        5
      );

      // stop the function and add last user message to array if there are no relevant chunks
      if (!topChunks.length) {

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Please ask a question related to my projects.",
          },
        ]);

        setLoading(false);

        return;
      }

      // 3. search the assistant response chunk store with the same query embedding
      //    and merge those results with the document chunks, then re-rank by score
      //    and take the top 4 to send as context. this replaces sending the full
      //    conversation history to the backend.
      console.log("3. combining context");

      // search prior assistant responses as if they were document chunks
      const assistantHits = searchDocuments(
        currentInput,
        queryEmbedding,
        assistantChunksRef.current,
        5 // retrieve up to 5 assistant chunks before merging
      );

      // merge document chunks and assistant response chunks into one pool,
      // sort descending by score, and keep the top 4
      const mergedChunks = [...topChunks, ...assistantHits]
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      // start counting the number of times each source/file appears in the top chunks
      // The Search.js document dominant source scoring wasn't efficient enough, and the
      // GPT still hallucinates information from multiple sources, so this
      // only gets chunks from the dominant source.
      const sourceCounts = {};

      for (const chunk of mergedChunks) {

      const source = chunk.source;

      if (sourceCounts[source] === undefined) {
        sourceCounts[source] = 1;
      } else {
        sourceCounts[source] += 1;
      }
    }

      // identify the dominant file/source
      let dominantSource = null;
      let largest = -Infinity;

      for (const key in sourceCounts) {
        if (sourceCounts[key] > largest) {
          largest = sourceCounts[key];
          dominantSource = key;
        }
      }
      
      // outdated nlogn method to find dominant source, replaced with linear scan above
      // const dominantSource =
      //   Object.entries(sourceCounts)
      //     .sort((a, b) => b[1] - a[1])[0][0]; // takes key name count of the first source in the sorted array

      console.log("Dominant source:", dominantSource);

      // filter the top chunks to only include those from the dominant source, O(n)
      const focusedChunks =
        mergedChunks.filter(
          chunk =>
            chunk.source === dominantSource
        );
      
      // combine the text of the focused chunks into one string to send as context to the backend
      const context = focusedChunks.map(chunk => chunk.text).join("\n\n");

      // 4. send user question + retrieved context.
      //    conversation now contains only the current user query; the top 4
      //    merged chunks (passed via context) replace the full message history.
      console.log("4. sending to backend with context:", context);
      // need to change this if backend is running on a different domain as frontend
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
          conversation: [
            { role: "user", content: currentInput }, // only the latest user query, not entire conversation history
            ],
          context, // optional
          prompt: `

          You are a concise RAG assistant for a personal portfolio website.

          Answer ONLY using retrieved context. Do not guess or add outside knowledge.

          You are Eric bot, representing Eric, a fourth-year Computer Science Specialist at University of Toronto. 
          Answer all questions in first person, reflecting Eric's experiences, skills, and projects.
          Use the retrieved information to answer, but always speak as Eric: "I", "my", "me", etc.

          Rules:
          - Answer the user's exact question only.
          - Ignore unrelated retrieved information.
          - Prefer 1-3 relevant facts instead of summarizing everything.
          - If context is insufficient, say: "Not enough information in the provided context."
          - If the query is ambiguous, ask one short clarification question.
          - Keep responses under 120 words.
          - Use short paragraphs or bullets.
          - Never mention retrieval, chunks, embeddings, or context unless asked.
          `, // set prompt here or leave it to backend
        }),
      });

      console.log("Received response from backend");
      
      // buffer if response is not ok to get error message from backend
      if (!response.ok) {

        const text = await response.text();

        throw new Error(text);
      }

      const data = await response.json();

      // 5. embed the assistant's reply and store it as a searchable chunk so
      //    future queries can retrieve it alongside document chunks, giving the
      //    model awareness of what it has already answered without needing to
      //    send the entire conversation history on every turn.
      console.log("5. embedding assistant reply and storing as chunk");

      const replyEmbedding = await embedQuery(data.reply);

      assistantChunksRef.current.push({
        text: data.reply,
        embedding: replyEmbedding,
        source: "assistant", // mark source so it can be identified during merging
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

    } catch (err) {

      console.error(err);

      // set error message in chatbot if something goes wrong with the API call
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

              // on enter send the message
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              
              // style the input box
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