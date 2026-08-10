---
title: 初期培训文档索引
description: 集中整理招新初期培训实际使用的文档入口。
sidebar:
  order: 2
---

本页只收录招新初期培训实际会使用的文档入口。文档中心可以持续增加资料，但培训参与者不需要按侧边栏从头读到尾，应以本页列出的内容和当期安排为准。

## 当前培训文档

### 基本认识

- [关于四足机器人](/docs/about-quadruped/)：了解四足机器人的构型、系统组成、控制问题和发展方向。
- [关于 ROBOCON](/docs/about-robocon/)：了解 ROBOCON、足式机器人赛项和比赛项目的工程特点。
- [入门学习概览](/docs/learning/learning-overview/)：了解四足组的软件技术范围与各学习目录的定位。

### 基础准备

- [开发基础](/docs/learning/01-development-foundations/overview/)：准备 Linux、Git、编程语言和常用开发工具。
- [AI 与 Agent 协作](/docs/learning/02-ai-agent-collaboration/ai-与-agent-协作概览/)：了解学习、开发和检查过程中使用 AI 与 Agent 的基本方式。

### 四足软件入门

- [机器人软件基础](/docs/learning/03-robot-software-foundations/overview/)：认识机器人状态、控制周期、通信和数据流。
- [四足强化学习与仿真](/docs/learning/04-quadruped-rl-simulation/overview/)：进入四足组当前主要的运动控制与仿真技术路线。

## 怎样维护本页

需要把一篇文档加入初期培训时，直接编辑：

`src/content/docs/docs/learning/training-index.md`

在合适的小节中增加一条 Markdown 链接即可：

```md
- [页面标题](/docs/页面路径/)：一句话说明为什么需要阅读。
```

例如，收录“实机部署与调试”页面：

```md
- [实机部署与调试](/docs/learning/05-deployment-debugging/overview/)：了解策略部署、通信和实机安全。
```

维护时注意：

1. 只收录本期培训实际要求阅读或使用的页面，不需要复制整个文档目录。
2. 站内链接建议使用以 `/docs/` 开头的绝对路径，避免本页移动后链接失效。
3. 链接在本页中的先后顺序由列表位置决定，与目标页面的 `sidebar.order` 无关。
4. 页面更名或移动后应同步修改这里的链接。
5. 提交前运行 `npm run check:links`；如果同时修改了页面结构，再运行 `npm run check` 和 `npm run build`。

培训内容发生变化时，可以直接增加、删除或调整列表顺序，不需要修改站点配置。
