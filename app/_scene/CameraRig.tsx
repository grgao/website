"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STOPS } from "../_data/content";

// One keyframe per snap section: hero, each stop, contact.
// The page has (STOPS.length + 2) equal-height snap sections, so snap i
// lands at progress i / (n - 1), which is exactly where getPoint(t)
// places keyframe i on a Catmull-Rom curve (uniform by knot, not arc
// length). That alignment is what parks the camera on each stop's box.
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

type Props = {
  scrollProgressRef: React.RefObject<number>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
};

export function CameraRig({ scrollProgressRef, mouseRef }: Props) {
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
    camCurve.getPoint(p, tmpCam);
    lookCurve.getPoint(p, tmpLook);

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
