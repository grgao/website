"use client";

import { EDUCATION, EXPERIENCES, SKILLS, CONTACT } from "../_data/content";
import type { Experience } from "../_data/content";
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

export function AboutSection() {
  return (
    <section data-snap className="relative min-h-screen flex items-center py-28">
      <RevealPanel className="px-8 md:px-16 max-w-5xl w-full">
        <SectionLabel index="01" title="DOSSIER" />

        <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-10">
          <div className="space-y-6">
            <p className="font-sans text-lg/8 text-foreground/85 max-w-2xl">
              Engineer focused on the unglamorous middle layer — the part where
              data has to actually move correctly between systems. At Firetiger
              I build the Go services and instrumentation behind an LLM
              investigation agent that reads telemetry and tells you what just
              broke.
            </p>
            <p className="font-sans text-base/7 text-foreground/70 max-w-2xl">
              Before that: Uline (Cassandra migration, security cleanup), Thomson
              Reuters (AWS CDK + monorepo constructs), and a stretch at Pitt
              doing engineering research. I like work that pays back in seconds
              shaved or dollars saved — last quarter, that meant a 90% Grafana
              cost cut and a search query that went from 17s to under 1s.
            </p>
          </div>

          <div className="border border-primary/40 bg-background/70 backdrop-blur-sm p-6 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/75 space-y-4">
            <Row k="Name" v={CONTACT.name} />
            <Row k="Based" v={CONTACT.location} />
            <Row k="Role" v="Systems Engineer · Firetiger" />
            <Row k="School" v={EDUCATION.school} />
            <Row k="Degree" v={EDUCATION.degree} />
            <Row k="Term" v={EDUCATION.range} />
          </div>
        </div>
      </RevealPanel>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-4 border-b border-primary/15 pb-2 last:border-0">
      <div className="text-foreground/45 text-[10px]">{k}</div>
      <div className="text-foreground/90 normal-case tracking-normal font-sans">
        {v}
      </div>
    </div>
  );
}

export function ExperienceSection() {
  return (
    <section className="relative">
      <div className="px-8 md:px-16 max-w-6xl pt-32">
        <SectionLabel index="02" title="LOG / DEPLOYMENTS" />
      </div>

      {EXPERIENCES.map((exp, i) => (
        <ExperiencePanel key={exp.id} exp={exp} index={i} />
      ))}
    </section>
  );
}

function ExperiencePanel({ exp, index }: { exp: Experience; index: number }) {
  const isCurrent = exp.status === "ACTIVE";
  return (
    <div data-snap className="min-h-screen flex items-center px-8 md:px-16 py-28">
      <RevealPanel className="max-w-5xl w-full">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
          <span
            className={`size-2 rounded-full ${isCurrent ? "bg-success hud-pulse" : "bg-primary/60"}`}
          />
          <span>
            LOG · {String(index + 1).padStart(3, "0")} //{" "}
            {exp.status === "ACTIVE" ? "LIVE FEED" : "ARCHIVED"}
          </span>
          <span className="h-px flex-1 bg-primary/30 max-w-32" />
          <span className="text-foreground/55">
            {exp.start} → {exp.end}
          </span>
        </div>

        <h3 className="mt-6 font-display font-bold uppercase text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-shadow-hud text-foreground">
          {exp.company}
        </h3>
        <div className="mt-2 font-mono text-sm uppercase tracking-[0.2em] text-accent">
          {exp.role} <span className="text-foreground/40">//</span>{" "}
          {exp.location}
        </div>

        <ul className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-4 max-w-4xl">
          {exp.highlights.map((h, i) => (
            <li key={i} className="flex gap-3 font-sans text-[15px] leading-7 text-foreground/85">
              <span className="mt-2 size-1.5 shrink-0 bg-primary" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </RevealPanel>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section data-snap className="relative min-h-screen flex items-center px-8 md:px-16 py-28">
      <RevealPanel className="max-w-6xl w-full">
        <SectionLabel index="03" title="LOADOUT" />

        <div className="mt-10 grid md:grid-cols-2 gap-10">
          <SkillBlock title="LANGUAGES" items={SKILLS.languages} accent="primary" />
          <SkillBlock title="PLATFORMS" items={SKILLS.platforms} accent="accent" />
        </div>
      </RevealPanel>
    </section>
  );
}

function SkillBlock({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: "primary" | "accent";
}) {
  const color =
    accent === "primary"
      ? "border-primary/40 text-primary"
      : "border-accent/40 text-accent";
  return (
    <div>
      <div className={`font-mono text-[10px] uppercase tracking-[0.3em] ${color}`}>
        {title}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((s) => (
          <span
            key={s}
            className={`border ${color} bg-background/60 backdrop-blur-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wider`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <section data-snap className="relative min-h-screen flex items-center px-8 md:px-16 pb-32">
      <RevealPanel className="max-w-5xl w-full">
        <SectionLabel index="04" title="OPEN CHANNEL" />

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
