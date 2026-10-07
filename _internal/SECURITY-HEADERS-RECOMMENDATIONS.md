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
| `Content-Security-Policy-Report-Only` | hardened audited policy below | Applied in Report-Only mode only |

The repository also contains `<meta name="referrer" content="strict-origin-when-cross-origin">` on every page.

## CSP currently in Report-Only mode

The initial Report-Only policy used `script-src 'unsafe-inline'`. On 2026-10-07 the site's two executable inline scripts were hashed against the exact production bytes and broad `unsafe-inline` was removed from `script-src`.

Current policy:

```
default-src 'self';
script-src 'self' 'sha256-pfgOMgfVZwm2ODyms34QYW9h8EwicylhV77q5LHK8c0=' 'sha256-0Ni9qZdBhSp7LqrcYm3EUwmc6i/DR1dThkgcYUKj9CM=' https://static.cloudflareinsights.com;
script-src-attr 'none';
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

Verified script hashes:

- `sha256-pfgOMgfVZwm2ODyms34QYW9h8EwicylhV77q5LHK8c0=` — shared `document.documentElement.className+=" js"` bootstrap.
- `sha256-0Ni9qZdBhSp7LqrcYm3EUwmc6i/DR1dThkgcYUKj9CM=` — `/diagnostic/` readiness-assessment logic.

The policy also explicitly blocks inline script attributes with `script-src-attr 'none'`.

Styles still allow `unsafe-inline` because `/diagnostic/` retains an inline `<style>` block and the site has a small number of inline `style` attributes. This is a style-only exception, not a script exception.

## Enforced-policy validation completed

Before deciding whether to enforce CSP globally, a temporary second Cloudflare response-header rule was created only for explicit test URLs containing:

`__pw_csp_test=1`

This allowed the exact CSP above to be tested in enforcement mode without changing normal visitor traffic.

Validated successfully:

- `https://pathweave.in/?__pw_csp_test=1`
  - returned HTTP 200;
  - received the enforced `Content-Security-Policy` header;
  - the shared JavaScript bootstrap executed (`<html>` received the `js` class);
  - the page rendered normally.

- `https://pathweave.in/diagnostic/?__pw_csp_test=1`
  - returned HTTP 200;
  - received the enforced `Content-Security-Policy` header;
  - the shared bootstrap executed;
  - the readiness-assessment script executed: the `Calculate My Readiness Score` button was no longer disabled after load;
  - the diagnostic rendered normally.

The temporary enforcement rule was then removed. Ordinary production responses remain Report-Only.

## Why CSP is not globally enforced yet

Cloudflare Bot Fight Mode on the current plan automatically uses JavaScript Detections. Cloudflare documents that JavaScript Detections may inject an inline script. With an enforced CSP that does not use a nonce, that injected inline script can be refused even when `/cdn-cgi/challenge-platform/` is otherwise permitted by `script-src 'self'`.

Cloudflare recommends CSP nonces rather than `unsafe-inline` for this case and states that Cloudflare can copy a nonce from the CSP response header onto its injected scripts.

PathWeave is currently served by static GitHub Pages. It therefore does not have an origin mechanism that generates a fresh unpredictable nonce per HTML response and places the matching nonce on PathWeave's own scripts/response header. Using a fixed nonce would weaken the security purpose of a nonce and is not being adopted.

For that reason, global CSP enforcement is deliberately deferred. This protects the existing Bot Fight Mode / JavaScript Detection security layer rather than trading one security control for another.

## Current safe hardening state

Production currently has:

- a hostname-scoped security-header rule for apex `pathweave.in` only;
- HSTS without `includeSubDomains` or `preload`;
- `nosniff`;
- referrer policy;
- frame denial;
- restrictive Permissions Policy;
- COOP `same-origin`;
- CSP in Report-Only mode;
- no `unsafe-inline` in `script-src`;
- exact hashes for PathWeave's executable inline scripts;
- `script-src-attr 'none'`;
- no `unsafe-eval`;
- no wildcard script sources;
- Bot Fight Mode, JavaScript Detections, Web Analytics and email obfuscation preserved.

## Future CSP enforcement options

Do not switch CSP to global enforcement until one of these safe paths is available and tested:

1. serve HTML through an edge/runtime layer capable of generating a fresh CSP nonce per response and applying it consistently;
2. use another Cloudflare-supported nonce architecture that keeps nonces unpredictable per response;
3. if the hosting/security architecture changes, re-test Cloudflare JavaScript Detections under the intended enforced CSP before rollout.

Do **not** disable Bot Fight Mode merely to make CSP enforcement easier unless there is a separate security decision to do so.

Moving the PathWeave inline scripts into local files remains a maintainability improvement, but by itself it does not solve Cloudflare's injected inline JavaScript Detection requirement. The current exact hashes already remove broad script `unsafe-inline` for PathWeave code.

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
