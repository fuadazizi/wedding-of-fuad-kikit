import { useRef, useEffect } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { MapPin, CalendarCheck, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { formatEventDate } from "@/lib/format-event-date";
import { useScrollReanimate } from "@/lib/use-scroll-reanimate";

import DecorativeCard from "@/components/ui/decorative-card";

// Helper to extract coordinates from Google Maps embed URL
function getCoordsFromGmapsEmbed(embedUrl) {
  if (!embedUrl) return null;
  const latMatch = embedUrl.match(/!3d(-?\d+\.\d+)/);
  const lngMatch = embedUrl.match(/!2d(-?\d+\.\d+)/);
  if (latMatch && lngMatch) {
    return [parseFloat(latMatch[1]), parseFloat(lngMatch[1])];
  }
  return null;
}

export default function Location() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const [ref, isAnimated] = useScrollReanimate(0.25);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Check if Leaflet is loaded
    if (!window.L || !mapRef.current) return;

    // Clean up any existing map instance first
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const hasExplicitCoords = config.maps_latitude && config.maps_longitude;
    const coords = hasExplicitCoords
      ? [parseFloat(config.maps_latitude), parseFloat(config.maps_longitude)]
      : getCoordsFromGmapsEmbed(config.maps_embed) || [-6.990835, 107.592897];

    // Initialize map
    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false, // Prevent zoom on scroll (better UX on mobile/one-page)
    }).setView(coords, 16);

    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Setup custom marker icon using absolute CDN links to fix missing marker assets
    const customIcon = window.L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Add marker
    const marker = window.L.marker(coords, { icon: customIcon }).addTo(map);

    // Bind popup
    if (config.location) {
      marker.bindPopup(`<div style="font-family: inherit; font-size: 14px;"><strong style="color: #1f2937;">${config.location}</strong><br/><span style="color: #4b5563;">${config.address || ""}</span></div>`).openPopup();
    }

    // Handle Framer Motion transition delay
    const resizeTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 1000);

    return () => {
      clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [config.maps_embed, config.location, config.address]);

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
              className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border-8 border-white relative z-0"
            >
              <div ref={mapRef} className="w-full h-full" />
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
                <span className="font-semibold">Petunjuk Arah</span>
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
