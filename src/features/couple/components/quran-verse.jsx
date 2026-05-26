import { motion } from "framer-motion";
import { Calendar, Clock, Heart } from "lucide-react";
import { useState } from "react";

import { useScrollReanimate } from "@/lib/use-scroll-reanimate";

export default function QuranVerse() {
  const [ref, isAnimated] = useScrollReanimate(0.25);

  const FloatingHearts = () => {
    const [hearts] = useState(() =>
      [...Array(8)].map((_, i) => ({
        size: Math.floor(Math.random() * 2) + 4,
        color:
          i % 3 === 0
            ? "text-rose-400"
            : i % 3 === 1
              ? "text-pink-400"
              : "text-red-400",
        initialX: Math.random() * 60 - 30,
        animateX: Math.random() * 100 - 50,
      })),
    );

    return (
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        {hearts.map((heart, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: heart.initialX,
              y: 20,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              x: heart.animateX,
              y: -80,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
            className="absolute"
          >
            <Heart
              className={heart.color}
              style={{
                width: `${heart.size * 3}px`,
                height: `${heart.size * 3}px`,
              }}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section id="quranverse" className="relative z-10 px-4 py-12 flex flex-col items-center justify-center min-h-[100dvh]">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Decorative top line */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-rose-300/60" />
          <div className="w-2 h-2 rounded-full bg-rose-300" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-rose-300/60" />
        </div>

        <div className="relative rounded-2xl border border-rose-100/60 bg-gradient-to-b from-rose-50/60 to-white/80 backdrop-blur-sm px-6 py-8 text-center shadow-sm">
          {/* Ornamental corners */}
          <span className="absolute top-3 left-4 text-rose-200 text-2xl select-none">
            ❧
          </span>
          <span
            className="absolute top-3 right-4 text-rose-200 text-2xl select-none"
            style={{ transform: "scaleX(-1)" }}
          >
            ❧
          </span>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-rose-200" />
            <span className="text-rose-300 text-xs">✦</span>
            <div className="flex-1 h-px bg-rose-200" />
          </div>

          {/* Translation */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-gray-600 text-sm sm:text-base leading-relaxed italic"
          >
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
            pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
            dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
            kasih dan sayang."
          </motion.p>

          {/* Source */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isAnimated ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mt-4 text-xs text-rose-400 font-medium tracking-widest uppercase"
          >
            QS. Ar-Rūm: 21
          </motion.p>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-rose-200" />
            <span className="text-rose-300 text-xs">✦</span>
            <div className="flex-1 h-px bg-rose-200" />
          </div>

          {/* Bottom ornamental corners */}
          <span
            className="absolute bottom-3 left-4 text-rose-200 text-2xl select-none"
            style={{ transform: "rotate(180deg) scaleX(-1)" }}
          >
            ❧
          </span>
          <span
            className="absolute bottom-3 right-4 text-rose-200 text-2xl select-none"
            style={{ transform: "rotate(180deg)" }}
          >
            ❧
          </span>
        </div>

        {/* Decorative bottom line */}
        <div className="flex items-center gap-3 mt-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-rose-300/60" />
          <div className="w-2 h-2 rounded-full bg-rose-300" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-rose-300/60" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pt-6 relative"
      >
        <FloatingHearts />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart
            className="w-10 sm:w-12 h-10 sm:h-12 text-rose-500 mx-auto"
            fill="currentColor"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
