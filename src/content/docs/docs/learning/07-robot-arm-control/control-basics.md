---
title: 控制基础
description: 从 PD 反馈到前馈、逆动力学（RNEA）的关节控制基础，以及本项目的前馈与摩擦补偿实现。
sidebar:
  order: 26
---

机械臂控制的核心问题：给定目标关节角 $q_{des}$，计算电机应该输出的力矩 $\tau$。

**a) PD 控制（反馈）**

最基本的反馈控制：

```text
τ = Kp · (q_des - q_actual) + Kd · (0 - dq_actual)
```

- `Kp`（比例增益）：位置误差越大，力矩越大。过大会振荡，过小会有静差
- `Kd`（微分增益）：阻尼项，抑制振荡。过大会发热，过小会超调

**b) 前馈控制**

PD 只能"等出了误差再修正"。前馈提前算好需要的力矩：

```text
τ = τ_gravity + τ_friction + τ_PD
```

- `τ_gravity`（重力补偿）：用动力学模型算出让机械臂不掉下来需要的力矩
- `τ_friction`（摩擦力补偿）：`fc · tanh(α · dq) + fv · dq`

**c) 逆动力学（RNEA）**

RNEA（Recursive Newton-Euler Algorithm）是计算前馈力矩的标准算法。给定 `(q, dq, ddq)`，算出每个关节需要的力矩。项目使用 Pinocchio 库实现。

**d) 控制模式切换**

不同场景需要不同的增益：

- 手持示教：kp 极低，让人能推动
- 空载运动：标准增益
- 带负载：更高增益，提高刚性

**推荐资源：**

- [CSDN 史上最详细的 PID 教程——理解 PID 原理及优化算法](https://blog.csdn.net/name_longming/article/details/115093338)
- [Pinocchio 文档](https://stack-of-tasks.github.io/pinocchio/)：RNEA 和 ABA 的使用
- [Modern Robotics 第 8 章 Dynamics](https://hades.mech.northwestern.edu/index.php/Modern_Robotics)

## 本项目的情况

本项目实现了 6 种控制模式（详见「控制模式设计」一节），前馈用的是 `RNEA(desired) + friction(actual)`。

摩擦力模型：$\tau_f = fc \cdot \tanh(\alpha \cdot dq) + fv \cdot dq \cdot \text{GearRatio}^2$

- `tanh` 函数让库伦摩擦在零速附近平滑过渡，避免力矩跳变
- `GearRatio²` 是因为摩擦力在电机侧，需要折算到关节侧

代码位置：

- `control_node.cpp` — Stack A 的 PD + 前馈控制
- `inverse_dynamics_node.cpp` — Stack B 的逆动力学控制
- `dynamics_manager.cpp` — RNEA 和摩擦力计算
