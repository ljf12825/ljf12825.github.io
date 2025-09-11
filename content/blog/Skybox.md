---
title: "Skybox"
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity Component, Light, Render, Graphics]
author: "ljf12825"
summary: Introduction and Usage of Skybox in Unity
---
Skybox是一种渲染技术，用于在3D场景中创建远景背景，例如天空、宇宙、城市天际线等  
它本质上是一种把纹理图贴在一个立方体（或球体）内侧的技巧，玩家看不到边界，只能看到包裹在四周的“天空”

## Skybox的类型

Unity中支持几种常见类型的Skybox材质（Shader）：

| Shader 类型             | 描述                                |
| --------------------- | --------------------------------- |
| **6 Sided**           | 使用六张图片分别贴在立方体六个面上（一般来自 HDRI 贴图拆分） |
| **Cubemap**           | 使用一个立方体贴图（.cubemap）进行渲染           |
| **Procedural**        | 程序化天空（可设置太阳、云层、颜色渐变）              |
| **HDRI Skybox (PBR)** | 用于高清真实感环境的 HDR 渲染，常用于 Unity HDRP  |

## 设置Skybox的方法
### 1.通过Lighting设置全局Skybox
1.创建一个Skybox材质：
- `Assets`->右键->`Create > Material`
- Shader选择为`Skybox/6 Sided`或`Skybox/Cubemap`或`Skybox/Procedural`

2.在材质中设置贴图（textures）或参数

3.打开`Window > Rendering > Lighting`面板

4.在`Environment > Skybox Material`中拖入刚刚的材质

这会将该Skybox应用于整个场景

### 2.通过摄像机设置局部Skybox（高级）
```cs
RenderSettings.skybox = mySkyboxMaterial;
```
或为相机设置`Skybox`组件并赋值

### Skybox与Lighting的关系
Skybox不只是视觉上的背景，它还影响了：
- Ambient Lighting（环境光）
- Reflection Probe（反射探针）
- 全局光照（GI）计算

所以换Skybox后记得：
- 在Lighting界面点击“Generate Lighting”
- 使用Reflection Probe重新采样环境反射
