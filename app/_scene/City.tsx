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

export function City() {
  const buildings = useMemo(() => generateBuildings(220), []);

  const { positions, scales, colors } = useMemo(() => {
    const p = new Float32Array(buildings.length * 3);
    const s = new Float32Array(buildings.length * 3);
    const c = new Float32Array(buildings.length * 3);
    const color = new THREE.Color();
    buildings.forEach((b, i) => {
      p[i * 3] = b.position[0];
      p[i * 3 + 1] = b.position[1];
      p[i * 3 + 2] = b.position[2];
      s[i * 3] = b.size[0];
      s[i * 3 + 1] = b.size[1];
      s[i * 3 + 2] = b.size[2];
      color.setHSL(b.hue, 0.05, 0.06 + b.lit * 0.05);
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    });
    return { positions: p, scales: s, colors: c };
  }, [buildings]);

  const { instMatrix, instColor } = useMemo(() => {
    const m = new THREE.Matrix4();
    const matrices: number[] = [];
    const colorsArr: number[] = [];
    const color = new THREE.Color();
    for (let i = 0; i < buildings.length; i++) {
      m.makeScale(scales[i * 3], scales[i * 3 + 1], scales[i * 3 + 2]);
      m.setPosition(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      matrices.push(...m.elements);
      color.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
      colorsArr.push(color.r, color.g, color.b);
    }
    return { instMatrix: matrices, instColor: colorsArr };
  }, [buildings, positions, scales, colors]);

  return (
    <group>
      {/* Ground plane with subtle grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, -30]} receiveShadow>
        <planeGeometry args={[400, 400, 1, 1]} />
        <meshStandardMaterial
          color="#0d060f"
          roughness={1}
          metalness={0}
        />
      </mesh>

      <gridHelper
        args={[400, 80, "#3a1f4a", "#1e0e26"]}
        position={[0, -3.99, -30]}
      />

      {/* Buildings as instanced meshes — single draw call */}
      <BuildingInstances buildings={buildings} />

      {/* Distant "spires" for silhouette interest */}
      {buildings
        .filter((b) => b.size[1] > 28)
        .slice(0, 12)
        .map((b, i) => (
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

function BuildingInstances({ buildings }: { buildings: Building[] }) {
  const meshRef = useMemo(() => {
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: "#241830",
      roughness: 0.72,
      metalness: 0.18,
      emissive: "#5a2e5e",
      emissiveIntensity: 0.4,
    });
    const inst = new THREE.InstancedMesh(geom, mat, buildings.length);
    const m = new THREE.Matrix4();
    const color = new THREE.Color();
    buildings.forEach((b, i) => {
      m.makeScale(b.size[0], b.size[1], b.size[2]);
      m.setPosition(b.position[0], b.position[1], b.position[2]);
      inst.setMatrixAt(i, m);
      // Warm plum → cool violet tint variation
      color.setHSL(0.83 + (b.hue - 0.55) * 0.4, 0.35, 0.06 + b.lit * 0.05);
      inst.setColorAt(i, color);
    });
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    return inst;
  }, [buildings]);

  return <primitive object={meshRef} />;
}

/** Emissive window dots layered as a separate instanced mesh */
export function CityWindows({ count = 1400, seed = 4242 }: { count?: number; seed?: number }) {
  const inst = useMemo(() => {
    const rand = seededRandom(seed);
    const geom = new THREE.PlaneGeometry(0.18, 0.18);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffd089,
      transparent: true,
      opacity: 0.95,
      toneMapped: false,
    });
    const mesh = new THREE.InstancedMesh(geom, mat, count);
    const m = new THREE.Matrix4();
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const radius = 20 + rand() * 90;
      const angle = rand() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = -Math.abs(Math.sin(angle) * radius) - 5;
      const h = 4 + Math.pow(rand(), 1.6) * 38;
      const y = -4 + rand() * h;
      const facing = rand() > 0.5 ? 0 : Math.PI / 2;
      m.makeRotationY(facing);
      m.setPosition(x + (Math.cos(facing) * 2.4), y, z + (Math.sin(facing) * 2.4));
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
