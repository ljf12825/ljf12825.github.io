---
title: "Unity Componenet-Driven Architecture"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity Engine]
author: "ljf12825"
permalink: /posts/2025-06-02-Unity-Architecture/
---

## Unity是如何驱动组件系统的

从**运行架构**、**组件调度机制**、**底层实现**三个方面来深度剖析

### Unity的运行架构（经典GameObject-Component模型）
Unity引擎的架构是 **“组合优于继承”** 的典范：
- `GameObject`：游戏世界中所有对象的容器
- `Component`：挂在GameObject上的功能模块
- `MonoBehaviour`：Unity脚本组件的基类，支持生命周期函数

```csharp
//伪代码结构
class GameObject
{
    List<Component> components;
}

class Component
{
    GameObject gameObject;
}

```

## Unity是如何调度组件的生命周期的
Unity在每一帧都会按以下顺序做一次组件调度遍历：
```text
For ever active GameObject:
    For every enable Component:
        If first frame:
            Call Awake()
            Call Start()

    Run physics:
        Call FixedUpdate()

    Handle rendering:
        Transform -> Camera -> Renderer
```
- Unity引擎内部有个巨大的函数表（或反射表），知道哪些组件实现了哪些生命周期函数
- 每一帧自动去“调用你实现的函数”
- C++内部利用RTTI或IL2CPP编译出的函数表映射进行调用

## 底层实现机制
### 在Mono引擎（早期）或IL2CPP编译后
- Unity会扫描所有`MonoBehaviour`脚本的继承结构和成员函数
- 使用反射或JIT（Mono）或AOT（IL2CPP）建立生命周期函数映射
- 每帧调用`Update()`时并不是逐个判断字符串，而是已建立了对应的“执行列表”
> IL2CPP模式下，C#代码会被编译成C++，再编译成机器码，性能更好，但调试难

## Unity怎么知道你挂了什么组件
每个GameObject内部维护了一个组件列表（通常是数组或链表），每个组件记录自己类型，并且Unity会为常见组件使用缓存优化
- `GetComponent<T>()`实际上会进行：
  - 查缓存
  - 缓存没有就遍历组件数组
  - 找到就缓存下来，下次加速

## Unity `GameObject` + `Component`的底层存储结构
GameObject + Component架构时Unity的核心数据结构  
大致如下：
```text
Scene
 └── GameObjects (树状结构)
      ├── GameObject A
      │     ├── Transform (每个 GameObject 必有)
      │     ├── MeshRenderer
      │     ├── BoxCollider
      │     └── MyScript (MonoBehaviour)
      └── GameObject B
            └── Transform
```
在内存中的布局
```text
[GameObject]
 ├─ Name: "Enemy"
 ├─ Tag: "Enemy"
 ├─ Active: true
 ├─ Component[] --> 指向一组组件
 │    ├─ [0] Transform*
 │    ├─ [1] MeshRenderer
 │    ├─ [2] MyScript : MonoBehaviour
 └─ SceneNode / Parent / Children 等关系信息
```
- 所有组件都存储在一个 **Component列表（数组/链表）** 中
- `Transform`总是第一个组件（内置逻辑保证）
- 每个`Component`内部都有一个指向所属`GameObject`的反向引用
```cpp
class GameObject
{
    std::vector<Componenet*> components;
    Transform* transform;
    ...
};
```

## Unity中生命周期函数的调度机制

### Per Frame
Unity的C++引擎内部维护了一套复杂的调度系统，它在每帧中会依次完成：
- 处理输入事件
- 调用`MonoBehaviour.Update()`等函数
- 执行物理模拟
- 渲染准备
- 真正渲染

### 调用过程（以Update()为例）
**关键逻辑：Unity会在引擎启动时反射出所有含有Update()的脚本，并构建函数调度表（Invocation List）
```text
Startup:
|___MonoScript Scanning（扫描所有脚本）
       |___找出哪些脚本实现了Update()

Runtime 每帧：
|___遍历Update列表
        |___调用脚本.Update()
```
> 这个调度是Unity内部用C++写的调度器来完成的，不是C#代码自己管自己的调用

### IL2CPP行为
当你开启IL2CPP编译  
- 所有C#代码都会被编译成IL
- Unity的IL2CPP工具将IL转成CXX
- 然后统一编译为Native Binary

**以Update()为例**
最终会变成：  
```cpp
void PlayerMove_Update(MonoBehaviour* this) {}
```
> Unity引擎内核就可以直接调用这个C++函数，避免了反射调用，提高性能

## Unity ECS（新架构：Entity-Component-System）
传统GameObject模式虽然灵活，但性能瓶颈明显（组件查找慢、缓存不友好）  
Unity推出的ECS（DOTS）架构更接近底层系统编程

| 架构元素        | 作用                                  |
| ----------- | ----------------------------------- |
| `Entity`    | 轻量 ID，不是 GameObject，零开销。            |
| `Component` | 纯数据结构（无逻辑），类似 C struct。             |
| `System`    | 控制逻辑，处理所有符合条件的 Entity+Component 数据。 |

> ECS通过内存连续布局 + SIMD + JobSystem实现了超高性能