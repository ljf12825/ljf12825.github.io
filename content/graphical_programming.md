---
title: Graphical Programming
author: ljf12825
date: 2026-07-11
tags: [Graphic]
summary: Overview of graphical programming
---

图形学编程包含三大块

- 生成图像(渲染)：从几何数据 + 材质 + 光照 -> 像素
- 处理图像(后处理)：对已有像素做变换（模糊、锐化、调色）
- 模拟与动画：物理模拟（布料、流体、刚体碰撞）

## 生成图像（渲染）

生成图像，也叫渲染，是图形学编程中最大的一块\
渲染的本质是将抽象的三维数据（几何、材质、灯光、相机）计算并绘制成二维像素图像

从物理学的角度来看，渲染是在求解由Jim Kajiya在1986年提出的渲染方程

$$L_o(p, \omega_o) = L_e(p, \omega_o) + \int_{\Omega} f_r(p, \omega_i, \omega_o) L_i(p, \omega_i) (\mathbf{n} \cdot \omega_i) d\omega_i$$

简单来说，该方程表达了：某个点发出的光线流量$$L_o$$ = 该点自发光$$L_e$$ + 所有方向入射光$$L_i$$在该表面反射($$f_r$$BRDF)的总和。图形学几十年的发展，本质上就是在寻找“更快、更准”地揭开这个积分公式的方法
