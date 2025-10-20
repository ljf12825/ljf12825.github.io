---
title: "Unity"
date: 2025-06-01
categories: [Note]
tags: [Unity]
author: "ljf12825"
summary: Overview of Unity overall architecture
---
# 引擎整体架构
引擎中有什么，系统如何被设计出来（静态结构），系统模块关系、职责划分、调用层级
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

### [Mono&IL2CPP](/content/blog/Mono&IL2CPP.md)

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

[NativeLayer to ScriptLayer](/content/blog/ScriptLayer2NativeLayer.md)

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

### C#与C++之间的调用成本（Interop Overhead）
这是Unity性能优化的一个“隐形税收点”\
当C#调用C++时会产生上下文切换和封送（marshalling）开销，比如：
- 结构体、字符串、数组再托管与原生之间需要拷贝
- 每次调用都要执行安全检查与栈切换

Unity为此推出了Generated Bindings系统，让IL2CPP能自动生成“零封送”接口，大幅减少了调用开销。这也是Unity越来越接近原生引擎性能的关键

## 平台抽象层（Platform Abstraction Layer, PAL）
决定了跨平台能力和性能底线的部分
### 定位与作用
平台抽象层是Unity C++引擎中介于引擎通用逻辑和具体平台实现之间的中间层\
它的核心使命是：屏蔽操作系统、硬件、API差异，给上层（Unity Player / Scripting Runtime）提供统一接口\
Unity的跨平台本质上就是靠这层在做“同一接口，不同平台不同实现”
- 选择对应平台实现
- 提供统一接口
- 封装所有系统调用

```css 
[C# 脚本层]
     ↓
[Scripting Runtime (Mono/IL2CPP)]
     ↓
[Unity Player (C++ 引擎核心)]
     ↓
[平台抽象层（Platform Abstraction Layer）]
     ↓
[操作系统 / 硬件 / 平台SDK]
```
比如脚本调用`File.Open()`
- C#调用到Player的文件接口
- Player再调用PAL提供的“文件访问API”
- PAL根据平台自动调用`fopen`/`CreateFileW`/`NSFileManager`/`AAssetManager`

### PAL的主要模块
1. 图形抽象层（GfxDevice Layer）
  - 统一封装GPU调用接口
  - 支持多种渲染后端：DirextX/Metal/Vulkan/OpenGL/GNM
  - 负责命令缓冲、资源绑定、渲染目标、Shader编译等
  - Unity中对应类：`GfxDevice`, `GfxContext`, `ShaderLab`, `ShaderCompilerPlatform`

2. 文件系统抽象（FileSystem Layer）
  - 统一文件路径、权限、读写接口
  - 支持打包资源（AssetBundle、StreamingAssets、PersistentDataPath）
  - 对平台路径分隔符、编码、权限进行适配

3. 输入抽象（Input Layer）
  - 提供统一事件模型（鼠标、键盘、触屏、手柄）
  - 新Input System直接基于这层进行事件采集与分发

4. 音频抽象（Audio Layer）
  - 封装各平台音频API（OpenSL、CoreAudio、XAudio2等）
  - 提供统一音频缓冲管理与混音接口

5. 线程与任务系统（Threading & Job System Layer）
  - 封装pthread/Win32 thread / SDK thread
  - 提供跨平台同步原语（mutex、semaphore、atomic等）

6. 网络抽象（Network Layer）
  - 统一socket和网络接口调用
  - 封装HTTP、WebSocket、UDP等

7. 时间与计时系统（Time Layer）
  - 提供跨平台精确时间、帧时间、DeltaTime等

### 平台特化（Platform Specific Layer）
PAL之下，Unity针对每个平台都有特化实现，比如
```swift
Runtime/PlatformDependent/Win/
Runtime/PlatformDependent/Android/
Runtime/PlatformDependent/iOS/
Runtime/PlatformDependent/Linux/
```
这些目录中是
- 文件系统实现（FileWin.cpp, FileAndroid.cpp...）
- 输入接口
- 平台启动代码（Entry Point）
- 特定编译选项、SDK调用

Unity编译时通过宏开关（如`UNITY_ANDROID`, `UNITY_WIN`, `UNITY_IOS`）选择不同文件编译入引擎

### 对游戏开发者的意义
虽然普通开发者看不到PAL，但它影响深远
- 跨平台一致性：同样一份代码，能跑在不同系统上
- 性能优化边界：理解PAL能让你知道为什么不同平台表现差异
- 原生插件开发：写Native Plugin时必须遵循PAL的约定，否则Unity Player无法安全调用
- 自定义渲染管线/底层扩展：需要理解PAL如何连接系统GPU

> Unity的核心结构是一种“三明治模型”：
> C#托管逻辑（上层）<-> C++引擎内核（中层）<-> 系统平台接口（底层）
这种设计的关键价值是可移植性与扩展性。C++层保持跨平台的引擎逻辑一致性，而PAL层“翻译”系统调用。这样Unity能再不同设备上跑同一逻辑，而脚本开发者甚至无需关心平台差异

## 渲染管线（Build-in / URP / HDRP）
渲染管线负责把场景数据（模型、光照、材质、相机）转换成图像像素的整个过程

### 渲染管线本质
渲染管线的本质是一条”数据流“
```text
场景（Scene）-> 摄像机（Camera）-> 可见物体（Renderer）-> Shader -> GPU渲染 -> 屏幕图像
```
它定义了：
- 渲染顺序（先绘制什么、后绘制什么）
- 光照计算方式
- 材质和Shader如何结合
- 后处理（Bloom、ToneMapping、SSR等）
- GPU命令提交与资源管理

Unity之所以能输出不同风格（卡通、写实、移动端轻量、高端HDR），本质就是在更换渲染管线实现

### 三代渲染管线的变化
Unity目前存在三种主流渲染管线

| 管线类型 | 名称 | 特点 | 适用场景 |
| - | - | - | - |
| Build-in Pipeline | 内置管线（传统）| 固定流程，难以自定义 | 老项目、教学、移动端轻量 |
| URP | 通用渲染管线（Universal Render Pipeline）| 可扩展、跨平台优化 | 移动端、Switch、主机中端 |
| HDRP | 高清渲染管线（High Definition Render Pipeline）| 高保真、PBR、物理级光照 | 高端PC、主机、电影级项目 |

### Build-in Pipeline（传统内置管线）
**架构特点：**
- 基于Unity早期固定渲染流程
- 使用Surface Shader + 内置光照模型（Blinn-Phong/Lambert）
- 所有渲染逻辑由Unity内部C++代码控制（不可修改）

**优点：**
- 稳定、成熟
- 上手简单、教程多

**缺点：**
- 可扩展性差（想改就得改ShaderLab内部定义）
- 不支持现代渲染特性（延迟光照、SRP批处理、GPU实例化受限）
- 光照模型不灵活（自定义PBR麻烦）

> Build-in就是“Unity替你写好了渲染管线，你只能在Shader里打补丁”

### URP（Universal Render Pipeline）
URP是Unity为现代设备设计的“可编程渲染管线”，基于Scriptable Render Pipeline（SPR）架构

**架构核心：**
```mathematica
C#层：RenderPipelineAsset / RenderPipeline
C++层：Unity Player 渲染接口
GPU层：Shader（HLSL）
```

**工作机制：**
1. Unity在启动时加载URP的Pipeline Asset
2. C#代码通过RenderPipeline控制每一帧的渲染过程
    - 过滤可见对象
    - 设置RenderTarget
    - 执行渲染Pass
3. URP内部执行优化
    - SRP Batcher（批处理优化）
    - GPU Instancing（实例化）
    - Forward + 渲染（更高效的多光源渲染）
    - Shader Variant剔除

**特点：**
- 完全可以自定义渲染逻辑（C#控制GPU流程）
- 跨平台表现一致（PC/移动/主机）
- 优化比较激进（统一Shader模板、管线级优化）

**适用：**\
移动游戏、中等规格主机、VR、独立游戏

> URP是“为性能和兼容性平衡而生的现代可编程管线”

### HDRP（High Definition Render Pipeline）
HDRP是Unity面向高端平台的高保真管线，核心是物理化渲染（Physically-Based Rendering）

**核心特性：**
- 真实光照模型（Energy-Conserving BRDF）
- 延迟渲染 + Tile/Cluster光照
- 屏幕空间反射（SSR）、全局光照（SSGI）
- 高级体积光（Volumetric Lighting）
- 多级后处理（Tone Mapping、Color Grading、Bloom、DOF）
- 支持DX12、Vulkan、Metal
- 支持光线追踪（Ray Tracing）

**架构上：**
- 同样基于SRP，但实现复杂度更高
- 拥有更强的Material/Lighting体系（Lit、StackLit、Decal等）
- 专为物理精度与高画质定制，不考虑老设备兼容性

> HDRP是“写实画面的终极方案”，但代价是性能和开发复杂度

### Scriptalbe Render Pipeline（SRP）的统一思想
URP和HDRP都基于同一个框架：SRP\
SRP让Unity的渲染管线“从硬编码” -> “脚本可编程”\
可以写出自定义管线

