import { useEffect, useState, useMemo } from "react";

const UID = "fuad-kikit";
const SUPABASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

/** Fetch ALL wishes from Supabase REST, filter by invitation_uid */
async function fetchAllWishes() {
  const url = new URL(`${SUPABASE_URL}/rest/v1/wishes`);
  url.searchParams.append("invitation_uid", `eq.${UID}`);
  url.searchParams.append("order", "created_at.desc");

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Gagal mengambil data dari Supabase");
  }
  return res.json();
}

/** Update a wish by ID via Supabase REST (PATCH) */
async function updateWishSupabase(id, payload) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/wishes`);
  url.searchParams.append("id", `eq.${id}`);

  const res = await fetch(url, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify(payload),
  });
  // Supabase returns 204 No Content on successful PATCH (no Prefer header)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengupdate ucapan");
  }
  // Return the payload itself — caller merges with existing data
  return payload;
}

/** Delete a wish by ID via Supabase REST */
async function deleteWishSupabase(id) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/wishes`);
  url.searchParams.append("id", `eq.${id}`);

  const res = await fetch(url, { method: "DELETE", headers: HEADERS });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus ucapan");
  }
}

const ATTENDANCE_OPTIONS = ["ATTENDING", "NOT_ATTENDING", "MAYBE"];

const ATTENDANCE_LABELS = {
  ATTENDING: { label: "Hadir", color: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
  NOT_ATTENDING: { label: "Tidak Hadir", color: "bg-rose-500/20 text-rose-300 border border-rose-500/30" },
  MAYBE: { label: "Mungkin", color: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
};

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-1 backdrop-blur-sm">
      <span className="text-xs font-medium uppercase tracking-widest text-gray-500">{label}</span>
      <span className={`text-4xl font-bold tabular-nums ${color}`}>{value}</span>
      {sub && <span className="text-xs text-gray-600 mt-1">{sub}</span>}
    </div>
  );
}

