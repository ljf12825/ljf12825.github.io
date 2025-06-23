---
title: "Unity Invisible Trap"
layout: single
date: 2025-06-01
categories: [Debug]
tags: [Unity, Unity Trap, Debug]
author: "ljf12825"
---
Unity实际开发中，有很多“看起来正常、实则容易出错”的**奇怪问题**（或称为**隐形陷阱**）

# Class 1 交互相关
## 1.多个可交互物体，输入触发多个
- 场景：靠近多个箱子同时按下`E`，多个箱子一起打开
- 原因：所有物体监听`E`，没有加距离或唯一判定
- 解决方案：只响应最近/朝向前方的一个对象

## 2.Trigger触发多次Enter/Exit
- 场景：一个对象靠近某个Trigger区域，`OnTriggerEnter`被触发两次
- 原因：
  - 可能身上挂有多个Collider
  - 或包含子物体的Collider也触发了
- 解决方案：确认是否是重复触发，加入`other.gameObject == expectedObject`判断

## 3.Button UI点击两次才响应
- 原因：
  - UI按钮背后有透明/未关闭的UI元素挡住射线
  - 或者EventSystem被禁用、Canvas未设置正确Sorting Order
- 解决方案：调试Graphic Raycaster、Canvas排序、Raycast Target勾选项

# Class 2 物理系统相关

