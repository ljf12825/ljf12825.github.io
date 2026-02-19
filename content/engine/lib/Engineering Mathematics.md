---
title: "Engineering Mathematics"
date: 2025-06-01
categories: [Note]
tags: [Graphics, Mathematics]
author: "ljf12825"
type: blog
summary: Mathematical Foundations of Graphics
---
图形开发中的常用数学

## 向量
### 定义
向量有方向和大小，比如`(1, 2)`、`(3, 5, -1)`是二维和三维向量

### 基本操作
#### 加减法
向量的加减法在图形学中非常常见，它们的“意义”主要体现在空间位置变换、方向差异、运动计算等方面

**几何意义**\
向量加法：位移的累加，从A点触发，走A向量，然后接着走B向量，到达的位置

图形学应用：
- 连续移动（多帧叠加移动）
- 合成多个力、速度方向
- 路径规划（导航中）

例如：
```cs
Vector3 newPosition = transform.position + movementDirection * speed * Time.deltaTime;
```
表示当前位置 + 方向 * 速度 -> 下一帧位置

向量减法：表示从一个点到另一个点的方向

向量`A - B`就是从点B指向点A的向量

图形学应用：
- 求物体之间的方向向量（例如：敌人朝玩家方向攻击）
- 摄像机朝向目标：`target.position - camera.position`
- 计算法线、插值、射线方向等

例如：
```cs
Vector3 dir = target.position - transform.position;
transform.forward = dir.normalized; // 朝向目标
```








- 数乘：向量整体缩放
- 点乘（Dot Product）
  - `a · b = |a||b|cosθ`，可以用来计算夹角
  - 应用：光照（Lambert光照模型）
  - 意义：

- 叉乘（Cross Product）
  - 只适用于3D：`a x b`得到一个垂直于a和b的新向量
  - 应用：求发现方向、旋转轴等
- 归一化（Normalization）：将向量变为单位长度



## 三角函数

## 线性代数
### 向量空间
### 矩阵乘法
### 变换矩阵
### 正交
### 特征向量
### 线性变换本质

## 齐次坐标
### 4×4矩阵
### w分量
### 透视投影

## 空间几何
### 点线面关系
### 空间夹角
### 包围盒
### 相交检测

## 物理数学
### 速度
### 加速度
### 抛物线公式

## 曲线曲面
### Bézier
### Catmull-Rom
### 样条曲线

## 概率统计
### 概率分布
### 采样
### 蒙特卡洛

## 微积分
### 导数
### 函数斜率
### 积分思想




