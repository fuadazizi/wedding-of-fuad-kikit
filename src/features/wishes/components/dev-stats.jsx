import { useEffect, useState } from "react";
import { formatEventDate } from "@/lib/format-event-date";

const STATS_KEY = "sakeenah_stats";

/**
 * Developer-only stats page.
 * Access at: http://localhost:5173/#/dev-stats (or your production URL)
 *
 * Data is written to localStorage["sakeenah_stats"] whenever a wish is submitted.
 * This page is NOT linked from anywhere in the app UI.
 */
export default function DevStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      setStats(raw ? JSON.parse(raw) : { submissions: [] });
    } catch {
      setStats({ submissions: [], error: "Failed to parse stats" });
    }
  }, []);

  if (!stats) return null;

  const { submissions = [] } = stats;
  const attending = submissions.filter((s) => s.attendance === "ATTENDING").length;
  const notAttending = submissions.filter((s) => s.attendance === "NOT_ATTENDING").length;
  const maybe = submissions.filter((s) => s.attendance === "MAYBE").length;

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sakeenah-stats.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearStats = () => {
    if (window.confirm("Hapus semua statistik dari localStorage?")) {
      localStorage.removeItem(STATS_KEY);
      setStats({ submissions: [] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold text-rose-400">🔒 Developer Stats</h1>
          <p className="text-gray-500 text-sm mt-1">
            Data dari <code className="bg-gray-800 px-1 rounded">localStorage[&quot;sakeenah_stats&quot;]</code>
            {" "}— halaman ini tidak tampil di UI tamu.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: submissions.length, color: "text-white" },
            { label: "Hadir ✅", value: attending, color: "text-emerald-400" },
            { label: "Tidak ❌", value: notAttending, color: "text-rose-400" },
            { label: "Mungkin ❓", value: maybe, color: "text-amber-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={downloadJson}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            ⬇ Download JSON
          </button>
          <button
            onClick={clearStats}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            🗑 Clear Stats
          </button>
        </div>

        {/* Submissions Table */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-300">
            Submissions ({submissions.length})
          </h2>

          {submissions.length === 0 ? (
            <p className="text-gray-600 italic">Belum ada submisi.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{s.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.attendance === "ATTENDING"
                        ? "bg-emerald-900 text-emerald-300"
                        : s.attendance === "NOT_ATTENDING"
                        ? "bg-rose-900 text-rose-300"
                        : "bg-amber-900 text-amber-300"
                    }`}>
                      {s.attendance}
                    </span>
                  </div>
                  {s.message && (
                    <p className="text-gray-400 text-sm">{s.message}</p>
                  )}
                  <p className="text-gray-600 text-xs">
                    {formatEventDate(s.created_at, "long", true)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Raw JSON */}
        <details className="bg-gray-800 rounded-xl border border-gray-700">
          <summary className="px-4 py-3 cursor-pointer text-gray-400 hover:text-white text-sm">
            Raw JSON
          </summary>
          <pre className="p-4 text-xs text-gray-300 overflow-auto max-h-96">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </details>

      </div>
    </div>
  );
}
