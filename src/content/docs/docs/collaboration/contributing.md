---
title: 怎样协作文档
description: 说明 Markdown 文档的目录、排序方式以及通过 Pull Request 协作的流程。
sidebar:
  order: 1
---

文档源文件位于 `src/content/docs/docs/`。目录对应网站路径，新增 Markdown 文件后，构建系统会自动生成页面。

## 文档目录

| 内容 | 目录 | 页面路径示例 |
| --- | --- | --- |
| 关键介绍页 | `docs/about-quadruped.md`、`docs/about-ROBOCON.md` | `/docs/about-quadruped/` |
| 团队与招新 | `docs/recruitment/` | `/docs/recruitment/overview/` |
| 入门学习 | `docs/learning/` | `/docs/learning/learning-overview/` |
| 文档协作与模板 | `docs/collaboration/` | `/docs/collaboration/contributing/` |

## 页面顺序怎样决定

排序功能已经启用，分为两层：

1. **分类顺序**由根目录的 `astro.config.mjs` 决定。目前依次为“文档首页 → 团队与招新 → 关于四足机器人 → 关于 ROBOCON → 入门学习 → 参与协作”。入门学习下的八个分组也在此文件中显式排列。
2. **各分组内页面顺序**由 Markdown 头部的 `sidebar.order` 决定，数字越小越靠前。

例如：

```yaml
---
title: 页面标题
description: 一句话说明页面内容
sidebar:
  order: 2
---
```

建议同一目录依次使用 `1`、`2`、`3`。新增页面时不要依赖文件名字母顺序；显式填写 `sidebar.order` 可以避免排序随标题变化。

## 新建页面

1. 从 `templates/docs/` 复制合适的模板。
2. 将文件放入对应的公开目录。只有需要长期固定在侧边栏顶层的关键介绍页才直接放在 `docs/` 下，并同步更新 `astro.config.mjs`。
3. 使用简短的英文小写文件名，例如 `git-basics.md`。
4. 填写 `title`、`description` 和 `sidebar.order`。
5. 检查站内链接、图片替代文字和公开范围。

## 在学习分类下创建子目录

“开发基础”等八个学习分类使用递归自动生成侧边栏，因此可以继续创建子目录，不需要修改 `astro.config.mjs`。例如：

```text
docs/learning/01-development-foundations/
├── overview.md
└── Linux基础/
    ├── command-line.md
    └── file-system.md
```

上述两个页面会出现在“入门学习 → 开发基础 → Linux基础”下，对应地址分别为：

- `/docs/learning/01-development-foundations/Linux基础/command-line/`
- `/docs/learning/01-development-foundations/Linux基础/file-system/`

自动生成的子目录名称会直接作为侧边栏分组标题，因此目录名应当简短、含义明确。若希望磁盘目录使用英文、侧边栏显示单独的中文名称，则需要在 `astro.config.mjs` 中为该层添加显式分组。子目录之间的顺序由其中页面最小的 `sidebar.order` 决定，页面内部仍按各自的 `sidebar.order` 排列。

## GitHub 协作流程

1. 从最新 `main` 创建短期分支，例如 `docs/add-git-basics`。
2. 一次 Pull Request 只完成一个范围明确的文档主题。
3. 本地运行 `npm run check`、`npm run build` 和 `npm run check:links`。
4. 提交 Pull Request，说明修改目的、页面路径和验证结果。
5. 根据审核意见修改，检查通过后合并。

## 写作要求

- 面向第一次接触该主题的读者解释必要背景。
- 命令需要说明用途，不只粘贴终端输出。
- 引用外部资料时给出名称和链接，避免整段复制。
- 图片使用有意义的替代文字，并确认可以公开。
- 不写入个人信息、账号密钥、内部网络、资产台账和未公开策略。

可直接复制的示例见[文档模板](/docs/collaboration/templates/)。仓库级说明见根目录 `CONTRIBUTING.md`。

招新初期实际使用的文档由[初期培训文档索引](/docs/learning/training-index/)集中维护。新增普通学习资料不会自动加入培训清单，需要培训维护者按当期安排手动添加链接。
