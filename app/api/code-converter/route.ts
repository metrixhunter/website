// app/api/code-converter/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, inputLang, targetLang, mode } = body;

  if (!code || !inputLang || !mode) {
    return NextResponse.json({ error: "Missing code, inputLang or mode" }, { status: 400 });
  }

  const prompt =
    mode === "convert"
      ? `Convert the following ${inputLang} code to ${targetLang}:\n\n${code}`
      : `Fix the errors in the following ${inputLang} code and make it correct:\n\n${code}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert software developer." },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();
  return NextResponse.json({ result: data.choices[0].message.content });
}
