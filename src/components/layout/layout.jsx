import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, PauseCircle, PlayCircle, Volume2, Volume1, VolumeX } from "lucide-react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import BottomBar from "@/components/layout/bottom-bar";
import FallingElements from "@/components/ui/falling-elements";

import { useScrollReanimate } from "@/lib/use-scroll-reanimate";

/**
 * Layout component that wraps the main invitation content.
 * Handles music playback controls and navigation.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Object} props.audioControls - Audio controls from useAudio hook
 * @param {boolean} props.audioControls.isPlaying - Whether audio is playing
 * @param {Function} props.audioControls.toggle - Toggle audio play/pause
 */
const Layout = ({ children, audioControls }) => {
  const config = useConfig();
  const [showToast, setShowToast] = useState(false);
  const [footerRef, isFooterAnimated] = useScrollReanimate(0.25);
  const [showSlider, setShowSlider] = useState(false);

  const { isPlaying, toggle, volume = 0.7, changeVolume } = audioControls || {};

  // Show toast when audio starts playing
  useEffect(() => {
    if (isPlaying) {
      setShowToast(true);
      const timer = setTimeout(
        () => setShowToast(false),
        config.audio?.toastDuration || 3000,
      );
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [isPlaying, config.audio?.toastDuration]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <motion.div
        className="mx-auto w-full max-w-[430px] min-h-screen bg-white relative overflow-hidden border border-gray-200 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FallingElements />
        {/* Music Control Capsule with Status Indicator */}
        {toggle && (
          <motion.div
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full shadow-md border border-rose-100/40 flex items-center gap-2 text-rose-500"
            onMouseEnter={() => setShowSlider(true)}
            onMouseLeave={() => setShowSlider(false)}
          >
            {/* Volume Control Group (Placed on the left) */}
            <motion.div layout className="flex items-center gap-1.5">
              {/* Slider (Animated slide-out) */}
              <AnimatePresence>
                {showSlider && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 70, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden flex items-center"
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => {
                        changeVolume(parseFloat(e.target.value));
                      }}
                      className="w-16 h-1 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, #f43f5e 0%, #f43f5e ${volume * 100}%, #ffe4e6 ${volume * 100}%, #ffe4e6 100%)`
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                layout="position"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSlider(!showSlider);
                }}
                className="flex items-center justify-center focus:outline-none text-rose-400 hover:text-rose-600 transition-colors"
                aria-label="Volume settings"
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : volume < 0.4 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </motion.button>
            </motion.div>

            {/* Visual Separator */}
            <motion.span
              layout="position"
              className="w-[1px] h-4 bg-rose-200/50"
            />

            {/* Play/Pause Button (Placed on the right) */}
            <motion.button
              layout="position"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggle}
              className="flex items-center justify-center focus:outline-none"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? (
                <div className="relative flex items-center justify-center">
                  <PauseCircle className="w-6 h-6 text-rose-500" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              ) : (
                <PlayCircle className="w-6 h-6 text-rose-500" />
              )}
            </motion.button>
          </motion.div>
        )}

        <main className="relative h-full w-full pb-[100px]">
          {children}

          {/* Footer Credit */}
          <motion.footer
            ref={footerRef}
            initial={{ opacity: 0 }}
            animate={isFooterAnimated ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center py-6 border-t border-gray-100 bg-white"
            style={{ zIndex: 10 }}
          >
            <p className="text-[11px] text-gray-600 tracking-wide">
              Developed with love ❤️ by{" "}
              <span className="font-medium text-gray-500">Fuad</span>
            </p>
          </motion.footer>
        </main>
        <BottomBar />

        {/* Music Info Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-black/80 text-white transform -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-sm flex items-center space-x-2">
                <Music className="w-4 h-4 animate-pulse" />
                <span className="text-sm whitespace-nowrap">
                  {config.audio?.title || "Background Music"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Layout;
