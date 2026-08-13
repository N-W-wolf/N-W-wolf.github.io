---
title: AI 工具选择与快速上手
description: 介绍目前有哪些常见 AI 工具，它们之间有什么区别，以及第一次接触这些工具时应该怎样选择。
sidebar:
  order: 30

---

如果只是想开始使用 AI，现在其实没有多少需要准备的东西。找一个好用的模型，直接开始问问题就行。每个人对好用的标准不同，GPT、Claude等闭源模型固然强悍，但是国内 Deepseek、Kimi等开源模型的价格优势有时候会成为更好的选择。

> 本文涉及具体产品的部分以 2026 年 8 月为参考。AI 产品更新非常快，模型名称、价格、额度和接入方式都有可能发生变化。

## 1. 模型的选择

目前来看，闭源与开源模型之间依然存在能力差距。 OpenAI 与 Anthropic  的前沿闭源模型是最值得优先尝试的一批模型。尤其是复杂代码修改、长时间 Agent 任务、论文分析、困难推理这类任务，强模型经常能够明显减少返工。如果账号、网络和预算都没有问题，直接使用这些第一梯队模型通常是最省时间的选择。

国内模型近几年进步也非常快。DeepSeek、Qwen、Kimi、GLM、MiniMax 等模型已经能够很好地完成日常问答、资料整理、代码解释和相当一部分编程任务。对于刚开始使用 AI 开发与协作的同学，直接使用国内产品完全没有问题，也没有必要为了更高的性能，先花几个晚上解决海外账号和支付问题。

> 就在昨天(2026年8月12日)，Deepseek发布了 V4Pro正式版 (DeepSeek-V4-Pro-0813)，性能在某些方面已经逼近 Anthropic 的 Fable 5，目前来看已经可以作为日常开发时协作代码的主力模型之一。

当然，由于一些众所周知的原因，国外的闭源模型在国内并不能轻松使用，其中 Anthropic 本身又对国内有政策性的排斥，导致 claude 账号极难稳定获取。因此对大家来说，GPT 就成了更广泛的选择。OpenAI 账号相对稳定，在靠谱的渠道订阅 Plus 之后基本不会有问题。此外，也可以通过一些中转站，以及 API 聚合平台等，使用 API 来调用。有些平台的价格会比官方低一大截，这时候就要注意提供的 API 有没有掺水。 不乏一些物美价廉的平台网站，大家需要好好甄别。

## 2. Agent 的选择和使用

现在比较成熟的 Coding Agent 已经可以自己搜索仓库、阅读多个文件、修改代码、执行编译和测试。对于几百行的小程序，这种优势可能还不明显；到了 ROS 2、STM32 工程或者强化学习项目中，相关代码经常分散在多个目录和配置文件里，Agent 能够直接获得整个项目的上下文，用起来会比在网页端来回复制代码方便很多。

目前 Coding Agent 的使用形式主要可以分成 IDE 和 CLI 两类。Cursor 是比较有代表性的 IDE 路线，Agent 直接集成在编辑器中，可以看到文件、Diff 和终端，对第一次接触这类工具的人比较直观。Cursor 当前的 Agent 已经可以自行搜索代码、修改多个文件并运行终端命令。同时，现在 VS Code、Jetbrains 系列IDE中已经集成了 Claude code、Codex 等 Agent 插件，可以直接使用。

另一类是 Claude Code、Codex 这类 CLI Agent，直接在项目目录的终端中运行。对机器人开发来说，我个人更推荐大家使用这种方式。我们在未来的开发中可能会频繁接触 SSH、Git、CMake、训练服务器和各种命令行工具，进入项目目录后直接启动 Agent，很多时候比额外打开一个专用 IDE 更自然。Claude Code 官方支持在本地开发环境中运行，Codex CLI 也提供了终端中的本地 Agent 工作方式；Codex 目前还可以在 CLI、IDE 和云端之间使用同一套 Codex 体系。

如果没有明确偏好， Claude Code 和 Codex 选一个先用起来就够了。两者目前都是很成熟的 Coding Agent，真正的差别要在长期使用中才能体会出来，例如上下文管理、模型风格、工具调用、长任务稳定性以及额度消耗。

### 2.1 Agent 和 模型

前面已经讨论过模型选择。到了 Coding Agent 这里，还需要多理解一层：

```
Coding Agent → API / Provider → Model
```

Claude Code 默认围绕 Claude 模型设计，Codex 则与 OpenAI 的模型更适配。直接使用官方组合通常最省心，客户端、模型能力和工具调用之间的适配也最好。

但 Agent 客户端和模型并没有完全绑定。现在很多开发者会给 Coding Agent 配置第三方 Provider，例如让一个客户端通过 API 调用其他模型。这在国内尤其常见，因为我们能够比较方便地获得 DeepSeek、Kimi、GLM 等模型的 API，同时 Claude 或 OpenAI 官方服务的获取条件可能麻烦很多。

这时候就会遇到大量 `API Key`、`Base URL`、Provider 和模型名称的配置。如果只有一套 API，手动配置完全没有问题；当手里同时有官方 API、几个中转站和不同模型时，频繁修改配置很快就会变得麻烦。

