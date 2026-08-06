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
| 团队与招新 | `docs/recruitment/` | `/docs/recruitment/overview/` |
| 入门学习 | `docs/learning/` | `/docs/learning/roadmap/` |
| 文档协作与模板 | `docs/collaboration/` | `/docs/collaboration/contributing/` |

## 页面顺序怎样决定

排序功能已经启用，分为两层：

1. **分类顺序**由根目录的 `astro.config.mjs` 决定。目前依次为“文档首页 → 团队与招新 → 入门学习 → 参与协作”。
2. **同一分类内的页面顺序**由 Markdown 头部的 `sidebar.order` 决定，数字越小越靠前。

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
2. 将文件放入上述三个公开目录之一。
3. 使用简短的英文小写文件名，例如 `git-basics.md`。
4. 填写 `title`、`description` 和 `sidebar.order`。
5. 检查站内链接、图片替代文字和公开范围。

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

两个可直接复制的示例见[文档模板](/docs/collaboration/templates/)。仓库级说明见根目录 `CONTRIBUTING.md`。
