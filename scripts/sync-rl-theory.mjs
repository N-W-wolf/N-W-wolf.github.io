import { cp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultSourceRoot = '/media/windnotebook/Software and Files1/myBlog/content/posts/RL/theory';
const sourceRoot = resolve(process.argv[2] || defaultSourceRoot);
const targetRoot = join(
  projectRoot,
  'src/content/docs/docs/learning/04-quadruped-rl-simulation/04-advanced-theory',
);
const sourceSite = 'https://www.qinshiyue.icu/';

const articles = [
  { source: 'Bellman', file: '01-bellman.md', label: '贝尔曼方程' },
  { source: 'DynamicPlan', file: '02-dynamic-programming.md', label: '动态规划' },
  { source: 'MC', file: '03-monte-carlo.md', label: '蒙特卡洛方法' },
  { source: 'TD', file: '04-temporal-difference.md', label: '时序差分方法' },
  { source: 'multi_TD', file: '05-n-step-td.md', label: '多步时序差分' },
  { source: 'eligibility_trace', file: '06-eligibility-trace.md', label: '资格迹与 TD(λ)' },
  { source: 'dyna-q', file: '07-dyna-q.md', label: 'Dyna-Q' },
  { source: 'function_approximate', file: '08-function-approximation.md', label: '值函数近似' },
  { source: 'DQN', file: '09-dqn.md', label: 'DQN' },
  { source: 'DQNupgrade', file: '10-dqn-improvements.md', label: 'DQN 改进方法' },
  { source: 'poliicy_gradient', file: '11-policy-gradient.md', label: '策略梯度' },
  { source: 'actor_critic', file: '12-actor-critic.md', label: 'Actor-Critic' },
  { source: 'a2c_a3c', file: '13-a2c-a3c.md', label: 'A2C 与 A3C' },
];

function readScalar(frontmatter, key) {
  const value = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'))?.[1]?.trim();
  if (!value) return '';
  if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  return value;
}

function splitDocument(source, sourceFile) {
  const normalized = source.replace(/\r\n?/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`无法解析 Front Matter：${sourceFile}`);
  return { frontmatter: match[1], body: match[2].trim() };
}

async function directoryExists(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

await mkdir(targetRoot, { recursive: true });

for (const [index, article] of articles.entries()) {
  const sourceFile = join(sourceRoot, article.source, 'index.md');
  const { frontmatter, body: originalBody } = splitDocument(await readFile(sourceFile, 'utf8'), sourceFile);
  const title = readScalar(frontmatter, 'title');
  const description = readScalar(frontmatter, 'description');
  const updatedAt = (readScalar(frontmatter, 'lastmod') || readScalar(frontmatter, 'date')).slice(0, 10);
  const draft = readScalar(frontmatter, 'draft') === 'true';
  const assetDirectory = article.file.replace(/\.md$/, '');
  const body = originalBody.replace(
    /(!\[[^\]]*\]\()(?:\.\/)?assets\//g,
    `$1./assets/${assetDirectory}/`,
  );
  const sourceNotice = `> **来源与同步说明：** 本文同步自作者个人博客[“秦时月”](${sourceSite})。个人博客与本网站将并行维护，后续更新会继续同步到本文档中心。`;
  const output = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    ...(updatedAt ? [`lastUpdated: ${updatedAt}`] : []),
    `draft: ${draft}`,
    'sidebar:',
    `  label: ${JSON.stringify(article.label)}`,
    `  order: ${index + 2}`,
    '---',
    '',
    sourceNotice,
    '',
    body,
    '',
  ].join('\n');

  await writeFile(join(targetRoot, article.file), output, 'utf8');

  const sourceAssets = join(sourceRoot, article.source, 'assets');
  if (await directoryExists(sourceAssets)) {
    await cp(sourceAssets, join(targetRoot, 'assets', assetDirectory), {
      recursive: true,
      force: true,
    });
  }
}

console.log(`已同步 ${articles.length} 篇强化学习理论文章到 ${targetRoot}`);
