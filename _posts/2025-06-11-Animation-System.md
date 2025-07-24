---
title: "Animation System"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
permalink: /posts/2025-06-11-Animation-System/
---
Unity现存两套动画系统，较早的是Legacy Animation，现代的是Mecanim；它们的设计理念、功能和灵活性由很大的不同

## Legacy Animation（传统动画系统）
Legacy Animation是Unity最初的动画系统，主要用于较为简单的动画控制，依赖于直接在物体上设置Animation Clips和控制这些片段的播放

### 核心特性
- 基本动画控制：传统的Legacy Animation主要通过Animation Component来控制动画。直接把也给Animation Clip分配到`Animation`组件上，然后通过脚本控制动画的播放（`Play()`）或停止（`Stop()`）
- 关键帧动画：它依赖于关键帧（Keyframe），逐帧设置物体的状态变化，如位置、选择、缩放等。这个系统比较适合控制小范围、简单的动画（比如对象的旋转、位移）
- 动画重叠和层次控制较弱：Legacy Animation没有多层次控制的功能，所以不同动画之间的重叠（例如角色走路和挥剑）难以高效地管理

### 使用方式
- 直接绑定：将动画片段直接附加到`Animation`组件上，通常是按顺序播放
- 脚本控制：通过脚本控制动画的播放，例如：
```cs
Animation anim = GetComponent<Animation>();
anim.Play("Run");
```
局限性：
- 不支持复杂的状态机：Legacy系统不支持复杂的动画状态机和动画切换。虽然可以控制动画的播放顺序，但没有明确的状态机来管理多个动画状态之间的切换
- 缺乏灵活性：对于需要多层次动画混合、状态管理或者需要处理复杂过渡的游戏项目，Legacy Animation显得过于简单，不能满足这些需求

适用场景：
- 适合简单的、无复杂逻辑的动画。比如：
  - 小物件的动画（例如按钮点击时的缩放动画）
  - 简单的角色动画（例如走路、跳跃）
  - 短小的过渡动画

## Mecanim（现代动画系统）
Mecanim 是 Unity 后期引入的动画系统，极大地增强了动画的控制和灵活性。它提供了丰富的功能，特别是 动画状态机 和 层（Layer），适合处理复杂的动画逻辑，特别是对角色动画和多动画重叠有较高要求的项目

### 核心特性
- 动画状态机（Animator Controller）：Mecanim 引入了 Animator Controller，它是一个图形化的界面，允许开发者通过状态机（State Machine）管理多个动画片段之间的过渡。状态机允许动画状态之间按条件平滑过渡，支持更复杂的动画逻辑。
- 参数控制：Mecanim 引入了 Animator Parameters，允许开发者通过布尔值、触发器、浮动值等控制动画过渡。
- Blend Trees（混合树）：Blend Trees 允许根据输入（如速度、方向等）平滑地过渡多个动画片段，这对于角色的移动（如从走路过渡到跑步）非常有用。
- 动画层（Animation Layers）：通过动画层，Mecanim 可以分离不同部分的动画。例如，角色的上半身（攻击、射击）可以在一个层中控制，而下半身（行走、奔跑）可以在另一个层中独立控制。这样可以避免动画冲突。
- Root Motion（根运动）：Mecanim 支持根运动，它允许角色的动画影响其物理运动（例如通过步伐动画推动角色的位移）。

### 使用方式
- Animator Controller：通过创建 Animator Controller，并在其中定义动画状态机、过渡和参数，来控制动画的播放逻辑。
- 脚本控制：通过 Animator 组件来设置参数并控制动画

优势：
- 动画管理更强大：Mecanim 通过状态机、混合树、参数等功能，使得动画的管理更加灵活，能够适应复杂的角色动画需求。
- 多动画层控制：支持多层动画，可以让不同部分的动画互不干扰。例如角色可以在走路时同时进行上半身攻击动作。
- 更高的动画控制精度：通过参数控制，可以更精细地调控动画过渡，创建更自然、流畅的动画效果。

适用场景：
- 角色动画：Mecanim 非常适合角色动画，尤其是当需要复杂的状态机、多个动画层和过渡效果时。例如：
  - 角色的行走、跑步、跳跃、攻击等多个动画状态。
  - 复杂的角色控制系统，如动画驱动的移动系统（走路时，跑步时，跳跃时等）。
- 大规模游戏项目：当游戏中涉及大量动画且需要高效、灵活的管理时，Mecanim 是理想的选择。
- UI 动画和其他动态元素：除了角色动画，Mecanim 还可以用来做 UI 动画，如按钮的点击、面板的出现与消失等。

## Mecanim vs Legacy Animation

