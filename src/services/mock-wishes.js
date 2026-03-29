/**
 * Mock wishes data for static mode (VITE_STATIC_MODE=true).
 * Used when the app runs without a backend connection.
 */
export const MOCK_WISHES = [
  {
    id: 1,
    name: "Budi Santoso",
    message:
      "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallahu lakuma wa baraka alaikuma.",
    attendance: "ATTENDING",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: 2,
    name: "Siti Rahayu",
    message:
      "Selamat ya Fuad & Kikit! Semoga langgeng sampai kakek-nenek dan selalu diberikan keberkahan dalam setiap langkah kehidupan bersama.",
    attendance: "ATTENDING",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  }
];
