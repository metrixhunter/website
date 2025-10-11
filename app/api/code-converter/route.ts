/*import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code, inputLang, targetLang, mode } = await req.json();

  if (!code || !inputLang || !mode) {
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
    );
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

  // Return response with CORS header
  return NextResponse.json(
    { result: data.choices[0].message.content },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}

// Handle preflight request (OPTIONS)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
*/
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, inputLang, targetLang, mode } = body;

    if (!code || !inputLang || !mode) {
      return new Response(JSON.stringify({ error: "Missing code, inputLang, or mode" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt =
      mode === "convert"
        ? `Convert the following ${inputLang} code to ${targetLang || inputLang}:\n\n${code}`
        : `Fix the errors in the following ${inputLang} code and make it correct:\n\n${code}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert software developer." },
        { role: "user", content: prompt },
      ],
    });

    // Safe fallback if OpenAI returns unexpected response
    const result = completion.choices?.[0]?.message?.content || "No result returned";

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return new Response(JSON.stringify({ error: error.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
