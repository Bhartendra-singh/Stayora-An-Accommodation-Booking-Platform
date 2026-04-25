// import express from "express";
// import Anthropic from "@anthropic-ai/sdk";

// const router = express.Router();
// const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// router.post("/chat", async (req, res) => {
//   try {
//     const { messages, system, max_tokens = 1000 } = req.body;

//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");

//     const stream = client.messages.stream({
//       model: "claude-sonnet-4-20250514",
//       max_tokens,
//       system,
//       messages,
//     });

//     stream.on("text", (text) => {
//       res.write(`data: ${JSON.stringify({ type: "content_block_delta", delta: { text } })}\n\n`);
//     });

//     stream.on("finalMessage", () => {
//       res.write("data: [DONE]\n\n");
//       res.end();
//     });

//     stream.on("error", (err) => {
//       res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
//       res.end();
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;



import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/chat", async (req, res) => {
  try {
    const { messages, system, max_tokens = 1000 } = req.body;

    const apiMessages = [];
    if (system) {
      apiMessages.push({ role: "system", content: system });
    }
    apiMessages.push(...messages);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: apiMessages,
      max_tokens,
    });

    const text = completion.choices[0]?.message?.content || "";

    res.setHeader("Content-Type", "text/event-stream");
    res.write(
      `data: ${JSON.stringify({ type: "content_block_delta", delta: { text } })}\n\n`
    );
    res.write("data: [DONE]\n\n");
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;