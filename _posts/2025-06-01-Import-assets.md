---
title: "Import Assets"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity]
author: "ljf12825"
---
Unity支持多种格式的资源文件，并能自动识别并进行初步处理  

## 资源导入基本流程
**1.将资源文件拖入`Assets`目录中（Unity会自动导入）**  
**2.在Inspector面板中查看导入设置**  
**3.配置相关参数，比如压缩方式、贴图类型、是否生成碰撞体等**  
**4.使用资源（拖到场景、作为材质贴图、挂到AudioSource等）**  

## 模型

### 支持格式
- `.fbx`推荐
- `.obj`
- `.dae`（Collada）
- `.blend`（需要Blender）

### 导入流程
1.拖拽`.fbx`文件到`Assets`文件夹  
2.选中模型文件，查看`Inspector`的导入设置
  - Scale Factor：缩放（一般保持默认）
  - Import Animations：是否导入动画
  - Import Materials：是否导入材质
  - Generate Colliders：是否自动生成碰撞体

### 导入后组成
- `Model`: 3D网格
- `Rig`（如果有骨骼）：用于动画绑定
- `Animation`：包含的动画片段
- `Materials`：自动生成或关联的材质

## 贴图

### 支持格式
- `.png`、`.jpg`、`.tga`、`.psd`（支持图层）等  

### 导入流程

1.拖入图片文件
2.在Inspector中设置：
  - sRGB（Color Texture）：颜色贴图用，法线贴图需取消勾选
  - Alpha Is Transparency：如果使用透明通道
  - Wrap Mode：Repeat（平铺）或Clamp（拉伸）
  - Filter Mode：Bilinear、Trilinear、Point（像素风）
  - Compression：高压缩（小体积）还是高质量（清晰）
  - Texture Type:
    - `Default`（通用）
    - `Sprite`（用于UI）
    - `Normal map`（法线贴图）
    - `Lightmap`（光照图）    


## 音频

### 支持格式

  - `.mp3`（压缩）
  - `.wav`（无损）
  - `.ogg`（高效）
  - `.aiff`

## 导入流程

1.拖入音频文件  
2.在`Inspector`中设置：  
  - Load Type：  
    - `Decompress On Load`（加载时解压，适合短音效）  
    - `Streaming`（边播放边加载，适合背景音乐）
  - Compression Format:
    - `Vorbis`、`ADPCM`、`PCM`
  - 3D Sound：是否启用3D空间化
  - Loop：是否循环播放

>**资源组织建议：** 使用好的文件夹结构和命名习惯，可以极大提高开发效率