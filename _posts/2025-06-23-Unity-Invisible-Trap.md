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
## 1.Rigidbody设置position导致穿透
- 使用`transform.position = ...`设置刚体位置，会跳过物理引擎检测，导致穿墙
- 正确做法：使用`Rigidbody.MovePosition()`

## 2.Collider和Rigidbody的组合错误
- 常见错误组合
  - 静态物体（如地面）用了非Kinematic的Rigidbody
  - 移动物体没加Rigidbody，靠transform移动导致物理行为异常

- Unity的推荐：
  - 静态物体（地面）用Collider，无Rigidbody
  - 动态物体加Rigidbody，控制用物理接口

# Class 3 生命周期相关
## 1.协程中的`WaitForSeconds`在TimeScale为0时失效
```cs
StartCoroutine(Example());

IEnumerator Example()
{
  yield return new WaitForSeconds(2f); // 如果Time.timeScale == 0，不会等待
}
```
- 解决方案：用`WaitForSecondRealtime(2f);

## 2.脚本的`Update()`仍被调用，虽然物体不可见
- 即使物体在摄像机外、隐藏或inactive子物体，只要GameObject时active的、脚本时enable的，Update就会继续执行



