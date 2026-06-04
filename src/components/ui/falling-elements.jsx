/**
 * Copyright (c) 2024-present mrofisr
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useState, useMemo, useRef } from "react";

// Custom SVG Shapes for a premium aesthetic
const Petal1 = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12,21 C15.5,21 18,17.5 18,13 C18,8 15,3 12,3 C9,3 6,8 6,13 C6,17.5 8.5,21 12,21 Z" />
  </svg>
);

const Petal2 = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12,2 C16.5,4 19,8 18,12 C17,16 13,20 11,21 C9,22 7,20 6.5,18 C5.5,14 7,8 12,2 Z" />
  </svg>
);

const Leaf1 = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M17,8 C14,11 12,15 12,19 C12,15 10,11 7,8 C10,6 12,4 12,2 C12,4 14,6 17,8 Z" />
  </svg>
);

const Leaf2 = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12,2 C16,5.5 17.5,11.5 14,16.5 C11,20.5 6,21.5 4,17.5 C2,13.5 5.5,7 12,2 Z" />
  </svg>
);

const COMPONENTS = [Petal1, Petal2, Leaf1, Leaf2];

// Pre-compute sin table untuk menghindari Math.sin setiap frame
const SIN_TABLE_SIZE = 1024;
const SIN_TABLE = new Float32Array(SIN_TABLE_SIZE);
for (let i = 0; i < SIN_TABLE_SIZE; i++) {
  SIN_TABLE[i] = Math.sin((i / SIN_TABLE_SIZE) * Math.PI * 2);
}
function fastSin(angle) {
  // angle dalam radian
  const idx = ((angle % (Math.PI * 2)) / (Math.PI * 2)) * SIN_TABLE_SIZE;
  return SIN_TABLE[(idx + SIN_TABLE_SIZE) % SIN_TABLE_SIZE | 0];
}

/**
 * FallingElements Component
 * Generates continuous falling flower petals and leaves within the page container.
 */
