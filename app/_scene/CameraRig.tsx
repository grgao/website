"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const CAMERA_PATH = [
  new THREE.Vector3(0, 4, 18),
  new THREE.Vector3(-3, 5, 8),
  new THREE.Vector3(2, 7, -4),
  new THREE.Vector3(6, 9, -14),
  new THREE.Vector3(-4, 11, -28),
  new THREE.Vector3(2, 14, -44),
  new THREE.Vector3(0, 18, -60),
];

const LOOK_PATH = [
  new THREE.Vector3(0, 4, 0),
  new THREE.Vector3(-2, 5, -10),
  new THREE.Vector3(2, 6, -22),
  new THREE.Vector3(8, 5, -28),
  new THREE.Vector3(-6, 5, -40),
  new THREE.Vector3(4, 6, -56),
  new THREE.Vector3(0, 4, -80),
];

const camCurve = new THREE.CatmullRomCurve3(CAMERA_PATH, false, "catmullrom", 0.4);
const lookCurve = new THREE.CatmullRomCurve3(LOOK_PATH, false, "catmullrom", 0.4);

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
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 4, 0);
  }, [camera]);

  useFrame((_, dt) => {
    const t = scrollProgressRef.current ?? 0;
    smoothed.current = THREE.MathUtils.lerp(smoothed.current, t, Math.min(1, dt * 6));

    camCurve.getPointAt(THREE.MathUtils.clamp(smoothed.current, 0, 1), tmpCam);
    lookCurve.getPointAt(THREE.MathUtils.clamp(smoothed.current, 0, 1), tmpLook);

    // Mouse parallax — small additive offset. Sign flipped so the camera
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