**[CC Switch](https://ccswitch.io/zh/)** 是目前比较常见的解决方案之一。它是一个开源的 Coding Agent 配置管理工具，可以集中管理 Claude Code、Codex、Gemini 等客户端的 Provider，并快速切换不同 API 配置。现在的版本甚至提供了本地路由和协议转换能力，例如把 DeepSeek、Kimi、GLM 等第三方 Provider 接到 Codex 的工作流中。

### 2.2 第一次使用 Agent

Agent 上手其实很简单。以 CLI Agent 为例，安装完成以后进入一个项目目录：

```
cd your_project
codex
```

或者启动对应的其他 Agent，就可以直接用自然语言和它交流。

可以先找一个自己熟悉的小项目，从非常普通的任务开始。例如：

> 阅读这个项目，先不要修改文件。告诉我程序从哪里启动，各个主要目录分别负责什么。

等它读完以后继续问：

> 找一下电机 CAN 通信相关的代码，解释发送和接收的数据流。

再进一步：

> 给这个模块增加一个 100 ms 的通信超时检测。先告诉我准备修改哪些地方，我确认以后再改。

这种使用方式很快就能体会到 Agent 和普通聊天 AI 的区别。你不需要把 `motor.cpp`、`can.cpp`、`main.cpp` 一个个复制给它，它会自己在仓库里找。

任务完成以后，也不要只看 Agent 最后说了一句“修改完成”。至少看一下 Git Diff，确认它实际改了哪些文件；能够编译的项目让它执行编译，有测试就运行测试。各种 IDE 本身提供 Diff 审查界面，Codex 等 Agent 也会显示代码修改和终端执行结果。

后面使用多了以后，自然会逐渐接触到项目规则文件、Skills、MCP、子 Agent、Plan 模式等更复杂的功能。这些东西都能提高 Agent 的上限，但不影响现在开始使用。现阶段最重要的事情还是先真正拿一个项目跑几次，知道 Agent 能替自己做到什么，以及哪些事情仍然需要自己判断。

## 3. AGENTS.md 与 Skill

### `AGENTS.md` 是什么

可以把它理解成：

> 给 AI Coding Agent 看的项目说明和开发规范。

Codex 在开始任务之前会自动寻找并读取 `AGENTS.md`。OpenAI 官方建议在里面写仓库结构、运行方法、构建/测试命令、工程约定、禁止事项以及“怎样才算完成任务”等内容。

例如一个 STM32H7 项目可以这样：

```
robot_firmware/
├── AGENTS.md
├── Core/
├── Drivers/
├── BSP/
├── Middleware/
├── Algorithm/
└── Application/
```

里面可能写：

```
# Project Instructions

## Architecture

The project is divided into:

- Drivers: MCU peripheral abstraction
- BSP: board-specific implementation
- Middleware: FreeRTOS and protocol libraries
- Algorithm: controllers and filters
- Application: robot application logic

## Development rules

- Do not put application logic directly in HAL callbacks.
- HAL callbacks should dispatch events to Driver layer.
- Motor drivers must not directly depend on Application.
- Prefer static allocation for frequently used runtime objects.

## Build

Use STM32CubeIDE project configuration.

After modifying firmware:

1. Build the project.
2. Check compiler warnings.
3. Verify no new dependency from Drivers to Application.
```

以后你告诉 Codex：

```
增加一个 RS485 电机驱动
```

它已经知道这个项目怎么分层、驱动应该放哪、哪些依赖关系不能出现，所以不需要你每次重新描述这些规则。

Codex 的 `AGENTS.md` 还支持层级。比如：

```
~/.codex/
└── AGENTS.md

robot/
├── AGENTS.md
├── firmware/
│   └── AGENTS.md
└── simulation/
    └── AGENTS.md
```

`~/.codex/AGENTS.md` 可以放个人通用习惯；仓库根目录放项目整体规则；子目录再放局部规则。Codex 会从项目根目录一路读到当前工作目录，更靠近当前目录的规则优先级更高。它还支持 `AGENTS.override.md` 来覆盖对应层级的普通规则。

所以 `AGENTS.md` 很适合解决这一类问题：

```
以后这个项目里：
- C++ 用什么规范？
- 文件应该放在哪里？
- 测试怎么运行？
- 修改之后检查什么？
- 哪些东西不允许改？
- Git commit / PR 有什么要求？
```

它属于“项目上下文 + 长期规则”。

### Skill 是什么

Skill 更接近：

> 给 Agent 安装一个可复用的专项工作流程。

目前 Agent Skills 已经形成开放规范。OpenAI 的 ChatGPT/Codex 也已经采用这个格式。一个 Skill 最基本就是一个目录和一个 `SKILL.md`。

典型结构：

```
stm32-motor-driver/
├── SKILL.md
├── scripts/
│   └── check_driver.py
├── references/
│   ├── motor-interface.md
│   └── can-guidelines.md
└── assets/
    └── driver-template/
```

其中：

```
SKILL.md
```

是核心文件。

最简单的形式是：

```
---
name: stm32-motor-driver
description: Create and modify STM32 motor drivers using CAN, FDCAN, UART or RS485. Use when implementing robot joint motor communication.
---

# STM32 Motor Driver

When adding a motor driver:

1. Identify the communication protocol.
2. Separate transport layer from motor protocol.
3. Define a unified motor interface.
4. Implement RX parsing.
5. Implement command serialization.
6. Add timeout handling.
7. Add a minimal communication test.
```

`name` 和 `description` 是 Skill 规范要求的核心元数据，其中 `description` 很重要，因为 Agent 会根据它判断这个 Skill 是否适用于当前任务。

Skill 还能包含：

```
scripts/
```

用于实际执行代码；

```
references/
```

用于存放详细参考资料；

```
assets/
```

用于模板、配置文件等静态资源。
