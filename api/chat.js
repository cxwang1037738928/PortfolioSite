// mock backend api call, will be replaced with Openroute API calls once I implement query embeddings in the browser

// expects user question and context from most relevant documents

export default async function handler(req, res) {
  res.status(200).json({
    reply:
      "This is a mock AI response from the backend while I work on user query embeddings in the browser",
  })
  console.log("Received message:", req.body.message);
  console.log("With context:", req.body.context)
  ;
}