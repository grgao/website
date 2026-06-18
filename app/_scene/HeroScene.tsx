"use client";

import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { City, CityWindows } from "./City";
import { CameraRig } from "./CameraRig";
import { Hotspot } from "./Hotspot";
import { EXPERIENCES } from "../_data/content";

type Props = {
  scrollProgressRef: React.RefObject<number>;
  scrollVelocityRef: React.RefObject<number>;
};

export function HeroScene({ scrollProgressRef, scrollVelocityRef }: Props) {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const chromaOffset = useMemo(() => new Vector2(0.001, 0.001), []);

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 55, near: 0.1, far: 400 }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.FogExp2(0x0a0f1a, 0.012);
        scene.background = new THREE.Color(0x070b14);
      }}
    >
      <ambientLight intensity={0.6} color="#7d88aa" />
      <directionalLight
        position={[5, 18, 10]}
        intensity={1.3}
        color="#ffb775"
      />
      <directionalLight
        position={[-12, 8, -20]}
        intensity={0.9}
        color="#6fc4ff"
      />
      <hemisphereLight args={["#a9c0ff", "#0a0f1c", 0.4]} />

      <City />
      <CityWindows />

      {EXPERIENCES.map((exp) => (
        <Hotspot key={exp.id} exp={exp} />
      ))}

      <CameraRig scrollProgressRef={scrollProgressRef} mouseRef={mouseRef} />

      <EffectComposer multisampling={0}>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={chromaOffset}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
        <Noise opacity={0.04} />
        <VelocityChroma
          scrollVelocityRef={scrollVelocityRef}
          chromaOffset={chromaOffset}
        />
      </EffectComposer>
    </Canvas>
  );
}

/**
 * Tiny passthrough that mutates the chroma offset uniform every frame
 * based on scroll velocity. Sits inside the EffectComposer to share the
 * Vector2 reference with the ChromaticAberration pass.
 */
import { useFrame } from "@react-three/fiber";
function VelocityChroma({
  scrollVelocityRef,
  chromaOffset,
}: {
  scrollVelocityRef: React.RefObject<number>;
  chromaOffset: Vector2;
}) {
  useFrame(() => {
    const v = Math.min(Math.abs(scrollVelocityRef.current ?? 0) / 40, 1);
    const target = 0.0008 + v * 0.012;
    chromaOffset.x += (target - chromaOffset.x) * 0.15;
    chromaOffset.y += (target * 0.6 - chromaOffset.y) * 0.15;
  });
  return null;
}
