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

// src/App.jsx
import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Heart, Lock, Delete } from "lucide-react";
import { useInvitation } from "@/features/invitation";
import { useAudio } from "@/hooks/use-audio";
import staticConfig from "@/config/config";

// Lazy load components for better performance
const Layout = lazy(() => import("@/components/layout/layout"));
const MainContent = lazy(
  () => import("@/features/invitation/components/main-content"),
);
const LandingPage = lazy(
  () => import("@/features/invitation/components/landing-page"),
);
const DevStats = lazy(
  () => import("@/features/wishes/components/dev-stats"),
);

// ─── Dev-stats PIN gate ───────────────────────────────────────────────────────

/** Hardcoded developer PIN — change this to whatever you want */
const DEV_PIN = "1401";
const SESSION_KEY = "dev_stats_unlocked";

function PinGate({ onUnlock }) {
  const [digits, setDigits] = useState([]);
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState("");
  const maxLen = DEV_PIN.length;

  const push = (d) => {
    setHint("");
    setDigits((prev) => {
      if (prev.length >= maxLen) return prev;
      const next = [...prev, d];
      if (next.length === maxLen) {
        if (next.join("") === DEV_PIN) {
          sessionStorage.setItem(SESSION_KEY, "1");
          setTimeout(onUnlock, 300);
        } else {
          setShake(true);
          setHint("PIN salah. Coba lagi.");
          setTimeout(() => { setShake(false); setDigits([]); }, 600);
        }
      }
      return next;
    });
  };

  const pop = () => {
    setHint("");
    setDigits((prev) => prev.slice(0, -1));
  };

  // Keyboard support
  useEffect(() => {
    const handleKey = (e) => {
      if (/^[0-9]$/.test(e.key)) push(e.key);
      else if (e.key === "Backspace") pop();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xs"
      >
        {/* Icon */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
            <Lock className="w-6 h-6 text-rose-400" />
          </div>
          <div className="text-center">
            <h1 className="text-white font-bold text-lg tracking-tight">Developer Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Masukkan PIN untuk melanjutkan</p>
          </div>
        </div>

        {/* Dots */}
        <motion.div
          animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex justify-center gap-4 mb-2"
        >
          {Array.from({ length: maxLen }).map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-150 ${
                i < digits.length
                  ? "bg-rose-500 border-rose-500 scale-110"
                  : "bg-transparent border-gray-600"
              }`}
            />
          ))}
        </motion.div>

        {/* Hint */}
        <div className="h-5 flex items-center justify-center mb-6">
          <AnimatePresence>
            {hint && (
              <motion.p
                key={hint}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-rose-400 text-xs font-medium"
              >
                {hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {keys.map((k, i) => {
            if (k === "") return <div key={i} />;
            const isBack = k === "⌫";
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.92 }}
                onClick={() => isBack ? pop() : push(k)}
                className={`h-14 rounded-2xl text-lg font-semibold transition-colors select-none ${
                  isBack
                    ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200 flex items-center justify-center"
                    : "bg-white/8 border border-white/10 text-gray-100 hover:bg-white/15 active:bg-rose-500/20"
                }`}
              >
                {isBack ? <Delete className="w-4 h-4" /> : k}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * App component serves as the root of the application.
 *
 * It manages the state to determine whether the invitation content should be shown.
 * Initially, the invitation is closed and the LandingPage component is rendered.
 * Once triggered, the Layout component containing MainContent is displayed.
 *
 * This component also uses HelmetProvider and Helmet to set up various meta tags:
 *   - Primary meta tags: title and description.
 *   - Open Graph tags for Facebook.
 *   - Twitter meta tags for summary and large image preview.
 *   - Favicon link and additional meta tags for responsive design and theme color.
 *
 * @component
 * @example
 * // Renders the App component
 * <App />
 */
function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const { config, isLoading, error } = useInvitation();

  // PIN gate state for /#/dev-stats
  const [devUnlocked, setDevUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );

  // Always call useAudio unconditionally (Rules of Hooks)
  const activeConfig = config || staticConfig.data;
  const audioControls = useAudio({
    src: activeConfig?.audio?.src || "/audio/fulfilling-humming.mp3",
    loop: activeConfig?.audio?.loop !== false,
  });

  // Hidden developer stats page — accessible at /#/dev-stats (PIN protected)
  if (window.location.hash === "#/dev-stats") {
    if (!devUnlocked) {
      return <PinGate onUnlock={() => setDevUnlocked(true)} />;
    }
    return (
      <Suspense fallback={null}>
        <DevStats />
      </Suspense>
    );
  }


  // Handle opening the invitation - this is called from a user click,
  // which is the perfect opportunity to start audio (browser policy compliant)
  const handleOpenInvitation = async () => {
    // Start audio playback during user interaction
    await audioControls.play();
    setIsInvitationOpen(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center">
          <Heart
            className="h-12 w-12 text-rose-500 mx-auto mb-4 animate-pulse"
            fill="currentColor"
          />
          <p className="text-gray-600">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-rose-500 text-6xl mb-4">!</div>
          <h1 className="text-2xl font-serif text-gray-800 mb-2">
            Undangan Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Silakan periksa URL Anda atau hubungi penyelenggara.
          </p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{activeConfig.title}</title>
        <meta name="title" content={activeConfig.title} />
        <meta name="description" content={activeConfig.description} />
        {/* Prevent Wayback Machine and Web Archiving */}
        <meta name="robots" content="noindex, nofollow, noarchive, nocache" />
        <meta name="googlebot" content="noindex, nofollow, noarchive" />
        <meta name="bingbot" content="noindex, nofollow, noarchive" />
        <meta name="archive" content="no" />
        <meta
          name="cache-control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={activeConfig.title} />
        <meta property="og:description" content={activeConfig.description} />
        <meta property="og:image" content={activeConfig.ogImage} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={activeConfig.title} />
        <meta
          property="twitter:description"
          content={activeConfig.description}
        />
        <meta property="twitter:image" content={activeConfig.ogImage} />
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href={activeConfig.favicon} />
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#FDA4AF" /> {/* Rose-300 color */}
      </Helmet>

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
            <div className="text-center">
              <Heart
                className="h-12 w-12 text-rose-500 mx-auto mb-4 animate-pulse"
                fill="currentColor"
              />
              <p className="text-gray-600">Memuat...</p>
            </div>
          </div>
        }
      >
        <AnimatePresence mode="wait">
          {!isInvitationOpen ? (
            <LandingPage onOpenInvitation={handleOpenInvitation} />
          ) : (
            <Layout audioControls={audioControls}>
              <MainContent />
            </Layout>
          )}
        </AnimatePresence>
      </Suspense>
    </HelmetProvider>
  );
}

export default App;
