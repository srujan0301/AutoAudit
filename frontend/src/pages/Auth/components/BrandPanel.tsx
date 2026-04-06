import React from "react";
import { Lock, Zap, BarChart3, type LucideIcon } from "lucide-react";

const brandFeatures: { icon: LucideIcon; text: string }[] = [
  { icon: Lock, text: "Enterprise-grade security & encryption" },
  { icon: Zap, text: "Real-time compliance monitoring" },
  { icon: BarChart3, text: "Actionable reporting & insights" },
];

const particlePositions = [
  "left-[12%] top-[25%]",
  "left-[30%] top-[70%]",
  "left-[52%] top-[45%]",
  "left-[68%] top-[80%]",
  "left-[82%] top-[35%]",
  "left-[20%] top-[85%]",
];

const BrandPanel = () => {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden rounded-3xl px-12 py-10 text-white"
      aria-labelledby="brand-title"
    >
      {particlePositions.map((position, index) => (
        <span
          key={index}
          className={`absolute h-1 w-1 rounded-full bg-blue-500/40 ${position}`}
          aria-hidden="true"
        />
      ))}

      <div className="relative z-10 flex max-w-[420px] flex-col items-center gap-6 text-center">
        <picture>
          <source srcSet="/AutoAudit.webp" type="image/webp" />
          <img
            src="/AutoAudit.png"
            alt="AutoAudit"
            className="mb-4 h-auto w-[180px] drop-shadow-[0_10px_25px_rgba(59,130,246,0.3)]"
            loading="lazy"
          />
        </picture>

        <div id="brand-title">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Access security insights anywhere
          </h1>
          <p className="leading-7 text-slate-300">
            Connect to your Microsoft 365 compliance dashboard, monitor security posture, and act on
            real-time recommendations.
          </p>
        </div>

        <div className="mt-4 hidden w-full flex-col gap-4 lg:flex" aria-label="Platform highlights">
          {brandFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.text}
                className="flex items-center gap-4 rounded-xl border border-blue-500/10 bg-white/5 p-4 text-left"
              >
                <span
                  className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"
                  aria-hidden="true"
                >
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <span>{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandPanel;