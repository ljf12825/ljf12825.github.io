---
title: Mixamo Model
date: 2025-06-01
categories: [Toolchains]
tags: [Model]
author: "ljf12825"
type: log
summary: Generate model by Mixamo
---

## Articulation Body

## Mixamo
免费的Adobe平台，用于下载各种模型和动画

### 下载设置
![mixamodownloadsetting](/images/log/mixamodownloadsetting.jpg)

- Animator Controller
- Avatar：动画重定向使用
- Apply Root Motion：角色的运动基于动画而不是脚本，当基于动画时，运动状态根据动画的播放进行；当基于脚本时，动画只是动画，运动状态由脚本决定
- Update Mode
  - Normal：根据当前时间刻度改变角色动画的播放速度
  - Fixed：将动画逻辑转移到`FixUpdate()`中
  - Unscaled Time：动画器和动画独立运行于时间刻度

- Culling Mode
  - Always Animate：即使不在摄像机范围内也始终执行动画并进行计算
  - Cull Update Transforms：当不在摄像机范围内时，Unity会继续计算动画中的后续帧
  - Cull Completely：离开后暂停，返回后继续

- Format:

| 格式名称                | 扩展名    | 说明                                    | 是否推荐用于 Unity |
| ------------------- | ------ | ------------------------------------- | ------------ |
| **FBX Binary**      | `.fbx` | 二进制格式，体积小，加载快，是主流标准格式                 |  强烈推荐       |
| **FBX ASCII**       | `.fbx` | 文本格式，方便查看内容，但体积大、加载慢                  |  不推荐       |
| **FBX for Unity**   | `.fbx` | 专门为 Unity 设置的导出选项，自动匹配 Unity 支持的版本及设置 |  推荐（最方便）    |
| **FBX 7.4 (2014+)** | `.fbx` | 高版本 FBX（兼容性较好，支持动画、骨骼、材质等）            |  常用版本       |
| **FBX 6.1 (2009)**  | `.fbx` | 老版本 FBX，兼容旧引擎，但不推荐新项目使用               |  不推荐        |
| **Collada (.DAE)**  | `.dae` | XML 格式，开源，结构清晰，兼容性较差，在 Unity 中常有问题    |  不推荐        |


- FPS：不同帧率，帧率越高，文件体积越大

- Keyframe Reduction：删除动画中与周围帧值差异不够大的帧，减少细节，Unity将用插值进行填补
  - none
  - uniform
  - non-uniform

- Skin：蒙皮
  - withSkin：包含蒙皮
  - withoutSkin：仅包含动画
