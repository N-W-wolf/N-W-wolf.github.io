import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import { readFileSync, readdirSync } from 'node:fs';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import rehypeImageCaptions from './src/plugins/rehype-image-captions.mjs';
import remarkImageSize from './src/plugins/remark-image-size.mjs';

const siteUrl = process.env.SITE_URL?.trim() || 'https://n-w-wolf.github.io';
const learningDirectory = new URL('./src/content/docs/docs/learning/', import.meta.url);

/**
 * Automatically expose Markdown files placed directly in `docs/learning/`.
 * Subdirectories remain explicit below so their Chinese labels and grouping stay stable.
 */
const learningRootPages = readdirSync(learningDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
  .map((entry) => {
    const source = readFileSync(new URL(entry.name, learningDirectory), 'utf8');
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
    const title = frontmatter.match(/^title:\s*(.+?)\s*$/m)?.[1]?.replace(/^(['"])(.*)\1$/, '$2');
    const order = Number(frontmatter.match(/^\s+order:\s*(-?\d+(?:\.\d+)?)\s*$/m)?.[1]);
    const slug = entry.name.replace(/\.mdx?$/, '');

    return {
      label: title || slug,
      link: `/docs/learning/${slug}/`,
      order: Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER,
    };
  })
  .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'zh-CN'))
  .map(({ label, link }) => ({ label, link }));

export default defineConfig({
  site: siteUrl,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkImageSize],
      rehypePlugins: [[rehypeKatex, { strict: false }], rehypeImageCaptions],
    }),
  },
  integrations: [
    starlight({
      title: 'N.W.wolf ROBOCON 四足组文档',
      description: '西安交通大学ROBOCON四足组 西北狼战队招新、入门学习与公开文档协作资料。',
      favicon: '/assets/brand/nwwolf-square.svg',
      logo: {
        src: './src/assets/nwwolf.svg',
        alt: 'N.W.wolf 狼头标志',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/N-W-wolf',
        },
      ],
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      editLink: {
        baseUrl: 'https://github.com/N-W-wolf/N-W-wolf.github.io/edit/main/',
      },
      lastUpdated: true,
      customCss: ['./src/styles/docs.css'],
      sidebar: [
        { label: '文档首页', link: '/docs/' },
        {
          label: '团队与招新',
          items: [{ autogenerate: { directory: 'docs/recruitment' } }],
        },
        { label: '关于四足机器人', link: '/docs/about-quadruped/' },
        { label: '关于 ROBOCON', link: '/docs/about-ROBOCON/' },
        {
          label: '入门学习',
          items: [
            ...learningRootPages,
            {
              label: '开发基础',
              collapsed: true,
              items: [{ autogenerate: { directory: 'docs/learning/01-development-foundations' } }],
            },
            {
              label: 'AI 与 Agent 协作',
              collapsed: true,
              items: [{ autogenerate: { directory: 'docs/learning/02-ai-agent-collaboration' } }],
            },
            {
              label: '机器人软件基础',
              collapsed: true,
              items: [{ autogenerate: { directory: 'docs/learning/03-robot-software-foundations' } }],
            },
            {
              label: '四足强化学习与仿真',
              collapsed: true,
              items: [{ autogenerate: { directory: 'docs/learning/04-quadruped-rl-simulation' } }],
            },
            {
              label: '实机部署与调试',
              collapsed: true,
              items: [{ autogenerate: { directory: 'docs/learning/05-deployment-debugging' } }],
            },
            {
              label: '定位、导航与感知',
              collapsed: true,
              items: [{ autogenerate: { directory: 'docs/learning/06-localization-navigation-perception' } }],
            },
            {
              label: '机械臂基础与控制',
              collapsed: true,
              items: [{ autogenerate: { directory: 'docs/learning/07-robot-arm-control' } }],
            },
            {
              label: '工程实践',
              collapsed: true,
              items: [{ autogenerate: { directory: 'docs/learning/08-engineering-practice' } }],
            },
          ],
        },
        {
          label: '参与协作',
          items: [{ autogenerate: { directory: 'docs/collaboration' } }],
        },
      ],
    }),
    sitemap(),
  ],
});
