---
title: 任务编排
description: 抓取动作为什么分 pre-grasp / grasp 两段、朝向歧义的处理，以及 mode 切换时机的物理意义。
sidebar:
  order: 34
---

**抓取为什么分两段（pre-grasp → grasp）？**

```text
pre-grasp（悬停）：末端在目标上方 pre_grasp_offset (0.10m) 处
  → 确认位置正确，没有碰撞风险
grasp（接触）：末端垂直下降到 object_height + tool_offset_z
  → 吸盘接触箱子表面
```

分段的好处：如果 pre-grasp 位置有问题，可以在碰到箱子之前停下来，不会撞到东西。

**为什么用 `get_box_edge_roll` 而不是直接用感知的朝向？**

感知给出的箱子朝向可能有 90° 的歧义（箱子是正方形顶面）。`get_box_edge_roll` 利用这个对称性：把感知角度映射到 $[-\pi/2, 0]$ 区间，选择最近的边作为抓取方向，始终保证吸盘与箱子边缘对齐。

**mode 切换时机：**

```text
idle → moving（开始运动）→ loaded（抓取后，高刚性持箱）→ moving（放置后）→ idle（任务结束）
```

每次切换都有明确的物理意义：低刚性等待 → 标准运动 → 负载运动 → 恢复。
