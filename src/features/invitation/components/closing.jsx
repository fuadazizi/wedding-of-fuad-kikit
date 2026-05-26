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

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { useScrollReanimate } from "@/lib/use-scroll-reanimate";

/**
 * Closing component that appears at the very end of the wedding invitation.
 * Displays a thank you message, hope for attendance, and couple names.
 */
export default function Closing() {
  const config = useConfig();
  const [ref, isAnimated] = useScrollReanimate(0.25);

  return (
    <section className="min-h-[100dvh] px-6 py-10 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-transparent to-rose-50/20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md text-center space-y-8 relative z-10"
      >
        {/* Top Ornament */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-rose-300" />
          <span className="text-rose-400 text-lg">❀</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-rose-300" />
        </div>

        {/* Message */}
        <div className="space-y-4 px-2">
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
          </p>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
            Atas kehadiran dan doa restunya, kami mengucapkan terima kasih yang sebesar-besarnya.
          </p>
        </div>

        {/* Closing Greeting */}
        <div className="space-y-2 pt-2">
          <p className="text-rose-400 font-serif italic text-sm tracking-wide">
            {"Wassalamu'alaikum Warahmatullahi Wabarakatuh"}
          </p>
        </div>

        {/* Divider with Heart */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-rose-200" />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
          </motion.div>
          <div className="h-[1px] w-8 bg-rose-200" />
        </div>

        {/* Couple Names */}
        <div className="space-y-2">
          <p className="text-gray-500 text-xs tracking-widest uppercase">Kami yang berbahagia,</p>
          <h3 className="text-3xl sm:text-4xl font-serif text-gray-800 py-2">
            {config.brideName} <span className="text-rose-400">&</span> {config.groomName}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">Beserta Keluarga</p>
        </div>

        {/* Decorative corner symbols */}
        <span className="absolute -top-6 left-2 text-rose-200 text-3xl select-none opacity-40">❧</span>
        <span className="absolute -top-6 right-2 text-rose-200 text-3xl select-none opacity-40" style={{ transform: "scaleX(-1)" }}>❧</span>
      </motion.div>

      {/* Soft background glow decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-100/10 rounded-full blur-3xl -z-10" />
    </section>
  );
}
