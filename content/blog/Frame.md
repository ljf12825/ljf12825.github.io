---
title: "Frame"
date: 2025-06-01
categories: [Note]
tags: [Unity, Rendering, Graphics]
author: "ljf12825"
summary: Frame and GameLoop
---
在Unity中，Frame（帧）是游戏运行的基本时间单位

## 什么是Frame
> Frame：指游戏每渲染并更新一次画面所经历的完整周期
> 一个Frame包含了物理模拟、逻辑更新、渲染提交等多个阶段
- 游戏每秒运行多个帧，成为FPS（Frame Per Second），帧率越高越流畅
- 如果帧率是60FPS，表示每秒执行60次完整的Frame逻辑

## Frame的生命周期
```css
[Input] -> [Physics] -> [Update] -> [AI/Animator] -> [LateUpdate] -> [Rendering] -> [Present]
```
详见[Scripts]({{site.baseurl}}/posts/2025-06-02-Scripts/)

## 不同帧的分类

| 帧类型                  | 描述             |
| -------------------- | -------------- |
| **逻辑帧（Update 帧）**    | 每帧都会执行的脚本逻辑    |
| **物理帧（FixedUpdate）** | 固定时间调用一次，与帧率无关 |
| **渲染帧**              | Unity 渲染一次画面   |

## Frame与多线程
Unity中每一帧可以大致分为如下几个阶段：
```mathematica
Frame 开始
│
├─ Script Update（MonoBehaviour Update）
├─ FixedUpdate（每 N 帧触发）
├─ Animation Update
├─ Physics Update
├─ AI Navigation Update
├─ Culling（剔除）
├─ Rendering Setup
│
├─ Rendering（提交 DrawCalls 到 GPU）
│
└─ EndFrame
```
这些阶段会部分并行执行（也就是说，并非所有都是主线程执行的）

### 多线程的参与

| 线程                      | 作用                        | 举例                               |
| ----------------------- | ------------------------- | -------------------------------- |
| **主线程（Main Thread）**    | 执行大部分脚本、生命周期函数、UI、调度渲染    | Update、LateUpdate、OnGUI、Animator |
| **Job System 线程池**      | 执行并行任务，如变换更新、骨骼动画、AI、路径查找 | DOTS Jobs、Transform System       |
| **渲染线程（Render Thread）** | 独立线程打包渲染命令给 GPU           | Draw Call 打包、CommandBuffer       |
| **Worker Threads（如音频）** | 异步加载资源、播放音频、网络等           | Audio Thread、Loading Thread      |
| **GPU（设备线程）**           | 执行实际绘制、后处理、粒子等并行任务        | Shader、Compute Shader、VFX Graph  |

### 一帧中多线程协同的流程图
```less
             [一帧开始]
                   │
      ┌────────────┴─────────────┐
      │                          │
[Main Thread]              [Job System Threads]
      │                          │
 MonoBehaviour.Update()     DOTS Job: 动画、物理、AI计算等
      │                          │
 LateUpdate() ←───────────────┘（主线程同步 Job 结果）
      │
[开始渲染准备]
      │
      └─→ [Render Thread] → 提交 GPU 渲染命令
                          │
                          ↓
                   [GPU 渲染这一帧]
```

### 线程同步与一帧的边界
- Job在当前帧内启动，也要在当前帧内完成，结果才能同步回主线程
- Unity不允许Job修改UnityEngine.Object
- `JobHandle.Complete()`会阻塞等待Job完成，要合理使用

## Frame性能调优
Frame Optimization是游戏性能优化的核心工作之一，目标是在每一帧内把CPU、GPU、内存、线程、渲染等资源使用最大化、冗余最小化，从而达到稳定的帧率  

### 一帧的性能结构（大脑图）
Unity中一帧的总耗时通常来自这几个方面：
```css
一帧时间（Frame Time） ≈
  CPU 脚本逻辑开销 +
  Physics 运算 +
  Animation 采样/骨骼 +
  Renderer 准备/剔除 +
  渲染线程开销（Render Thread）+
  GPU 渲染耗时
```
目标是：让这些总和 小于 1 / FPS

### 调优的目标：谁卡，就调谁

| 调优对象          | 优化目的               | 工具                            |
| ------------- | ------------------ | ----------------------------- |
| CPU 主线程       | 减少逻辑卡顿             | Profiler、Timeline             |
| Job 多线程       | 减少不必要的等待           | Profiler、JobDebugger          |
| Render Thread | 减少 DrawCall 和渲染命令量 | Frame Debugger、Stats          |
| GPU 渲染        | 降低 Shader/像素复杂度    | GPU Profiler、RenderDoc        |
| 内存使用          | 减少 GC 和加载卡顿        | Memory Profiler、Deep Profiler |

### 常见瓶颈与优化方法（大致思路）
#### 1.脚本逻辑太重（主线程占满）

| 症状                                | 优化手段                     |
| --------------------------------- | ------------------------ |
| Update() 每帧循环太多对象                 | 改为 Job 或事件驱动、UpdateGroup |
| 大量使用 `Find`, `GetComponent`, LINQ | 改成缓存引用、避免动态分配            |
| 高频调用 GC                           | 使用对象池、Span、少用 string 拼接  |

#### 2.Draw Call太多 / Batching失效

| 症状             | 优化方法                             |
| -------------- | -------------------------------- |
| 每帧几千次 DrawCall | 开启 SRP Batching 或 GPU Instancing |
| 动态物体频繁改变材质     | 合并材质、使用 Texture Atlas            |
| UGUI 每个按钮都独立绘制 | 使用 Canvas 分层、合批策略优化（静态 Canvas）   |

#### 3.渲染管线太重 / GPU满载

| 症状               | 优化手段                     |
| ---------------- | ------------------------ |
| Shader 复杂 / 光照太多 | 降低 Shader 复杂度，合并 Pass    |
| 每像素灯光多 / 阴影开销大   | 减少实时光源数量，Bake 灯光         |
| 后处理堆叠太多          | 合并效果、调低分辨率、关闭没必要的 PostFX |

#### 物理模拟耗时长

| 症状                      | 优化方法                              |
| ----------------------- | --------------------------------- |
| 大量 Collider / Rigidbody | 简化碰撞体、使用 Layer 避免不必要检测            |
| FixedUpdate 太频繁         | 调整 Fixed Timestep（如 0.02 → 0.033） |
| 不必要的物理交互                | 设置 isKinematic、启用睡眠               |

#### 资源加载卡顿 / GC卡顿

| 症状                                         | 优化方法                         |
| ------------------------------------------ | ---------------------------- |
| 使用 `Resources.Load()` 或 `Instantiate()` 卡顿 | 使用 Addressables 异步加载         |
| 不断产生临时对象                                   | 对象池、避免 foreach/ToList/Lambda |
| 大量 UI 弹窗频繁创建销毁                             | UI 预加载 + 缓存 + 对象池化管理         |

**详见 [Unity Performance Tuning]({{site.baseurl}}/posts/2025-06-13-Unity-Performance-Tuning/)**

## 帧的底层原理
从底层角度说： 
> 一帧 = CPU逻辑执行 + 渲染命令提交 + GPU图像输出 + 系统显示刷新

### 一帧在底层的完整生命周期

| 阶段             | 描述                                | 涉及模块                     |
| -------------- | --------------------------------- | ------------------------ |
|  时间触发       | 到了下一帧时间，Unity 开始执行 Update         | 操作系统定时器 / 游戏主循环          |
|  逻辑更新       | 执行脚本逻辑（如移动、AI、物理）                 | CPU，主线程，Mono             |
|  资源准备       | 加载纹理、动画数据、Mesh 等                  | CPU + 内存 + IO            |
|  渲染命令生成     | 调用 Graphics API：DrawMesh、DrawCall | Unity C++ 层、RenderThread |
|  渲染命令提交     | 传给 GPU 渲染管线（如 Vulkan、OpenGL）      | RenderThread → GPU       |
|  GPU 执行渲染管线 | 顶点着色 → 光栅化 → 像素着色 → 输出到帧缓冲        | GPU Pipeline             |
|  vsync 同步   | 等待下一次显示器刷新（如 60Hz）                | SwapChain、VSync          |
|  显示图像       | 当前帧图像输出到屏幕                        | 显示设备、操作系统                |

### 图形API：如何控制帧
Unity底层是通过图形API驱动的，这些API控制：
- 帧缓冲区 FrameBuffer
- 渲染管线
- 命令缓冲区 CommandBuffer
- 交换链 SwapChain

**Vulkan或DX中的一帧**
```c
BeginFrame(); // 开始新的一帧（获取缓冲区）
RecordRenderCommands(); // 录制渲染命令
SubmitToGPU(); // 提交到GPU
PresentFrame(); // 显示渲染结果（同步vsync）
```
Unity在底层封装了这些过程，开发者只看到`Update()`、`LateUpdate()`、`Render()`

### 帧率和显示器刷新率之间的关系

