import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Custom hook for managing audio playback.
 * Designed to work with browser autoplay policies by starting
 * audio during user interaction (e.g., button click).
 *
 * @param {Object} options - Audio configuration options
 * @param {string} options.src - Audio source URL
 * @param {boolean} options.loop - Whether to loop the audio
 * @returns {Object} Audio state and controls
 */
export function useAudio(options = {}) {
  const {
    src = "/audio/bermuara.mp3",
    loop = true,
    initialVolume = 0.5,
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const savedVolume = localStorage.getItem("sakeenah_audio_volume");
      return savedVolume !== null ? parseFloat(savedVolume) : initialVolume;
    } catch (e) {
      return initialVolume;
    }
  });

  const audioRef = useRef(null);
  const wasPlayingRef = useRef(false);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.loop = loop;
    audioRef.current.preload = "auto";
    audioRef.current.volume = volume;

    const handleCanPlay = () => setIsReady(true);
    const handlePlay = () => {
      setIsPlaying(true);
      wasPlayingRef.current = true;
    };
    const handlePause = () => setIsPlaying(false);

    audioRef.current.addEventListener("canplaythrough", handleCanPlay);
    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("canplaythrough", handleCanPlay);
        audioRef.current.removeEventListener("play", handlePlay);
        audioRef.current.removeEventListener("pause", handlePause);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, loop]);

  // Handle visibility changes - pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;

      if (document.hidden) {
        wasPlayingRef.current = isPlaying;
        if (isPlaying) {
          audioRef.current.pause();
        }
      } else if (wasPlayingRef.current) {
        audioRef.current.play().catch(console.error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Play audio - must be called from user interaction handler
  const play = useCallback(async () => {
    if (!audioRef.current) return false;
    try {
      await audioRef.current.play();
      return true;
    } catch (error) {
      console.error("Audio playback failed:", error);
      return false;
    }
  }, []);

  // Pause audio
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    wasPlayingRef.current = false;
  }, []);

  // Toggle play/pause
  const toggle = useCallback(async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, play, pause]);

  // Change volume level (0.0 to 1.0)
  const changeVolume = useCallback((newVolume) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    try {
      localStorage.setItem("sakeenah_audio_volume", vol.toString());
    } catch (e) {
      console.warn("Could not save volume preference:", e);
    }
  }, []);

  return {
    isPlaying,
    isReady,
    play,
    pause,
    toggle,
    volume,
    changeVolume,
  };
}
