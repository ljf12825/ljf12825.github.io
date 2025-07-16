---
title: "Native Layer to Script Layer"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Underlying Principle]
author: "ljf12825"
permalink: /posts/2025-07-15-Native-Layer-to-Script-Layer/
---
## The Bridge between Native Layer and Script Layer
Unity引擎运行时，本质上是一个C++引擎内核 + C#脚本层的结构

所写的`MonoBehaviour`只是在C#中的一个代理对象，真正控制游戏运行的逻辑、渲染、物理等是C++层在执行

所以从`UnityEngine.Object`开始，Unity构建了一个“双向映射体系”
```plaintext
C++对象（native） <--- instance ID --- UnityEngine.Object（C#托管对象）
        ↑                                       ↑
    内存资源                                   脚本代理
```

### 从Object到MonoBehaviour的完整继承链
```text
System.Object （纯托管）
└── UnityEngine.Object （托管对象，桥梁类）
    ├── GameObject（托管对象）
    └── Component
        ├── Transform / Renderer / Collider...（托管对象）
        └── MonoBehaviour （托管行为对象，支持生命周期方法）
```
它们都不是普通的C#对象，它们都与C++侧的“实体”挂钩，甚至生命周期也是引擎控制的

### native layer 与 script layer的绑定方式
Unity会通过一套机制将C++层对象暴露给C#层，这其中最关键的桥梁是：`instance ID + GCHandle + m_CachedPtr`

| 名称                | 作用                                            |
| ----------------- | --------------------------------------------- |
| `m_CachedPtr`     | `UnityEngine.Object`中保留的指针，指向C++对象的地址（Unsafe） |
| `GCHandle`        | Unity用于保持托管对象不被GC收走，native端持有                 |
| `Instance ID`     | 每个 C++ native 对象的唯一标识，Unity使用它查找C#代理对象        |
| `ScriptingObject` | C++对象的基类，用于和C#对象绑定（runtime下存在）                |
| `MonoObject*`     | 指向 C# 对象的原生指针（Mono环境时）                        |

流程图：
```plaintext
C++对象 (ScriptingObject)
   ↕ instance ID
C#对象（UnityEngine.Object） ← GCHandle ← C++
         ↑
      m_CachedPtr → C++对象
```

### instance ID
Unity通过使用`instance ID`统一管理对象

每个在C++层的Unity对象都有一个唯一的标识符，即`instance ID`，它用于区分不同的C++对象。这个标识符的作用类似于内存中的指针
- 在C#中，可以通过`UnityEngine.Object.GetInstanceID()`获取该对象的`instance ID`
- 在C++中，通过这个`instance ID`可以找到实际的对象。所有Unity引擎的原生对象都会被注册到一个全局的对象管理器中，这个管理器会维护`instance ID`和对象之间的映射

可以把`instance ID`想象成一个类似于数据库中的“主键”，它指向C++层中的实际属性。在C#层，Unity通过`m_CachedPtr`或类似机制与C++对象建立联系。C#调用一个方法或访问一个属性时，实际上就是通过这个`instance ID`去C++层查找并操作相应对象的

### C++层对象的生命周期管理
在Unity中，C++层的对象生命周期是由引擎控制的，而不是像普通的C#对象那样由GC自动回收。也就是说，C++对象在被销毁时，并不会立即被C#垃圾处理器回收，而是由Unity引擎自己管理

关键点：
- C++层对象的创建和销毁：Unity引擎在创建或销毁对象时，会在C#层为这些C++对象创建对应的托管代理。当你调用`Destroy()`或`DestroyImmediate()`时，Unity会标记这个对象为待销毁，但实际销毁操作会发生在引擎的下一帧
- GCHandle和`instance ID`：为了防止C#垃圾回收器误回收正在被引擎使用的对象，Unity会使用`GCHandle`来防止C#层的对象被GC销毁。`GCHandle`是一个特定的标记，它告诉C#的垃圾回收器，这个对象在native层还有引用，不应该被回收
- 内存管理：一旦`GameObject`或其他对象在C++层销毁，Unity会通过管理器从托管层移除该对象，确保其不再被访问。此时，C#层的引用会变成`null`，也就无法再访问该对象了。若访问，C#层会返回`null`，这便是Unity的`fake null`行为

