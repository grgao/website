"use client";

import dynamic from "next/dynamic";
import { HudFrame } from "./_components/HudFrame";
import { HudHeader } from "./_components/HudHeader";
import { HudFooter } from "./_components/HudFooter";
import { Reticle } from "./_components/Reticle";
import {
  HeroSection,
  AboutSection,
  ExperienceSection,
  SkillsSection,
  ContactSection,
} from "./_components/Sections";
import { useScrollProgress } from "./_hooks/useScrollProgress";

const HeroScene = dynamic(
  () => import("./_scene/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export default function Home() {
  const { progressRef, velocityRef } = useScrollProgress();

  return (
    <main className="relative">
      {/* Sticky 3D canvas — stays pinned while content scrolls over it */}
      <div className="sticky top-0 h-svh w-full z-(--z-canvas)">
        <HeroScene
          scrollProgressRef={progressRef}
          scrollVelocityRef={velocityRef}
        />
      </div>

      {/* Scroll content layered above the canvas. -mt pulls it back over the sticky parent. */}
      <div className="relative z-(--z-content) -mt-[100svh]">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
      </div>

      {/* Persistent HUD chrome */}
      <Reticle />
      <HudHeader />
      <HudFooter />
      <HudFrame />
    </main>
  );
}
