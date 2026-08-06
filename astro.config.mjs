import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://n-w-wolf.github.io',
  integrations: [
    starlight({
      title: 'N.W.wolf RoboCon 四足组文档',
      description: '西安交通大学西北狼战队 RoboCon 四足机器人组招新、入门学习与公开文档协作资料。',
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
        {
          label: '入门学习',
          items: [{ autogenerate: { directory: 'docs/learning' } }],
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
