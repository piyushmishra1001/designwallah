"use client";

import { useState } from "react";
import FlowResult from "@/components/FlowResult";
import type { GenerationResult } from "@/lib/types";

const PLACEHOLDER = `e.g. "Users can save items to a wishlist from the product page. Wishlist is accessible from the account menu. Items can be moved to cart or removed. Wishlist should persist across sessions."`;

export default function Home() {
  const [specText, setSpecText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <p className="font-mono text-xs text-signal uppercase tracking-wider mb-3">
            Pathwright
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-paper leading-tight">
            Paste a spec. Get the flow
            <br />
            and the edge cases it's missing.
          </h1>
          <p className="text-slate-mute mt-4 max-w-xl">
            Drop in a PRD, a feature description, or a rough idea. Pathwright maps
            the user flow and flags what the spec didn't account for — before it
            reaches design review.
          </p>
        </header>

        <div className="space-y-4">
          <textarea
            value={specText}
            onChange={(e) => setSpecText(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={8}
            className="w-full rounded-lg border border-ink-line bg-ink-soft p-4 text-paper placeholder:text-slate-mute/60 focus:outline-none focus:border-signal/60 resize-y font-body"
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-mute">
              {specText.length} characters
            </span>
            <button
              onClick={handleGenerate}
              disabled={loading || specText.trim().length < 20}
              className="font-display text-sm bg-signal text-ink px-5 py-2.5 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-signal/90 transition-colors"
            >
              {loading ? "Mapping the flow…" : "Generate flow"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-flag/40 bg-flag/10 p-4 text-sm text-flag">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-16 border-t border-ink-line pt-12">
            <FlowResult result={result} />
          </div>
        )}
      </div>
    </main>
  );
}
