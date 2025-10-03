// app/api/ask-finance/route.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question) {
      return new Response(JSON.stringify({ error: "No question provided" }), { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a financial adviser. Only answer finance-related queries." },
        { role: "user", content: question }
      ]
    });

    const answer = completion.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("OpenAI API error:", error);
    return new Response(JSON.stringify({ error: error.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
