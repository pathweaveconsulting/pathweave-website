#!/usr/bin/env node
/*
 * PathWeave — sync shared page blocks. No dependencies; run with Node 18+:
 *
 *   node _tools/sync-shared.js          (writes changes)
 *   node _tools/sync-shared.js --check  (reports pages that are out of date; exit 1 if any)
 *
 * Every page carries three marked blocks:
 *   <!-- pw:head -->   ... <!-- /pw:head -->    from _tools/partials/head.html
 *   <!-- pw:header --> ... <!-- /pw:header -->  generated below (per-page active link)
 *   <!-- pw:footer --> ... <!-- /pw:footer -->  from _tools/partials/footer.html
 *
 * A new page can use the placeholders <!--#header--> and <!--#footer--> after <body>;
 * the head block is inserted before </head> if missing.
 * Folders starting with "_" or "." are never published by GitHub Pages, so this
 * tool and its partials stay private.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');
const read = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8').trim();
const HEAD = read('partials/head.html');
const FOOTER = read('partials/footer.html');

const practices = [
  ['/businessos/', 'BusinessOS', 'Sales, CRM, data and how the business runs'],
  ['/peopleos/', 'PeopleOS', 'HR, organisation and people systems'],
  ['/skillhubos/', 'Skill HubOS', 'Education-to-employment capability'],
  ['/government-advisory/', 'Government Advisory', 'Policy, incentives and approvals'],
];

function header(urlPath) {
  const inPractice = practices.some(([href]) => urlPath.startsWith(href));
  const link = (href, label) => {
    if (urlPath === href) return `<a class="nav-link" href="${href}" aria-current="page">${label}</a>`;
    if (urlPath.startsWith(href)) return `<a class="nav-link is-current" href="${href}">${label}</a>`;
    return `<a class="nav-link" href="${href}">${label}</a>`;
  };
  const sub = practices.map(([href, name, desc], i) =>
    `${i === 2 ? '<li class="sub-divider" role="presentation"></li>' : ''}<li${i > 1 ? ' class="sub-secondary"' : ''}><a href="${href}"${urlPath === href ? ' aria-current="page"' : ''}><strong>${name}</strong><span>${desc}</span></a></li>`
  ).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="PathWeave home"><img src="/assets/images/pathweave-mark.webp" width="176" height="96" alt=""><span class="brand-name">PathWeave</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="menu-icon" aria-hidden="true"></span><span class="menu-label">Menu</span></button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="nav-list">
        <li class="has-sub"><button class="nav-link sub-toggle${inPractice ? ' is-current' : ''}" type="button" aria-expanded="false" aria-controls="nav-practices">Practices</button>
          <ul class="sub-menu" id="nav-practices">${sub}</ul></li>
        <li>${link('/how-we-work/', 'How We Work')}</li>
        <li>${link('/insights/', 'Insights')}</li>
        <li>${link('/about/', 'About')}</li>
      </ul>
      <a class="button button-primary button-small nav-cta" href="/contact/">Start a conversation</a>
    </nav>
  </div>
</header>`;
}

function pages(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name.startsWith('_') || e.name === 'node_modules' || e.name === 'Claude outputs') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) pages(p, out);
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

function setBlock(html, name, body, fallback) {
  const block = `<!-- pw:${name} -->\n${body}\n<!-- /pw:${name} -->`;
  const re = new RegExp(`<!-- pw:${name} -->[\\s\\S]*?<!-- /pw:${name} -->`);
  if (re.test(html)) return html.replace(re, () => block);
  return fallback(html, block);
}

let stale = 0;
for (const file of pages(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const urlPath = '/' + rel.replace(/index\.html$/, '');
  const before = fs.readFileSync(file, 'utf8');
  let html = before;
  html = setBlock(html, 'head', HEAD, (h, b) => h.replace('</head>', `${b}\n</head>`));
  html = setBlock(html, 'header', header(urlPath), (h, b) => h.replace('<!--#header-->', b));
  html = setBlock(html, 'footer', FOOTER, (h, b) => h.replace('<!--#footer-->', b));
  if (!html.includes('<!-- pw:header -->') || !html.includes('<!-- pw:footer -->')) {
    console.error(`missing header/footer markers: ${rel}`);
    process.exitCode = 1;
    continue;
  }
  if (html !== before) {
    stale++;
    if (CHECK) console.log(`out of date: ${rel}`);
    else { fs.writeFileSync(file, html); console.log(`updated: ${rel}`); }
  }
}
if (CHECK && stale) process.exitCode = 1;
console.log(stale ? `${stale} page(s) ${CHECK ? 'out of date' : 'updated'}` : 'all pages in sync');
