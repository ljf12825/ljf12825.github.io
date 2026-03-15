---
title: "Unity"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Overview]
author: "ljf12825"
type: log
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

### [Mono&IL2CPP](/content/log/Mono&IL2CPP.md)

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

[NativeLayer to ScriptLayer](/content/log/ScriptLayer2NativeLayer.md)

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

#### 脚本层交互
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

### [时间维度的分层协作(MonoBehaviour生命周期)](/home/ljf12825linux/ljf12825.github.io/content/log/MonoBehaviour.md)

### 系统之间的协作链
以一次典型帧为例，系统之间的数据与依赖链如下
```scss 
InputSystem
  ↓
ScriptSystem (MonoBehaviour.Update)
  ↓
PhysicsSystem (FixedUpdate)
  ↓
AnimationSystem
  ↓
TransformSystem (同步位置)
  ↓
CameraSystem (确定视角矩阵)
  ↓
RenderSystem (生成渲染命令)
  ↓
GPU (执行渲染)
```
这条链并非严格线性，而是通过 **任务系统（Job System）和依赖图（Dependency Graph）**并行调度；例如：动画计算，粒子模拟，骨骼蒙皮都可以异步执行，只要它们不依赖同一份数据

### 数据同步与Job调度
Unity的Job System是运行时的多线程调度核心\
它的工作原理大致是：
- 每个系统提交若干条任务（Job）
- Job之间通过依赖关系（Dependency）控制执行顺序
- 调度器动态分配任务到多个线程执行
- 最后在主线程同步结果（Sync Point）

```nginx 
TransformJob
 ├─依赖-> AnimationJob
 └─依赖-> PhysicsJob
 ```
 这意味着：在执行`TransformSystem`之前，动画与物理系统必须先完成它们的计算。这种模型的优势是高并行性和低耦合，但也要求架构层具备明确的数据所有权与生命周期管理

### 渲染与主循环的协同
渲染系统是调度中的特殊角色\
Unity在渲染时会：
1. 收集场景数据（Cilling）
2. 生成Draw Call队列（CommandBuffer）
3. 提交给渲染线程（Graphics Jobs）
4. GPU异步执行（Command Buffer）

这部分采用“双缓冲帧同步”
```text 
CPU: Frame N+1 在准备中
GPU: Frame N 在渲染中
```
这种机制确保GPU和CPU并行工作，不互相阻塞\
Unity通过Fence同步点控制帧节奏，使物理、脚本、渲染三者稳定配合

### PlayerLoop的可扩展性
开发者可以通过`PlayerLoop.SetPlayerLoop()`修改Unity的帧调度表\
例如插入自定义系统
```cs 
var loop = playerLoop.GetCurrentPlayerLoop();
InsertSystemAfter(ref loop, typeof(UnityEngine.PlayerLoop.Update), typeof(MyCustomSystem));
PlayerLoop.SetPlayerLoop(loop);
```
这意味着：Unity的调度系统是开放的\
这也是DOTS、Entity Component System、以及SRP（Scriptable Render Pipeline）能独立运作的根本原因

# 数据流动
数据流动是Unity引擎中的核心机制，Unity的本质是“数据驱动的引擎”，数据流贯穿编辑器与运行时\
在Unity中，数据流动是指游戏或应用在运行时，从输入到输出的数据如何在不同系统和模块之间传递。每一帧的数据流动涉及了多个层级，从外部输入、逻辑计算，到最终的渲染输出

## 输入到处理
### 1. 输入数据流
首先，游戏的输入来源通常包括键盘、鼠标、触摸屏、手柄等设备。输入系统是最早处理数据的系统

**数据流动：**
- 用户输入：例如玩家按下了一个按键或移动了鼠标
- 输入系统：Unity中的`InputSystem`会处理这些事件，封装成可用的输入数据
  - 新的`Input System`通常会以事件驱动的方式处理输入（例如键盘事件、鼠标点击、触摸滑动等），而旧的`Input`系统则是轮询输入状态
  - 这时的输入数据通常是基于设备状态（如是否按下、按下的时长、触摸的坐标等）

```cs 
// 示例：新Input System获取按键输入
if (Keyboard.current.spaceKey.isPressed)
{
  // 做相应处理
}
```

### 2. 脚本逻辑处理
在接收到输入数据后，游戏的脚本逻辑（通常是C#脚本中的`Update()`函数）会对这些输入做出反应，并根据输入更新游戏的状态

**数据流动：**
- 输入系统将输入数据传递到脚本
- 脚本根据输入修改GameObject的属性、动画状态、物理状态等
  - 例如，当玩家按下键盘的某个键时，`Update()`函数会更新玩家角色的位置，改变它的速度或状态