/** Inline edit row — shown when a row is being edited */
function EditRow({ wish, onSave, onCancel, saving }) {
  const [name, setName] = useState(wish.name || "");
  const [message, setMessage] = useState(wish.message || "");
  const [attendance, setAttendance] = useState(wish.attendance || "MAYBE");

  const inputCls = "bg-gray-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-gray-100 focus:outline-none focus:border-rose-500/60 w-full transition-colors";

  return (
    <tr className="bg-rose-950/10 border-y border-rose-500/20">
      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{wish.id}</td>
      <td className="px-4 py-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
          placeholder="Nama"
          maxLength={100}
        />
      </td>
      <td className="px-4 py-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputCls} resize-none`}
          rows={2}
          placeholder="Pesan"
          maxLength={500}
        />
      </td>
      <td className="px-4 py-2">
        <select
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          className={inputCls}
        >
          {ATTENDANCE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{ATTENDANCE_LABELS[opt]?.label}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-gray-600 text-xs font-mono whitespace-nowrap">
        {formatDate(wish.created_at)}
      </td>
      <td className="px-4 py-2 text-center">
        <div className="flex flex-col gap-1 items-center">
          <button
            onClick={() => onSave({ name: name.trim(), message: message.trim(), attendance })}
            disabled={saving || !name.trim()}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium disabled:opacity-40 transition-colors w-full"
          >
            {saving ? "…" : "Simpan"}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 rounded-lg text-xs transition-colors w-full"
          >
            Batal
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function DevStats() {
  const [wishes, setWishes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterAttendance, setFilterAttendance] = useState("ALL");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const wishesData = await fetchAllWishes();
      const list = Array.isArray(wishesData) ? wishesData : [];
      setWishes(list);
      setStats({
        total:         list.length,
        attending:     list.filter((w) => w.attendance === "ATTENDING").length,
        not_attending: list.filter((w) => w.attendance === "NOT_ATTENDING").length,
        maybe:         list.filter((w) => w.attendance === "MAYBE").length,
      });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /** Update wish — PATCH to Supabase, update local state from payload */
  const handleUpdate = async (id, payload) => {
    setSavingId(id);
    try {
      await updateWishSupabase(id, payload);
      // Merge payload into local state, recompute stats
      setWishes((prev) => {
        const list = prev.map((w) => (w.id === id ? { ...w, ...payload } : w));
        setStats({
          total:         list.length,
          attending:     list.filter((w) => w.attendance === "ATTENDING").length,
          not_attending: list.filter((w) => w.attendance === "NOT_ATTENDING").length,
          maybe:         list.filter((w) => w.attendance === "MAYBE").length,
        });
        return list;
      });
      setEditingId(null);
    } catch (err) {
      alert(err.message || "Gagal mengupdate ucapan");
    } finally {
      setSavingId(null);
    }
  };

  /** Delete wish — DELETE to Supabase */
  const handleDelete = async (id) => {
    if (!window.confirm(`Hapus ucapan #${id}?`)) return;
    setDeletingId(id);
    try {
      await deleteWishSupabase(id);
      setWishes((prev) => {
        const list = prev.filter((w) => w.id !== id);
        setStats({
          total:         list.length,
          attending:     list.filter((w) => w.attendance === "ATTENDING").length,
          not_attending: list.filter((w) => w.attendance === "NOT_ATTENDING").length,
          maybe:         list.filter((w) => w.attendance === "MAYBE").length,
        });
        return list;
      });
    } catch (err) {
      alert(err.message || "Gagal menghapus ucapan");
    } finally {
      setDeletingId(null);
    }
  };

  const processed = useMemo(() => {
    let result = [...wishes];
    if (filterAttendance !== "ALL") {
      result = result.filter((w) => w.attendance === filterAttendance);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) => w.name?.toLowerCase().includes(q) || w.message?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let va = a[sortField] ?? "";
      let vb = b[sortField] ?? "";
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [wishes, filterAttendance, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = processed.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(wishes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `wishes-${UID}-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = ["id", "name", "message", "attendance", "created_at"];
    const rows = wishes.map((w) =>
      headers.map((h) => `"${String(w[h] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `wishes-${UID}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="text-gray-600 ml-1">↕</span>;
    return <span className="text-rose-400 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Memuat data dari Supabase...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="bg-rose-950/40 border border-rose-800 rounded-2xl p-8 max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-rose-300 font-bold text-lg mb-2">Gagal memuat data</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────────────────────────────────────
  const attending = Number(stats?.attending ?? 0);
  const notAttending = Number(stats?.not_attending ?? 0);
  const maybe = Number(stats?.maybe ?? 0);
  const total = Number(stats?.total ?? wishes.length);
  const attendPct = total > 0 ? Math.round((attending / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top Bar */}
      <div className="border-b border-white/10 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-500/20 border border-rose-500/30 rounded-lg flex items-center justify-center text-rose-400 text-sm">🔒</div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Developer Dashboard</h1>
              <p className="text-xs text-gray-500 font-mono">{UID}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5">
              ↻ Refresh
            </button>
            <button onClick={downloadCSV} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-xs font-medium transition-colors">
              ⬇ CSV
            </button>
            <button onClick={downloadJSON} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-colors">
              ⬇ JSON
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Ucapan" value={total} color="text-white" />
          <StatCard label="Hadir ✅" value={attending} sub={`${attendPct}% dari total`} color="text-emerald-400" />
          <StatCard label="Tidak Hadir ❌" value={notAttending} color="text-rose-400" />
          <StatCard label="Mungkin ❓" value={maybe} color="text-amber-400" />
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Distribusi Kehadiran</span>
              <span>{total} total respons</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              <div className="bg-emerald-500 transition-all" style={{ width: `${(attending / total) * 100}%` }} />
              <div className="bg-rose-500 transition-all" style={{ width: `${(notAttending / total) * 100}%` }} />
              <div className="bg-amber-500 transition-all" style={{ width: `${(maybe / total) * 100}%` }} />
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Hadir</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />Tidak Hadir</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Mungkin</span>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {/* Table Controls */}
          <div className="p-4 border-b border-white/10 flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Cari nama atau pesan..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 min-w-[180px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-rose-500/50 transition-colors"
            />
            <div className="flex gap-1.5">
              {["ALL", "ATTENDING", "NOT_ATTENDING", "MAYBE"].map((key) => (
                <button
                  key={key}
                  onClick={() => { setFilterAttendance(key); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    filterAttendance === key
                      ? "bg-rose-600 border-rose-600 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {key === "ALL" ? "Semua" : ATTENDANCE_LABELS[key]?.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-auto">
              {processed.length} dari {wishes.length} data
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-gray-300 select-none w-14" onClick={() => toggleSort("id")}>
                    ID <SortIcon field="id" />
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-gray-300 select-none" onClick={() => toggleSort("name")}>
                    Nama <SortIcon field="name" />
                  </th>
                  <th className="px-4 py-3 text-left">Pesan</th>
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-gray-300 select-none w-36" onClick={() => toggleSort("attendance")}>
                    Kehadiran <SortIcon field="attendance" />
                  </th>
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-gray-300 select-none w-44" onClick={() => toggleSort("created_at")}>
                    Waktu <SortIcon field="created_at" />
                  </th>
                  <th className="px-4 py-3 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-600 italic">
                      Tidak ada data yang sesuai.
                    </td>
                  </tr>
                ) : (
                  paginated.map((w) => {
                    // Show inline edit row
                    if (editingId === w.id) {
                      return (
                        <EditRow
                          key={w.id}
                          wish={w}
                          saving={savingId === w.id}
                          onSave={(payload) => handleUpdate(w.id, payload)}
                          onCancel={() => setEditingId(null)}
                        />
                      );
                    }

                    const badge = ATTENDANCE_LABELS[w.attendance] || { label: w.attendance, color: "bg-gray-700 text-gray-300" };
                    return (
                      <tr key={w.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{w.id}</td>
                        <td className="px-4 py-3 font-semibold text-white max-w-[140px] truncate">{w.name}</td>
                        <td className="px-4 py-3 text-gray-400 max-w-xs">
                          {w.message
                            ? <span className="line-clamp-2 leading-relaxed">{w.message}</span>
                            : <span className="text-gray-700 italic text-xs">—</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs font-mono whitespace-nowrap">
                          {formatDate(w.created_at)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            {/* Edit button */}
                            <button
                              onClick={() => { setEditingId(w.id); }}
                              disabled={deletingId === w.id}
                              className="text-gray-500 hover:text-amber-400 transition-colors text-base disabled:opacity-30"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(w.id)}
                              disabled={deletingId === w.id}
                              className="text-gray-500 hover:text-rose-400 transition-colors text-base disabled:opacity-30"
                              title="Hapus"
                            >
                              {deletingId === w.id ? "…" : "🗑"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-600">Halaman {currentPage} dari {totalPages}</span>
              <div className="flex gap-1.5">
                <button onClick={() => setPage(1)} disabled={currentPage === 1} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">«</button>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">‹ Prev</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">Next ›</button>
                <button onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">»</button>
              </div>
            </div>
          )}
        </div>

        {/* Raw JSON */}
        <details className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <summary className="px-5 py-4 cursor-pointer text-gray-500 hover:text-gray-300 text-sm transition-colors select-none">
            Raw JSON — {wishes.length} records
          </summary>
          <pre className="p-5 text-xs text-gray-400 overflow-auto max-h-96 border-t border-white/10 leading-relaxed">
            {JSON.stringify(wishes, null, 2)}
          </pre>
        </details>

        <p className="text-center text-xs text-gray-800 pb-4">
          🔒 Halaman ini tidak terhubung dari UI tamu — akses via <code className="font-mono">/#/dev-stats</code>
        </p>
      </div>
    </div>
  );
}
