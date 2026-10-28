"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface MockFeedbackNotice {
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  meta?: string;
}

interface MockFeedbackProps {
  notice: MockFeedbackNotice | null;
  onClose: () => void;
}

export function MockFeedback({ notice, onClose }: MockFeedbackProps) {
  if (!notice) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100",
    warning: "border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100",
    info: "border-blue-500/30 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100",
  };

  return (
    <div
      role="alert"
      className={`relative p-4 rounded-xl border shadow-md flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${borders[notice.type]}`}
    >
      {icons[notice.type]}
      <div className="flex-1 min-w-0 pr-6">
        <h4 className="text-sm font-bold">{notice.title}</h4>
        <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{notice.message}</p>
        {notice.meta && (
          <p className="text-[11px] font-mono mt-1 px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 inline-block">
            {notice.meta}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-md opacity-60 hover:opacity-100 transition"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
