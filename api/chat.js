export default async function handler(req, res) {
  res.status(200).json({
    reply:
      "This is a mock AI response from the backend.",
  });
}