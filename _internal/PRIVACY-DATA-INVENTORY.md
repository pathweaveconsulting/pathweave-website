# PathWeave website — privacy data inventory

Internal document. Not published (GitHub Pages does not publish folders starting with `_`).
Evidence gathered 2026-10-07 from the repository at `09e55a7` and from production (https://pathweave.in/) using headless Chrome, curl and DevTools Protocol cookie inspection.

## Data collection points

| Point | Mechanism | Personal data | Leaves the browser? |
|---|---|---|---|
| Email links (`mailto:growth@pathweave.in`, some with a fixed `subject=`) | Visitor's own email client | Whatever the visitor writes | Yes, by the visitor's own email, to PathWeave's mailbox |
| Phone links (`tel:+917700883315`) | Visitor's phone | Caller ID, call content | Yes, by phone call |
| WhatsApp links (`wa.me/917700883315?text=…`) | Opens WhatsApp with generic prefilled text (topic only, no personal data) | Whatever the visitor sends | Yes, through WhatsApp (Meta) |
| LinkedIn links | Opens linkedin.com | Whatever the visitor sends there | Yes, through LinkedIn |
| Readiness assessment `/diagnostic/` | `<form id="readiness-form">`, 15 radio groups `q1`–`q15` (values 1–5, all `required`), no text fields | None requested (no name, email or company) | No (see below) |

There are **no** contact forms, newsletter sign-ups, accounts, logins, file uploads, chat widgets, scheduling embeds or form-processing services.

## Contact information collected

Only what a visitor chooses to send by email, phone, WhatsApp or LinkedIn. The website itself receives none of it.

## Assessment data

- Questions: 15 statements rated 1–5 across People, Process and Technology.
- Scoring is done in inline JavaScript on submit (`event.preventDefault()`); results are written into the page DOM only.
- Tested in production: after submitting, the URL was unchanged, no new network request carried answers, and localStorage, sessionStorage, IndexedDB, Cache API and cookies were all empty.
- The Cloudflare Web Analytics beacon sent after submission contained page-performance fields only (`location`, timings, `siteToken`, etc.), not answers.
- Fix applied 2026-10-07: the submit button is now `disabled` in HTML and enabled by the script. Previously, if the script had not run, a native submit (GET, no `action`) would have placed all answers in the URL query string.
- "Print or Save Scorecard" uses `window.print()`, so the copy stays with the user.

## Browser storage

| Mechanism | Used by PathWeave code? | Observed at runtime |
|---|---|---|
| Cookies | No | Only Cloudflare `cf_clearance` (below) |
| localStorage / sessionStorage | No | Empty |
| IndexedDB | No | None |
| Cache API / service worker | No | None registered |
| URL parameters | Only `?v=` cache-busting on CSS/JS, plus fixed `subject=` / `text=` on outbound mailto and WhatsApp links (no personal data) | — |
| Hidden fields / fingerprinting | No | — |

Our only client-side script is `/assets/js/site.js` (navigation), plus a one-line inline script that adds a `js` class to `<html>`, and the assessment's inline script.

## Cookies

| Name | Domain | Set by | Purpose | Classification | Flags | Lifetime |
|---|---|---|---|---|---|---|
| `cf_clearance` | `.pathweave.in` | Cloudflare (bot challenge / Bot Fight Mode JS detection) | Shows the browser passed a security check | Security / strictly necessary | HttpOnly, Secure, SameSite=None | ~365 days (observed) |

PathWeave sets no first-party cookies. No analytics, advertising or third-party cookies were observed.

## Analytics

- **Cloudflare Web Analytics**, injected by Cloudflare (not in the repository): loads `https://static.cloudflareinsights.com/beacon.min.js/…` and posts JSON to `https://pathweave.in/cdn-cgi/rum` once per page view.
- Observed payload fields: `startTime, pageloadId, eventType, nt, location, versions, bi, memory, firstPaint, firstContentfulPaint, timingsV2, siteToken, st`.
- No cookies or browser storage used by it (observed).
- Requests necessarily expose IP address and user agent to Cloudflare.
- It can only be disabled in the Cloudflare dashboard, not from the repository. Left unchanged as instructed.
- The repository's `data-pw-event` / `data-pw-offer` attributes are inert; no script reads them.

## Cloudflare/security services

Evidence from live responses and HTML:

- Proxy/CDN: `Server: cloudflare`, `cf-cache-status`.
- Email Address Obfuscation: `/cdn-cgi/scripts/…/email-decode.min.js`, `data-cfemail`, `/cdn-cgi/l/email-protection#…` links. Email text and mailto links still work for users with JavaScript.
- Bot Fight Mode / JS detection: inline script loading `/cdn-cgi/challenge-platform/scripts/jsd/main.js` and a POST to `/cdn-cgi/challenge-platform/h/g/jsd/oneshot/…`; sets `cf_clearance`.
- Web Analytics: as above.
- Turnstile: not present.
- HTTPS: `http://pathweave.in/` → 301 → `https://pathweave.in/`; `www` → apex.

## Third-party processors

Evidenced in this website's data flow:

1. **Cloudflare**: CDN, security (bot detection, cookie), email obfuscation, web analytics.
2. **GitHub (GitHub Pages)**: origin hosting (`x-github-request-id`, `x-github-edge-region` headers).

Outside the website, by visitor choice: PathWeave's email service provider (not determinable from the repository), telephone and WhatsApp (Meta), and LinkedIn.

## External resources

Requested automatically by the browser on page load:

| URL | Purpose | Added by |
|---|---|---|
| `https://static.cloudflareinsights.com/beacon.min.js/…` | Web Analytics | Cloudflare injection |
| `https://pathweave.in/cdn-cgi/…` (same origin) | Email decode, bot detection, RUM | Cloudflare injection |

All fonts, CSS, JavaScript and images are self-hosted. There are no Google Fonts, CDNs, iframes, embeds, maps, video, tracking pixels or social widgets. Outbound links only: linkedin.com, wa.me, mailto, tel.

## Data transmission destinations

- Every page request reaches Cloudflare, then GitHub Pages: IP, URL, headers, user agent.
- Analytics beacon to Cloudflare: page URL and performance timings.
- Bot detection to Cloudflare: browser signals for the security check.
- Nothing is transmitted to any PathWeave-operated server, database or form endpoint (none exists).

## Known storage locations

- Website: none.
- Outside the website: PathWeave's email mailbox, phone and WhatsApp accounts, and LinkedIn messages. Owner to confirm whether enquiries are copied into a CRM or spreadsheet.
- Cloudflare and GitHub logs, under their own retention.

## Unknown / requires owner confirmation

- Legal entity name and registered office (the location pages show "PathWeave Consulting" with office addresses, but no registration details are evidenced).
- Email service provider.
- Whether enquiries are entered into a CRM or any lead database.
- Formal retention periods for correspondence.
- Whether marketing emails or newsletters are ever sent (none are offered on the site).
- Whether client information may be used in case studies.
- Governing law / jurisdiction for the Terms.
- Whether `growth@pathweave.in` should remain the privacy and security contact.

## Retention facts currently evidenced

- Assessment answers: not retained (in-page only).
- Website: no retention, because it stores nothing.
- `cf_clearance`: about one year (set by Cloudflare).
- No evidence of any other retention period.

## Security controls observed

- HTTPS enforced (301) through Cloudflare. Redirect target is HTTPS; no mixed content observed.
- Cloudflare bot detection and email obfuscation.
- No secrets, keys, tokens or credential files in tracked files or git history (pattern scan 2026-10-07).
- `.git`, `.env`, `_redirects`, `_seo-briefs/` and `Claude outputs/` are not served (404).
- Missing response headers: HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options / frame-ancestors. See `SECURITY-HEADERS-RECOMMENDATIONS.md`.

## Legal pages currently present/missing

- Before this pass: no privacy policy, no terms, no security contact.
- Added 2026-10-07: `/privacy/`, `/terms/` (includes the general-information disclaimer), `/.well-known/security.txt`.
- Not created: cookie banner or cookie page (not required: only a security cookie and cookieless analytics; explained in the Privacy Policy) and a separate disclaimer page (covered in Terms).