**核心类：**
```cs
RenderPipelineAsset // 管线资源配置
RenderPipeline // 每帧执行逻辑
RenderPass / RenderFeature //扩展模块
```
这意味着：
- 你可以定义Camera如何渲染
- 可以插入自定义Pass（轮廓描边、体积雾、屏幕特效）
- 完全控制渲染顺序和命令

SRP的出现让Unity从“游戏引擎”进化成“渲染框架”

可拔插渲染框架思想（RenderGraph + GPU Driven Rendering）的趋势：
> Unity正在逐渐把SRP向RenderGraph体系演化，用命令图（Command Graph）组织GPU Pass，未来会更接近Unreal的RDG或自研引擎的GPU-driven架构

渲染正在从“指令式”走向“数据驱动 + 并行调度”

## 物理与动画子系统
### 物理子系统（Physics）
物理子系统负责模拟真实世界的力学行为，包括刚体、碰撞、关节、角色控制器等

#### 核心组成
1. 刚体（Rigidbody）
    - 表示一个受力的物体
    - 属性：质量、阻力、重力、速度等
    - 控制方式：
      - 通过物理力（AddForce）驱动
      - 直接修改位置（会跳过物理）
2. 碰撞器（Collider）
    - 定义物体形状，用于检测碰撞
    - 类型：
      - 基本形状：Box, Sphere, Capsule
      - MeshCollider（复杂模型）
3. 物理引擎核心
  - Unity主要使用NVIDIA PhysX（PC、主机）作为底层实现
  - Android/iOS/主机平台上可能有优化或自研替代
  - 负责：
    - 碰撞检测
    - 刚体动力学
    - 关节约束
    - 碰撞回调（OnCollisionEnter, OnTriggerEnter）
4. 场景集成
    - 每帧固定更新（FixedUpdate）物理世界
    - 与渲染循环独立，保证模拟稳定性
    - 支持多进程计算（Job System + Burst优化）

#### 脚本层交互
C#层的`Rigidbody`, `Collider`等都是托管对象，内部绑定对应C++的原生PhysX对象
```cs
Rigidbody rb = GetComponent<Rigidbody>();
rb.AddForce(Vector3.up * 10f);
```
- C#调用 -> IL2CPP/Mono桥接 -> C++ PhysX对象 -> 物理计算 -> 更新Transform
- 最终渲染层拿到Transform更新位置

### 动画子系统（Animation）
动画子系统负责角色、物体的运动表现，包括骨骼动画、Blend、State Machine等

#### 核心模块
1. Animator/Animation组件
    - `Animator`使用Mecanim系统，支持状态机和Blend Tree
    - `Animation`是旧动画系统，主要用于简单动画
2. 骨骼动画（Skinned Mesh）
    - Mesh通过骨骼（Bones）驱动顶点变形
    - 支持GPU skinning加速
3. 状态机（Animator Controller）
    - 控制动画播放逻辑（Idle -> Walk -> Run）
    - 支持条件转换（Triggers, Booleans, Floats）
    - 每帧更新在Update/AnimatorUpdate模式下执行
4. Blend Tree
    - 混合多种动画，实现平滑过渡
    - 用于复杂动作组合，如走跑切换、方向移动
5. IK/动态调整
    - Inverse Kinematics（逆向运动学）
    - 让角色手、脚自然接触地面或环境

#### 脚本曾交互
```cs
Animator anim = GetComponent<Animator>();
anim.SetFloat("Speed", 1.0f);
anim.SetTrigger("Jump");
```
- C# -> IL2CPP/Mono -> C++动画核心
- 动画子系统会计算骨骼矩阵
- 更新Skinned Mesh
- 最终渲染系统拿到最终顶点数据

### 物理与动画的协作
1. Rigidbody与Animator
    - Animator默认不影响物理（“根运动 Root Motion”可选）
    - Root Motion开启时，动画驱动Rigidbody位置
    - Root Motion关闭时，脚本驱动Rigidbody位置，而Animator只负责骨骼动画
2. 碰撞与动画
    - 动画过程中可以触发碰撞事件
    - 游戏逻辑可以根据碰撞/触发器调整动画状态

### 总结
- 物理子系统 = “模拟真实世界的力学”
- 动画子系统 = “控制物体或角色运动表现”
- 它们都属于C++原生引擎模块，C#层只是包装和控制接口
- 脚本层与这两者的交互都依赖Scripting Runtime桥接

## Editor扩展层
这是Unity架构中连接用户编辑操作和底层引擎的部分\
它不影响游戏运行时逻辑，但对于提高生产效率、开发工具、定制工作流至关重要

