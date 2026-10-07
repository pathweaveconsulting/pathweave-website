# Security headers — implementation record

Internal document. GitHub Pages does not let the repository set HTTP response headers, and `_headers` files are ignored. The required headers are therefore applied at Cloudflare.

## Status

Applied on 2026-10-07 through a Cloudflare zone-level Response Header Transform Rule scoped only to:

`(http.host eq "pathweave.in")`

The zone-wide Cloudflare HSTS control was deliberately left unchanged so other `pathweave.in` hostnames are not affected by this hardening step.

## Applied response headers

| Header | Value | Status |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Applied |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Applied |
| `X-Frame-Options` | `DENY` | Applied |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()` | Applied |
| `Cross-Origin-Opener-Policy` | `same-origin` | Applied |
| `Strict-Transport-Security` | `max-age=31536000` | Applied; no `includeSubDomains`, no `preload` |
| `Content-Security-Policy-Report-Only` | audited candidate policy below | Applied in Report-Only mode only |

The repository also contains `<meta name="referrer" content="strict-origin-when-cross-origin">` on every page.

## CSP currently in Report-Only mode

```
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

Sources the site currently needs include:

- Scripts: self (`/assets/js/site.js`), the site's inline `js` class helper, assessment inline logic on `/diagnostic/`, Cloudflare-injected inline bot-detection code, `/cdn-cgi/` scripts, and `https://static.cloudflareinsights.com`.
- Styles: self, plus the remaining inline style use on `/diagnostic/` and a few inline `style` attributes.
- Images and fonts: self only.
- Connect: self (`/cdn-cgi/rum`, `/cdn-cgi/challenge-platform/…`) and `https://cloudflareinsights.com`.

`'unsafe-inline'` remains necessary in the Report-Only candidate because of current site/Cloudflare inline scripts. No `unsafe-eval` or wildcard source is used.

## Future hardening path

Do **not** switch CSP from Report-Only to enforcement until normal production navigation and the readiness assessment have been observed for violations and legitimate sources are accounted for.

A later hardening pass can consider:

1. moving the site's remaining inline scripts into local files;
2. reviewing Cloudflare nonce/hash options for injected scripts;
3. removing `'unsafe-inline'` from `script-src` only when safe;
4. enforcing CSP only after a clean observation period.

Do not enable HSTS `includeSubDomains` or `preload` without separately confirming every `pathweave.in` subdomain is HTTPS-ready and intentionally covered.

## Untouched during this change

No change was made to:

- DNS or nameservers;
- SSL mode;
- zone-wide HSTS;
- Web Analytics;
- Bot Fight Mode;
- email obfuscation;
- other domains, projects or PathWeave subdomains.

## Other notes

- `access-control-allow-origin: *` is set by GitHub Pages on public static files. With no authenticated/private content, this remains informational.
- `Cache-Control: max-age=600` is the GitHub Pages default and is acceptable.