| 显示器刷新率    | 理想帧率        | VSync          |
| --------- | ----------- | -------------- |
| 60Hz 显示器  | 60 FPS      | 每 16.67ms 输出一帧 |
| 120Hz 显示器 | 120 FPS     | 每 8.33ms 输出一帧  |
|  帧生成慢    | 掉帧、卡顿       | GPU 没赶上显示器刷新节奏 |
|  帧生成太快   | 撕裂（Tearing） | 若无 vsync       |

### 一帧中关键的底层数据（引擎角度）

| 结构/模块               | 功能                    |
| ------------------- | --------------------- |
| GameLoop            | 每帧驱动所有系统的核心循环         |
| MonoBehaviourSystem | 驱动 C# 脚本的系统           |
| RenderLoop          | 构建和提交渲染指令             |
| CommandBuffer       | 存储一帧的渲染命令             |
| SwapChain           | 管理图像缓冲与 vsync 交换      |
| GfxDevice           | 抽象的 GPU 设备接口          |
| NativeContainer     | 管理底层数据容器（如 Transform） |

### 每帧中资源怎么流转
- `C# 代码 -> C++ 引擎 -> GfxDevice -> GPU Pipeline -> 帧缓冲 -> 显示器`
- Unity做了大量C# <-> C++ <-> GPU间的数据传输

## Unity的高效框架优化
> 这些操作能在一帧时间内完成，是因为Unity通过了“并行化 + 最小化处理 + GPU卸载 + 帧缓冲机制”等一套高效框架优化，最大程度压缩了每一帧的工作流程

### 为什么一帧能做这么多事

| 原因                  | 说明                        |
| ------------------- | ------------------------- |
|  **并行处理**          | 利用多个线程同时处理物理、动画、渲染准备等     |
|  **GPU 异步渲染**      | 渲染任务交给 GPU，CPU 继续处理逻辑，不等待 |
|  **渲染缓存机制**        | 当前帧 CPU 和上一帧 GPU 同时工作     |
|  **分帧处理**          | 大任务（如寻路、加载）分帧执行，避免卡帧      |
|  **批处理 + 合批**      | 合并多个渲染对象为一次提交，减少 GPU 压力   |
|  **剔除（Culling）优化** | 只渲染玩家能看到的东西               |
|  **时间预算模型**        | 每帧只做预算时间内的任务，多余的等下一帧      |

### 多线程并行架构
Unity实际上一帧涉及多个并行线程

| 线程         | 负责内容                  |
| ---------- | --------------------- |
| 主线程        | 脚本、GameObject 生命周期、逻辑 |
| 渲染线程       | 提交 DrawCall，生成 GPU 命令 |
| Job System | 并发处理物理、动画、AI 等任务      |
| GPU 线程     | 执行渲染（光栅化、着色器等）        |

**多线程图示（简化）**
```scss
帧 #N
主线程：   ─────► Update() ──► PrepareRender ─► Present
渲染线程：           ─────► Submit Commands
GPU 线程：                     ─────► 渲染执行
```
每个线程在同时工作，不是等待某个线程跑完再开始

### 最小化处理
Unity在每一帧中，只处理真正必要、真正可见、真正变化的内容，而不是对所有对象、组件、资源都进行全量遍历和更新  
这是一种性能优化策略，目的是
- 减少CPU和内存的使用
- 减少主线程压力
- 减少渲染压力
- 保证帧率稳定

#### 最小化处理的核心原则

| 原则               | 举例                       |
| ---------------- | ------------------------ |
| 只更新**变化**的对象     | 静止物体不会触发动画或物理            |
| 只渲染**可见**的物体     | 被遮挡或不在视野内的对象被剔除（Culling） |
| 只处理**在场景中激活**的对象 | 非激活 GameObject 不调用生命周期函数 |
| 只计算**必要精度**的数据   | LOD 降级，简化远处模型            |
| 按需执行**系统模块**     | 关闭未使用系统，如 NavMesh、布料、粒子  |

#### Unity常见的“最小化处理”机制
##### 1.剔除（Culling）
Unity会自动或手动剔除无用物体，跳过渲染或逻辑更新

| 类型                | 功能           |
| ----------------- | ------------ |
| Frustum Culling   | 相机视锥外的物体不渲染  |
| Occlusion Culling | 被遮挡的物体不渲染    |
| LOD Group         | 距离远时使用低面数模型  |
| Static Batching   | 静态物体合批减少绘制指令 |

##### 2.非激活物体不处理
```cs
gameObject.SetActive(false);
```
- 不会执行`Update()`
- 不会被物理系统检测
- 不参与渲染
- 节省计算资源

