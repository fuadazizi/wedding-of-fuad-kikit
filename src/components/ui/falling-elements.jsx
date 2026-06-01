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

import { useEffect, useState, useMemo, useRef, useCallback } from "react";

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

/**
 * Tracks scroll velocity with smoothing.
 * Returns a ref whose .current is the current smoothed scroll velocity.
 * Negative = scrolling up, Positive = scrolling down.
 */
function useScrollVelocity() {
  const velocityRef = useRef(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt < 1) return; // Avoid division by zero on rapid fire

      const dy = window.scrollY - lastScrollY.current;
      const rawVelocity = dy / dt; // px/ms

      // Exponential smoothing for organic feel
      velocityRef.current = velocityRef.current * 0.7 + rawVelocity * 0.3;

      lastScrollY.current = window.scrollY;
      lastTime.current = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Decay velocity toward zero when not scrolling
    let decayRaf;
    const decay = () => {
      velocityRef.current *= 0.95;
      if (Math.abs(velocityRef.current) < 0.001) {
        velocityRef.current = 0;
      }
      decayRaf = requestAnimationFrame(decay);
    };
    decayRaf = requestAnimationFrame(decay);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(decayRaf);
    };
  }, []);

  return velocityRef;
}

/**
 * FallingElements Component
 * Generates continuous falling flower petals and leaves within the page container.
 * Leaves respond to scroll velocity for a natural, wind-like effect:
 * - Scrolling down: leaves drift upward slightly (as if caught in updraft)
 * - Scrolling up: leaves fall faster (as if pushed by downdraft)
 */
export default function FallingElements({ count = 10 }) {
  const [dimensions, setDimensions] = useState({ width: 430, height: 1000 });
  const scrollVelocity = useScrollVelocity();
  const containerRef = useRef(null);
  const elementRefs = useRef([]);
  const animationState = useRef([]);
  const rafRef = useRef(null);
  const lastFrameTime = useRef(performance.now());

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: Math.min(window.innerWidth, 430),
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const elements = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const isPetal = Math.random() > 0.4; // 60% petals, 40% leaves
      const Component = COMPONENTS[
        isPetal
          ? Math.floor(Math.random() * 2)
          : 2 + Math.floor(Math.random() * 2)
      ];

      const size = Math.floor(Math.random() * 12) + 12; // 12px to 24px
      const left = Math.random() * 100; // 0% to 100%
      const delay = Math.random() * 12; // delay up to 12s
      const duration = Math.random() * 6 + 10; // 10s to 16s
      const baseSpeed = (dimensions.height + 100) / duration; // px per second

      // Sway configuration
      const swayAmplitude = Math.random() * 60 - 30; // -30px to 30px
      const swayFrequency = (2 * Math.PI) / (Math.random() * 4 + 3); // period 3s-7s

      // Rotation
      const rotateSpeed = 360 / (duration * 1.5); // degrees per second
      const initialRotation = Math.random() * 360;

      // Highly aesthetic color palette
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
  }, [count, dimensions.height]);

  // Initialize animation state for each element
  useEffect(() => {
    animationState.current = elements.map((el) => ({
      y: -50, // start above viewport
      swayTime: 0,
      rotateAngle: el.initialRotation,
      opacity: 0,
      delayRemaining: el.delay,
      active: false,
    }));
  }, [elements]);

  // Main animation loop
  const animate = useCallback(() => {
    const now = performance.now();
    const dt = (now - lastFrameTime.current) / 1000; // delta in seconds
    lastFrameTime.current = now;

    // Clamp dt to avoid huge jumps if tab was inactive
    const clampedDt = Math.min(dt, 0.1);

    // scrollVelocity.current is in px/ms. Convert to a multiplier.
    // Positive velocity = scrolling down → leaves should resist (slow down / drift up)
    // Negative velocity = scrolling up → leaves should speed up
    const sv = scrollVelocity.current;

    // Scroll influence: maps velocity to a speed multiplier.
    // Positive sv (scroll down) → negative influence → leaves slow down or rise
    // Negative sv (scroll up) → positive influence → leaves fall faster
    //
    // Tuning knobs:
    //   - multiplier (3.0): how strongly scroll affects leaves. Higher = more dramatic
    //   - clamp min (-2.5): allows leaves to actually reverse direction and rise
    //   - clamp max (3.0): max speedup when scrolling up (4x normal = 1 + 3.0)
    const SCROLL_SENSITIVITY = 0; // Set to 3.0 to re-enable scroll reactivity
    const scrollInfluence = Math.max(-2.5, Math.min(3.0, -sv * SCROLL_SENSITIVITY));

    const viewportHeight = dimensions.height;

    elements.forEach((el, i) => {
      const state = animationState.current[i];
      if (!state) return;

      // Handle initial delay
      if (state.delayRemaining > 0) {
        state.delayRemaining -= clampedDt;
        return;
      }

      state.active = true;

      // Fall speed modified by scroll
      // Base speed + scroll-influenced offset
      const effectiveSpeed = el.baseSpeed;
      state.y += effectiveSpeed * clampedDt;

      // Sway
      state.swayTime += clampedDt;
      const swayX = el.swayAmplitude * Math.sin(el.swayFrequency * state.swayTime);

      // Rotation — also affected by scroll for extra realism
      const rotateMultiplier = 1;
      state.rotateAngle += el.rotateSpeed * clampedDt * Math.max(0.3, rotateMultiplier);

      // Opacity: fade in near top, fade out near bottom
      const progress = state.y / (viewportHeight + 50);
      if (progress < 0.1) {
        state.opacity = Math.min(0.8, (progress / 0.1) * 0.8);
      } else if (progress > 0.9) {
        state.opacity = Math.max(0, ((1 - progress) / 0.1) * 0.8);
      } else {
        state.opacity = 0.8;
      }

      // Reset when fallen past viewport
      if (state.y > viewportHeight + 50) {
        state.y = -50;
        state.opacity = 0;
        state.swayTime = 0;
      }

      // If scroll pushes leaf above start, clamp it
      if (state.y < -60) {
        state.y = -50;
        state.opacity = 0;
      }

      // Apply to DOM directly for performance (bypass React render)
      const domEl = elementRefs.current[i];
      if (domEl) {
        domEl.style.transform = `translate(${swayX}px, ${state.y}px) rotate(${state.rotateAngle}deg)`;
        domEl.style.opacity = state.opacity;
      }
    });

    rafRef.current = requestAnimationFrame(animate);
  }, [elements, dimensions.height, scrollVelocity]);

  useEffect(() => {
    lastFrameTime.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
    >
      {
        elements.map((el, i) => {
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
                willChange: "transform, opacity",
              }}
            >
              <Comp className={el.color} style={{ width: "100%", height: "100%" }} />
            </div>
          );
        })
      }
    </div >
  );
}
