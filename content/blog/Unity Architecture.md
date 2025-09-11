---
title: "Unity Componenet-Driven Architecture"
date: 2025-06-01
categories: [Note]
tags: [Unity, Unity Engine]
author: "ljf12825"
summary: Unity Components in native layer
---

Unity是如何驱动组件系统的

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
## GameObject 与 Component
>一个GameObject本身只是一个空壳，组件赋予它行为和外观

每个GameObject都至少由这三个组件（不可移除）：
- Transform
- Tag
- Layer

此外可以向GameObject添加任意数量的组件

每个组件就是一块插件，GameObject就像是空机壳，插上不同“模块”就有不同功能

Unity中组件影响GameObject的底层原理涉及到引擎的架构设计，主要是基于ECS的理念，虽然MonoBehaviour不是纯ECS，但是思想相近

在底层， Unity的架构可以简化成
```ini
GameObject = 实体（Entity）
Component = 数据 + 行为
```

### GameObject本身
- 是一个空容器，并不做事
- 只持有一个Transform
- 它维护一个组件列表（Component List）

### 当添加组件时
```csharp
gameObject.AddComponent<Rigidbody>();
```
Unity引擎底层会：
**1.分配内存：在C++层面为`Rigidbody`组件实例分配空间**

**2.注册行为：将这个组件加入到`GameObject`的组件列表中**

**3.标记更新：将这个GameObject添加到物理系统更新队列中**

**4.启用生命周期函数**

### 行为生效
Unity引擎每帧进行如下操作：
```text
for each GameObject:
    for each Component in GameObject:
        if Component.enabled:
            Call Component.Update() / Render() / PhysicsStep()
```
具体到组件类型：

| 组件类型            | 引擎系统           | 调用方式                       |
| --------------- | -------------- | -------------------------- |
| `MonoBehaviour` | 脚本系统           | `Update()`、`FixedUpdate()` |
| `Rigidbody`     | 物理系统（PhysX）    | 每帧物理步计算                    |
| `Renderer`      | 渲染系统（Graphics） | 每帧调用 GPU 绘制命令              |
| `Collider`      | 碰撞系统           | 注册到空间分区中                   |
| `AudioSource`   | 音频系统           | 发出 PCM 数据到音频设备             |

### Unity引擎背后的底层结构（简化）
```scss
GameObject (C#层 wrapper)
 └─ native GameObject (C++层)
       ├── Transform
       ├── Component[]
       │    ├── MonoBehaviour（C#脚本）
       │    ├── Renderer
       │    ├── Rigidbody
       │    └── ...
```
Unity通过“托管桥接机制（Managed to Native Binding）”来让C#脚本和底层C++引擎通讯


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

## Unity启动流程

### 0.平台入口：本地程序启动

| 平台      | 实际入口函数                                         |
| ------- | ---------------------------------------------- |
| Windows | `main()` 或 `WinMain()`（由 `UnityPlayer.dll` 调用） |
| Android | `android_main()`（JNI 进入 `libunity.so`）         |
| iOS     | `UIApplicationMain()`（Objective-C）             |
| WebGL   | `Module.main()`（JavaScript/wasm）               |

这些都在C++写的引擎底层里，不可见且无法修改  

### 1.引擎初始化阶段

| 步骤       | 内容                                        |
| -------- | ----------------------------------------- |
| 加载配置     | 读取 PlayerSettings、Graphics API、质量设置等      |
| 初始化子系统   | 渲染器、输入系统、物理引擎、音频系统等                       |
| 初始化脚本引擎  | 启动 Mono 或 IL2CPP 虚拟机                      |
| 加载资源管理系统 | AssetBundle / Resources 等                 |
| 加载启动场景   | SceneManager 加载 Build Settings 中第一个 Scene |

### 2.场景加载后-创建GameObject/Component实例
加载场景时：  
- 逐个读取GameObejct
- 为每个GameObject绑定组件
- 为挂载了`MonoBehaviour`的对象创建托管对象实例（C#）

### 3.生命周期调用顺序（首次）
Unity中的生命周期调度系统，每帧按照生命周期函数顺序依次调用

### 4.游戏循环开始（每帧）
Unity内部引擎每帧执行以下大致顺序：

| 顺序 | 方法             | 功能                                |
| -- | -------------- | --------------------------------- |
| 1  | Input Update   | 处理键鼠、触摸、手柄输入                      |
| 2  | `Update()`     | 调用所有激活脚本的 `Update()`（每帧）          |
| 3  | 动画更新           | Animator 执行动画播放                   |
| 4  | 物理模拟           | `FixedUpdate()` 调用 + Rigidbody 计算 |
| 5  | `LateUpdate()` | 通常用于摄像机跟随等逻辑                      |
| 6  | 渲染准备           | 剔除、光照、材质、阴影计算等                    |
| 7  | 渲染提交           | 图像渲染到屏幕，执行 UI、特效等                 |
| 8  | `OnGUI()`      | Unity GUI 系统（少用）                  |
| 9  | PostProcessing | 后期处理：Bloom、HDR、MotionBlur         |


### 5.脚本执行机制（Mono vs IL2CPP）

#### Mono模式（Editor 或 Dev Build）
- 每个脚本是托管C#类，由Mono VM动态加载与反射调用
- 优点：调试快，热重载方便
- 缺点：性能差，函数调度慢

#### IL2CPP模式（正式发布时）
- Unity构建时将C#脚本编译为C++源码 -> 原始代码
- 所有`Update()`、`Awake()`变成真正的C++函数
- 优点：性能极高、无法反编译
- 缺点：编译慢，不支持热重载

## Unity ECS（新架构：Entity-Component-System）
传统GameObject模式虽然灵活，但性能瓶颈明显（组件查找慢、缓存不友好）  
Unity推出的ECS（DOTS）架构更接近底层系统编程

| 架构元素        | 作用                                  |
| ----------- | ----------------------------------- |
| `Entity`    | 轻量 ID，不是 GameObject，零开销。            |
| `Component` | 纯数据结构（无逻辑），类似 C struct。             |
| `System`    | 控制逻辑，处理所有符合条件的 Entity+Component 数据。 |

> ECS通过内存连续布局 + SIMD + JobSystem实现了超高性能
