import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";
import { useConfig } from "@/features/invitation";
import groomPhoto from "../../../assets/images/pria.png";
import bridePhoto from "../../../assets/images/wanita.png";

function PersonCard({ fullName, shortName, parentName, ig, text, side, delay = 0 }) {
  const isGroom = side === "groom";
  const photo = isGroom ? groomPhoto : bridePhoto;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="flex flex-col items-center gap-4"
    >
      {/* Photo avatar */}
      <div className="relative">
        {/* Gradient ring */}
        <div
          className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full p-[3px] shadow-lg ${
            isGroom
              ? "bg-gradient-to-br from-rose-300 via-rose-500 to-pink-600"
              : "bg-gradient-to-br from-pink-300 via-pink-500 to-rose-600"
          }`}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img
              src={photo}
              alt={fullName ?? shortName}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
          </div>
        </div>

        {/* Role badge */}
        <span
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-medium rounded-full whitespace-nowrap shadow-sm ${
            isGroom
              ? "bg-rose-500 text-white"
              : "bg-pink-500 text-white"
          }`}
        >
          {isGroom ? "Mempelai Pria" : "Mempelai Wanita"}
        </span>
      </div>

      {/* Info */}
      <div className="mt-3 text-center space-y-1.5">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 font-serif">
          {fullName}
        </h3>
        <p className="text-sm text-gray-500 leading-snug">
          { text }<br />
          <span className="text-gray-700 font-medium">{parentName}</span>
        </p>

        {/* Instagram link */}
        {ig && (
          <a
            href={`https://instagram.com/${ig}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
              isGroom
                ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-200"
                : "bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100"
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            @{ig}
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function CoupleInfo() {
  const config = useConfig();

  return (
    <section id="couple" className="px-4 py-10 sm:py-14 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Section heading */}
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest text-rose-400 uppercase mb-2">
            Mempelai
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-gray-800">
            Dua Hati, Satu Tujuan
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-12 bg-rose-200" />
            <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />
            <div className="h-px w-12 bg-rose-200" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-6 sm:gap-10">
          <PersonCard
            fullName={config.groomFullName ?? config.groomName}
            shortName={config.groomName}
            parentName={config.parentGroom}
            ig={config.groomIg}
            text={config.groomText}
            side="groom"
            delay={0}
          />

          <PersonCard
            fullName={config.brideFullName ?? config.brideName}
            shortName={config.brideName}
            parentName={config.parentBride}
            ig={config.brideIg}
            text={config.brideText}
            side="bride"
            delay={0.15}
          />
        </div>

        {/* Bottom ampersand decoration */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
          className="flex flex-col items-center mt-10 gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-200" />
            <span className="text-3xl font-serif text-rose-300">&</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-200" />
          </div>
          <p className="text-xs text-gray-400 italic">
            Bersatu dalam ikatan suci pernikahan
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
