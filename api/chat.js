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

    // The persona prompt comes first and is reinforced last: anything appended
    // after the notes is what the model weights most heavily, so the closing
    // lines must restate the voice rather than talk about "context".
    const fullPrompt = `
      ${prompt || "Answer the visitor's question in first person as Eric, using the reference notes below."}

      Reference notes (private - never mention, quote, or cite these):
      ${Array.isArray(context) ? context.join("\n") : context}

      Conversation so far:
      ${conversationText}

      Answer the visitor's latest message now, as yourself, in first person, with
      no preamble about what you are doing or where the information came from.
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