### 定位与作用
- 位置：位于Unity Player + Scripting Runtime之上，是C#层的Editor专用模块
- 核心作用：
  - 提供可视化编辑界面（Inspecor、Hierarchy、Scene视图）
  - 扩展Unity编辑器功能（自定义工具、窗口、菜单）
  - 与底层C++引擎交互，实现资源操作、场景管理、渲染预览

> Editor扩展层 = “Unity的可编程工作台”，开发者可以改造编辑器来提升效率或定制工作流

### 核心模块
1. Editor Window/Editor GUI
    - 自定义窗口、面板、工具栏
    - 基于IMGUI或UIElements绘制界面
    - 可以访问Unity对象（GameObject、ScriptableObject、Asset）
2. Inspector / Property Drawer
    - Inspector窗口显示对象属性
    - PropertyDrawer允许自定义组件属性的显示和编辑方式
3. Editor Utility
    - 文件操作、资源管理、序列化、日志、调试工具
    - ScriptableWizard、MenuItem、EditorCoroutine
4. Scene View/Gizmos
    - 直接在Scene视图绘制辅助信息
    - 自定义Gizmos显示逻辑，如碰撞体、路径、AI节点
5. Custom Asset Pipeline
    - 自定义资源导入器（ScriptedInporter）
    - 自动处理特定资源格式、生成AssetBundle、Addressable资源
6. Play Mode Simulation
    - 编辑器模式下模拟运行
    - PlayMode下的资源加载、脚本执行、物理和动画系统都调用底层Player

### 脚本层交互
Editor扩展层完全在C#托管环境，与游戏运行层使用不同运行上下文：
- 游戏运行时（Play Mode）：调用Player + Runtime
- 编辑器模式（Edit Mode）：调用Editor扩展层

它们都通过Scripting Runtime桥接C++引擎，但编辑器扩展有额外API层用于编辑器操作

```cs
using UnityEditor;
using UnityEngine;

public class MyWindow : EditorWindow
{
  [MenuItem("Tools/My Window")]
  static void ShowWindow() => GetWindow<MyWindow>("My Window");

  void OnGUI()
  {
    if (GUILayout.Button("Create Cube"))
    {
      GameObject cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
      Undo.RegisterCreateObjectUndo(cube, "Create Cube");
    }
  }
}
```
- 自定义窗口 -> 显示按钮 -> 调用Player API创建Cube
- Undoo系统也通过Editor层统一管理

### Editor扩展与工具链
- 打通C#编辑器脚本的底层C++引擎
- 支持自定义工作流，例如：
  - 自动生成场景/预制件
  - 自定义Inspector显示复杂数据
  - 编辑器内资源管理和打包
  - 可视化调试AI、物理或动画

### 总结
- Editor扩展本质上是C#层的编辑器专用API集合
- 它依赖Player + Scripting Runtime提供底层功能
- 不影响最终游戏运行时逻辑，但大幅提高开发效率
- 对于游戏开发者来说：
  - 初级阶段：只会用现有窗口、Inspector、菜单即可
  - 进阶阶段：可以自定义工具、窗口、资源处理逻辑
  - 高级阶段：可以写全套编辑器插件或Pipeline工具

> Editor扩展层是“可编程编辑器 + 工具接口”，是Unity生产力和自动化的核心

# 运行时结构
运行时结构指的是————程序在运行过程中各个模块之间的组织方式、生命周期、以及数据和控制流的关系\
它回答了三个问题：
- 程序运行时，系统里“有哪些东西”
- 这些东西是“怎么互相作用”的
- 整个系统是“怎么从启动到退出”保持运作的（动态行为）

Unity在游戏启动后会维持一个完整的“虚拟世界”的组织体系\
当游戏从可执行文件启动时，Unity会依次初始化引擎模块、加载场景、实例化对象、执行脚本、维护帧循环，再到最终退出。

## GameObject & Component系统
Unity的运行时世界由GameObject和Component构成
- GameObject：场景中的“实体”，仅仅是容器，不包含逻辑
- Component：组件，决定物体的行为和外观。Transform、Renderer、Collider、Script都是组件

在C++层，每个GameObject对应一个`GameObject`结构体实例，内部维护组件列表（C#层表现为`GetComponent`、`AddComponent`接口）\
脚本层的组件（MonoBehaviour）只是托管包装，实际行为逻辑通过绑定机制连接C++对象
> Unity世界 = 对象树（Transform Hierarchy）+ 组件系统（Behavior Modules）

