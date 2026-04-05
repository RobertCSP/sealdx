"use client";

import { useEffect, useState } from "react";

interface Props {
  type: "proposal" | "invoice";
}

const PROPOSAL_STEPS = [
  "Reading your project details...",
  "Crafting the introduction...",
  "Writing scope of work...",
  "Building the pricing table...",
  "Drafting terms & next steps...",
  "Polishing the final document...",
];

const INVOICE_STEPS = [
  "Reading your invoice details...",
  "Polishing payment terms...",
  "Formatting line items...",
  "Finalizing your invoice...",
];

export default function GeneratingLoader({ type }: Props) {
  const steps = type === "proposal" ? PROPOSAL_STEPS : INVOICE_STEPS;
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through step labels
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, type === "proposal" ? 2200 : 1500);
    return () => clearInterval(interval);
  }, [steps.length, type]);

  // Smoothly animate progress bar, slowing near 90% to wait for real completion
  useEffect(() => {
    const target = ((stepIndex + 1) / steps.length) * 90;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= target) return p;
        return Math.min(p + 1, target);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [stepIndex, steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-6">
      {/* Animated icon */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9"
              stroke="#3b82f6"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M16 3l2 2-5 5M18 5l2-2"
              stroke="#3b82f6"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Status text */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white transition-all duration-500">
          {steps[stepIndex]}
        </p>
        <p className="text-xs text-slate-500">
          Powered by Claude AI · This takes {type === "proposal" ? "10–20" : "a few"} seconds
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-slate-600">
          <span>Working…</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < stepIndex
                ? "w-1.5 h-1.5 bg-blue-500"
                : i === stepIndex
                ? "w-2.5 h-2.5 bg-blue-400"
                : "w-1.5 h-1.5 bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
