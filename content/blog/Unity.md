---
title: "Unity"
date: 2025-06-01
categories: [Note]
tags: [Unity]
author: "ljf12825"
summary: Overview of Unity overall architecture
---
# 引擎整体架构
## Unity Player(C++引擎内核)
Unity Player是Unity的心脏，它是引擎的底层C++实现，是多个底层模块的统称，负责把游戏逻辑变成实际在不同平台上运行的程序
### 定位与作用
- 本质：Unity Player是一个用C++写的跨平台引擎核心
- 作用：提供底层系统功能，包括：
  - 渲染（Graphics）
  - 物理（Physics）
  - 音频（Audio）
  - 网络（Networking）
  - 输入（Input）
  - 线程调度与内存管理

它本身不处理脚本逻辑，脚本逻辑最终会通过Scripting Runtime（Mono / IL2CPP）调用Player的C++接口

### 核心模块
1. 渲染子系统
  - 管理GPU渲染管线、材质、光照、Shader、后处理等
  - 内置支持多个渲染管线（Built-in/URP/HDRP）
  - 实现跨平台抽象：DirextX/Metal/Vulkan/OpenGL ES
2. 物理子系统
  - 基于NVIDIA PhysX或自研物理库
  - 提供刚体、碰撞、关节、角色控制器等功能
  - 负责物理模拟循环，保证帧率稳定
3. 音频子系统
  - 管理音源、3D音效、混音器、DSP效果等
  - 提供低延迟音频播放和跨平台兼容
4. 输入系统
  - 键盘、鼠标、触屏、手柄等输入统一抽象
  - 新Input System封装事件驱动接口，旧Input类通过C++底层调用
5. 资源与内存管理
  - C++层负责原生内存的分配与管理
  - 与托管内存（C#对象）协作，通过GCHandle或NativeArray管理托管与原生内存交互
6. 线程与任务调度
  - 渲染、物理、脚本、音频等子系统可能在不同线程
  - Player负责线程安全、调度和同步

### 与Scripting Runtime的关系
- Mono/IL2CPP负责执行C#脚本，但大部分游戏逻辑最终还是需要调用Player的底层C++接口
- 这层是桥梁：脚本调用 -> C++ Player -> 底层API（GPU、物理、音频）
- IL2CPP的作用是把C#脚本编译为C++，再通过Player编译成机器码执行，提高性能

## Scripting Runtime(Mono/IL2CPP)
这是Unity中连接“脚本逻辑”和Unity Player的桥梁，属于中间层运行时系统\

### 角色与定位
Scripting Runtime负责
- 执行C#脚本逻辑
- 管理托管内存（GC）
- 处理脚本与引擎C++层的互操作（bindings）

它是Unity脚本世界的虚拟机，Unity提供两种实现方式
- Mono（传统的.NET运行时）
- IL2CPP（把IL代码转成C++再编译为机器码）

### [Mono&IL2CPP](/content/blog/Mono%20and%20IL2CPP.md)

### 托管内存与GC机制
无论是Mono还是IL2CPP，脚本层都运行在托管内存环境
- 所有C#对象（GameObject、Component、ScriptableObject等）都受GC管理
- GC暂停（Stop-the-world）会影响帧率，因此
  - 高频逻辑要减少分配
  - 使用`object pool`对象池
  - 避免频繁装箱/拆箱

Unity自2019起采用了增量式GC（Incremental GC），缓解了帧冻结问题

### 脚本与C++交互机制（Bindings）
- Unity通过一套C++ <-> C# 桥接系统实现引擎调用
- 在C#层看到的类，如`Transform`、`Rigidbody`、`Renderer`等，都是
  - C#包装类（托管层）
  - 对应C++引擎对象（原生层）
- 绑定通过：
  - 内部调用（InternalCall）
  - P/Invoke（Platform Invocation）
  - Generated Bindings（新系统，自动生成高效桥接代码）

[NativeLayer to ScriptLayer](/content/blog/Native%20Layer%20to%20Script%20Layer.md)

脚本中`transform.position = new Vector3(1, 0, 0)`\
实际上是：C#对象 -> IL2CPP桥接 -> C++原生Transform -> 改变底层数据

```css 
[C#脚本] 
   ↓ 编译为IL
[Mono / IL2CPP Runtime]
   ↓ 调用桥接接口
[C++ Engine Core (Unity Player)]
   ↓
[底层系统：渲染 / 物理 / 音频 / 输入 ...]
```

## 平台抽象层
## 渲染管线（Build-in / URP / HDRP）
## 物理与动画子系统
## Editor扩展层

# 运行时结构
## GameObject & Component系统
## Scene & Asset管理
## 生命周期管理
## 脚本绑定与执行机制
## 内存模型与GC管理
