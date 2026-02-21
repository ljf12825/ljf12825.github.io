---
title: "Navigation"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Unity System, AI]
author: "ljf12825"
type: log
summary: Navigation System in Unity. Introduction, usage and document。
---
constructing
# Navigation in 3D
Unity的默认NavMesh系统是为3D场景涉及的

Unity中的Navigation主要涉及路径寻找（Pathfinding）和导航网格（NavMesh）两大核心内容，广泛应用于AI和角色移动的场景中，特别是用于控制NPC的行动

## NavMesh（导航网格）
NavMesh是一个为AI角色提供导航支持的系统。在一个3D场景中，NavMesh是通过对地面等可行走区域的“网格化”，让AI角色能在场景中找到通行路径

### NavMesh的基本概念
- 可行走区域：NavMesh会自动计算哪些地方是可供角色行走的，哪些地方是不可行走的。不可行走区域可以通过物理层（Layer）或直接标记为不可行走区域来实现
- 障碍物避让：NavMehs会避开障碍物，因此角色在移动时不会穿越墙壁、岩石等不可行走区域
- NavMesh代理（NavMesh Agent）：用于控制角色在NavMesh上的运动，它会根据目标点、路径规划和障碍物自动调整角色的路径

### NavMesh生成
在Unity中，我们通过以下几个步骤来创建NavMesh：
1. 导航面（NavMesh Surface）：这是Unity中生成NavMesh的工具。通过在地面上添加一个NavMeshSurface组件来定义NavMesh的生成区域。
2. 烘焙NavMesh：一旦设置好NavMeshSurface，就可以通过点击“Bake”按钮来生成NavMesh，这时可行走的区域会被标记出来，Unity会在该区域内生成一个路径网格。
3. 设置不可行走区域：可以通过NavMesh Obstacle组件来定义障碍物，标记出不可走的区域，生成的NavMesh会自动避开这些区域。

## NavMesh Surface
![NavMeshSurfacePanel](/images/content/NavMeshSurfacePanel.jpg)



## NavMesh Agent（导航代理）
`NavMeshAgent` 是挂载在角色上的组件，负责根据计算出的路径自动引导角色移动。它依赖于NavMesh来判断路径和避开障碍物。NavMeshAgent 会计算从当前位置到目标点的路径，并使角色沿路径移动

![NavMeshAgentPanel](/images/content/NavMeshAgentPanel.jpg)

属性
- Speed：设置角色的移动速度
- Angular Speed：设置角色旋转的速度
- Acceleration：角色的加速速度
- Stopping Distance：目标点与角色之间的最小距离，当距离小于该值时，角色会停止移动
- Auto-Breaking：是否在停止时自动刹车
- Avoidance Priority：设置代理的优先级，用于多个角色避免碰撞

移动方法  
可以通过代码控制角色的移动
```cs
NavMeshAgent agent = GetComponent<NavMeshAgent>();
agent.SetDestination(targetPosition);
```
这个方法会让角色自动计算到`targetPosition`的最短路径，并开始沿着路径移动

## NavMesh Path（导航路径）
`NavMeshPath`是一个可以通过代码访问的类，它保存了计算出的路径的所有信息，包括路径的各个节点（Waypoints），可以使用它来获取更详细的路径信息
```cs
NavMeshPath path = new NavMeshPath();
NavMesh.CalculatePath(startPosition, targetPosition, NavMesh.AllAreas, path);
```
这段代码会计算从`StartPosition`到`targetPostion`的路径，并返回路径中的所有节点

## 路径寻找和动态障碍物
- 动态障碍物：有时场景中的障碍物是动态变化的，比如敌人、移动的物体等。可以通过`NavMeshObstacle`组件来设置动态障碍物。该组件会实时更新NavMesh，自动调整路径
- Recalculate Path：如果障碍物被移除或发生了变化，`NavMeshAgent`可以动态重新计算路径：
```cs
if (agent.isOnNavMesh) agent.SetDestination(newDestination);
```

## NavMesh Obstacle

## NavMesh Link

## NavMesh Modifier

## NavMesh Modifier Volume

## Navigation
- Agents
- Areas

## Agent Avoidance（代理避免）
Unity的NavMesh系统支持代理避让功能。当多个`NavMeshAgent`对象在场景中一起移动时，系统会自动计算并避免它们相互碰撞，可以在`NavMeshAgent`的避让设置中调整优先级和半径，从而控制AI角色之间的避让行为

## 高级应用
- 多层NavMesh：可以为不同的地面或楼层设置不同的NavMesh；比如，可以设置两个不同的NavMesh，一个是地面上的，一个是楼顶上的。这样，角色可以跨楼层或避开楼层之间的障碍
- 自定义NavMesh：如果Unity的内置功能不满足需求，可以通过API自定义路径计算方式和避让算法。`NavMesh`类提供了API来获取网格数据，进行自定义的路径寻找计算

## NavMesh与AI结合
Unity的NavMesh不仅可以用于角色导航，还可以与AI逻辑结合，用于实现复杂的行为，比如：
- 巡逻：AI可以在NavMesh上设置多个巡逻点，自动选择路径并执行巡逻
- 攻击行为：AI角色通过路径计算寻找到敌人并进行攻击
- 逃跑行为：AI根据当前状况（如角色被攻击时）可以自动计算逃跑路径

# Navigation in 2D


