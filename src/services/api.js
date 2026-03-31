const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Fetch all wishes for an invitation
 * @param {string} uid - Invitation UID
 * @param {object} options - Query options (limit, offset)
 * @returns {Promise<object>} Response with wishes data
 */

export async function fetchWishes(uid, options = {}) {
  const { limit = 50, offset = 0 } = options;

  const url = new URL(`${API_URL}/rest/v1/wishes`);
  url.searchParams.append("message", "not.is.null");
  url.searchParams.append("order", "created_at.desc");

  const response = await fetch(url, {
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch wishes");
  }

  return response.json();
}

/**
 * Create a new wish
 * @param {string} uid - Invitation UID
 * @param {object} wishData - Wish data (name, message, attendance)
 * @returns {Promise<object>} Response with created wish
 */

export async function createWish(wishData) {
  // ===== BAD WORD FILTER =====
  const badWords = [
    // Indonesian
    "anjink",
    "banksat",
    "babi",
    "koblok",
    "koblok",
    "bakot",
    "tolol",
    "kontol",
    "memek",
    "tai",
    "bajinkan",
    "kampret",
    "keparat",
    "peler",
    "pepek",
    "jembut",
    "titit",
    "brenksek",
    "telaso",
    'puki',

    // Indonesian slang / singkatan
    "anj",
    "ajk",
    "kblk",
    "mmk",
    "kntl",
    "bkst",

    // English
    "fukk",
    "fukk",
    "shit",
    "bitkh",
    "asshole",
    "bastard",
    "dikk",
    "pussi",
  ];

  const vowelMap = {
    a: "[a4]",
    i: "[i1!l]",
    e: "[e3]",
    o: "[o0]",
    u: "[u]",
    b: "[b8]",
    g: "[gk9]",
    k: "[kx]",
    l: "[l1I]",
    s: "[s5]",
    z: "[z2]",
  };

  function normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/g/g, "k")
      .replace(/q/g, "k")
      .replace(/v/g, "f")
      .replace(/c/g, "k")
      .replace(/y/g, "i")
      .replace(/ou/g, "o")
      .replace(/oe/g, "u");
  }

  const containsBadWord = (text) => {
    if (!text) return false;
    text = normalizeText(text);

    const patterns = badWords.map((word) => {
      const letters = word
        .split("")
        .map((char) => vowelMap[char] || char)
        .join("+[^a-z0-9]*");
      return new RegExp(letters, "i");
    });

    return patterns.some((regex) => regex.test(text));
  };

  if (containsBadWord(wishData.message)) {
    const error = new Error();
    error.code = "BAD_WORDS";
    throw error;
  }

  const response = await fetch(`${API_URL}/rest/v1/wishes`, {
    method: "POST",
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(wishData),
  });

  const data = await response.json();

  // Duplicate wish (unique constraint)
  if (data.code === "23505") {
    const error = new Error();
    error.code = "DUPLICATE_WISH";
    throw error;
  }

  // Bad words from Supabase trigger
  if (data.code === "P0001") {
    const error = new Error();
    error.code = "BAD_WORDS";
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data.message || "Failed to create wish");
    error.code = data.code;
    throw error;
  }

  return data;
}

/**
 * Delete a wish (admin function)
 * @param {string} uid - Invitation UID
 * @param {number} wishId - Wish ID to delete
 * @returns {Promise<object>} Response with deletion confirmation
 */
export async function deleteWish(uid, wishId) {
  const response = await fetch(`${API_URL}/api/${uid}/wishes/${wishId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete wish");
  }
  return response.json();
}

/**
 * Get attendance statistics
 * @param {string} uid - Invitation UID
 * @returns {Promise<object>} Response with stats data
 */
export async function fetchAttendanceStats(uid) {
  const response = await fetch(`${API_URL}/api/${uid}/stats`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch stats");
  }
  return response.json();
}

/**
 * Get invitation details
 * @param {string} uid - Invitation UID
 * @returns {Promise<object>} Response with invitation data
 */
export async function fetchInvitation(uid) {
  const response = await fetch(`${API_URL}/api/invitation/${uid}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch invitation");
  }
  return response.json();
}
