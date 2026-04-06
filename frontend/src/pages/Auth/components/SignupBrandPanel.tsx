import React from "react";
import { BarChart3, Lock, Zap, type LucideIcon } from "lucide-react";

const featureItems: { icon: LucideIcon; text: string }[] = [
  { icon: Zap, text: "Setup in minutes, not hours" },
  { icon: Lock, text: "Bank-level security & encryption" },
  { icon: BarChart3, text: "Real-time compliance monitoring" },
];

const SignupBrandPanel = () => {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden rounded-3xl px-12 py-10 text-white"
      aria-labelledby="signup-brand-title"
    >
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

        <div id="signup-brand-title">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Start Your Compliance Journey
          </h1>
          <p className="leading-7 text-slate-300">
            Join organizations that rely on AutoAudit to monitor, analyze, and improve their
            Microsoft 365 security posture.
          </p>
        </div>

        <div className="mt-4 hidden w-full flex-col gap-4 lg:flex" aria-label="AutoAudit highlights">
          {featureItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.text}
                className="flex items-center gap-4 rounded-xl border border-blue-500/10 bg-white/5 p-4 text-left"
              >
                <span
                  className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"
                  aria-hidden="true"
                >
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                <span>{item.text}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SignupBrandPanel;