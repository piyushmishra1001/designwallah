"use client";

import type { GenerationResult } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  empty_state: "Empty state",
  error_state: "Error state",
  permissions_auth: "Permissions / auth",
  network_offline: "Network / offline",
  concurrency_timing: "Concurrency / timing",
  accessibility: "Accessibility",
};

const SEVERITY_COLOR: Record<string, string> = {
  high: "text-flag border-flag/40 bg-flag/10",
  medium: "text-signal border-signal/40 bg-signal/10",
  low: "text-slate-mute border-ink-line bg-ink-soft",
};

export default function FlowResult({ result }: { result: GenerationResult }) {
  return (
    <div className="space-y-12">
      <div>
        <p className="font-mono text-xs text-slate-mute uppercase tracking-wider mb-2">
          Feature
        </p>
        <p className="font-display text-xl text-paper">{result.feature_summary}</p>
      </div>

      <section>
        <p className="font-mono text-xs text-slate-mute uppercase tracking-wider mb-5">
          User flow — {result.flow.length} steps
        </p>
        <div className="space-y-6">
          {result.flow.map((step) => (
            <div key={step.order} className="rail flex gap-4">
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-sm ${
                  step.state === "decision_point"
                    ? "border-signal text-signal bg-ink"
                    : "border-ink-line text-paper bg-ink"
                }`}
              >
                {step.order}
              </div>
              <div className="pb-2 pt-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base text-paper">{step.name}</h3>
                  {step.state === "decision_point" && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-signal border border-signal/40 rounded px-1.5 py-0.5">
                      branches
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-mute mt-1">
                  <span className="text-paper/70">User:</span> {step.user_action}
                </p>
                <p className="text-sm text-slate-mute mt-0.5">
                  <span className="text-paper/70">System:</span> {step.system_response}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="font-mono text-xs text-slate-mute uppercase tracking-wider mb-5">
          Edge cases — {result.edge_cases.length} found
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.edge_cases.map((ec, i) => (
            <div
              key={i}
              className="rounded-lg border border-ink-line bg-ink-soft p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-mute">
                  {CATEGORY_LABEL[ec.category] ?? ec.category}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 border ${SEVERITY_COLOR[ec.severity]}`}
                >
                  {ec.severity}
                </span>
              </div>
              <h4 className="font-display text-sm text-paper">{ec.title}</h4>
              <p className="text-sm text-slate-mute">{ec.scenario}</p>
              <p className="text-sm text-paper/70 border-t border-ink-line pt-2 mt-2">
                <span className="text-slate-mute">Handle it: </span>
                {ec.suggested_handling}
              </p>
            </div>
          ))}
        </div>
      </section>

      {result.open_questions.length > 0 && (
        <section>
          <p className="font-mono text-xs text-slate-mute uppercase tracking-wider mb-5">
            Open questions
          </p>
          <div className="space-y-3">
            {result.open_questions.map((q, i) => (
              <div key={i} className="border-l-2 border-signal/50 pl-4">
                <p className="text-paper text-sm">{q.question}</p>
                <p className="text-slate-mute text-xs mt-1">{q.why_it_matters}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
