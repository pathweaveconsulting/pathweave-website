# Security headers — recommendations

Internal document. GitHub Pages does not let the repository set HTTP response headers, and `_headers` files are ignored. Headers must therefore be added at Cloudflare. **Nothing here has been applied.** These are CLOUDFLARE OWNER ACTIONS.

## Current production headers (https://pathweave.in/, 2026-10-07)

Present: `Content-Type`, `Cache-Control: max-age=600`, `access-control-allow-origin: *` (GitHub Pages default), `Server: cloudflare`, `alt-svc`.

Absent: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy`.

Done in the repository: `<meta name="referrer" content="strict-origin-when-cross-origin">` on every page (browser default made explicit). A meta CSP was **not** added: it cannot express `frame-ancestors`, and Cloudflare's injected inline scripts would force `'unsafe-inline'`, so it would add risk of breakage for little benefit.

## CLOUDFLARE OWNER ACTIONS

Suggested via **Rules → Transform Rules → Modify Response Header** (or Managed Transforms), hostname `pathweave.in`:

| Header | Value | Risk |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | None expected |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | None |
| `X-Frame-Options` | `DENY` | None (site is never framed) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()` | None (no features used) |
| `Cross-Origin-Opener-Policy` | `same-origin` | Low |
| `Strict-Transport-Security` | Start with `max-age=31536000` (via SSL/TLS → Edge Certificates → HSTS). Add `includeSubDomains` only after confirming **every** pathweave.in subdomain serves HTTPS; do not add `preload` without that review. | Medium if subdomains are not HTTPS-ready |

### Content-Security-Policy (deploy as Report-Only first)

Sources the site needs today:

- Scripts: self (`/assets/js/site.js`), two inline scripts (the `js` class line on every page and the assessment logic on `/diagnostic/`), Cloudflare-injected inline bot-detection snippet, `/cdn-cgi/` scripts, `https://static.cloudflareinsights.com`.
- Styles: self, plus the inline `<style>` on `/diagnostic/` and a few inline `style=""` attributes.
- Images and fonts: self only (`data:` not required).
- Connect: self (`/cdn-cgi/rum`, `/cdn-cgi/challenge-platform/…`) and `https://cloudflareinsights.com`.

Candidate policy:

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self';
  font-src 'self';
  connect-src 'self' https://cloudflareinsights.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests
```

`'unsafe-inline'` in `script-src` is needed because of Cloudflare's injected inline snippet and the site's two inline scripts. Hardening path: move the two site scripts into files, then use Cloudflare's nonce support or hashes. No `unsafe-eval` and no wildcards. Monitor in Report-Only, then enforce.

## Other notes

- `access-control-allow-origin: *` is set by GitHub Pages on static files. The site has no authenticated content, so the risk is informational.
- `Cache-Control: max-age=600` is the GitHub Pages default and is fine.