```cs 
void Update()
{
  if (Keyboard.current.spaceKey.wasPressedThisFrame)
  {
      // 执行跳跃
      character.Jump();
  }
}
```

## 从脚本到物理引擎
### 1. 数据流：脚本 -> 物理系统
物理系统通常由刚体（Rigidbody）、碰撞器（Collider）等组成，这些对象会根据物理规则（如重力、力的作用等）更新其状态。Unity的物理系统在固定时间间隔内运行，以`FixedUpdate()`为周期执行，这与普通的`Update()`不同，`FixedUpdate()`的执行周期是固定的，而`Update()`是根据帧率变化的

**数据流动：**
- 脚本修改：脚本逻辑通常会通过操作物体的刚体（如`Rigidbody.AddForce()`），或者通过直接修改Transform的位置和旋转来影响物理系统
  - 例如，玩家输入方向键时，角色的速度会更新，然后物理引擎就会基于这些速度值来计算角色的运动
- 物理计算：物理系统接收到这些修改后，会在每一帧进行物理模拟，更新物体的位置、速度、角速度、加速度等物理状态

```cs 
void FixedUpdate()
{
  // 根据输入给刚体施加一个力
  if (Keyboard.current.wKey.isPressed)
    rigidbody.AddForce(Vector3.forward * moveSpeed)
}
```

### 2. 物理系统的输出
物理系统会基于这些输入，计算出每个物体的新状态，并将结果传递回到脚本层。脚本可以进一步读取这些物理计算的结果并进行决策

**数据流动：**
- 物理系统更新位置、速度后，通过`Rigidbody`对象将这些物理状态暴露给脚本
- 脚本根据这些更新的状态来判断下一步逻辑，或者用来驱动其他系统（如动画、声音等）

## 从物理到渲染：渲染数据流动
### 数据流：物理与渲染
物理系统计算完成后，需要把物体的位置、旋转、缩放等变换传递给渲染系统，以便在屏幕上正确显示

**数据流动：**
- Transform组件：物理系统通过更新物体的`Transform`（如`Transform.position`和`Transform.rotation`）来传递世界坐标给渲染系统
- 渲染准备：渲染系统会在每一帧根据场景的`Transform`更新物体的显示位置。摄像机、光源等也会在此阶段计算，并将最终结果输出到屏幕

### 渲染过程
- Culling：场景中的物体会被摄像机剔除（即决定那些物体在当前视野中是可见的）。
- 图形管线：根据物体的材质、光照、Shader等，图形管线会生成最终的图像。所有的数据（如模型、纹理、光照、Shader、变换矩阵等）都会被传递给GPU,GPU通过渲染管线生成屏幕图像

## 异步任务与Job系统
在Unity中，许多繁重的计算任务（如物理模拟、路径计算、光照计算等）会通过Job System来异步执行。数据流动不仅限于主线程，很多计算任务会被分配到后台线程去执行，计算的结果会在主线程进行合并

### Job System的数据流动
- 主线程分配任务：脚本或引擎核心根据需要创建和调度任务，这些任务会分配给Job系统执行
- 数据传递与同步：任务执行的数据通常以JobHandle或NativeArray的形式传递。这些任务执行时会对共享数据进行读写操作
- 结果回馈：异步任务完成后，主线程会通过同步机制获取计算结果，更新游戏状态或渲染输出

```cs 
// 使用Job系统计算物理位置
NativeArray<Vector3> positions = new NativeArray<Vector3>(numObjects, Allocator.TempJob);
MyJob job = new MyJob 
{
  positions = positions
};
JobHandle handle = job.Schedule();
handle.Complete(); // 等待任务完成
```

### 数据流动的优化：GC与内存管理
Unity的内存管理和数据流动中的GC管理对于性能优化至关重要。游戏中创建和销毁大量对象会导致频繁的GC暂停，影响帧率
- 托管内存：Unity使用C#的内存管理机制，这意味着Unity对象（如`GameObject`, `Component`等）由垃圾回收器（GC）进行管理
- 原生内存：对于高性能计算，Unity使用原生内存（C++层）来存储与物理、渲染等系统相关的原始数据

通过NativeArray, Job System和Burst Compiler等工具，Unity使得原生内存管理更加高效，从而减少GC暂停，提高性能

> 开发者通过掌握数据流的路径和优化点，可以在游戏开发中提升性能、增强稳定性、以及打造更加高效的游戏系统

# 设计哲学与扩展性
Unity作为一个游戏引擎，其设计哲学是追求灵活性、可扩展性和跨平台兼容性。它通过简化复杂性、提供清晰的API接口，以及在多种平台上提供一致的体验，使开发者能够专注于创造内容，而不是底层实现