| 特性/功能       | **Mecanim**            | **Legacy Animation** |
| ----------- | ---------------------- | -------------------- |
| **动画控制**    | 状态机、参数、混合树、层，支持复杂控制    | 基于动画片段和过渡的简单控制       |
| **层级控制**    | 支持多个动画层，独立控制不同部分动画     | 不支持层级控制，所有动画共享同一个状态  |
| **过渡条件**    | 支持复杂过渡条件（例如布尔值、触发器、浮动） | 只能通过简单的播放控制          |
| **混合控制**    | 支持 Blend Tree 平滑过渡     | 不支持混合过渡              |
| **根运动**     | 支持根运动，动画驱动物理位移         | 不支持根运动               |
| **灵活性与扩展性** | 高，适合复杂动画和大规模项目         | 较低，适合简单动画            |
| **适用场景**    | 复杂的角色动画、游戏中的多个动画状态和过渡  | 简单的动画控制，适用于小项目或小物件动画 |


## Animator Controller
Animator Controller 是 Unity 中用来管理和控制动画状态机的核心工具，它将动画片段、状态、过渡、参数等整合起来，从而实现复杂的动画控制逻辑。简而言之，Animator Controller 是管理游戏对象动画的指挥官，它控制着对象在游戏运行时如何在不同的动画状态之间切换

### 构成
Animator Controller主要由以下几部分构成：
1. 动画状态（Animation States）
  - 每个动画片段都会创建一个 动画状态。每个状态都对应一个具体的动画片段（Animation Clip），比如角色的走路、跑步、跳跃等动画
  - 状态是连接动画的基础。通常一个动画控制器会有多个状态，表示游戏对象可能的动画行为
  - 在Animator Window中，可以直接看到这些状态，它们通常以节点的形式呈现

2. 过渡（Transitions）
  - Transition是连接两个状态的路径，描述从一个状态到另一个状态的切换方式
  - 在Animator Controller中，你可以手动为不同的动画定义过渡条件，例如：
    - 从跑步状态转到走路状态
    - 从攻击动画过渡到空闲状态
  - 过渡可以有Exit Time（退出时间），表示动画结束时才会触发过渡，也可以设置条件（Condition），例如通过设置bool、float等触发过渡

3. 参数（Parameters）
  - Animator Parameters是用来控制状态机中转换的条件。可以通过参数来影响过渡和动画播放
  - 常见的参数类型：
    - Trigger：一个瞬时的条件，通常用于启动某个动画（例如攻击、跳跃）。触发后自动重置
    - Bool：布尔值，通常用来控制某个状态的开启或关闭（例如是否在奔跑）
    - Int：整数值，通常用于选择不同的动画（例如四种攻击类型）
    - Float：浮动值，通常用来表示一些连续的变化（例如角色的移动速度）

4. 状态机（State Machine）
  - Animator Controller使用状态机来管理状态之间的转换。每个状态机都有一个默认的状态（通常是空闲状态）
  - 你可以将多个状态划分到不同的层（Layer）中，层的优先级和混合规则可以灵活控制多个动画的同时播放

5. 混合树（Blend Tree）
  - Blend Tree是一种特殊的动画状态，允许你根据一个或多个输入参数平滑地过渡不同的动画片段
  - 例如，可以用一个浮点值（如速度）来控制角色从走路动画到跑步动画的过渡，或者用两个参数（例如水平和垂直输入）来控制角色的运动方向
  - 通过Blend Tree，你可以创建非常流畅的动画过渡，减少不同动画之间的突兀切换

6. 层（Layer）
  - Animator Controller支持层（Layer）功能，可以为不同的动画行为定义独立的动画层
  - 例如，角色的上半身动画和下半身动画可以在不同的层上分别控制：下半身控制走路或跑步，上半身控制开枪或挥剑。这样可以让不同动画互不干扰
  - 每个层可以由自己的状态机和过渡，并且可以设置不同的权重（Weight）来控制其影响力

7. 虚拟角色模型（Avatar）
  - Avatar是Unity中用于绑定角色动画的虚拟模型，它定义了角色骨骼的结构
  - Animator Controller与Avatar紧密结合，用来确保动画能够正确驱动角色的骨骼系统。Avatar允许你将动画与不同的角色模型进行复用

### 工作原理
Animator Controller 的工作流程可以通过以下几个步骤来理解：
1. 创建动画状态：首先，在 Animator Controller 中为每个动画创建状态。比如，走路动画、跳跃动画、攻击动画等。
2. 定义过渡条件：在状态之间定义过渡（Transition），并设置过渡的条件。例如，设置触发器（Trigger）来切换到攻击状态，或者设置布尔值来控制角色是否奔跑。
3. 使用参数：参数是触发动画状态的关键。通过参数，你可以控制状态机中的状态切换逻辑。例如，使用浮动值控制角色的速度，以决定是播放跑步动画还是走路动画。
4. 播放动画：当游戏运行时，Animator Controller 根据当前的动画状态和参数的变化来自动播放动画。例如，当角色的速度大于某个值时，播放跑步动画；当角色按下攻击键时，播放攻击动画。
5. 控制层和权重：你可以使用多个动画层来分别控制不同部分的动画，例如上半身和下半身。层的权重可以决定每个层对最终动画的影响程度。

### 动画状态机图（Animator Window）
在 Animator Window 中，你可以直观地查看和编辑 Animator Controller 的结构。图中包含了动画状态、过渡、参数等元素。你可以通过拖拽、添加状态、设置过渡条件等方式来设计你的动画逻辑

