---
title: 架构总览
description: 26 赛季机械臂软件的分层架构、数据流与两套控制栈（Stack A / Stack B）的职责划分。
sidebar:
  order: 30
---

```text
┌─────────────────────────────────────────────────────────┐
│  task_node                                              │
│  "大脑" — 任务编排、交互菜单、导航集成、视觉对齐         │
│  输入：感知结果 (world 坐标)、用户命令、nav 触发         │
│  输出：MoveJoint action (关节目标)                       │
└──────────────┬──────────────────────────────────────────┘
               │ MoveJoint action
               ▼
┌─────────────────────────────────────────────────────────┐
│  control_node / inverse_dynamics_node                   │
│  "小脑" — 轨迹插值 + FK/IK + 前馈控制 + PD              │
│  输入：MoveJoint target                                 │
│  输出：/arm2/_lowCmd/command (关节力矩)                   │
└──────────────┬──────────────────────────────────────────┘
               │ MIT 控制命令
               ▼
┌─────────────────────────────────────────────────────────┐
│  dm_motor_sdk_ros                                       │
│  "脊髓" — CAN 帧收发、2 轴选圈、限位、跳变检测          │
│  输入：力矩命令                                          │
│  输出：关节状态 /arm2/_lowState/joint                    │
└──────────────────────────────────────────────────────────┘
```

**数据流：** 感知位姿 (world) → IK → 关节角 target → 轨迹插值 → 前馈 + PD → 力矩命令 → 电机

**两套控制栈：**

|  | Stack A（生产） | Stack B（实验/示教） |
| --- | --- | --- |
| 控制器 | `control_node` | `inverse_dynamics_node` |
| 控制模式 | 4 种 | 6 种（多 teach_pendant、teach_drag） |
| 启动 | `run_arm.sh` 默认 | `planner_inverse_task_launch.py` |

> 项目代码仓库：[feet-arm1](https://github.com/zhao-max-max/feet-arm1)（较全面版）、[feet-arm2](https://github.com/leinie-alien/feet-arm2)（较精简版）。
