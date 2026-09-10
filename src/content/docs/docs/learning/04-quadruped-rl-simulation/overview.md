---
title: 四足强化学习与仿真
description: 四足强化学习、仿真任务、策略训练、泛化迁移与理论进阶文档的章节入口。
sidebar:
  label: 章节概览
  order: 1
---

本章节面向开始学习四足运动控制与强化学习的成员，按基础理解、仿真与任务构建、策略训练、泛化与迁移、强化学习理论进阶五部分组织。

## 章节结构与学习顺序

| 部分 | 学习目标 | 当前内容 |
| --- | --- | --- |
| 基础理解 | 理解策略在系统中的位置、训练闭环和任务组成 | 三篇基础正文 |
| 仿真与任务构建 | 说明模型、观测、动作、指令、奖励和回合的设计与验证 | 五篇基础正文，包含公式、伪代码和检查练习 |
| 策略训练 | 学习算法、训练流程、参数管理与策略评估 | 四篇正文，包含算法公式、流程伪代码与实验练习 |
| 泛化与迁移 | 学习地形课程、域随机化、跨仿真器验证与实机迁移 | 四篇正文，包含建模方法、验证流程与思考练习 |
| 强化学习理论进阶 | 补充价值函数、时序差分与策略优化等理论 | 已整理为支撑性选读资料 |

建议从[四足运动控制中的强化学习](/docs/learning/04-quadruped-rl-simulation/01-core-concepts/quadruped-rl-in-system/)开始，完成[四足强化学习任务的定义与组成](/docs/learning/04-quadruped-rl-simulation/01-core-concepts/training-task-definition/)中的任务说明表，再进入[仿真环境与机器人模型](/docs/learning/04-quadruped-rl-simulation/02-simulation-task-building/simulation-environment/)。完成任务构建后，可从 [PPO 与 Actor-Critic 方法](/docs/learning/04-quadruped-rl-simulation/03-policy-training/ppo-and-actor-critic/)开始学习策略训练。完成基础策略评估后，可继续阅读[地形建模与课程学习](/docs/learning/04-quadruped-rl-simulation/04-generalization-transfer/terrain-and-curriculum/)，逐步扩展训练条件并学习迁移验证。理论进阶不要求新成员在招新初期全部掌握。

## 示例设定与框架适用范围

基础正文以平地速度跟踪任务为共同例子，假设机器人有十二个驱动关节，策略输出目标位置偏移并经 PD 控制执行。文中维度、频率和数值会注明适用条件，不代表所有机器人或框架的默认配置。伪代码用于解释数据流，不作为可直接运行的训练脚本。

legged_gym 的具体代码仅作为单独标注的阅读示例。迁移框架时，仍需重新核对模型、观测、控制、奖励缩放和重置语义。

mjlab 当前作为后续框架学习与迁移的资料入口，本站尚未提供队内验证过的安装训练教程。实际操作先参考[官方仓库](https://github.com/mujocolab/mjlab)与[官方文档](https://mujocolab.github.io/mjlab/)。后续实践材料应记录设备、依赖和框架版本，在完成官方任务运行、短训练、保存与回放以及任务修改验证后逐步整理。
