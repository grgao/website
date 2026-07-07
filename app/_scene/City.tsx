"use client";

import { useMemo } from "react";
import * as THREE from "three";

type Building = {
  position: [number, number, number];
  size: [number, number, number];
  hue: number;
  lit: number;
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateBuildings(count: number, seed = 1337): Building[] {
  const rand = seededRandom(seed);
  const buildings: Building[] = [];
  for (let i = 0; i < count; i++) {
    const radius = 20 + rand() * 90;
    const angle = rand() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = -Math.abs(Math.sin(angle) * radius) - 5;
    const w = 2 + rand() * 5;
    const d = 2 + rand() * 5;
    const h = 4 + Math.pow(rand(), 1.6) * 38;
    buildings.push({
      position: [x, h / 2 - 4, z],
      size: [w, h, d],
      hue: 0.55 + rand() * 0.15,
      lit: rand(),
    });
  }
  return buildings;
}

// Deterministic, shared by the building meshes and the window layer so
// windows land on actual building faces.
const BUILDINGS = generateBuildings(220);

export function City() {
  const spires = useMemo(
    () => BUILDINGS.filter((b) => b.size[1] > 28).slice(0, 12),
    []
  );

  return (
    <group>
      {/* Ground plane with subtle grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, -30]} receiveShadow>
        <planeGeometry args={[400, 400, 1, 1]} />
        <meshStandardMaterial color="#0d060f" roughness={1} metalness={0} />
      </mesh>

      <gridHelper
        args={[400, 80, "#3a1f4a", "#1e0e26"]}
        position={[0, -3.99, -30]}
      />

      <BuildingInstances />

      {/* Distant "spires" for silhouette interest */}
      {spires.map((b, i) => (
        <mesh
          key={`spire-${i}`}
          position={[b.position[0], b.position[1] + b.size[1] / 2 + 2, b.position[2]]}
        >
          <coneGeometry args={[0.25, 4, 4]} />
          <meshStandardMaterial color="#2a1830" />
        </mesh>
      ))}
    </group>
  );
}

function BuildingInstances() {
  const inst = useMemo(() => {
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: "#241830",
      roughness: 0.72,
      metalness: 0.18,
      emissive: "#5a2e5e",
      emissiveIntensity: 0.4,
    });
    const mesh = new THREE.InstancedMesh(geom, mat, BUILDINGS.length);
    const m = new THREE.Matrix4();
    const color = new THREE.Color();
    BUILDINGS.forEach((b, i) => {
      m.makeScale(b.size[0], b.size[1], b.size[2]);
      m.setPosition(b.position[0], b.position[1], b.position[2]);
      mesh.setMatrixAt(i, m);
      // Warm plum to cool violet tint variation
      color.setHSL(0.83 + (b.hue - 0.55) * 0.4, 0.35, 0.06 + b.lit * 0.05);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    return mesh;
  }, []);

  return <primitive object={inst} />;
}

/** Emissive window dots placed on actual building faces. */
export function CityWindows({ count = 1400, seed = 4242 }: { count?: number; seed?: number }) {
  const inst = useMemo(() => {
    const rand = seededRandom(seed);
    const geom = new THREE.PlaneGeometry(0.18, 0.18);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.InstancedMesh(geom, mat, count);
    const m = new THREE.Matrix4();
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const b = BUILDINGS[Math.floor(rand() * BUILDINGS.length)];
      const [bx, by, bz] = b.position;
      const [w, h, d] = b.size;
      const y = by - h / 2 + (0.08 + rand() * 0.84) * h;

      // Pick one of the four faces, offset just outside it.
      const face = Math.floor(rand() * 4);
      let x = bx;
      let z = bz;
      let rotY = 0;
      if (face < 2) {
        x = bx + (rand() - 0.5) * w * 0.8;
        z = face === 0 ? bz + d / 2 + 0.03 : bz - d / 2 - 0.03;
      } else {
        z = bz + (rand() - 0.5) * d * 0.8;
        x = face === 2 ? bx + w / 2 + 0.03 : bx - w / 2 - 0.03;
        rotY = Math.PI / 2;
      }
      m.makeRotationY(rotY);
      m.setPosition(x, y, z);
      mesh.setMatrixAt(i, m);

      const choice = rand();
      if (choice < 0.5) color.setHex(0xff90c8); // hot pink
      else if (choice < 0.75) color.setHex(0xc98cff); // lavender
      else if (choice < 0.9) color.setHex(0x8be9ff); // cyan pop
      else color.setHex(0xffe4a0); // rare warm highlight
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    return mesh;
  }, [count, seed]);

  return <primitive object={inst} />;
}
