# PathWeave website — privacy & security audit (2026-10-07)

Internal document. Starting commit `09e55a7`; privacy/security implementation commit `788a815`. Scope: pathweave.in only. Lightweight, non-intrusive checks; no DNS changes made. Full evidence: `PRIVACY-DATA-INVENTORY.md`.

## Executive summary

The website collects very little: no forms, accounts, first-party cookies or browser storage. The readiness assessment runs entirely in the browser. The original gaps were the absence of a Privacy Policy, Terms or security contact, missing HTTP security headers, and one edge case where assessment answers could have reached a URL. The repository-side gaps are fixed. On 2026-10-07 the remaining response-header hardening was also applied at Cloudflare through a hostname-scoped Transform Rule for `pathweave.in` only.

## Data collected

- Visitor-initiated email, phone, WhatsApp and LinkedIn messages, outside the website.
- Standard request data (IP, user agent, URL, referrer) processed by Cloudflare and GitHub Pages.
- Cloudflare Web Analytics page-view and performance data.
- Cloudflare bot-detection signals and the `cf_clearance` cookie.

## Data not collected

Names or emails through the site, assessment answers, accounts, payment data, marketing consent, advertising identifiers, session recordings, error telemetry. Scans found no Google Analytics, Tag Manager, Meta or LinkedIn pixels, Hotjar, Clarity, PostHog, Sentry, LogRocket or FullStory.

## Cookies

`cf_clearance` only (Cloudflare security, strictly necessary, HttpOnly, Secure, SameSite=None, about one year). No consent banner is used for this or for cookieless analytics. The Privacy Policy discloses both.

## Analytics

Cloudflare Web Analytics (Cloudflare-injected, cookieless). Left enabled as instructed.

## Third parties

Cloudflare and GitHub Pages. Visitor-chosen channels: email provider (not identified from the repository), WhatsApp, LinkedIn. No other external resources load.

## Storage

None used by the site.

## Security findings

| # | Finding | Severity | Status |
|---|---|---|---|
| S1 | Security response headers were absent | Medium | Fixed at Cloudflare on 2026-10-07 with a hostname-scoped `http_response_headers_transform` rule for `pathweave.in` only. HSTS has no `includeSubDomains` or `preload`; CSP is Report-Only, not enforced. |
| S2 | Assessment form had no `action`; a native submit before or without JS would put answers in the URL query string | Low | Fixed: submit disabled until script runs |
| S3 | No security contact | Low | Fixed: `/.well-known/security.txt` (Contact: growth@pathweave.in) |
| S4 | One `target="_blank"` link had `rel="noopener"` only | Informational | Fixed: `noopener noreferrer` |
| S5 | `access-control-allow-origin: *` from GitHub Pages | Informational | No action; public static content |
| S6 | Secrets / credentials in repo or history | — | None found |
| S7 | Sensitive paths (`.git`, `.env`, `_seo-briefs`, internal folders) | — | Not served (404) |
| S8 | HTTPS / mixed content | — | 301 to HTTPS; all assets same-origin HTTPS |

### Cloudflare header state applied 2026-10-07

Rule scope: `(http.host eq "pathweave.in")`

Headers configured:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`
- `Cross-Origin-Opener-Policy: same-origin`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy-Report-Only` using the audited candidate policy

The zone-wide Cloudflare HSTS control was left untouched. Other domains/subdomains, DNS, nameservers, SSL mode, Web Analytics, Bot Fight Mode and email obfuscation were not changed.

## Privacy/legal findings

| # | Finding | Severity | Status |
|---|---|---|---|
| P1 | No Privacy Policy despite analytics, a security cookie and enquiry channels | Medium | Fixed: `/privacy/` |
| P2 | No Website Terms / content disclaimer | Low | Fixed: `/terms/` |
| P3 | No legal links in footer | Low | Fixed: Privacy and Terms in footer on all pages |
| P4 | Contact page had no privacy notice | Low | Fixed: short note linking the policy |
| P5 | Assessment privacy note did not link a policy | Informational | Fixed |
| P6 | Business/legal facts needed owner confirmation | Informational | Resolved by owner on 2026-10-07; current public policies already match the confirmed facts. |

## Owner-confirmed business/legal facts (2026-10-07)

- Public/business name: **PathWeave**.
- Legal entity status: PathWeave is **not currently incorporated or registered as a separate company, LLP or other legal entity**. The public website must not invent a legal suffix.
- Registered office: none is to be published; no residential address is to be substituted.
- CRM: **none currently** for website enquiries.
- Retention: no fixed enquiry-retention period is being represented publicly; the Privacy Policy uses purpose-based retention wording.
- Governing law / jurisdiction: deliberately **not specified** in the Website Terms at this stage.
- Privacy/security contact: `growth@pathweave.in` remains the approved contact.

The existing `/privacy/` and `/terms/` pages were reviewed after these owner confirmations and already match them: they refer simply to PathWeave, publish no registered address, make no CRM claim, use purpose-based retention wording and contain no governing-law clause. No public-page rewrite was needed merely to force a change.

## Fixes implemented

- `/privacy/`, `/terms/`, `/.well-known/security.txt`, `_config.yml` (publishes `.well-known`).
- Footer: Privacy and Terms links and "© 2026 PathWeave. All rights reserved." on every page.
- Referrer-Policy meta on every page.
- Assessment submit hardening and privacy note link.
- Contact page privacy note.
- `rel="noopener noreferrer"` on the LinkedIn profile link.
- `_tools/sync-shared.js` and `_tools/partials/` keep head, header and footer in sync across pages (`--check` mode for CI or manual use).
- Sitemap: `/privacy/`, `/terms/`.
- Cloudflare response-security headers for apex `pathweave.in` only, including HSTS and CSP Report-Only.

## Remaining owner decisions

No unresolved owner decision currently blocks the website's public privacy or terms disclosures.

Operational reminders only:

1. Renew `security.txt` before `Expires: 2027-10-07`.
2. Revisit the policies if PathWeave later registers a legal entity, introduces a CRM, contact form, newsletter, new analytics/advertising technology, a fixed retention schedule or a governing-law decision.
3. If desired, obtain independent Indian legal review as the business formalises.

## Cloudflare status

The original recommendations in `SECURITY-HEADERS-RECOMMENDATIONS.md` have now been implemented in a safer hostname-scoped form. HSTS is sent from the same apex-only response Transform Rule rather than Cloudflare's zone-wide HSTS toggle. CSP remains Report-Only and should not be switched to enforcement until normal-site violations have been reviewed and any inline-script hardening is complete.

## Legal review recommendation

Independent legal review remains advisable as PathWeave formalises its entity, client contracts and data-handling practices. The current pages intentionally avoid claims of full DPDP/GDPR compliance or certification.

## Risk classification

- Critical: none.
- High: none.
- Medium: original S1 and P1 — both addressed.
- Low: S2, S3, P2, P3, P4 — all fixed.
- Informational: S4, S5, P5, P6 — resolved or accepted as documented.
