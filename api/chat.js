// /api/chat.js

import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Use POST method to interact with this endpoint",
      });
    }
    const { conversation, context, prompt } = req.body;

    if (!conversation ||!Array.isArray(conversation)) {
        return res.status(400).json({
          error: "Missing or invalid conversation",
        });
      }

      if (context === undefined ||context === null) {
        return res.status(400).json({
          error: "Missing context",
        });
    }

    const conversationText = Array.isArray(conversation)
      ? conversation
          .map(msg => `${msg.role}: ${msg.content}`)
          .join("\n")
      : conversation;

    const fullPrompt = `
      ${prompt || "Answer the user question using the context below."}

      Context:
      ${Array.isArray(context) ? context.join("\n") : context}

      Conversation History:
      ${conversationText}

      Instructions:
      - Answer using ONLY the relevant context.
      - Focus on the latest user message.
      - Be concise and factual.
      `;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      input: fullPrompt,
    });

    console.log("LLM input:", fullPrompt); 
    console.log("Conversation:", conversation);


    return res.status(200).json({
      reply: response.output_text || "No reply from model",
    });

    

  } catch (error) {
    console.error("LLM handler error:", error);

    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}