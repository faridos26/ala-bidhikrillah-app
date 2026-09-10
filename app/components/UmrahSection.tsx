"use client";

import { useState } from "react";
import umrahData from "../../data/umrah.json";
import { SpeechButton } from "./SpeechButton";

type UmrahStep = {
  order: number;
  title: string;
  icon: string;
  description: string;
  dua?: string;
  notes?: string[];
};

export function UmrahSection() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"steps" | "prohibitions" | "mistakes" | "etiquette">("steps");

  const umrah = umrahData.umrah;
  const steps = umrah.steps as UmrahStep[];

  return (
    <section className="animate-rise mt-6 space-y-5">
      {/* العنوان */}
      <div className="gold-card rounded-3xl p-6 text-center">
        <span className="text-5xl">🕋</span>
        <h1 className="gold-text mt-3 text-3xl font-extrabold">{umrah.title}</h1>
        <p className="mt-1 text-sm text-muted">{umrah.title_en}</p>
        <p className="mt-3 font-quran text-base leading-[2] text-ink/90">
          {umrah.introduction}
        </p>
        <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 p-3">
          <p className="font-quran text-sm leading-[1.9] text-gold-dark">
            {umrah.virtue}
          </p>
        </div>
      </div>

      {/* التبويبات */}
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border bg-surface p-1.5">
        <button
          onClick={() => setActiveTab("steps")}
          className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
            activeTab === "steps"
              ? "bg-gold/15 text-gold-dark"
              : "text-muted hover:text-ink"
          }`}
        >
          📖 خطوات العمرة
        </button>
        <button
          onClick={() => setActiveTab("prohibitions")}
          className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
            activeTab === "prohibitions"
              ? "bg-gold/15 text-gold-dark"
              : "text-muted hover:text-ink"
          }`}
        >
          🚫 المحظورات
        </button>
        <button
          onClick={() => setActiveTab("mistakes")}
          className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
            activeTab === "mistakes"
              ? "bg-gold/15 text-gold-dark"
              : "text-muted hover:text-ink"
          }`}
        >
          ⚠️ أخطاء شائعة
        </button>
        <button
          onClick={() => setActiveTab("etiquette")}
          className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
            activeTab === "etiquette"
              ? "bg-gold/15 text-gold-dark"
              : "text-muted hover:text-ink"
          }`}
        >
          ✨ الآداب
        </button>
      </div>

      {/* خطوات العمرة */}
      {activeTab === "steps" && (
        <div className="space-y-3">
          {steps.map((step) => {
            const isExpanded = expandedStep === step.order;
            return (
              <div
                key={step.order}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.order)}
                  className="flex w-full items-center justify-between p-4 text-right transition-colors hover:bg-gold/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-xs font-extrabold text-gold-dark">
                      {step.order}
                    </span>
                    <div>
                      <p className="text-base font-bold text-ink">{step.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-gold">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border p-4">
                    <p className="font-quran text-base leading-[2] text-ink/90">
                      {step.description}
                    </p>

                    {step.dua && (
                      <div className="mt-3 rounded-xl border border-gold/30 bg-gold/5 p-3">
                        <p className="text-xs font-bold text-gold-dark">🤲 الدعاء</p>
                        <p className="mt-2 font-quran text-base leading-[2] text-ink">
                          {step.dua}
                        </p>
                        <div className="mt-2">
                          <SpeechButton text={step.dua} />
                        </div>
                      </div>
                    )}

                    {step.notes && step.notes.length > 0 && (
                      <div className="mt-3 rounded-xl border border-border bg-surfaceMuted/30 p-3">
                        <p className="text-xs font-bold text-accentStrong">📌 ملاحظات</p>
                        <ul className="mt-2 space-y-1.5">
                          {step.notes.map((note, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
                              <span className="mt-1 text-gold">❋</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* المحظورات */}
      {activeTab === "prohibitions" && (
        <div className="rounded-2xl border border-danger/30 bg-danger-surface p-5">
          <h2 className="mb-4 text-lg font-extrabold text-danger">
            🚫 محظورات الإحرام
          </h2>
          <ul className="space-y-2">
            {umrah.prohibitions.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
                <span className="mt-1 text-danger">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-white/40 p-3 text-xs leading-[1.8] text-muted">
            💡 من فعل محظورًا من هذه المحظورات متعمدًا وجب عليه الفدية أو الكفارة حسب نوعه.
          </p>
        </div>
      )}

      {/* الأخطاء الشائعة */}
      {activeTab === "mistakes" && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 p-5">
          <h2 className="mb-4 text-lg font-extrabold text-amber-700">
            ⚠️ أخطاء شائعة تجنبها
          </h2>
          <ul className="space-y-2">
            {umrah.commonMistakes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
                <span className="mt-1 text-amber-600">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* الآداب */}
      {activeTab === "etiquette" && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-gold/30 bg-gold/5 p-5">
            <h2 className="mb-4 text-lg font-extrabold text-gold-dark">
              ✨ من آداب العمرة
            </h2>
            <ul className="space-y-2">
              {umrah.etiquette.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
                  <span className="mt-1 text-gold">❋</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <h2 className="mb-4 text-lg font-extrabold text-accentStrong">
              🎉 بعد أداء العمرة
            </h2>
            <ul className="space-y-2">
              {umrah.after_umrah.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-[1.8]">
                  <span className="mt-1 text-accent">❋</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}