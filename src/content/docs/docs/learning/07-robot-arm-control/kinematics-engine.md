---
title: 运动学引擎
description: 本项目运动学引擎的设计决策：为什么用解析法 IK、IK 计算流程与阻尼最小二乘。
sidebar:
  order: 31
---

**设计决策：为什么用解析法 IK？**

本项目的 5-DOF 构型中，前 3 个关节（Yaw + Pitch1 + Pitch2）形成平面三连杆，正好可以用余弦定理直接求解。解析法在这个场景下：

- 计算快（几个三角函数，不需要迭代）
- 不会发散（数值法需要好的初始猜测）
- 解唯一（肘向下分支，固定取 `q2 = -acos(cos_q2)` 即负值）

**IK 计算流程：**

```text
1. 分离基座旋转：q0 = atan2(y_w, x_w)
2. 在 XZ 平面投影，用余弦定理：
   d² = x_w² + z_w²（去掉 L1 后）
   cos(q2) = (d² - l2² - l3²) / (2·l2·l3)
   q2 = -acos(cos_q2)        ← 固定肘向下
   q1 = atan2(z_w, x_w) - atan2(l3·sin(q2), l2 + l3·cos(q2))
3. 腕部：q3 = target_pitch - q1 - q2
4. q4 = 0（初始，后续用视觉对齐调整）
```

**阻尼最小二乘（Damped Least Squares）：** 当需要速度级 IK 时（如视觉对齐），使用 $(JJ^T + \lambda^2 I)^{-1}$ 避免奇异点附近的数值爆炸。

代码位置：`src/arm2_task/src/kinematics_engine.cpp`
