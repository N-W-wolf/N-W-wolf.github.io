---
title: 刚体变换与矩阵
description: 理解齐次变换矩阵、旋转矩阵与 DH 参数，这是机械臂运动学建模的数学基础。
sidebar:
  order: 20
---

机械臂的每一根连杆都是一个**刚体**。描述刚体在空间中的位置和姿态，用的是**齐次变换矩阵**（Homogeneous Transformation Matrix）：

```text
T = ┌        ┐
    │ R   p  │
    │ 0   1  │
    └        ┘
```

其中 R 是 3×3 旋转矩阵，p 是 3×1 平移向量。

**需要掌握的概念：**

- 旋转矩阵（SO(3)）—— 绕 X/Y/Z 轴的旋转
- 齐次坐标 —— 为什么加一维
- 变换的复合 —— 矩阵乘法，从右到左
- **DH 参数**（Denavit-Hartenberg）—— 用 4 个参数描述相邻关节之间的变换，是机械臂建模的标准方法

**推荐资源：**

- [bilibili 机械臂运动学教程（机械臂+旋转矩阵+变换矩阵+DH+逆解+轨迹规划）](https://www.bilibili.com/video/BV1oa4y1v7TY?vd_source=e45d77178f9cce3b4aede27c01f4f3ab)
- [3Blue1Brown — Linear Algebra 系列](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)：直观理解线性变换
- [Modern Robotics 第 3 章](https://hades.mech.northwestern.edu/index.php/Modern_Robotics)：免费的在线教材，Rigid-Body Motions
- [Peter Corke — Robotics Toolbox 文档](https://petercorke.com/toolboxes/robotics-toolbox/)：MATLAB/Python 机器人工具箱，有大量示例

## 本项目的情况

本项目 5 个关节全是旋转关节，DH 参数体现为 URDF 文件中的 `<joint>` 标签。实际计算用的是 Pinocchio 库，不需要手动写 DH 矩阵，但理解 DH 参数才能看懂 URDF 里每个关节的 `origin` 标签（`xyz` 是位置，`rpy` 是姿态）。

代码位置：`src/arm2_task/urdf/arm2.urdf`
