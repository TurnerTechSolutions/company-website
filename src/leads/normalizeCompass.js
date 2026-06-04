// ──────────────────────────────────────────────────────────────
// Normalize Compass (apify/compass-crawler-google-places) output
// into a consistent lead shape. Defensive about field names since
// they vary slightly across actor versions.
// ──────────────────────────────────────────────────────────────

const firstString = (...vals) => {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
};

const firstEmail = (lead) => {
  // Contact-details enrichment add-on puts emails in `emails: []`
  if (Array.isArray(lead.emails) && lead.emails.length) return lead.emails[0];
  if (Array.isArray(lead.email) && lead.email.length) return lead.email[0];
  return firstString(lead.email);
};

// Build a stable doc id. placeId is the most reliable; fall back to
// cid/fid, then a slug of name+address so re-imports still dedupe.
const stableId = (lead) => {
  const raw = firstString(lead.placeId, lead.cid, lead.fid);
  if (raw) return raw.replace(/[/\\.#$[\]]/g, '_');
  const slug = `${firstString(lead.title, lead.name)}-${firstString(lead.address)}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
  return slug || `lead-${Math.random().toString(36).slice(2, 12)}`;
};

export function normalizeLead(lead) {
  const website = firstString(lead.website, lead.webSite, lead.site);
  const phone   = firstString(lead.phone, lead.phoneUnformatted, lead.formattedPhoneNumber);
  const email   = firstEmail(lead);

  return {
    id:        stableId(lead),
    // Scraped fields (overwritten on re-import)
    name:      firstString(lead.title, lead.name, '(no name)'),
    category:  firstString(lead.categoryName, lead.category, (lead.categories && lead.categories[0])),
    address:   firstString(lead.address, lead.street),
    city:      firstString(lead.city),
    state:     firstString(lead.state, lead.countryCode),
    postalCode: firstString(lead.postalCode, lead.zip),
    phone,
    website,
    email,
    rating:    typeof lead.totalScore === 'number' ? lead.totalScore
             : typeof lead.rating === 'number' ? lead.rating : null,
    reviews:   typeof lead.reviewsCount === 'number' ? lead.reviewsCount
             : typeof lead.reviews === 'number' ? lead.reviews : 0,
    googleUrl: firstString(lead.url, lead.googleMapsUrl, lead.placeUrl),
    // Convenience flags used by filters
    hasWebsite: !!website,
    hasPhone:   !!phone,
    hasEmail:   !!email,
  };
}

// Accepts either a raw array, or { items: [...] }, or a single object.
export function normalizeDataset(raw) {
  let arr = raw;
  if (raw && Array.isArray(raw.items)) arr = raw.items;
  if (!Array.isArray(arr)) arr = [arr];
  return arr
    .filter((x) => x && typeof x === 'object')
    .map(normalizeLead)
    .filter((l) => l.name && l.name !== '(no name)' || l.phone || l.website);
}
