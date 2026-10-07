# PathWeave website — privacy data inventory

Internal document. Not published (GitHub Pages does not publish folders starting with `_`).
Evidence gathered 2026-10-07 from the repository at `09e55a7` and from production (https://pathweave.in/) using headless Chrome, curl and DevTools Protocol cookie inspection. Owner business facts were confirmed on 2026-10-07.

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
- On 2026-10-07 a hostname-scoped Cloudflare Response Header Transform Rule was added for `pathweave.in` only, setting HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, Cross-Origin-Opener-Policy and a Content-Security-Policy-Report-Only header. CSP enforcement remains off; HSTS has neither `includeSubDomains` nor `preload`.

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
- Outside the website: PathWeave's email mailbox, phone and WhatsApp accounts, and LinkedIn messages.
- Owner-confirmed 2026-10-07: website enquiries are **not currently entered into a CRM**.
- Cloudflare and GitHub logs, under their own retention.

## Owner-confirmed business facts (2026-10-07)

- Public/business name: **PathWeave**.
- Legal entity status: PathWeave is **not currently incorporated or registered as a separate company, LLP or other legal entity**. No invented legal suffix is to be used.
- Registered office: none is to be published; no residential address is to be substituted.
- CRM: **none currently** for website enquiries.
- Enquiry retention: **no fixed retention period is being represented publicly**. The public policy uses purpose-based retention: information is kept only as long as reasonably necessary for the enquiry, business records or an actual/potential business relationship, subject to applicable requirements.
- Governing law / jurisdiction: deliberately **not specified** in the current Website Terms.
- Privacy/security contact currently used: `growth@pathweave.in`.

## Items still not evidenced from the website/repository

These are not blockers for the current public policy because the policy does not make unsupported claims about them:

- Email service provider.
- Whether PathWeave may later introduce newsletters/marketing campaigns (none are offered on the site today).
- Whether future client information may be used in case studies; any such use should be governed by the relevant client engagement/permission rather than assumed here.

## Retention facts currently evidenced / confirmed

- Assessment answers: not retained (in-page only).
- Website: no retention, because it stores nothing.
- `cf_clearance`: about one year (set by Cloudflare).
- Enquiry correspondence: no fixed period is published; owner has confirmed use of a purpose-based retention approach rather than an invented fixed duration.

## Security controls observed / applied

- HTTPS enforced (301) through Cloudflare. Redirect target is HTTPS; no mixed content observed.
- Cloudflare bot detection and email obfuscation.
- No secrets, keys, tokens or credential files in tracked files or git history (pattern scan 2026-10-07).
- `.git`, `.env`, `_redirects`, `_seo-briefs/` and `Claude outputs/` are not served (404).
- Repository includes `<meta name="referrer" content="strict-origin-when-cross-origin">` on every page.
- Cloudflare hostname-scoped security headers were applied on 2026-10-07 for apex `pathweave.in`: `Strict-Transport-Security: max-age=31536000`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin`, and `Content-Security-Policy-Report-Only`. The zone-wide HSTS setting was left untouched.

## Legal pages currently present/missing

- Before the privacy/security pass: no privacy policy, no terms, no security contact.
- Added 2026-10-07: `/privacy/`, `/terms/` (includes the general-information disclaimer), `/.well-known/security.txt`.
- Public legal pages intentionally identify the business simply as **PathWeave**, publish no registered office, make no CRM claim, use purpose-based retention wording and contain no governing-law clause.
- Not created: cookie banner or cookie page (not required by the audited site behaviour: only a security cookie and cookieless analytics; both are explained in the Privacy Policy) and a separate disclaimer page (covered in Terms).
