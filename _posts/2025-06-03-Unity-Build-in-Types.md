---
title: "Unity Build-in Types"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
---

## 常见Unity内建类型（按用途分）
### 1.空间/几何类型（Transform相关）

| 类型                              | 说明               |
| ------------------------------- | ---------------- |
| `Vector2`, `Vector3`, `Vector4` | 表示二维/三维/四维向量     |
| `Quaternion`                    | 四元数，表示旋转         |
| `Matrix4x4`                     | 4×4 矩阵，常用于转换     |
| `Bounds`                        | 包围盒（中心+尺寸）       |
| `Ray`, `RaycastHit`             | 射线检测相关类型         |
| `Plane`                         | 表示一个无限平面         |
| `Rect`                          | 二维矩形区域           |
| `Color`, `Color32`              | 表示颜色（线性空间和 sRGB） |

- **Vector2 3 4**

| 类型        | 维度                 | 常见用途              |
| --------- | ------------------ | ----------------- |
| `Vector2` | 2D 向量 (x, y)       | UI 坐标、2D 游戏、纹理坐标  |
| `Vector3` | 3D 向量 (x, y, z)    | 位置、速度、方向、缩放       |
| `Vector4` | 4D 向量 (x, y, z, w) | 齐次坐标、颜色、Shader 传参 |



### 2.游戏对象相关

| 类型                 | 说明                  |
| ------------------ | ------------------- |
| `GameObject`       | 场景中所有对象的基本单元        |
| `Component`        | 所有组件的基类             |
| `Transform`        | 表示物体的位置、旋转、缩放       |
| `MonoBehaviour`    | 用户自定义脚本的基类          |
| `ScriptableObject` | 可创建的资产类，用于数据管理      |
| `Object`           | Unity 所有对象的基类（包括资源） |


### 3.图形和渲染

| 类型                                      | 说明          |
| --------------------------------------- | ----------- |
| `Mesh`, `MeshRenderer`                  | 网格和其渲染组件    |
| `Material`                              | 材质资源        |
| `Shader`                                | 控制材质渲染效果的程序 |
| `Texture`, `Texture2D`, `RenderTexture` | 贴图资源        |
| `Camera`                                | 摄像机组件       |
| `Light`                                 | 灯光组件        |


### 4.物理相关

| 类型                                             | 说明                   |
| ---------------------------------------------- | -------------------- |
| `Rigidbody`, `Rigidbody2D`                     | 刚体，驱动物体物理行为          |
| `Collider`, `BoxCollider`, `SphereCollider`, 等 | 碰撞器                  |
| `Physics`, `Physics2D`                         | 提供物理检测和操作的静态类        |
| `Joint` 系列                                     | 链接两个刚体（如 HingeJoint） |
| `ContactPoint`                                 | 碰撞点信息结构体             |


### 5.输入和事件

| 类型                    | 说明         |
| --------------------- | ---------- |
| `Input`               | 输入系统静态类    |
| `KeyCode`             | 键盘按键枚举     |
| `Touch`, `TouchPhase` | 触摸输入相关     |
| `Event`, `EventType`  | GUI 系统事件类型 |


### 6.资源与序列化

| 类型                         | 说明                |
| -------------------------- | ----------------- |
| `Resources`, `AssetBundle` | 资源加载管理器           |
| `TextAsset`                | 文本资源，如 JSON、配置文件等 |
| `SerializableAttribute`    | 允许自定义类型序列化存储      |


### 7.UI（UGUI）

| 类型                                    | 说明                  |
| ------------------------------------- | ------------------- |
| `Canvas`, `CanvasRenderer`            | UI 根组件              |
| `RectTransform`                       | 用于 UI 布局的 Transform |
| `Image`, `Text`, `Button`, `Slider` 等 | 基础 UI 组件            |
| `EventSystem`                         | 管理 UI 输入事件          |


### 8.时间、协程与生命周期

| 类型                            | 说明                          |
| ----------------------------- | --------------------------- |
| `Time`                        | 时间相关（如 deltaTime、timeScale） |
| `WaitForSeconds`, `WaitUntil` | 协程等待辅助类                     |
| `Coroutine`                   | 协程对象类型                      |
