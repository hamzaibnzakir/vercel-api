// BRAINBOXECOMLAB License Verification API
// Deploy this to Vercel — it will live at:
// https://your-vercel-app.vercel.app/api/verify

// ============================================================
// LICENSE DATABASE
// Add your students' licenses here as:
// "their-store.myshopify.com": "THEIR-LICENSE-KEY"
// ============================================================
const LICENSES = {
  // Example entries — replace with real ones as students enroll
  // "studentstore.myshopify.com": "BBX-XXXX-XXXX-XXXX",
};

// How often the theme re-checks (in seconds)
// 86400 = once per day, 3600 = once per hour
const CACHE_TTL = 86400;

export default function handler(req, res) {
  // Allow requests from any Shopify store
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", `public, max-age=${CACHE_TTL}`);

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { domain, key } = req.query;

  // Missing params
  if (!domain || !key) {
    return res.status(400).json({
      valid: false,
      message: "Missing domain or key",
    });
  }

  const cleanDomain = domain.toLowerCase().trim();
  const cleanKey = key.toUpperCase().trim();

  // Check license
  const storedKey = LICENSES[cleanDomain];

  if (storedKey && storedKey === cleanKey) {
    return res.status(200).json({
      valid: true,
      domain: cleanDomain,
      message: "License valid",
      expires: null, // null = never expires. Set a date string like "2026-12-31" to expire
    });
  }

  // Invalid
  return res.status(200).json({
    valid: false,
    domain: cleanDomain,
    message: "Invalid license. Get yours at brainboxecomlab.com",
  });
}
