---
title: 正向运动学（FK）
description: 由关节角度计算末端执行器位姿的正向运动学，以及本项目使用 Pinocchio 库的实现方式。
sidebar:
  order: 22
---

**正向运动学**：给定每个关节的角度，计算末端执行器在世界坐标系中的位置和姿态。

对于串联机械臂，FK 就是沿着运动链把所有 DH 变换矩阵乘起来：

```text
T_world_to_tip = T_0→1 · T_1→2 · T_2→3 · T_3→4 · T_4→5
```

**推荐资源：**

- [Modern Robotics 第 4 章 Forward Kinematics](https://hades.mech.northwestern.edu/index.php/Modern_Robotics)
- 任何机器人学教材的 FK 章节

## 本项目的情况

本项目使用 **Pinocchio** 库做 FK，不需要手写矩阵乘法。Pinocchio 从 URDF 加载模型后，调用 `forwardKinematics(model, data, q)` 即可得到所有连杆的位姿。

代码位置：`src/arm2_task/src/kinematics_engine.cpp` 中的 `forwardKinematics()`

返回的是 **Link_4** 的位姿（不是末端 Link_5），因为相机安装在 Link_4 上。`control_node` 拿到 FK 结果后，发布 `world → Link_4` 的动态 TF。
