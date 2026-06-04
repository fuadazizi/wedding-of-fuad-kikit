import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

const LandingPage = ({ onOpenInvitation }) => {
  const config = useConfig(); // Use hook to get config from API or fallback to static

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white" />
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-rose-100/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-pink-100/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Card Container */}
          <div className="backdrop-blur-sm bg-white/50 p-6 sm:p-8 md:p-10 rounded-2xl border border-rose-100/50 shadow-xl">

            {/* Date and Time */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="font-serif text-xl sm:text-xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400">
                13 · 06 · 2026
              </span>
            </motion.div>

            {/* Top Decorative Line */}
            <div className="flex items-center justify-center gap-3 my-6">
              <div className="h-px w-12 sm:w-16 bg-rose-200/50" />
              <div className="w-2 h-2 rounded-full bg-rose-300" />
              <div className="h-px w-12 sm:w-16 bg-rose-200/50" />
            </div>

            {/* Wedding Invitation label */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium text-center mb-1"
            >
              You're Invited to
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[12] tracking-[0.25em] uppercase text-gray-500 font-medium text-center mb-6"
            >
              Wedding of
            </motion.p>

            {/* Initials row */}
            <div className="flex justify-center items-center gap-4 sm:gap-6 py-1">
              {/* Bride Initial */}
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="font-serif text-5xl sm:text-6xl leading-none text-gray-800 drop-shadow-sm select-none"
                style={{ fontVariant: "small-caps", letterSpacing: "0.02em" }}
              >
                {config.brideName}
              </motion.span>

              {/* Ampersand */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center gap-0.5"
              >
                <span
                  className="font-serif text-xl sm:text-2xl italic text-gray-400 leading-none"
                  style={{ fontStyle: "italic" }}
                >
                  &amp;
                </span>
              </motion.div>

              {/* Groom Initial */}
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="font-serif text-5xl sm:text-6xl leading-none text-gray-800 drop-shadow-sm select-none"
                style={{ fontVariant: "small-caps", letterSpacing: "0.02em" }}
              >
                {config.groomName}
              </motion.span>
            </div>

            {/* Open Invitation Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-6 sm:mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenInvitation}
                className="group relative w-full bg-rose-500 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-xl font-medium shadow-lg hover:bg-rose-600 transition-all duration-200"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>Buka Undangan</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </motion.button>
            </motion.div>

            {/* Privacy notice */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="mt-5 text-center text-xs text-gray-400 leading-relaxed px-2 italic"
            >
              🔒 Undangan ini bersifat pribadi. Mohon tidak menyebarluaskan
              tautan ini tanpa sepengetahuan kedua mempelai karena keterbatasan
              tempat dan akses.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