## 抽象与暴露最小接口
Unity的设计哲学的核心之一就是抽象复杂性，同时暴露最小的接口给开发者。这一哲学体现在以下方面
### 1. 高层次抽象
- 对象与组件模型：Unity的核心是其组件化架构，通过将不同功能（如渲染、物理、输入、动画等）拆分为不同的组件（Component），让开发者能够自由组合这些组件来构建对象（GameObject）。这种设计使得Unity既简化了开发过程，也保持了灵活性
- GameObject/Component模型：GameObject作为一个容器，没有业务逻辑，它依赖于附加的组件来提供行为。组件化架构让开发者可以根据需要为一个GameObject添加多个组件，这种设计简化了游戏开发中的许多常见问题

### 2. 最小接口
- Unity力求暴露最小接口，即只暴露开发者常用的功能，避免了复杂且不常用的API。它通过提供清晰的API和默认实现，减轻了开发者的负担，同时还提供了丰富的自定义能力，以满足开发者的多样化需求
例如：
- 输入系统（Input）：它隐藏了不同设备的差异，只暴露了一个统一的接口，开发者通过简单的API即可获得键盘、鼠标、触摸屏等设备的输入数据

### 3. 跨平台支持
Unity的另一个重要设计哲学是跨平台。开发者只需要编写一次代码，Unity就会自动处理跨平台的兼容问题，减少平台特有的差异。无论是PC、移动端、Web,还是VR/AR设备，Unity都提供了平台抽象层（PAL），让游戏的核心逻辑保持一致，开发者只需关注游戏的业务逻辑，而无需关心具体平台的底层细节

## 模块化与解耦
Unity的设计不仅追求易用性，同时注重模块化和解耦。这使得Unity在扩展性方面表现得尤为强大，尤其是对于大型项目的开发
### 1. 模块化架构
Unity引擎通过多个独立的子系统（渲染、物理、输入、音频、资源管理等）来实现功能的分离。这些模块化的设计允许开发者可以有选择地使用某些子系统，同时还能够在不同的模块之间进行定制化扩展\

### 2. 解耦的系统架构
游戏的物理系统、动画系统、输入系统等都能独立运行，并且可以彼此解耦，每个系统都负责自身的逻辑，可以独立开发和优化

## 数据驱动与可扩展性
Unity的数据驱动设计和可扩展性让它能够轻松应对多样化的开发需求，同时支持丰富的第三方插件和系统的集成

### 数据驱动设计
- Unity引擎的核心架构是数据驱动的。引擎核心本身将数据与功能分离，将游戏中的所有内容（例如，场景、物体、动画、资源）作为数据处理，而将这些数据呈现出来的逻辑通过脚本、组件和行为来实现。这种设计使得开发者能够灵活地操作数据和资源，从而实现各种功能
- ECS架构的引入进一步推动来数据驱动的方式，特别是在高性能场景中，ECS通过把游戏数据组织成结构体（如`Entity`, `Component`)来提升数据存取的效率

### 灵活的插件扩展机制
- Unity的可扩展性体现在它的插件系统和自定义工具上。开发者可以利用Unity的Editor API,扩展Unity编辑器功能，创建自定义工作流、工具和资源管理

### Asset Pipeline与扩展性
- Unity的资源管线（Asset Pipeline）可以非常方便地扩展。例如，开发者可以创建自定义的资源导入器（`ScriptedImporter`）来处理特定类型的资源格式，或者在资源加载过程中添加自己的处理逻辑（如数据压缩、纹理优化等）

## 简化开发过程与自定义
Unity的设计哲学强调开发者体验，力求简化游戏开发过程，同时允许开发者在需要时进行自定义和深度修改

### 可视化编辑与脚本编程
- Unity支持可视化编辑，开发者可以通过拖拽、点击等方式直观地设计游戏中的对象、场景、动画等。大多数任务都可以通过图形化界面完成，这使得没有编程背景的开发者也能参与到游戏开发中
- 脚本编程：同时，Unity也提供了完整的编程支持，允许开发者在C#脚本中实现更复杂的逻辑。C#脚本与Unity编辑器紧密结合，开发者可以直接在代码中访问Unity的API进行深度自定义

### 扩展与自定义的自由度
Unity提供大量的扩展点，开发者可以根据需求自定义引擎的各个部分，例如渲染、物理、输入、GUI系统的行为。它的开源性质（如SRP）使得开发者可以灵活定制和优化性能，满足特定的项目需求

### 代码生成与反射
Unity通过提供反射（Reflection）功能和代码生成，使得开发者可以动态地调整程序行为。例如，使用`[SerializeField]`等特性，开发者可以让私有字段在编辑器中可见，便于调整游戏数据，进一步增强了Unity的可定制性
