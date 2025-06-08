---
title: "Input System"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
---
Unity目前存在新旧两个输入系统，旧输入系统（Input类）和新输入系统（Input System包）

## Unity旧输入系统（UnityEngine.Input）

这是Unity默认内建的输入方式，无配置即可用，使用非常直观，主要通过静态类`Input`获取各种输入信息  
- 适合快速开发与小型项目
- 不支持热插拔和玩家映射
- 键盘/鼠标输入最简单最稳定
- 建议仅在不考虑复杂输入要求的项目中使用

### 键盘输入
基本方法： 
```cs
Input.GetKey(KeyCode.X); //判断某键是否按住
Input.GetKeyDown(KeyCode.X); // 是否按下（只触发一帧）
Input.GetKeyUp(KeyCode.X)l // 是否刚抬起
```
> `KeyCode`是一个枚举，表示各种键盘和鼠标按键

### 鼠标输入
鼠标按钮
```cs
Input.GetMouseButton(int button);      // 0左键，1右键，2中键
Input.GetMouseButtonDown(int button);
Input.GetMouseButtonUp(int button);
```
鼠标位置和滚轮
```cs
Vector3 mousePos = Input.mousePosition;    // 屏幕坐标
float scrollDelta = Input.mouseScrollDelta.y; // 滚轮滑动
```

### 触摸屏输入（Touch）
移动端专用，支持多点触控
```cs
int count = Input.touchCount;

if (count > 0)
{
    Touch touch = Input.GetTouch(0);
    Debug.Log(touch.position); // 屏幕坐标
    Debug.Log(touch.phase); // Began, Moved, Stationary, Ended, Cancled
}
```

### 虚拟轴（Input Manager）
通过Unity的`Project Setting -> Input Manager`设置，可实现跨平台控制  
它允许你用统一的名字来访问不同平台或设备上的输入  
通过`Input.GetAxis("Horizontal")获取的是一个“横向控制”的抽象值，不需要关心是按了哪个具体按键或移动了哪个摇杆
```cs
float h = Input.GetAxis("Horizontal"); // A/D 或 左/右
float v = Input.GetAxis("Vertical"); // W/S 或 上/下

float raw = Input.GetAxisRaw("Horizontal"); //不经过平滑处理
```

常用默认名称列表

| 名称                  | 类型 | 默认映射键             | 描述              |
| ------------------- | -- | ----------------- | --------------- |
| `Horizontal`        | 轴  | A/D 键、←/→键、手柄左摇杆  | 左右移动轴，范围 -1 到 1 |
| `Vertical`          | 轴  | W/S 键、↑/↓键、手柄左摇杆  | 上下移动轴，范围 -1 到 1 |
| `Fire1`             | 按钮 | Ctrl、鼠标左键、手柄 A 键  | 攻击、射击等          |
| `Fire2`             | 按钮 | Alt、鼠标右键、手柄 B 键   | 次要攻击、取消         |
| `Fire3`             | 按钮 | Shift、鼠标中键、手柄 X 键 | 冲刺或特殊技能         |
| `Jump`              | 按钮 | 空格键、手柄 Y 键        | 跳跃              |
| `Mouse X`           | 轴  | 鼠标横向移动            | 相机/视角横向旋转       |
| `Mouse Y`           | 轴  | 鼠标纵向移动            | 相机/视角纵向旋转       |
| `Mouse ScrollWheel` | 轴  | 鼠标滚轮上下滚动          | 放大缩小、切换武器等      |
| `Submit`            | 按钮 | Enter、手柄 A 键      | UI确认            |
| `Cancel`            | 按钮 | Escape、手柄 B 键     | UI取消            |


### 手柄支持（旧系统的有限支持）
手柄也通过虚拟轴或`KeyCode.JoystickButton0`等访问，但：
- 设备不通用，配置复杂
- 不支持手柄热插拔
- 不支持多个玩家分开处理

## Unity新输入系统（Input System Package）
Unity为了解决旧系统的局限，引入了新输入系统，是一个模块化、可配置、支持多设备的专业输入方案

