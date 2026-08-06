import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');

const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? walk(path) : [path];
});

const resolveTarget = (htmlFile, rawTarget) => {
  const target = rawTarget.split('#')[0].split('?')[0];
  if (!target) return null;

  const decoded = decodeURIComponent(target);
  const candidate = decoded.startsWith('/')
    ? join(output, decoded)
    : resolve(dirname(htmlFile), decoded);

  if (existsSync(candidate)) {
    return extname(candidate) ? candidate : join(candidate, 'index.html');
  }

  if (!extname(candidate) && existsSync(`${candidate}.html`)) return `${candidate}.html`;
  return candidate.endsWith('/') ? join(candidate, 'index.html') : candidate;
};

if (!existsSync(output)) {
  console.error('dist/ 不存在，请先运行 npm run build。');
  process.exit(1);
}

const failures = [];
const htmlFiles = walk(output).filter((file) => file.endsWith('.html'));
const attributePattern = /\b(?:href|src)=["']([^"']+)["']/g;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  for (const match of html.matchAll(attributePattern)) {
    const target = match[1];
    if (!target || target.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(target)) continue;
    const resolved = resolveTarget(htmlFile, target);
    if (resolved && !existsSync(resolved)) failures.push({ htmlFile, target });
  }
}

if (failures.length) {
  console.error('发现无效的站内链接：');
  for (const failure of failures) {
    console.error(`- ${failure.htmlFile.replace(`${root}/`, '')}: ${failure.target}`);
  }
  process.exit(1);
}

console.log(`已检查 ${htmlFiles.length} 个 HTML 文件，未发现无效站内链接。`);
