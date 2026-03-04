// BRAINBOXECOMLAB License Verification API
// Lives at: https://vercel-api-flax-pi.vercel.app/api/verify

// ============================================================
// LICENSE DATABASE
// Add your students licenses here as:
// "their-store.myshopify.com": "THEIR-LICENSE-KEY"
// ============================================================
const LICENSES = {
  "yunish987.myshopify.com": "BBX-9VYY-7ZVG-XSW2",
  "undeercover.myshopify.com": "BBX-F24L-NQ4X-LEV9",
};

const CACHE_TTL = 86400;

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", `public, max-age=${CACHE_TTL}`);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { domain, key } = req.query;

  if (!domain || !key) {
    return res.status(400).json({
      valid: false,
      message: "Missing domain or key",
    });
  }

  const cleanDomain = domain.toLowerCase().trim();
  const cleanKey = key.toUpperCase().trim();

  const storedKey = LICENSES[cleanDomain];

  if (storedKey && storedKey === cleanKey) {
    return res.status(200).json({
      valid: true,
      domain: cleanDomain,
      message: "License valid",
      expires: null,
    });
  }

  return res.status(200).json({
    valid: false,
    domain: cleanDomain,
    message: "Invalid license. Get yours at brainboxecomlab.com",
  });
};
