import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import type { GenerationResult } from "@/lib/types";

// Simple in-memory rate limit per server instance.
// Replace with a real per-user limit (tied to Supabase auth + plan tier)
// before you take payments — see README "Adding billing limits".
const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 20;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit reached. Try again in a bit." },
      { status: 429 }
    );
  }

  const { specText } = await req.json();

  if (!specText || typeof specText !== "string" || specText.trim().length < 20) {
    return NextResponse.json(
      { error: "Paste a spec with at least a few sentences of detail." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY. See README setup." },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: process.env.ANTHROPIC_BASE_URL,
  });

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(specText.slice(0, 12000)) }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text content returned from model.");
    }

    let parsed: GenerationResult;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      // Model occasionally wraps in fences despite instructions — strip and retry once.
      const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Generation failed:", err);
    return NextResponse.json(
      { error: "Generation failed. Try again, or shorten the spec." },
      { status: 500 }
    );
  }
}
