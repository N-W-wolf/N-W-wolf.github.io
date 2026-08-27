---
title: MuJoCo 仿真基础
description: 用 MuJoCo 仿真器替代真实硬件进行无风险开发：工作原理、真机对照与调试技巧。
sidebar:
  order: 40
---

## 什么是 MuJoCo

MuJoCo（Multi-Joint dynamics with Contact）是 Google DeepMind 开源的物理仿真引擎，在机器人领域广泛用于训练和调试。本项目用它替代真实硬件进行无风险开发。

**推荐资源：**

- [bilibili MUJOCO 交互教程](https://www.bilibili.com/video/BV1z8HUzkEHh?vd_source=e45d77178f9cce3b4aede27c01f4f3ab)
- [MuJoCo 官方文档](https://mujoco.readthedocs.io/)

## 本项目仿真模式的工作原理

```text
真机模式：   task_node → control_node → dm_motor_sdk_ros → USB2CANFD → 电机
                                           ↑ 发布 /robot_driver/ready

仿真模式：   task_node → control_node → 等待 /robot_driver/ready
                                           ↑ 由 mujoco_runner 发布
              MuJoCo 仿真器（独立进程，sim_arm.sh）
```

仿真模式下，`run_arm.sh --sim` 不启动硬件驱动，而是等待另一个终端里 MuJoCo 仿真器发布的 `/robot_driver/ready` 信号。上层控制栈完全一样，只是底层物理被 MuJoCo 替代。

## 仿真 vs 真机对照

|  | 真机 | 仿真 |
| --- | --- | --- |
| 启动命令 | `bash run_arm.sh` | 终端1: `sim_arm.sh`，终端2: `bash run_arm.sh --sim` |
| 驱动 | dm_motor_sdk_ros | mujoco_runner |
| 风险 | 撞机/扯线 | 无 |
| 速度 | 实时 | 可调 |
| 传感器 | 真实相机 | 需另外接入 |
| 摩擦力/动力学 | 真实 | 模型近似 |

## 仿真调试小 Tips

1. **先仿真后真机**：任何新功能或参数修改，先在仿真里跑通，确认没崩再上真机。撞坏一个电机就是几百块。
2. **Mock 模式调试**：仿真里没有相机时，把 `params.yaml` 里的 `use_mock_target: true` 打开，用固定坐标取代感知，可以单独测试运动控制部分。
3. **关节角可视化**：用 PlotJuggler 订阅 `/arm2/_lowState/joint`，实时看每个关节的 q_cmd vs q_fb，判断跟踪效果。
4. **重力补偿验证**：`gravity_comp_test_node` 可以在仿真里验证动力学模型——关掉 PD 只靠前馈，看机械臂能不能"浮"在原地不掉。
5. **仿真不确定性**：MuJoCo 的摩擦模型和接触动力学与真实物理有差异。抓取成功率以真机为准，仿真只用来验证逻辑和防崩溃。
6. **仿真速度**：MuJoCo 可以比实时快很多倍，适合快速迭代。但注意高速仿真时 PD 控制器可能行为不同（因为物理步长变了）。
7. **死锁排查**：如果 `run_arm.sh --sim` 一直卡在"waiting for /robot_driver/ready"，检查仿真终端是否启动成功、ROS_DOMAIN_ID 是否一致。
