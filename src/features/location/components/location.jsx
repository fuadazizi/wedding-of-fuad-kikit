import { useConfig } from "@/features/invitation/hooks/use-config";
import { Clock, MapPin, CalendarCheck, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { formatEventDate } from "@/lib/format-event-date";
import { useScrollReanimate } from "@/lib/use-scroll-reanimate";

import DecorativeCard from "@/components/ui/decorative-card";

export default function Location() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const [ref, isAnimated] = useScrollReanimate(0.25);

  return (
    <>
      {/* Location section */}
      <section id="location" className="relative overflow-hidden flex flex-col justify-center">
        <div className="container mx-auto px-4 py-10 relative z-10">
          {/* Section Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center space-y-4 mb-16"
          >

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-4xl md:text-5xl font-serif text-gray-800"
            >
              Event Location
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isAnimated ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <div className="h-[1px] w-12 bg-rose-200" />
              <MapPin className="w-5 h-5 text-rose-400" />
              <div className="h-[1px] w-12 bg-rose-200" />
            </motion.div>
          </motion.div>

          {/* Location Content */}
          <div className="max-w-6xl mx-auto grid md:grid-row-2 gap-8 items-center">
            {/* Venue Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="space-y-6"
            >
              <DecorativeCard noOrnaments={true} className="text-left">
                <h3 className="text-2xl font-serif text-gray-800 mb-6">
                  {config.location}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-rose-500 mt-1" />
                    <p className="text-gray-600 flex-1">{config.address}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <CalendarCheck className="w-5 h-5 text-rose-500" />
                    <p className="text-gray-600">
                      {formatEventDate(config.date)}
                    </p>
                  </div>
                </div>
              </DecorativeCard>
            </motion.div>

            {/* Map Container */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border-8 border-white"
            >
              <iframe
                src={config.maps_embed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </motion.div>
            {/* Action Button - Full Width */}
            <div className="">
              <motion.a
                href={config.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-1.5 bg-white text-gray-600 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="font-semibold">View Map</span>
              </motion.a>
              {config.maps_notes && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-xs text-gray-500 italic text-center mt-3"
                >
                  *Note: {config.maps_notes}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