### 动态控制
在运行时，可以通过代码控制Animator Controller
```cs
// 获取Animator组件
Animator animator = GetComponent<Animator>();

// 设置bool
animator.SetBool("isRunning", true);

// 设置trigger
animator.SetTrigger("Attack");

// 设置float
animator.SetFloat("Speed", 5.0f);
```
### API
`Animator` inherits from `Behaviour`

[Unity Scripting Animator](https://docs.unity3d.com/ScriptReference/Animator.html)

## Animation Clips
在 Unity 中，Animation Clips 是用于存储和播放动画的关键资源。它们包含了物体在一段时间内的各种 动画数据，如 位置、旋转、缩放 以及其他的动画属性（例如材质、颜色、透明度等）。`Animation Clip` 充当了动画的核心文件，控制物体的运动和变化。

### 概述
- Animation Clip本质上是一组关键帧（Keyframe）的集合，它定义了物体在某一时间点的状态，并通过这些关键帧进行平滑的过渡
- 它可以定义不同类型的动画，例如角色动画、物体的平移动画、UI动画等
- 动画片段（Clip）可以用Mecanim系统（通过Animator Controller）来播放，也可以用Legacy Animation系统来播放

### 创建与使用
**创建Animation Clip**

![AnimationClipPanel](/assets/images/AnimationClipPanel.jpg)

- 通过Animator Controller（Mecanim）：
  1. 在Project视图中右键点击，选择`Create > Animation > Animation Clip`
  2. 为新创建的Animation Clip取名
  3. 然后可以通过Animator Controller来管理动画片段
- 通过Timeline或Animation窗口（Mecanim）
  1. 在Unity编辑器种选择一个物体
  2. 打开Animation窗口，点击Create按钮来创建一个新的Animation Clip
  3. 选择物体的动画属性（例如位置、旋转等），然后添加关键帧，定义动画
- 通过Legacy Animation系统
  1. 为物体添加一个Animation 组件
  2. 在Animation组件中直接拖放或选择现有的Animation Clip

**编辑Animation Clip**
通过Animation窗口，可以编辑一个Animation Clip：
1. 选择物体：选择你想要的动画化的物体
2. 打开Animation窗口：点击Window > Animation > Animation 打开 Animation窗口
3. 录制关键帧：点击录制按钮（Red Record）开始录制动画，设置物体的不同状态（位置、旋转、缩放等），Unity会自动为这些状态添加关键帧
4. 手动添加关键帧：在Timeline中点击任意时间点插入关键帧（可以手动修改每个属性的值）

### Animation Clip与关键帧
一个Animation Clip的本质就是一系列关键帧的时间序列。这些关键帧代表某个时间点物体的状态

**关键帧（Keyframe）**
- 时间轴（Timeline）：关键帧被分配到时间轴上，每个关键帧代表某个时间点物体的状态
- 属性：可以给多个属性（位置、旋转、缩放、材质颜色、音效等）添加关键帧，这样就可以动画化这些属性
- 插值：关键帧之间的动画过渡是通过插值算法完成的。默认的插值方式是线性插值，但是也可以选择样条插值或其他自定义插值方式来控制动画的过渡效果

**编辑关键帧**
- 时间：每个关键帧都有一个时间戳，表示它在动画时间线中的位置
- 插值方式：关键帧之间的过渡可以是线性、曲线等。可以在Curves窗口中调整曲线来细化动画效果
- 曲线编辑：可以通过Curves编辑器来修改每个动画属性的变化曲线，控制动画的加速、减速等

### 动画的播放与控制
Animation Clip可以通过以下两种主要方式进行播放和控制
1. Legacy Animation系统
  - `Animation`组件：在Legacy系统中，`Animation`组件用来播放Animation Clip，可以在`Animation`组件中手动指定动画片段并控制播放
  ```cs
  Animation anim = GetComponent<Animation>();
  anim.Play("Run");  // 播放名为 "Run" 的 Animation Clip
  ```
2. Macanim动画系统
  - Animator Controller：在Mecanim系统中，`Animation Clip`是通过Animator Controller来管理的
  ```cs
  Animator animator = GetComponent<Animator>();
  animator.SetTrigger("Jump");
  ```

### 动画片段的压缩与优化
Unity 支持在 Animation Clip 上进行压缩，以减少游戏资源占用并提高性能。
- 压缩设置：你可以通过在 Animation Clip 的 Inspector 中调整 压缩设置 来压缩动画数据，减少内存消耗。
- 优化：尽量避免在大量不需要的帧之间存储关键帧。例如，对于循环动画，减少关键帧数量可以显著提升性能。

### 动画片段的导入
如果在外部软件（如 Maya、Blender 或 3ds Max）中创建了动画，导出时可以将 Animation Clip 直接导入到 Unity 中。Unity 会自动识别 骨骼动画 和 面部表情，并将它们作为 Animation Clip 导入

## Animator Component
![AnimatorPanel](/assets/images/AnimatorPanel.jpg)

## Animation Event

## Root Motion

## Animator Parameters

## Playables API

## 动画优化