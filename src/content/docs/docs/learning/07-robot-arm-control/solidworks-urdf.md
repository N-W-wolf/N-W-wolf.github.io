---
title: SolidWorks → URDF
description: 从 CAD 装配体导出 URDF 机器人描述文件的流程，以及 URDF 核心标签的含义与注意事项。
sidebar:
  order: 21
---

URDF（Unified Robot Description Format）是 ROS 中描述机器人结构的 XML 格式。从 CAD 到 URDF 的典型流程：

```text
SolidWorks 装配体
  → 导出每个连杆为 STL（网格文件）
  → 写 URDF XML（定义连杆、关节、惯量）
  → 在 ROS 中加载
```

**URDF 核心标签：**

```xml
<link name="Link_1">
  <visual>
    <geometry><mesh filename="..." /></geometry>  <!-- 用于显示 -->
  </visual>

  <collision>
    <geometry><mesh filename="..." /></geometry>  <!-- 用于碰撞检测 -->
  </collision>

  <inertial>
    <mass value="..." />                           <!-- 质量 (kg) -->
    <inertia ixx="..." iyy="..." izz="..." />      <!-- 转动惯量 -->
  </inertial>

</link>

<joint name="Joint_1" type="revolute">            <!-- 旋转关节 -->
  <parent link="Link_0" />
  <child link="Link_1" />
  <origin xyz="0 0 0.0845" rpy="0 0 0" />        <!-- 相对父连杆的位姿 -->
  <axis xyz="0 0 1" />                             <!-- 旋转轴 -->
  <limit lower="-4.188" upper="4.188" effort="..." velocity="..." />
</joint>
```

**关键注意事项：**

- `origin` 的 `rpy` 是 Roll-Pitch-Yaw，顺序是绕 X → 绕 Y → 绕 Z（固定轴）
- 惯量矩阵（inertia）必须正定，否则 Pinocchio 等库会报错。SolidWorks 可以自动计算
- STL 文件路径是相对于 URDF 文件所在目录的

**推荐资源：**

- [bilibili 很详细的 SolidWorks 导 URDF 视频](https://www.bilibili.com/video/BV15ur1YfEKr/?spm_id_from=333.1391.0.0&vd_source=9679132188fd3f800f1bf2232d79cb8b)
- [知乎 很详细的 URDF 导 MJCF（部分需结合 AI 食用）](https://zhuanlan.zhihu.com/p/576491263)
- [ROS2 URDF 官方教程](https://docs.ros.org/en/humble/Tutorials/Intermediate/URDF/URDF-Main.html)
- [SolidWorks to URDF 插件](http://wiki.ros.org/sw_urdf_exporter)（ROS1 时代，但概念通用）
- 可以把 XML 格式的文件拖到 [viewer.robotsfan.com](https://viewer.robotsfan.com/) 看看形态

## 本项目的情况

本项目的 URDF 在 `src/arm2_task/urdf/arm2.urdf`，STL 网格文件在 `src/arm2_task/meshes/`。几何参数（连杆长度）与 `params.yaml` 中的 `robot_geometry` 严格一致，修改任何一个都要同步更新另一个。
