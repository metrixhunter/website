import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
  const { code, inputLang, targetLang, mode } = req.body;

  if (!code || !inputLang || !mode) {
    return res.status(400).json({ error: "Missing code, inputLang or mode" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback if API key is missing
      return res.json({
        result: `Converted ${inputLang} → ${targetLang}\n${code}`
      });
    }

    let prompt = "";
    if (mode === "convert") prompt = `Convert the following ${inputLang} code to ${targetLang}:\n\n${code}`;
    if (mode === "fix") prompt = `Fix the errors in the following ${inputLang} code:\n\n${code}`;
    if (mode === "run") prompt = `Simulate running this ${inputLang} code and show the output:\n\n${code}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert software developer. and when asked for output you should provide only the code without any additional explanation." },
        { role: "user", content: prompt }
      ],
    });

    const result = completion.choices?.[0]?.message?.content || `Converted ${inputLang} → ${targetLang}\n${code}`;
    res.json({ result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
