"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STOPS } from "../_data/content";

// One keyframe per snap section: hero, each stop, contact. Keyframe i is
// reached when the scroll settles on snap section i; the mapping from scroll
// progress to curve parameter comes from the *measured* section offsets
// (snapProgressRef), so layout drift can't desync camera from snap points.
const CAMERA_KEYS = [
  new THREE.Vector3(0, 4, 18),
  ...STOPS.map(
    (s) =>
      new THREE.Vector3(
        s.worldPos[0] * 0.7,
        s.worldPos[1] + 1.5,
        s.worldPos[2] + 9
      )
  ),
  new THREE.Vector3(0, 16, -70),
];

const LOOK_KEYS = [
  new THREE.Vector3(0, 4, -2),
  ...STOPS.map((s) => new THREE.Vector3(...s.worldPos)),
  new THREE.Vector3(0, 2, -100),
];

const camCurve = new THREE.CatmullRomCurve3(CAMERA_KEYS, false, "catmullrom", 0.4);
const lookCurve = new THREE.CatmullRomCurve3(LOOK_KEYS, false, "catmullrom", 0.4);

const tmpCam = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const tmpEuler = new THREE.Euler();

/** Piecewise-linear map from scroll progress to Catmull-Rom knot parameter:
 *  measured snap progress i maps exactly onto knot i. Falls back to the
 *  identity (uniform sections) until measurements arrive. */
function progressToKnot(p: number, snaps: number[]): number {
  const n = snaps.length;
  if (n !== CAMERA_KEYS.length || n < 2) return p;
  if (p <= snaps[0]) return 0;
  if (p >= snaps[n - 1]) return 1;
  for (let i = 0; i < n - 1; i++) {
    if (p <= snaps[i + 1]) {
      const seg = (p - snaps[i]) / (snaps[i + 1] - snaps[i] || 1);
      return (i + seg) / (n - 1);
    }
  }
  return 1;
}

type Props = {
  scrollProgressRef: React.RefObject<number>;
  snapProgressRef: React.RefObject<number[]>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
};

export function CameraRig({ scrollProgressRef, snapProgressRef, mouseRef }: Props) {
  const { camera } = useThree();
  const smoothed = useRef(0);
  const targetRot = useRef({ x: 0, y: 0 });

  useEffect(() => {
    camera.position.copy(CAMERA_KEYS[0]);
    camera.lookAt(LOOK_KEYS[0]);
  }, [camera]);

  useFrame((_, dt) => {
    const t = scrollProgressRef.current ?? 0;
    smoothed.current = THREE.MathUtils.lerp(smoothed.current, t, Math.min(1, dt * 6));

    const p = THREE.MathUtils.clamp(smoothed.current, 0, 1);
    const knot = progressToKnot(p, snapProgressRef.current ?? []);
    camCurve.getPoint(knot, tmpCam);
    lookCurve.getPoint(knot, tmpLook);

    // Mouse parallax, small additive offset. Sign flipped so the camera
    // rotates *toward* the cursor rather than away.
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;
    targetRot.current.x = THREE.MathUtils.lerp(targetRot.current.x, -my * 0.08, dt * 4);
    targetRot.current.y = THREE.MathUtils.lerp(targetRot.current.y, -mx * 0.12, dt * 4);

    camera.position.copy(tmpCam);
    camera.lookAt(tmpLook);

    // Apply parallax as a post-lookAt rotation tweak
    tmpEuler.setFromQuaternion(camera.quaternion);
    tmpEuler.x += targetRot.current.x;
    tmpEuler.y += targetRot.current.y;
    camera.quaternion.setFromEuler(tmpEuler);
  });

  return null;
}
