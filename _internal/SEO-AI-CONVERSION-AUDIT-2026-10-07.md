# PathWeave SEO, AI discoverability and conversion audit — 7 October 2026

Internal working record. Do not publish.

## Executive finding

The redesigned site is technically strong and contains a useful 12-article Insights library, focused Health Checks, founder authority pages, canonical URLs, structured data, sitemap, robots.txt, llms.txt and an About-for-AI reference page. The main near-term issue is not missing SEO infrastructure: it is consistency and recrawl. Search results observed on 7 October 2026 still show pre-redesign snippets for the homepage, About, Contact and Insights, including an obsolete Renu title and the old empty Insights page.

## Priority fixes

1. Remove the global claim that Hyderabad/Secunderabad is PathWeave's "primary market". PathWeave's intended positioning is broader; Hyderabad remains a factual presence/location, not the defining market in global metadata/entity copy.
2. Keep local landing pages for Hyderabad, Nagpur, Bhopal and Indore, but separate local SEO from the main brand/entity positioning.
3. Update sitemap lastmod values truthfully for pages materially changed on 7 October 2026 to encourage recrawling of the redesigned/current content.
4. Keep founder entities consistent: Srrinivas Sharrma — Founder, leads BusinessOS; Renu Dhanopia Sharma — Founder, leads PeopleOS.
5. Maintain the existing Health Check conversion path: homepage -> focused offer -> direct email/contact. Do not add a web form or heavy analytics solely for measurement.
6. Preserve the 12-guide Insights hub and strengthen internal links from service/Health Check pages rather than creating generic filler content.

## Search observations

Search engine results retrieved on 7 October 2026 were about four weeks old and still exposed previous content. Notably:
- About result still showed Renu as "Principal Consultant".
- Insights result still said "the first PathWeave insights are coming soon" even though the live repo now contains 12 guides.
- Homepage and Contact results also reflected previous copy.

This is a recrawl/index-refresh problem, not evidence that the current repository reverted.

## Technical state

- robots.txt: open crawl, sitemap declared.
- sitemap.xml: 45 public URLs, including Privacy, Terms, Insights, Health Checks, location pages and Srrinivas authority pages.
- canonical tags: present on reviewed key pages.
- structured data: Organization/WebSite/FAQ on homepage; Person entities on About; Service schema on Health Checks; CollectionPage/ItemList on Insights.
- AI-readable surfaces: /about-for-ai/, /llms.txt, /llms-full.txt.
- security/privacy: already hardened separately; do not weaken or add tracking libraries.

## Conversion observations

Strengths:
- clear primary CTA: Start a conversation.
- two focused paid entry offers reduce commitment friction.
- Health Checks state scope, output, fixed-price principle and no obligation to continue.
- diagnostic requires no email and keeps answers in-browser.
- Contact supports email, phone, WhatsApp and LinkedIn without a form.

Remaining opportunity:
- keep direct topic-prefilled contact links on Health Check pages;
- make sure broad brand pages do not over-focus on one geography;
- use useful guides as pre-conversion proof and question-sharpening content.

## Content authority priorities after recrawl

BusinessOS next topics should deepen authority around Sales Transformation, Sales Excellence, Commercial Excellence, Sales Operations, CRM adoption, management cadence, value-based pricing, distributor/channel governance and GTM execution. PeopleOS can continue practical HR-system content. New content should be evidence-led and should not be added merely for volume.

## Do not do

- Do not redesign the site again.
- Do not add generic AI-written city pages.
- Do not add invasive analytics, session replay, ad pixels or cookie banners just for measurement.
- Do not change founder titles.
- Do not weaken CSP, Bot Fight Mode or other Cloudflare security controls.
- Do not create unverifiable client outcomes.
