#!/usr/bin/env node
// Extracts legitimate page/post content from the WordPress SQL dump into
// _extracted/*.md, and wp_wpdatatable_* rows into _extracted/devices/*.json.
// Strips Fusion shortcodes, normalizes HTML entities, drops obvious spam.

const fs = require('fs');
const path = require('path');

const SQL_PATH = path.resolve(__dirname, '..', 'gatort5_wp389.sql');
const OUT_DIR = path.resolve(__dirname, '..', '_extracted');
const DEV_DIR = path.join(OUT_DIR, 'devices');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(DEV_DIR, { recursive: true });

const sql = fs.readFileSync(SQL_PATH, 'utf8');
console.log(`Loaded SQL: ${(sql.length / 1024 / 1024).toFixed(1)} MB`);

/* ────────────────────────────────────────────────────────────────────────── */
/* SQL tuple parser                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

// Walk through "(v1,v2,'v 3 with \'escapes\'',...),(...),(...);" starting at pos.
// Returns array of tuples (each tuple = array of typed values: number|string|null).
function parseTuples(s, startPos) {
  const tuples = [];
  let i = startPos;
  const n = s.length;
  while (i < n) {
    // skip whitespace/commas/newlines
    while (i < n && /[\s,]/.test(s[i])) i++;
    if (i >= n || s[i] === ';') break;
    if (s[i] !== '(') break;
    i++; // past (
    const values = [];
    while (i < n) {
      // skip whitespace
      while (i < n && /\s/.test(s[i])) i++;
      let v;
      if (s[i] === "'") {
        // quoted string with mysqldump escape sequences
        i++;
        let buf = '';
        const ESC = { n: '\n', r: '\r', t: '\t', 0: '\0', b: '\b', Z: '\x1a' };
        while (i < n) {
          const c = s[i];
          if (c === '\\') {
            const next = s[i + 1];
            buf += (next in ESC) ? ESC[next] : next;
            i += 2; continue;
          }
          if (c === "'") {
            if (s[i + 1] === "'") { buf += "'"; i += 2; continue; }
            i++; // closing quote
            break;
          }
          buf += c; i++;
        }
        v = buf;
      } else if (s.startsWith('NULL', i)) {
        v = null; i += 4;
      } else {
        // unquoted number or token
        let start = i;
        while (i < n && !/[,\)]/.test(s[i])) i++;
        const tok = s.slice(start, i).trim();
        v = tok === '' ? null : (isNaN(Number(tok)) ? tok : Number(tok));
      }
      values.push(v);
      while (i < n && /\s/.test(s[i])) i++;
      if (s[i] === ',') { i++; continue; }
      if (s[i] === ')') { i++; break; }
      // malformed — bail
      break;
    }
    tuples.push(values);
  }
  return { tuples, end: i };
}

// Find all INSERT INTO `tableName` ... VALUES blocks and parse them all.
function extractTable(tableName) {
  const all = [];
  let columns = null;
  const insertRe = new RegExp(
    'INSERT INTO `' + tableName + '`\\s*(?:\\(([^\\)]+)\\))?\\s*VALUES',
    'g'
  );
  let m;
  while ((m = insertRe.exec(sql)) !== null) {
    if (m[1] && !columns) {
      columns = m[1].split(',').map(c => c.trim().replace(/^`|`$/g, ''));
    }
    const { tuples } = parseTuples(sql, m.index + m[0].length);
    all.push(...tuples);
  }
  return { columns, rows: all };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Cleaners                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

const HTML_ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'",
  '&apos;': "'", '&nbsp;': ' ', '&rsquo;': '’', '&lsquo;': '‘',
  '&rdquo;': '”', '&ldquo;': '“', '&mdash;': '—',
  '&ndash;': '–', '&hellip;': '…', '&trade;': '™',
  '&reg;': '®', '&copy;': '©',
};

function decodeEntities(s) {
  return s.replace(/&[a-z#0-9]+;/gi, e => HTML_ENTITIES[e] || e);
}

// Remove Fusion (Avada) shortcodes: [fusion_foo attr="..."] ... [/fusion_foo]
// Keep inner content. Also strip standalone [shortcode attr="..."] (self-closing).
function stripFusion(html) {
  let prev;
  let out = html;
  // strip opening + closing tag pairs, preserving inner content
  do {
    prev = out;
    out = out.replace(/\[(\/?fusion_[a-z_]+)[^\]]*\]/gi, '');
  } while (out !== prev);
  // strip any other shortcodes
  out = out.replace(/\[\/?[a-z_]+(?:\s+[^\]]*)?\]/gi, '');
  return out;
}

// Strip HTML tags, preserving common structural breaks.
function htmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<h([1-6])[^>]*>/gi, (_, n) => '\n' + '#'.repeat(Number(n)) + ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Render an HTML <table>...</table> block as a markdown table.
function tablesToMarkdown(html) {
  return html.replace(/<table[\s\S]*?<\/table>/gi, (table) => {
    const captionMatch = table.match(/<caption[^>]*>([\s\S]*?)<\/caption>/i);
    const caption = captionMatch ? htmlToText(captionMatch[1]).trim() : '';
    const rows = [];
    const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let r;
    while ((r = rowRe.exec(table)) !== null) {
      const cells = [];
      const cellRe = /<(t[hd])[^>]*>([\s\S]*?)<\/\1>/gi;
      let c;
      while ((c = cellRe.exec(r[1])) !== null) {
        cells.push(htmlToText(c[2]).replace(/\|/g, '\\|').trim());
      }
      if (cells.length) rows.push(cells);
    }
    if (!rows.length) return '';
    const header = rows[0];
    const body = rows.slice(1);
    const widths = header.map((_, i) => Math.max(...rows.map(r => (r[i] || '').length)));
    const fmt = r => '| ' + r.map((cell, i) => (cell || '').padEnd(widths[i])).join(' | ') + ' |';
    const sep = '| ' + widths.map(w => '-'.repeat(Math.max(3, w))).join(' | ') + ' |';
    let md = '';
    if (caption) md += `**${caption}**\n\n`;
    md += fmt(header) + '\n' + sep + '\n' + body.map(fmt).join('\n') + '\n\n';
    return md;
  });
}

// Spam heuristic: kill content with known injection markers.
function isLikelySpam(text) {
  const markers = [
    /\bjudi\b/i, /\bslot online\b/i, /\bgacor\b/i, /\bsitus\b/i,
    /\btogel\b/i, /\bbandar\b/i, /\bpkv\b/i, /\bpoker online\b/i,
    /\bsbobet\b/i, /\bcasino online\b/i, /\bdaftar slot\b/i,
    /situs slot/i, /slot deposit/i, /\bjoker123\b/i, /\bidnpoker\b/i,
  ];
  return markers.some(re => re.test(text));
}

// Strip long unbroken runs of base64-looking gibberish (common in dumps where
// wpcode/firebox blobs land inside post_content). 60+ chars of [A-Za-z0-9+/=]
// with no whitespace is not natural English.
function stripBase64Blobs(s) {
  return s.replace(/[A-Za-z0-9+/=]{60,}/g, '');
}

function cleanContent(raw) {
  if (!raw) return '';
  let s = raw;
  s = tablesToMarkdown(s);
  s = stripFusion(s);
  s = decodeEntities(s);
  s = htmlToText(s);
  s = decodeEntities(s);
  s = stripBase64Blobs(s);
  s = s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

function slugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'untitled';
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Extract wp_posts                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

const POST_COLS = [
  'ID', 'post_author', 'post_date', 'post_date_gmt', 'post_content',
  'post_title', 'post_excerpt', 'post_status', 'comment_status', 'ping_status',
  'post_password', 'post_name', 'to_ping', 'pinged', 'post_modified',
  'post_modified_gmt', 'post_content_filtered', 'post_parent', 'guid',
  'menu_order', 'post_type', 'post_mime_type', 'comment_count',
];

console.log('\nParsing wp_posts…');
const { rows: postRows } = extractTable('wp_posts');
console.log(`  ${postRows.length} rows`);

const KEEP_TYPES = new Set(['page', 'post']);
const stats = { total: postRows.length, kept: 0, spamFiltered: 0, byType: {}, byStatus: {} };

const pages = [];
for (const r of postRows) {
  const post = Object.fromEntries(POST_COLS.map((c, i) => [c, r[i]]));
  stats.byType[post.post_type] = (stats.byType[post.post_type] || 0) + 1;
  stats.byStatus[post.post_status] = (stats.byStatus[post.post_status] || 0) + 1;
  if (!KEEP_TYPES.has(post.post_type)) continue;
  if (post.post_status !== 'publish') continue;
  if (!post.post_content || !post.post_content.trim()) continue;

  const cleaned = cleanContent(post.post_content);
  if (!cleaned) continue;
  if (isLikelySpam(post.post_title) || isLikelySpam(cleaned)) {
    stats.spamFiltered++;
    continue;
  }
  pages.push({
    id: post.ID,
    type: post.post_type,
    slug: post.post_name || slugify(post.post_title),
    title: decodeEntities(post.post_title || '').trim(),
    date: post.post_date,
    modified: post.post_modified,
    content: cleaned,
    guid: post.guid,
  });
  stats.kept++;
}
console.log(`  kept: ${stats.kept} (spam filtered: ${stats.spamFiltered})`);
console.log(`  by type:`, stats.byType);
console.log(`  by status:`, stats.byStatus);

// Disambiguate duplicate slugs by appending the post ID
const slugCount = {};
for (const p of pages) {
  const key = `${p.type}-${p.slug || 'id-' + p.id}`;
  slugCount[key] = (slugCount[key] || 0) + 1;
}
for (const p of pages) {
  const baseKey = `${p.type}-${p.slug || 'id-' + p.id}`;
  p.filename = slugCount[baseKey] > 1
    ? `${p.type}-${p.slug || 'untitled'}-${p.id}.md`
    : `${p.type}-${p.slug || 'id-' + p.id}.md`;
}

pages.sort((a, b) => a.type.localeCompare(b.type) || a.slug.localeCompare(b.slug));
for (const p of pages) {
  const fname = p.filename;
  const fpath = path.join(OUT_DIR, fname);
  const md = [
    `---`,
    `id: ${p.id}`,
    `type: ${p.type}`,
    `slug: ${p.slug}`,
    `title: ${JSON.stringify(p.title)}`,
    `date: ${p.date}`,
    `modified: ${p.modified}`,
    `guid: ${p.guid}`,
    `---`,
    ``,
    `# ${p.title}`,
    ``,
    p.content,
    ``,
  ].join('\n');
  fs.writeFileSync(fpath, md);
}
console.log(`  wrote ${pages.length} files to _extracted/`);

/* ────────────────────────────────────────────────────────────────────────── */
/* Extract wp_wpdatatable_*                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

console.log('\nParsing wp_wpdatatable_* device tables…');
const tableRe = /CREATE TABLE `(wp_wpdatatable_\d+)`/g;
const tableNames = [];
let tm;
while ((tm = tableRe.exec(sql)) !== null) tableNames.push(tm[1]);

const devSummary = [];
for (const t of tableNames) {
  const { columns, rows } = extractTable(t);
  if (!columns || !rows.length) continue;
  const objs = rows.map(r => {
    const o = {};
    columns.forEach((c, i) => { o[c] = r[i]; });
    return o;
  });
  const outFile = path.join(DEV_DIR, t + '.json');
  fs.writeFileSync(outFile, JSON.stringify({ table: t, columns, rows: objs }, null, 2));
  devSummary.push({ table: t, rows: rows.length, columns });
  console.log(`  ${t}: ${rows.length} rows · cols=[${columns.join(', ')}]`);
}
fs.writeFileSync(path.join(DEV_DIR, '_index.json'), JSON.stringify(devSummary, null, 2));

/* ────────────────────────────────────────────────────────────────────────── */
/* Index                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

const idx = [
  `# Extracted content`,
  ``,
  `Source: gatort5_wp389.sql`,
  `Pages/posts: ${pages.length} (spam filtered: ${stats.spamFiltered})`,
  `Device tables: ${devSummary.length}`,
  ``,
  `## Pages`,
  ...pages.filter(p => p.type === 'page')
    .map(p => `- [${p.title}](${p.filename}) — id ${p.id} · slug ${p.slug}`),
  ``,
  `## Posts`,
  ...pages.filter(p => p.type === 'post')
    .map(p => `- [${p.title}](${p.filename}) — id ${p.id} · slug ${p.slug}`),
  ``,
  `## Device tables`,
  ...devSummary.map(d => `- \`${d.table}\` — ${d.rows} rows · ${d.columns.length} columns`),
  ``,
].join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'INDEX.md'), idx);
console.log(`\nWrote INDEX.md`);
console.log('Done.');
