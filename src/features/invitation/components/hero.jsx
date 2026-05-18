import { Calendar, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { getGuestName } from "@/lib/invitation-storage";

export default function Hero() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    // Get guest name from localStorage
    const storedGuestName = getGuestName();
    if (storedGuestName) {
      setGuestName(storedGuestName);
    }
  }, []);

  const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
          jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
          menit: Math.floor((difference / 1000 / 60) % 60),
          detik: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }, [targetDate]);

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {Object.keys(timeLeft).map((interval) => (
          <motion.div
            key={interval}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-rose-100"
          >
            <span className="text-xl sm:text-2xl font-bold text-rose-600">
              {timeLeft[interval]}
            </span>
            <span className="text-xs text-gray-500 capitalize">{interval}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-4 text-center relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 relative z-10"
        >
          <div className="space-y-4">
            {/* Decorative label */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-rose-400/80 font-light"
            >
              The Wedding of
            </motion.p>

            {/* Monogram block */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
              className="relative flex flex-col items-center gap-1"
            >
              {/* Decorative top rule */}
              <div className="flex items-center gap-3 w-full max-w-[280px] sm:max-w-xs">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-rose-300/60" />
                <div className="w-1 h-1 rounded-full bg-rose-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <div className="w-1 h-1 rounded-full bg-rose-300" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-rose-300/60" />
              </div>

              {/* Couple Names */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center space-y-4"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-800 leading-tight py-4">
                    {config.groomName}
                    <span className="text-rose-400 mx-2 sm:mx-3">&</span>
                    {config.brideName}
                  </h1>
                </div>
              </motion.div>

              {/* Decorative bottom rule */}
              <div className="flex items-center gap-3 w-full max-w-[280px] sm:max-w-xs">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-rose-300/60" />
                <div className="w-1 h-1 rounded-full bg-rose-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <div className="w-1 h-1 rounded-full bg-rose-300" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-rose-300/60" />
              </div>

              {/* Soft glow backdrop */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-radial from-rose-300 to-transparent rounded-full" />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-white/50 backdrop-blur-md rounded-2xl" />

            <div className="relative px-4 sm:px-8 py-8 sm:py-10 rounded-2xl border border-rose-100/50">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px">
                <div className="w-20 sm:w-32 h-[2px] bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
              </div>

              <div className="space-y-6 text-center">
                <div className="space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="inline-block mx-auto"
                  >
                    <span className="px-4 py-1 text-sm bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                      Save the date!
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-px w-6 bg-gradient-to-r from-transparent to-rose-300" />
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      <div className="h-px w-6 bg-gradient-to-l from-transparent to-rose-300" />
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400">
                      13 · 06 · 2026
                    </span>
                  </motion.div>

                  {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Clock className="w-4 h-4 text-rose-400" />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      {config.time}
                    </span>
                  </motion.div> */}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-8 sm:w-12 bg-rose-200/50" />
                  <div className="w-2 h-2 rounded-full bg-rose-200" />
                  <div className="h-px w-8 sm:w-12 bg-rose-200/50" />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-2"
                >
                  <p className="text-gray-500 font-serif italic text-sm">
                    Kepada Yth.
                  </p>
                  <p className="text-gray-600 font-medium text-sm">
                    Bapak/Ibu/Saudara/i
                  </p>
                  <p className="text-rose-500 font-semibold text-lg">
                    {guestName || "Tamu Undangan"}
                  </p>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px">
                <div className="w-20 sm:w-32 h-[2px] bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
              </div>
            </div>

            <div className="absolute -top-2 -right-2 w-16 sm:w-24 h-16 sm:h-24 bg-rose-100/20 rounded-full blur-xl" />
            <div className="absolute -bottom-2 -left-2 w-16 sm:w-24 h-16 sm:h-24 bg-rose-100/20 rounded-full blur-xl" />
          </motion.div>

          <CountdownTimer targetDate={config.date} />

        </motion.div>
      </section>
    </>
  );
}
