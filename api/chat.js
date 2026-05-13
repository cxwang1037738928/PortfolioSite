// pages/api/llm.js

import OpenAI from "openai";


// hard coding API key for testing, will be removed in production and set via environment variable
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const { conversation, context, prompt } = req.body;

    if (!conversation || !context) {
      return res.status(400).json({
        error: "Missing conversation or context",
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

      Question:
      ${conversationText}
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