import { useEffect, useRef, useState } from "react";

/**
 * A custom hook to handle scroll-based re-animations.
 * - If the element is in the viewport: isAnimated is true.
 * - If the element goes above the viewport (scrolling down): isAnimated remains true.
 * - If the element goes below the viewport (scrolling up): isAnimated resets to false.
 *
 * @param {number} threshold - The intersection threshold (default: 0.25).
 * @returns {[React.RefObject, boolean]} An array containing the ref to attach to the element and the animation state.
 */
export function useScrollReanimate(threshold = 0.3) {
  const ref = useRef(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnimated(true);
        } else {
          const rect = entry.boundingClientRect;
          if (rect.top < 0) {
            // The element is above the viewport (scrolled past it downwards)
            setIsAnimated(true);
          } else {
            // The element is below the viewport (scrolled past it upwards)
            setIsAnimated(false);
          }
        }
      },
      {
        threshold,
      },
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  }, [threshold]);

  return [ref, isAnimated];
}
