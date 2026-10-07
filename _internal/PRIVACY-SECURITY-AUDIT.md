# PathWeave website — privacy & security audit (2026-10-07)

Internal document. Starting commit `09e55a7`; branch `audit/privacy-security-2026-10`. Scope: pathweave.in only. Lightweight, non-intrusive checks; no Cloudflare or DNS changes made. Full evidence: `PRIVACY-DATA-INVENTORY.md`.

## Executive summary

The website collects very little: no forms, accounts, first-party cookies or browser storage. The readiness assessment runs entirely in the browser. The main gaps were the absence of any Privacy Policy, Terms or security contact, missing HTTP security headers (which need Cloudflare), and one edge case where assessment answers could have reached a URL. The repository-side gaps are fixed. Header hardening needs Cloudflare owner action.

## Data collected

- Visitor-initiated email, phone, WhatsApp and LinkedIn messages, outside the website.
- Standard request data (IP, user agent, URL, referrer) processed by Cloudflare and GitHub Pages.
- Cloudflare Web Analytics page-view and performance data.
- Cloudflare bot-detection signals and the `cf_clearance` cookie.

## Data not collected

Names or emails through the site, assessment answers, accounts, payment data, marketing consent, advertising identifiers, session recordings, error telemetry. Scans found no Google Analytics, Tag Manager, Meta or LinkedIn pixels, Hotjar, Clarity, PostHog, Sentry, LogRocket or FullStory.

## Cookies

`cf_clearance` only (Cloudflare security, strictly necessary, HttpOnly, Secure, SameSite=None, about one year). No consent banner is required for this or for cookieless analytics. The Privacy Policy discloses both.

## Analytics

Cloudflare Web Analytics (Cloudflare-injected, cookieless). Left enabled as instructed.

## Third parties

Cloudflare and GitHub Pages. Visitor-chosen channels: email provider (unknown), WhatsApp, LinkedIn. No other external resources load.

## Storage

None used by the site.

## Security findings

| # | Finding | Severity | Status |
|---|---|---|---|
| S1 | No HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy or frame protection headers | Medium | Cloudflare owner action (`SECURITY-HEADERS-RECOMMENDATIONS.md`); Referrer-Policy meta added |
| S2 | Assessment form had no `action`; a native submit before or without JS would put answers in the URL query string | Low | Fixed: submit disabled until script runs |
| S3 | No security contact | Low | Fixed: `/.well-known/security.txt` (Contact: growth@pathweave.in) |
| S4 | One `target="_blank"` link had `rel="noopener"` only | Informational | Fixed: `noopener noreferrer` |
| S5 | `access-control-allow-origin: *` from GitHub Pages | Informational | No action; public static content |
| S6 | Secrets / credentials in repo or history | — | None found |
| S7 | Sensitive paths (`.git`, `.env`, `_seo-briefs`, internal folders) | — | Not served (404) |
| S8 | HTTPS / mixed content | — | 301 to HTTPS; all assets same-origin HTTPS |

## Privacy/legal findings

| # | Finding | Severity | Status |
|---|---|---|---|
| P1 | No Privacy Policy despite analytics, a security cookie and enquiry channels | Medium | Fixed: `/privacy/` |
| P2 | No Website Terms / content disclaimer | Low | Fixed: `/terms/` |
| P3 | No legal links in footer | Low | Fixed: Privacy and Terms in footer on all pages |
| P4 | Contact page had no privacy notice | Low | Fixed: short note linking the policy |
| P5 | Assessment privacy note did not link a policy | Informational | Fixed |
| P6 | Legal entity, retention periods and governing law not evidenced | Informational | Owner decision; policies avoid stating them |

## Fixes implemented

- `/privacy/`, `/terms/`, `/.well-known/security.txt`, `_config.yml` (publishes `.well-known`).
- Footer: Privacy and Terms links and "© 2026 PathWeave. All rights reserved." on every page.
- Referrer-Policy meta on every page.
- Assessment submit hardening and privacy note link.
- Contact page privacy note.
- `rel="noopener noreferrer"` on the LinkedIn profile link.
- `_tools/sync-shared.js` and `_tools/partials/` keep head, header and footer in sync across pages (`--check` mode for CI or manual use).
- Sitemap: `/privacy/`, `/terms/`.

## Remaining owner decisions

1. Legal entity name / registered office, if it should appear in the policy or terms.
2. Retention periods for enquiry correspondence, if a fixed period should be stated.
3. Whether enquiries are copied into a CRM or other system; update the Privacy Policy if so.
4. Whether `growth@pathweave.in` should remain the privacy and security contact (a dedicated, monitored address can replace it in `/privacy/` and `security.txt`).
5. Governing law / jurisdiction for the Terms (deliberately omitted).
6. Renew `security.txt` before `Expires: 2027-10-07`.

## Cloudflare recommendations

See `SECURITY-HEADERS-RECOMMENDATIONS.md`: add `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` and HSTS (after a subdomain HTTPS check), then a CSP in Report-Only mode first. Do not disable Bot Fight Mode or Web Analytics without an owner decision. If the policy wording changes because analytics is removed, update `/privacy/`.

## Legal review recommendations

Have a qualified Indian lawyer review `/privacy/` and `/terms/` against the DPDP Act, 2023 and its Rules, especially notice requirements, grievance contact and any obligations that apply as implementation phases take effect. The pages avoid any claim of full compliance or certification.

## Risk classification

- Critical: none.
- High: none.
- Medium: S1, P1 (P1 fixed).
- Low: S2, S3, P2, P3, P4 (all fixed).
- Informational: S4, S5, P5, P6.