### C#和C++的指针交互
在C#和C++之间，`m_CachedPtr`是Unity使用的一个关键字段，它保存了C++对象的指针。这个指针并不会直接暴露，而是通过`UnityEngine.Object`的方法间接访问

例如，当使用`Instantiate()`克隆一个对象时，C#层会创建一个新的对象，并将其`m_CachedPtr`指向一个新的C++对象。这种机制确保了C#和C++层可以同步管理对象的创建、销毁和引用

为什么不直接使用C++指针
- 安全性：如果C#直接操作C++指针，那么内存管理将变得非常复杂，容易发生野指针错误（例如访问已销毁的对象）
- 跨平台：Unity需要支持多个平台，如果直接操作原始指针，会导致平台之间的不兼容

### 内存和资源管理：Native与Managed内存
Unity对内存的管理通常分为两类：托管内存（Managed Memory）和原生内存（Native Memory）

托管内存：
- 这是C#层的内存，由.NET的垃圾回收器负责管理。Unity中的许多类都在托管内存中分配
- 例如，通过`new GameObject()`创建一个对象时，它实际上是在托管内存中创建了一个`GameObject`代理类，该类最终通过`instance ID`和C++对象绑定

原生内存：
- 这是C++层的内存。Unity对这些内存进行严格管理，确保它们被正确地分配和释放
- 对于一个`GameObject`，它在C++层的实际数据都存在原生内存中。C#只能通过指针和绑定方法访问这些内存数据，而不能直接操作它

### 资源的加载与卸载的底层机制
Unity的资源管理在C++层也有对应的资源对象，它们通过资源路径和资源管理系统来加载和卸载

当使用`Resource.Load()`或`Addressables`加载资源时，Unity会在C++层将资源加载到内存中，并返回一个C#层的代理对象。这些资源的引用计数会由C++层管理，当没有对象再引用这些资源时，C++层会负责销毁这些内存并释放内存

### 性能和优化

1. 频繁的资源加载和卸载：如果你在每帧都调用 Resources.Load() 或频繁销毁对象，可能会导致性能瓶颈。推荐使用 Addressables 或 Object Pooling 技术来优化资源管理。

2. 避免大量无效对象：例如，创建大量的 GameObject、MonoBehaviour，然后频繁销毁。这样不仅会增加垃圾回收的负担，还会在 C++ 层产生频繁的对象创建和销毁开销。可以使用对象池来减少这种开销。

3. 内存泄漏问题：如果对象在 C++ 层没有正确销毁，可能导致内存泄漏。特别是 MonoBehaviour 等绑定对象，它们的销毁需要确保在 C# 层正确解除引用，否则即使对象在 C++ 层销毁，C# 层的引用仍会阻止 GC 回收。


### 对象创建过程
以创建一个`GameObject`为例：
```cs
GameObject go = new GameObject("Hero");
```
在背后发生了：
1. C#调用UnityEngine的构造方法
2. Unity C#层调用了内部绑定的native构造函数（通过`[NativeMethod]`或`extern`实现）
3. C++中创建了一个`GameObject`对象，并注册`instance ID`
4. Unity C++层为这个对象创建一个C#代理，分配内存，绑定`m_CachedPtr`
5. 如果启用脚本（MonoBehaviour），则Unity会通过反射或运行时代码绑定，自动挂载脚本（生成MonoObject，绑定）

## MonoBehaviour的生命周期的控制
生命周期函数是Unity引擎每帧自动调度的：
- Unity在每帧中，遍历所有激活的`GameObject`和`Component`
- 检查是否存在重写的生命周期函数
- 调用托管对象中的方法（通过反射或自动生成的绑定）

## MonoBehaviour是怎么挂载的
```cs
gameObject.AddComponent<MyScript>();
```
内部流程：
1. C#调用泛型方法`AddComponent<T>()`
2. UnityC#层调用底层`AddComponent(Type t)`(native bridge)
3. 引擎C++层创建一个`MonoBehaviour`实例（C++对象）
4. 引擎创建对应的C#代理对象，并调用构造函数
5. 将代理对象挂到该`GameObject`下，并添加到调度列表中
6. 引擎在适当时机调用`Awake() -> Start() -> Update()`

所以不能用`new MyScript()`创建MonoBehaviour，它不是纯托管类，是托管↔native绑定类