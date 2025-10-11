import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { code, inputLang, targetLang, mode } = req.body;

  if (!code || !inputLang || !mode) {
    return res.status(400).json({ error: "Missing code, inputLang or mode" });
  }

  let prompt = "";
  if (mode === "convert") prompt = `Convert the following ${inputLang} code to ${targetLang}:\n\n${code}`;
  if (mode === "fix") prompt = `Fix the errors in the following ${inputLang} code and make it correct:\n\n${code}`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert software developer." },
        { role: "user", content: prompt },
      ],
    });

    const result = completion.choices[0].message.content;
    res.status(200).json({ result });
  } catch (err: any) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}

