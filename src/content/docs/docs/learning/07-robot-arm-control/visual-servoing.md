---
title: 视觉引导感知
description: 从相机图像到目标位姿的完整链路：相机模型、手眼标定、物体姿态估计与 TF 坐标变换。
sidebar:
  order: 24
---

视觉引导机械臂的完整链路：

```text
相机图像 → 物体检测 → 物体在相机坐标系中的位姿
  → TF 变换到世界坐标系 → 目标位姿 (world)
  → IK 求解 → 关节角 → 执行运动
```

**需要掌握的核心概念：**

**a) 相机模型与内参**

针孔相机模型：3D 世界点 → 2D 像素点。内参矩阵 K 描述焦距、光心、畸变。

**b) 手眼标定（Eye-in-Hand Calibration）**

相机装在机械臂上（"眼在手"），需要知道相机相对机械臂末端的位姿 `T(Link_4 → camera_link)`。这就是 `params.yaml` 里的 `camera_extrinsics`。

经典方法：机械臂移动到多个不同姿态，每拍一张棋盘格，求解 AX = XB 问题。

**c) 物体姿态估计**

从 RGB-D 图像中检测物体并估计其 6D 位姿。本项目用的是 RANSAC 平面拟合 + 角点检测。

**d) TF 坐标变换**

拿到物体在相机坐标系中的位姿后，利用 TF 树变换到世界坐标系：

```text
T(world → object) = T(world → Link_4) · T(Link_4 → camera_link) · T(camera_link → object)
                     ↑ 动态 FK              ↑ 静态外参                  ↑ 感知输出
```

**推荐资源：**

- 可以借鉴项目：[RealManRobot/hand_eye_calibration](https://github.com/RealManRobot/hand_eye_calibration)
- [OpenCV 相机标定教程](https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html)
- [TUM 手眼标定综述](https://campar.in.tum.de/Chair/HandEyeCalibration)
- [ROS2 TF2 教程](https://docs.ros.org/en/humble/Tutorials/Intermediate/Tf2/Tf2-Main.html)
- `tf2_ros` 和 `tf2_geometry_msgs` 是 ROS 中做坐标变换的标准工具

## 本项目的情况

**外参：** 手眼相机外参已经标定好，填在 `params.yaml` 的 `camera_extrinsics` 中。`control_node` 启动时自动广播这段静态 TF。狗头相机外参同理。

**感知服务：** 感知节点在独立的 "neweyes" workspace 中运行，提供 ROS2 服务：

- `get_pick_pos` — 返回箱子上表面在 `camera_link` 中的位姿
- `get_place_pos` — 返回方框在 `dog_camera_link` 中的位姿

**TF 变换：** `task_node` 收到感知结果后，用 TF2 做 `lookupTransform("world", frame_id)` + `doTransform()`，把位姿转到 world 坐标系，然后喂给 IK。代码在 `task_node.cpp` 的 `call_pick_service_sync()` 中。

**⚠️ 关键教训：** `GetPickPos.srv` 在 arm 和 neweyes 两个 workspace 中各有一份，必须字段完全一致，否则 ROS2 序列化布局错位 → 运行时 Segmentation Fault。修改任意一边的 `.srv` 后必须同步另一边。

**三阶段管线**（详见「视觉感知管线」一节）是我们提高精度的核心设计。
