---
title: 轨迹规划
description: 在关节空间或笛卡尔空间生成平滑轨迹的方法，以及本项目五次多项式插值与多段混合的实现。
sidebar:
  order: 25
---

机械臂不能瞬间从一个角度跳到另一个角度——需要规划一条平滑的轨迹，受速度和加速度限制。

**常见轨迹类型：**

| 类型 | 特点 |
| --- | --- |
| 梯形速度 | 加速 → 匀速 → 减速，简单但加速度不连续 |
| **五次多项式** | 位置、速度、加速度都连续，平滑 |
| S 曲线 | 加加速度也连续，更平滑但更复杂 |
| 样条插值 | 通过多个中间点 |

**轨迹参数：** 最大速度 `v_max`、最大加速度 `a_max`、轨迹时长 `T`

**多段混合（Blend）：** 当连续执行多个 waypoint 时，不用停到前一个终点再出发，而是在接近终点时就开始混合下一段，使运动更连续。

**推荐资源：**

- [Modern Robotics 第 9 章 Trajectory Generation](https://hades.mech.northwestern.edu/index.php/Modern_Robotics)
- 搜索："quintic polynomial trajectory generation"

## 本项目的情况

本项目使用**五次多项式**插值（不是梯形！`plan_trapezoid()` 名字有误导）。位置曲线的形状是 $s(t) = 10t^3 - 15t^4 + 6t^5$（归一化时间），保证起点和终点的速度、加速度都为 0。

**多段混合：** `control_node` 支持 blend radius —— 当前段未结束时就开始混入下一段，避免停顿。

**参数：** `params.yaml` 中 `trajectory_planner.max_velocity: 0.5`、`max_acceleration: 1.0`、`min_segment_duration: 0.3`

代码位置：`control_node.cpp` 中的 `plan_trapezoid()` 和 `compute_segment_state()`
