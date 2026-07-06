"use client";

import { CONTACT } from "../_data/content";
import { RevealPanel } from "./RevealPanel";

export function HeroSection() {
  return (
    <section data-snap className="relative min-h-screen flex items-end pb-32">
      <RevealPanel className="px-8 md:px-16 max-w-5xl">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent text-shadow-cyan">
          <span className="size-1.5 rounded-full bg-accent hud-pulse" />
          INCOMING TRANSMISSION · CHANNEL G-301
        </div>

        <h1 className="mt-6 font-display font-extrabold uppercase leading-[0.95] text-foreground text-shadow-hud text-[clamp(2.75rem,9vw,7.5rem)] tracking-tight">
          GRACE GAO
        </h1>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-sm uppercase tracking-[0.22em] text-primary/90">
          <span>SYSTEMS ENGINEER</span>
          <span className="text-foreground/40">//</span>
          <span>SAN FRANCISCO, CA</span>
          <span className="text-foreground/40">//</span>
          <span>FIRETIGER</span>
        </div>

        <p className="mt-8 max-w-xl font-sans text-base/7 text-foreground/75">
          I build backend systems, telemetry, and developer tools — currently
          shipping LLM-powered investigation agents that turn noisy telemetry
          into answers. UW–Madison CompE + CS, 2025.
        </p>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl font-mono text-[11px] uppercase tracking-widest">
          <StatBlock label="Status" value="ACTIVE" tone="success" />
          <StatBlock label="Stack" value="GO · TS · OTEL" />
          <StatBlock label="Sector" value="04 / SF" />
          <StatBlock label="Range" value="NOMINAL" />
        </div>
      </RevealPanel>
    </section>
  );
}

function StatBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="border-l-2 border-primary/60 pl-3">
      <div className="text-foreground/45 text-[9px]">{label}</div>
      <div
        className={`mt-0.5 ${tone === "success" ? "text-success" : "text-primary"} text-shadow-hud`}
      >
        {value}
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <section data-snap className="relative min-h-screen flex items-center px-8 md:px-16 pb-32">
      <RevealPanel className="max-w-5xl w-full">
        <SectionLabel index="05" title="OPEN CHANNEL" />

        <h2 className="mt-6 font-display font-extrabold uppercase text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-shadow-hud">
          LET&apos;S
          <br />
          BUILD SOMETHING.
        </h2>

        <p className="mt-6 max-w-xl font-sans text-base/7 text-foreground/75">
          Pinging for backend / infra / dev-tools work, telemetry pipelines, and
          systems that have to behave under load. Reach out — I read everything.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-4 max-w-3xl pointer-events-auto">
          <ContactLink
            href={`mailto:${CONTACT.workEmail}`}
            label="WORK EMAIL"
            value={CONTACT.workEmail}
          />
          <ContactLink
            href={`mailto:${CONTACT.email}`}
            label="PERSONAL EMAIL"
            value={CONTACT.email}
          />
          <ContactLink
            href={CONTACT.linkedin}
            label="LINKEDIN"
            value="/in/grace-gao"
            external
          />
          <ContactLink
            href={CONTACT.github}
            label="GITHUB"
            value="@grgao"
            external
          />
        </div>

        <div className="mt-16 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/45">
          <span className="h-px flex-1 bg-foreground/15" />
          <span>END OF TRANSMISSION</span>
          <span className="h-px flex-1 bg-foreground/15" />
        </div>
      </RevealPanel>
    </section>
  );
}

function ContactLink({
  href,
  label,
  value,
  external,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="group border border-primary/40 bg-background/70 backdrop-blur-sm p-5 hover:border-primary hover:bg-primary/10 transition-colors"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80">
        {label} →
      </div>
      <div className="mt-2 font-display text-lg uppercase tracking-wide group-hover:text-shadow-hud">
        {value}
      </div>
    </a>
  );
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
      <span className="border border-primary/60 px-2 py-1 text-shadow-hud">
        {index}
      </span>
      <span className="text-shadow-hud">{title}</span>
      <span className="h-px flex-1 bg-primary/30 max-w-40" />
    </div>
  );
}