## Scene & Asset管理
场景（Scene）是对象的集合
- 当运行时加载场景时，Unity会
    1. 解析序列化文件（.unity/.scene）
    2. 实例化GameObject与Component
    3. 加载依赖的Asset（纹理、Mesh、材质、音频等）
    4. 建立引用关系（GUID到对象映射）

资源加载有三种主要路径：
- 内嵌资源（Build-in Asset）：打包时直接编入
- AssetBundle/Addressable：运行时按需加载
- Resources.Load()：动态从Resources文件夹中读入

> Scene系统本质是“对象状态的快照”，运行时通过反序列化重建整个世界

## 生命周期管理
Unity的运行时生命周期可以分为三个层面：\
**引擎启动层面**\
`RuntimeInitialize` -> 初始化Player -> 初始化模块（渲染、物理、音频、输入等） -> 加载第一个场景

**对象层面**\
每个MonoBehaviour实例会经历：\
`Awake()` -> `OnEnable()` -> `Start()` -> `Update()`/`FixedUpdate()`/`LateUpdate()` -> `OnDisable()` -> `OnDestroy()` \
C++对象（Transform、Renderer等）在销毁时会触发托管对象解绑（GCHandle释放）

**帧循环层面**\
每一帧：
1. 处理输入（InputSystem）
2. 执行物理更新（FixedUpdate）
3. 调用脚本逻辑（Update/LateUpdate）
4. 执行动画系统
5. 渲染提交（Camera.Render）
6. 提交GPU命令 -> 显示输出

> 生命周期系统维持了Unity世界的“持续运作”，是时间与逻辑的主线

## 脚本绑定与执行机制
Unity脚本运行在托管层（Mono/IL2CPP），核心机制是托管对象 <-> 原生对象绑定（Binding）

运行时流程：
1. C#编译为IL字节码
2. Mono或IL2CPP执行
3. 脚本调用C# API，如`transform.position`
4. 通过绑定接口（InternalCall或Generated Bindings）访问C++对象
5. 修改底层引擎数据

`Transform`、`Rigidbody`、`Renderer`等对象其实是C#包装 + C++实体\
脚本层操作的是“代理”，数据变更最终反映在C++引擎核心中
> 脚本驱动引擎，而引擎执行结果再反馈回脚本世界

## 内存模型与GC管理
Unity的运行时有双层内存体系

| 层级 | 语言 | 管理方式 | 内容 |
| 托管层 | C#(Mono/IL2CPP) | GC | 脚本对象、数据逻辑 |
| 原生层 | C++(Unity Player) | 手动分配/释放 | 渲染资源、物理数据、引擎核心 |

C#层对象通过`GCHandle`或`NativeArray`等结构与原生内存交互\
GC采用增量式GC（Incremental GC），分帧执行，降低卡顿

高性能开发要点：
- 避免频繁分配（尤其在Update中）
- 使用对象池（Object Pool）
- 利用`struct`与`NativeController`（如Burst + JobSystem）绕过GC压力
> GC是Unity运行时世界的“代谢系统”，要控制频率、减少毒素

## 系统协作与调度（System Collaboration & Scheduling）
系统协作与调度决定了每个子系统何时启动、如何交互、谁先谁后、怎样同步

### 核心理念：PlayerLoop驱动的分层世界
Unity运行时的根本调度机制就是一个多层嵌套的循环体系：PlayerLoop\
它是整个运行时的“心跳”

```scss
while (ApplicationRunning)
{
    EarlyUpdate();   // 输入、时间、任务调度
    FixedUpdate();   // 物理系统（定时器驱动）
    Update();        // 脚本与AI逻辑
    LateUpdate();    // 动画、摄像机、后处理
    RenderFrame();   // 渲染提交与同步
}
```
这是真实存在于Unity C++层的PlayerLoopSystem结构
```cs
PlayerLoopSystem
{
  type;
  subSystemList[];
  updateDelegate;
}
```
每一帧中，Unity会遍历这些系统树，依序调用每个系统注册的更新函数\
这样，不同模块可以通过注册`PlayerLoopSystem`来参与调度，而不需要硬编码耦合\
这就是Unity架构的关键哲学：可重组的帧调度系统

# 数据流动
Unity的本质是“数据驱动的引擎”，数据流贯穿编辑器与运行时

# 设计哲学与扩展性
Unity的设计哲学是“抽象一切复杂性，暴露最小接口”\

# 总结
Unity的Runtime世界，本质是一个“以GameObject为节点、以Component为行为单元、以Scene为组织载体”的实体系统。\
这其实与现代ECS（Entity-Component-System）框架思想一脉相承，只是Unity传统架构的耦合度更高。Unity DOTS就是在重构这个部分，让引擎从对象导向进化到数据导向