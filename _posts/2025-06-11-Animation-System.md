---
title: "Animation System"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
permalink: /posts/2025-06-11-Animation-System/
---
Unity动画系统

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

## Animation Clips

## Animator Component

## Animation Event

## Root Motion

## Animator Parameters

## Playables API

## Mechanim vs Legacy Animation

## 动画优化

