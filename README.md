# 西安交通大学西北狼战队 | RoboCon 四足组

N.W.wolf RoboCon 四足组官方网站，包含战队与项目展示、招新信息、RoboCon 赛季记录以及招新与学习文档。

站点使用 Astro + Starlight 构建，通过 GitHub Actions 部署到 GitHub Pages。

## 本地开发

需要 Node.js 22.12 或更高版本。

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run check      # Astro / TypeScript 检查
npm run build      # 生成生产站点到 dist/
npm run check:links # 检查构建产物中的站内链接
npm run preview    # 本地预览生产构建
```

## 目录

```text
src/
├── pages/index.astro              # 战队宣传首页
├── components/                    # 首页公共组件
├── config/site.ts                 # 队名、招新日期、联系方式
├── styles/                        # 首页与文档视觉
└── content/docs/docs/             # /docs/ 下的 Markdown 文档
public/assets/                      # 发布使用的图片、视频与 Logo
assets/originals/                   # 本地源素材，不进入 Git
templates/docs/                    # 文档模板
.github/                            # PR、Issue、检查与部署配置
```

## 修改招新信息

招新状态、时间、联系方式、报名链接和二维码统一位于：

```text
src/config/site.ts
```

目前联系方式为占位信息。正式发布招新信息前，请更新 `siteConfig.recruitment`。

## 添加文档

1. 在 `src/content/docs/docs/` 对应分类中创建 Markdown 文件。
2. 填写 `title`、`description` 和 `sidebar.order`。
3. 本地执行 `npm run check` 与 `npm run build`。
4. 通过 Pull Request 提交并由内容负责人审核。

详细说明见 [CONTRIBUTING.md](CONTRIBUTING.md) 和网站中的“参与文档协作”。

文档分类在侧边栏中的顺序由 `astro.config.mjs` 决定；同一分类内的 Markdown 页面按 `sidebar.order` 从小到大排列。

## 素材约定

- 页面加载使用 `public/assets/` 内优化后的 WebP、SVG 和 H.264 MP4。
- 高分辨率照片、证书和原始视频保存在 `assets/originals/` 或团队统一归档中。
- 照片不得作为整页背景，优先使用保持完整构图的有边界媒体卡片。
- 不在公开仓库中保存账号密码、个人隐私和未公开竞赛策略。

## GitHub Pages 部署

仓库已提供 `.github/workflows/deploy.yml`。首次启用时，在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。此后推送到 `main` 会自动检查并部署 `dist/`。

## Vercel 同步部署

在 Vercel 中导入 `N-W-wolf/N-W-wolf.github.io`，使用以下构建配置：

- Framework Preset：`Astro`
- Production Branch：`main`
- Install Command：`npm ci`
- Build Command：`npm run build`
- Output Directory：`dist`
- Node.js Version：`22.x`

在 Vercel 项目的 Production 环境中添加：

```text
SITE_URL=https://nwwolf.top
```

`SITE_URL` 用于生成 sitemap、canonical 和 Open Graph 地址；它不会自动完成域名绑定。正式启用前，还需要在 Vercel 的 Domains 页面添加 `nwwolf.top`，并按提示配置 DNS。未设置该变量时，构建默认使用 `https://n-w-wolf.github.io`。
