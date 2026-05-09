import React from "react";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Bolt, Lock } from "lucide-react";

type FloatingCard = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
};

const floatingCards: FloatingCard[] = [
  {
    icon: Lock,
    title: "99.9% Uptime",
    subtitle: "Enterprise-grade reliability you can trust",
  },
  {
    icon: Bolt,
    title: "Real-Time Monitoring",
    subtitle: "Instant alerts and comprehensive insights",
  },
  {
    icon: BarChart3,
    title: "Actionable Reports",
    subtitle: "Export audit-ready documentation instantly",
  },
];

type HeroSectionProps = {
  onSignInClick?: () => void;
};

const HeroSection = ({ onSignInClick }: HeroSectionProps) => {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-br from-[rgb(var(--landing-bg-base))] via-[rgb(var(--landing-bg-mid))] to-[rgb(var(--landing-bg-end))] px-[5%] pt-8 pb-16">
      <div className="pointer-events-none absolute -right-50 -top-50 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-blue)/0.15)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-37.5 -left-25 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgb(var(--brand-blue)/0.2)_0%,transparent_70%)]" />

      <div className="mx-auto grid max-w-300 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-14">
        <div>
          <p className="mb-3 text-sm font-semibold tracking-wide text-white">
            AutoAudit Platform
          </p>

          <h1 className="mb-6 bg-linear-to-br from-white to-[rgb(var(--brand-blue))] bg-clip-text text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-tight text-transparent">
            Access your compliance dashboard and security insights.
          </h1>

          <p className="max-w-170 text-[1.2rem] leading-relaxed text-[rgb(var(--landing-text-soft))]">
            Compliance made easy for you. View your dashboards anytime,
            anywhere. Automate security monitoring and stay ahead of threats
            with real-time insights.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-linear-to-br from-[rgb(var(--brand-blue))] to-[rgb(var(--brand-blue-deep))] px-7 py-3 font-semibold text-white shadow-[0_8px_30px_rgb(var(--brand-blue)/0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgb(var(--brand-blue)/0.5)]"
              onClick={onSignInClick}
            >
              Get Started
            </button>

            <a
              className="inline-flex items-center justify-center rounded-full border-2 border-[rgb(var(--brand-blue))] px-7 py-3 font-semibold text-[rgb(var(--brand-blue))] transition duration-200 hover:-translate-y-0.5 hover:bg-[rgb(var(--brand-blue))] hover:text-[rgb(var(--landing-bg-base))]"
              href="#features"
            >
              Learn More
            </a>
          </div>
        </div>

        <div
          className="grid gap-5"
          aria-label="AutoAudit platform highlights"
        >
          {floatingCards.map(({ icon: Icon, title, subtitle }) => (
            <article
              key={title}
              className="group grid grid-cols-[64px_1fr] items-center gap-4 rounded-3xl border border-[rgb(var(--brand-blue)/0.18)] bg-[rgb(255_255_255/0.04)] p-5 shadow-[0_12px_30px_rgb(0_0_0/0.18)] backdrop-blur-[12px] transition duration-300 hover:-translate-y-1 hover:border-[rgb(var(--brand-blue)/0.55)] hover:shadow-[0_18px_40px_rgb(var(--brand-blue)/0.18)] max-sm:grid-cols-1 max-sm:justify-items-center max-sm:text-center"
            >
              <span
                className="grid h-13 w-13 place-items-center rounded-2xl bg-linear-to-br from-[rgb(var(--brand-blue))] to-[rgb(var(--brand-blue-deep))] text-white shadow-[0_10px_24px_rgb(var(--brand-blue)/0.35)] transition duration-300 group-hover:scale-105"
                aria-hidden="true"
              >
                <Icon size={20} strokeWidth={2.2} />
              </span>

              <div className="min-w-0">
                <h3 className="mb-1 text-lg font-bold text-white">{title}</h3>
                <p className="m-0 leading-relaxed text-[rgb(var(--landing-text-soft))]">
                  {subtitle}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;