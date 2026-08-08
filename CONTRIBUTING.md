# 贡献指南

本仓库同时维护战队主页和公开文档。文档中心面向招新、新成员学习与 Markdown 协作，不用于保存队内详细资产。普通文档贡献只需要修改 Markdown。

## 协作流程

1. 从最新 `main` 创建短期分支，例如 `docs/add-git-basics`。
2. 完成范围明确的一次修改。
3. 执行 `npm run check` 和 `npm run build`。
4. 提交 Pull Request，说明修改原因和验证方式。
5. 邀请对应内容负责人审核。

不建议多人直接向 `main` 推送。仓库启用分支保护后，应至少经过一次审核再合并。

## 文档放置

| 内容 | 目录 |
| --- | --- |
| 团队与招新 | `src/content/docs/docs/recruitment/` |
| 关于四足机器人、关于 RoboCon | `src/content/docs/docs/about-quadruped.md`、`src/content/docs/docs/about-robocon.md` |
| 入门学习 | `src/content/docs/docs/learning/` |
| 文档协作与模板 | `src/content/docs/docs/collaboration/` |

分类和顶层介绍页在侧边栏中的顺序由 `astro.config.mjs` 决定。同一分类内的页面顺序由 Markdown 头部的 `sidebar.order` 决定，数字越小越靠前。招新初期实际采用的阅读材料集中记录在 `src/content/docs/docs/learning/training-index.md`，由培训维护者按当期安排手动添加链接。

## 内容要求

- 面向第一次接触主题的读者说明必要背景。
- 学习步骤包含目标和验证方法。
- 图片提供有意义的替代文字，并确认可以公开。
- 不提交密钥、设备网络信息、个人隐私、资产台账和未公开策略。
- 不确定是否适合公开的内容应先询问负责人。

## 模板

- 通用页面：`templates/docs/page-template.md`

复制模板后，请删除其中的提示文字和不适用章节。