##### 3.脚本生命周期函数的懒执行
Unity不会在每一帧中调用所有函数，只有对应条件满足才会触发  
比如：

| 函数                  | 条件             |
| ------------------- | -------------- |
| `Update()`          | 每帧调用（激活物体）     |
| `FixedUpdate()`     | 只在固定帧率更新（物理开启） |
| `OnBecameVisible()` | 物体刚出现在相机里时     |
| `LateUpdate()`      | Update之后才调     |
| `OnTriggerEnter()`  | 只有碰撞才调         |

##### 4.JobSystem / Burst的细粒度任务调度
- Job System会把数据分片并发处理，并自动分配到空闲进程
- Burst编译器会将运算变成SIMD、无分支命令，极致压缩计算量

目标：尽量避免主线程阻塞和不必要的处理  

##### 5.实例化和资源加载的最小化

| 技术                   | 优化点                           |
| -------------------- | ----------------------------- |
| 对象池（Object Pool）     | 重用对象，避免频繁 Instantiate/Destroy |
| Addressables 异步加载    | 只在用到时加载资源                     |
| 场景流（Scene Streaming） | 只加载玩家附近区域的场景                  |
| 延迟加载（Lazy Init）      | 某些组件在用到时再初始化                  |

### GPU卸载
GPU卸载，是指将计算密集、并行性强的工作从CPU转交给GPU来完成，以释放CPU的压力，从而提升整帧执行效率

### 原因
- GPU并行能力极强：GPU内部拥有成千上万个核心，能同时处理大量数据（如像素、顶点）
- CPU是瓶颈：Unity主线程常因逻辑繁忙，成为帧率瓶颈
- 渲染任务天然适合GPU：像素计算、顶点变换、光照、后处理等可并行处理
- 渲染和逻辑可并行执行

### 哪些任务会被卸载到GPU

| 卸载内容             | 描述                          |
| ---------------- | --------------------------- |
|  顶点变换           | 模型的顶点坐标变换（MVP矩阵）            |
|  光照计算           | 每像素 / 顶点光照、反射、阴影等           |
|  像素着色           | Color blending、贴图、Fog、后期特效等 |
|  后处理            | Bloom、AO、DOF、MotionBlur 等   |
|  GPU Instancing | 一次性绘制成千上万相同模型               |
|  Compute Shader | 通用并行任务，如粒子模拟、布料、体积雾等        |

### Unity如何实现GPU卸载
主线程构建渲染命令 -> 渲染线程提交 -> GPU异步执行
```cs
// Unity C#层伪流程
void Update()
{
    UpdateLogic(); // 脚本逻辑运行（CPU）
    UpdateAnimaion(); // 动画采样（CPU或Job）
    PrepareDrawCalls(); // 构建绘制命令
    // 提交给GPU渲染线程 
}
```
- `PrepareDrawCalls()`把数据交给GPU（通过command buffer）
- GPU异步处理，不阻塞主线程

### GPU着色器

| 类型                             | 用途                    |
| ------------------------------ | --------------------- |
| Vertex Shader                  | 每个顶点执行一次，变换模型到裁剪空间    |
| Fragment (Pixel) Shader        | 每像素执行一次，计算最终颜色        |
| Geometry / Tessellation Shader | 细分曲面或生成额外几何体          |
| Compute Shader                 | 并行通用计算，不限于渲染任务（如粒子模拟） |

**Unity Standard Shader如何借助GPU完成渲染**
当你使用Unity内置Shader，如Standard Shader，它会自动在GPU上执行如下操作：
- 变换每个顶点位置（MVP）
- 对每个像素计算光照、纹理贴图、法线贴图
- 对半透明物体进行混合
- 对反射、环境光遮蔽等做实时计算

>如果这些都在CPU上完成，一帧可能要跑1分钟

**图示：Unity渲染流程（CPU -> GPU）**
```scss
[C# 脚本逻辑 Update()]        ┐
[动画采样/物理运算]          ├─ CPU (主线程)
[构建 DrawCall 命令]         ┘
         ↓
[渲染线程打包命令] ─→ CommandBuffer
         ↓
[GFX Device 发给 GPU]
         ↓
[GPU 执行：Shader ➜ Raster ➜ PostFX]
```

### CPU与GPU的帧缓冲双缓冲机制
Unity会将“本帧CPU逻辑”和上一帧“GPU渲染”并行进行
- 当前帧：CPU构建渲染命令
- 上一帧：GPU正在执行渲染

这样就不会阻塞CPU，也不会GPU空转



