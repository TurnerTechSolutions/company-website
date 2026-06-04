# Leads Dashboard — Setup

A private, login-gated dashboard at `/leads` that imports your Compass
(Google Maps) scraper JSON, filters it, and lets you mark leads "contacted"
and attach notes. Data lives in Firebase Firestore.

---

## 1. Install the new dependency

```bash
npm install firebase
```

(The code uses the modular v9+ SDK; `firebase@^10.12.0` is already added to
`package.json`. `npm install` will pick it up.)

## 2. Create a Firebase project

1. Go to https://console.firebase.google.com → **Add project**.
2. Once created, click the **Web** icon (`</>`) to register a web app.
   Firebase shows you a `firebaseConfig` object — keep that tab open.
3. In the left sidebar:
   - **Build → Firestore Database → Create database** → Production mode →
     pick a region.
   - **Build → Authentication → Get started → Email/Password → Enable.**

## 3. Create your login user

Authentication → **Users** tab → **Add user** → enter the email + password
you'll sign in with. (There is intentionally no public sign-up — you add
users here by hand.)

## 4. Add your config to `.env`

Copy the values from the `firebaseConfig` object into your `.env`
(see `.env.example` for the full list):

```
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=1:...:web:...
```

> These keys are **not secret** — every Firebase web app ships them to the
> browser. Your data is protected by Auth + the security rules below, not by
> hiding them. Restart `npm start` after editing `.env`.

## 5. Publish the security rules

Open `firestore.rules` (included). In the console: **Firestore → Rules**,
paste the contents, **Publish**. This blocks all access unless signed in.

**Recommended hardening:** since only you use this, lock it to your exact
user. Find your UID in Authentication → Users, then in the rules replace
`if request.auth != null` with:

```
allow read, write: if request.auth != null
  && request.auth.uid == 'YOUR_UID_HERE';
```

## 6. Run it

```bash
npm start
```

Visit `/login`, sign in, and you'll land on `/leads`.

---

## Using the dashboard

**Import** — click **Upload JSON** and pick the file you exported from the
Compass actor (the dataset "Export → JSON"). Re-importing the same area is
safe: leads are de-duplicated by Google place ID, and your **contacted /
notes never get overwritten** — only the scraped fields refresh.

**Filter** — search by name/address, filter by category, website (none / has),
contacted status, "has phone", and a min/max review-count range. Sort by
reviews ascending to surface the smallest owner-operators first (your
"no website + low reviews" sweet spot).

**Work the list** — tick **Done** to mark a lead contacted (greys the row),
type in the **Notes** cell (saves when you click away). **Export CSV** dumps
whatever is currently filtered.

**Apify pull (optional)** — "Import from Apify" lets you paste a dataset ID/URL
and your Apify API token to pull results without downloading a file. Note the
token passes through the browser; for a hardened setup, move this call into a
serverless function (e.g. a Vercel function) later and drop the token field.

---

## Data model (`leads` collection)

Each document is keyed by Google `placeId`. Scraped fields: `name`, `category`,
`address`, `city`, `state`, `phone`, `website`, `email`, `rating`, `reviews`,
`googleUrl`, plus `hasWebsite/hasPhone/hasEmail` flags. Your fields:
`contacted` (bool), `notes` (string), `updatedAt`, `importedAt`.

## Files added / changed

```
src/firebase.js                    (new) Firebase init
src/context/AuthProvider.jsx       (new) Auth context + useAuth
src/components/ProtectedRoute.jsx  (new) Login gate
src/pages/Login.jsx / .module.css  (new) Login screen
src/pages/Leads.jsx / .module.css  (new) Dashboard
src/leads/normalizeCompass.js      (new) Maps scraper field mapping
src/leads/leadsService.js          (new) Firestore read/write + Apify fetch
src/App.jsx                        (edit) AuthProvider + /login, /leads routes
package.json                       (edit) firebase dependency
.env.example                       (new) config template
firestore.rules                    (new) security rules
```