export default function FallingElements({ count = 20 }) {
  // FIX #4: Simpan dimensions di ref, bukan state
  // → tidak trigger re-render → tidak recreate elements/animate
  const dimensionsRef = useRef({ width: 430, height: 1000 });
  const [, forceUpdate] = useState(0); // hanya untuk inisialisasi awal

  const containerRef = useRef(null);
  const elementRefs = useRef([]);
  const animationState = useRef([]);
  const rafRef = useRef(null);
  const lastFrameTime = useRef(null);

  // FIX #3: Simpan animate di ref agar tidak pernah recreate
  const animateRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      dimensionsRef.current = {
        width: Math.min(window.innerWidth, 430),
        height: window.innerHeight,
      };
    };
    updateDimensions();
    forceUpdate(n => n + 1); // trigger render pertama dengan dimensi yang benar

    window.addEventListener("resize", updateDimensions, { passive: true });
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const elements = useMemo(() => {
    const height = dimensionsRef.current.height;
    return Array.from({ length: count }).map((_, i) => {
      const isPetal = Math.random() > 0.4;
      const Component = COMPONENTS[
        isPetal
          ? Math.floor(Math.random() * 2)
          : 2 + Math.floor(Math.random() * 2)
      ];

      const size = Math.floor(Math.random() * 12) + 12;
      const left = Math.random() * 100;
      const delay = Math.random() * 12;
      const duration = Math.random() * 6 + 10;
      const baseSpeed = (height + 60) / duration;

      // FIX: Kurangi amplitude sway agar tidak terlalu jauh ke kanan
      const swayAmplitude = Math.random() * 30 - 15;
      const swayFrequency = (2 * Math.PI) / (Math.random() * 4 + 3);

      const rotateSpeed = 360 / (duration * 1.5);
      const initialRotation = Math.random() * 360;

      const petalColors = [
        "text-rose-200",
        "text-pink-200",
        "text-rose-300",
        "text-pink-300",
      ];
      const leafColors = [
        "text-emerald-100",
        "text-green-200",
        "text-amber-100",
        "text-emerald-200",
      ];
      const color = isPetal
        ? petalColors[Math.floor(Math.random() * petalColors.length)]
        : leafColors[Math.floor(Math.random() * leafColors.length)];

      return {
        id: i,
        Component,
        size,
        left,
        delay,
        duration,
        baseSpeed,
        swayAmplitude,
        swayFrequency,
        rotateSpeed,
        initialRotation,
        color,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]); // FIX #1: hapus dimensionsRef dari dependency → elements tidak recreate saat resize

  // Initialize animation state
  useEffect(() => {
    animationState.current = elements.map((el) => ({
      y: -50,
      swayTime: 0,
      rotateAngle: el.initialRotation,
      opacity: 0,
      delayRemaining: el.delay,
      active: false,
    }));
  }, [elements]);

  // FIX #3: animate disimpan di ref → tidak pernah recreate → RAF tidak pernah restart
  useEffect(() => {
    animateRef.current = () => {
      const now = performance.now();

      // FIX #2: lastFrameTime diinisialisasi di sini jika null
      // → tidak ada gap dt besar saat pertama jalan
      if (lastFrameTime.current === null) {
        lastFrameTime.current = now;
      }

      const dt = (now - lastFrameTime.current) / 1000;
      lastFrameTime.current = now;

      // FIX #2: Clamp dt lebih ketat (60fps = 0.016s, beri toleransi 3 frame)
      // Ini mencegah lompatan besar saat tab background atau scroll freeze
      const clampedDt = Math.min(dt, 0.05);

      const viewportHeight = dimensionsRef.current.height; // FIX #4: baca dari ref

      const stateArr = animationState.current;
      const refs = elementRefs.current;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const state = stateArr[i];
        if (!state) continue;

        if (state.delayRemaining > 0) {
          state.delayRemaining -= clampedDt;
          continue;
        }

        state.active = true;
        state.y += el.baseSpeed * clampedDt;
        state.swayTime += clampedDt;

        // FIX #5: Gunakan fastSin (lookup table) ganti Math.sin
        const swayX = el.swayAmplitude * fastSin(el.swayFrequency * state.swayTime);

        state.rotateAngle += el.rotateSpeed * clampedDt;

        const progress = state.y / (viewportHeight + 50);
        if (progress < 0.1) {
          state.opacity = Math.min(0.8, (progress / 0.1) * 0.8);
        } else if (progress > 0.9) {
          state.opacity = Math.max(0, ((1 - progress) / 0.1) * 0.8);
        } else {
          state.opacity = 0.8;
        }

        if (state.y > viewportHeight + 50) {
          state.y = -50;
          state.opacity = 0;
          state.swayTime = 0;
        }

        const domEl = refs[i];
        if (domEl) {
          // FIX: Gunakan transform3d untuk paksa GPU compositing layer
          domEl.style.transform = `translate3d(${swayX}px, ${state.y}px, 0) rotate(${state.rotateAngle}deg)`;
          domEl.style.opacity = state.opacity;
        }
      }

      rafRef.current = requestAnimationFrame(animateRef.current);
    };
  }, [elements]);

  // FIX #3: RAF hanya distart sekali, tidak bergantung pada `animate` function identity
  useEffect(() => {
    lastFrameTime.current = null; // reset supaya dt tidak loncat saat mount
    rafRef.current = requestAnimationFrame(animateRef.current);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []); // ← dependency array kosong, RAF hanya start/stop sekali

  return (
    <div
      ref={containerRef}
      className="fixed inset-y-0 left-1/2 w-full max-w-[430px] pointer-events-none overflow-hidden"
      style={{
        zIndex: 5,
        // FIX #4: Force GPU layer di container → browser composite di GPU
        // tidak ikut repaint saat scroll
        transform: "translateX(-50%) translateZ(0)",
        willChange: "transform",
      }}
    >
      {elements.map((el, i) => {
        const Comp = el.Component;
        return (
          <div
            key={el.id}
            ref={(node) => { elementRefs.current[i] = node; }}
            style={{
              position: "absolute",
              left: `${el.left}%`,
              width: el.size,
              height: el.size,
              opacity: 0,
              // FIX #4: Setiap elemen juga di GPU layer sendiri
              willChange: "transform, opacity",
              // FIX: backface-visibility untuk stabilisasi rendering di mobile
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <Comp className={el.color} style={{ width: "100%", height: "100%" }} />
          </div>
        );
      })}
    </div>
  );
}
