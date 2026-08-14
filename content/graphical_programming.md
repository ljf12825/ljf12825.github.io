---
title: Computer Graphics
author: ljf12825
date: 2026-07-11
tags: [Graphic]
summary: Overview of graphical programming
---

Computer Graphics 是利用计算机程序处理、生成、表示、分析和绘制图形/视觉数据的一大类编程

```
Computer Graphics
|
|-- Rendering
|   |-- Resterization
|   |-- Ray Tracing
|   |-- Path Tracing
|   |-- Lighting
|   |-- Shadows
|   |-- PBR
|
|-- Geometry Processing
|   |-- Mesh
|   |-- Mesh Simplification
|   |-- Subdivision
|   |-- Collision Geometry
|   |-- Procedural Geometry
|
|-- Animation
|   |-- Keyframe
|   |-- Skeletal Animation
|   |-- Skinning
|   |-- Physics Animation
|   |-- Procedural Animation
|
|-- Image Processing
|   |-- Filtering
|   |-- HDR
|   |-- Denoising
|   |-- Tone Mapping
|   |-- Image Reconstruction
|
|-- Simulation
|   |-- Fluid
|   |-- Cloth
|   |-- Rigid Body
|   |-- Particle
|
|-- Computer Vision
|   |-- Image Recognition
|   |-- Feature Detection
|   |-- 3D Reconstruction
|   |-- SLAM
|
|-- Visualization
|   |-- Scientific Visualization
|   |-- Data Visualization
|   |-- Volume Rendering
|
|-- GPU Computing
    |-- Compute Shader
    |-- CUDA
    |-- General GPU Algorithms
```

## 生成图像（渲染）

生成图像，也叫渲染，是图形学编程中最大的一块\
渲染的本质是将抽象的三维数据（几何、材质、灯光、相机）计算并绘制成二维像素图像

从物理学的角度来看，渲染是在求解由Jim Kajiya在1986年提出的渲染方程

$$L_o(p, \omega_o) = L_e(p, \omega_o) + \int_{\Omega} f_r(p, \omega_i, \omega_o) L_i(p, \omega_i) (\mathbf{n} \cdot \omega_i) d\omega_i$$

简单来说，该方程表达了：某个点发出的光线流量$$L_o$$ = 该点自发光$$L_e$$ + 所有方向入射光$$L_i$$在该表面反射($$f_r$$BRDF)的总和。图形学几十年的发展，本质上就是在寻找“更快、更准”地揭开这个积分公式的方法
