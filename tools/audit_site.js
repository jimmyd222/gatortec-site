// Comprehensive site audit — links, images, a11y, HTML hygiene
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const findings = { broken_links: [], missing_images: [], a11y: [], hygiene: [], titles: {} };

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.name === 'assets') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) audit(full);
  }
}

function resolveRel(fromFile, href) {
  // Strip query/fragment for file existence check
  const clean = href.replace(/[?#].*$/, '');
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('mailto:') ||
      clean.startsWith('tel:') || clean.startsWith('javascript:') || clean === '' || clean === '#') return null;
  let target;
  if (clean.startsWith('/')) {
    target = path.join(ROOT, clean);
  } else {
    target = path.resolve(path.dirname(fromFile), clean);
  }
  // If it points to a directory, look for index.html
  if (target.endsWith('/')) target = path.join(target, 'index.html');
  try {
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      const indexed = path.join(target, 'index.html');
      return fs.existsSync(indexed) ? null : target; // null = OK, otherwise return the missing target
    }
    return null; // exists
  } catch (e) {
    return target; // missing
  }
}

function audit(file) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);

  // 1. Title check (uniqueness)
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (titleMatch) {
    const t = titleMatch[1].trim();
    if (findings.titles[t]) findings.titles[t].push(rel);
    else findings.titles[t] = [rel];
  } else {
    findings.hygiene.push({ file: rel, issue: 'missing <title>' });
  }

  // 2. Links — check anchors with href
  const linkRegex = /<a\s[^>]*href="([^"]+)"[^>]*>/g;
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    const href = m[1];
    const missing = resolveRel(file, href);
    if (missing) findings.broken_links.push({ file: rel, href, expected: path.relative(ROOT, missing) });
  }

  // 3. Images — check src files exist + alt attribute present
  const imgRegex = /<img\s[^>]*src="([^"]+)"[^>]*>/g;
  while ((m = imgRegex.exec(html)) !== null) {
    const src = m[1];
    const tag = m[0];
    const missing = resolveRel(file, src);
    if (missing) findings.missing_images.push({ file: rel, src, expected: path.relative(ROOT, missing) });
    if (!/\salt=/.test(tag)) findings.a11y.push({ file: rel, issue: 'img without alt=', detail: tag.slice(0, 80) });
  }

  // 4. Buttons must have accessible name (text content OR aria-label)
  const btnRegex = /<button[^>]*>([\s\S]*?)<\/button>/g;
  while ((m = btnRegex.exec(html)) !== null) {
    const tag = m[0];
    const inner = m[1].replace(/<[^>]+>/g, '').trim();
    const hasLabel = /aria-label="[^"]+"/.test(tag);
    if (!inner && !hasLabel) findings.a11y.push({ file: rel, issue: 'button without accessible name', detail: tag.slice(0, 100) });
  }

  // 5. Inputs (non-hidden, non-submit) should have a label or aria-label.
  // Skip honeypots (aria-hidden="true") and inputs in JS template literals (containing ${...}).
  const inputRegex = /<input\s[^>]*>/g;
  while ((m = inputRegex.exec(html)) !== null) {
    const tag = m[0];
    if (/type="(hidden|submit|button|checkbox)"/.test(tag)) continue;
    if (/aria-hidden="true"/.test(tag)) continue;
    if (/\$\{[^}]+\}/.test(tag)) continue; // JS template literal — skip
    const id = (tag.match(/id="([^"]+)"/) || [])[1];
    const hasAriaLabel = /aria-label="[^"]+"/.test(tag);
    const hasLabel = id && new RegExp('<label[^>]*for="' + id + '"').test(html);
    if (!hasAriaLabel && !hasLabel) {
      findings.a11y.push({ file: rel, issue: 'input without label', detail: tag.slice(0, 100) });
    }
  }
  // 6. Textareas / selects too
  for (const tagName of ['textarea', 'select']) {
    const re = new RegExp('<' + tagName + '\\s[^>]*>', 'g');
    while ((m = re.exec(html)) !== null) {
      const tag = m[0];
      if (/\$\{[^}]+\}/.test(tag)) continue; // JS template literal — skip
      const id = (tag.match(/id="([^"]+)"/) || [])[1];
      const hasAriaLabel = /aria-label="[^"]+"/.test(tag);
      const hasLabel = id && new RegExp('<label[^>]*for="' + id + '"').test(html);
      if (!hasAriaLabel && !hasLabel) findings.a11y.push({ file: rel, issue: tagName + ' without label', detail: tag.slice(0, 100) });
    }
  }

  // 7. H1 count
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count === 0) findings.a11y.push({ file: rel, issue: 'no <h1>' });
  else if (h1Count > 1) findings.a11y.push({ file: rel, issue: 'multiple <h1> (' + h1Count + ')' });

  // 8. Lang attribute
  if (!/<html[^>]*\slang=/.test(html)) findings.a11y.push({ file: rel, issue: 'missing lang on <html>' });

  // 9. Skip link
  if (!/skip-link/.test(html)) findings.a11y.push({ file: rel, issue: 'missing skip-link' });

  // 10. Empty href (#)
  if (/href="#"(?!\s*onclick)/.test(html)) findings.hygiene.push({ file: rel, issue: 'empty href="#" without onclick' });
}

walk(ROOT);

// Report
console.log('\n========= SITE AUDIT REPORT =========\n');

console.log('### Broken internal links (' + findings.broken_links.length + ')');
findings.broken_links.forEach(b => console.log('  ' + b.file + ' → ' + b.href + ' (expected ' + b.expected + ')'));

console.log('\n### Missing images (' + findings.missing_images.length + ')');
findings.missing_images.forEach(b => console.log('  ' + b.file + ' → ' + b.src + ' (expected ' + b.expected + ')'));

console.log('\n### Accessibility issues (' + findings.a11y.length + ')');
// Group by issue type
const a11yByType = {};
for (const f of findings.a11y) {
  a11yByType[f.issue] = (a11yByType[f.issue] || []);
  a11yByType[f.issue].push(f);
}
for (const [issue, list] of Object.entries(a11yByType)) {
  console.log('  ' + issue + ' (' + list.length + ' instances)');
  list.slice(0, 3).forEach(f => console.log('    ' + f.file + (f.detail ? ' — ' + f.detail : '')));
  if (list.length > 3) console.log('    … ' + (list.length - 3) + ' more');
}

console.log('\n### HTML hygiene (' + findings.hygiene.length + ')');
findings.hygiene.forEach(f => console.log('  ' + f.file + ': ' + f.issue));

console.log('\n### Duplicate <title>');
const dupes = Object.entries(findings.titles).filter(([_, files]) => files.length > 1);
if (dupes.length === 0) console.log('  (none — all titles unique)');
else dupes.forEach(([t, files]) => {
  console.log('  "' + t + '" used in ' + files.length + ' pages:');
  files.forEach(f => console.log('    ' + f));
});

console.log('\n=================================');
console.log('Summary: ' + findings.broken_links.length + ' broken links, ' +
  findings.missing_images.length + ' missing images, ' +
  findings.a11y.length + ' a11y issues, ' +
  findings.hygiene.length + ' hygiene issues');
