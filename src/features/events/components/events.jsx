import EventCards from "@/features/events/components/events-card";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useScrollReanimate } from "@/lib/use-scroll-reanimate";

export default function Events() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const [ref, isAnimated] = useScrollReanimate(0.25);

  return (
    <>
      {/* Event Section */}
      <section id="event" className="relative overflow-hidden z-10 flex flex-col justify-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isAnimated ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 1.0 }}
          className="relative z-10 container mx-auto px-4 py-10"
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 1.0 }}
            className="text-center space-y-4 mb-16"
          >

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1.0, duration: 1.0 }}
              className="text-4xl md:text-5xl font-serif text-gray-800 leading-tight"
            >
              Walimah
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 1.2, duration: 1.0 }}
              className="text-gray-500 max-w-md mx-auto"
            >
              Kami turut mengundang Anda untuk merayakan hari istimewa kami sebagai awal
              perjalanan cinta kami
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isAnimated ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 1.4, duration: 1.0 }}
              className="flex items-center justify-center gap-4 mt-6"
            >
              <div className="h-[1px] w-12 bg-rose-200" />
              <div className="text-rose-400">
                <Heart className="w-4 h-4" fill="currentColor" />
              </div>
              <div className="h-[1px] w-12 bg-rose-200" />
            </motion.div>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 1.6, duration: 1.0 }}
            className="max-w-2xl mx-auto"
          >
            <EventCards events={config.agenda} title={config.title} gmaps={config.gmaps_name} />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
