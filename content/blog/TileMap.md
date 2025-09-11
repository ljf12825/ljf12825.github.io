---
title: "Tilemap"
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System, Unity Package]
author: "ljf12825"
summary: TileMap in Unity
---
在Unity中，Tilemap是一个强大的工具，专为2D游戏开发中的网格地图（Tile-based maps）设计

它允许开发者通过将单独的图块（Tiles）布置在网格中，构建复杂的2D游戏世界，如平台游戏、回合制策略游戏等

Tilemap可以用于处理游戏世界的地形、背景、障碍物、关卡设计等

## Tilemap的组成和工作原理
Tilemap的工作原理是基于网格（Grid）的，将单个的图块（Tile）放置在网格的各个单元格中，从而构建出复杂的2D地图。Unity提供了一个强大的Tilemap系统，使得开发者能够快速而高效地创建这些地图

**组成部分**
- Grid：Grid是Tilemap的基础结构，它为所有Tile提供一个坐标系统，可以设置不同类型的Grid，如矩形网格、六边形网格等，以适应不同的地图需求
- Tilemap：Tilemap组件是核心，负责管理Tiles在Grid上的位置和现实。每个Tilemap会有自己的Tile图层，用于绘制和管理不同的地形或装饰层
- Tile：Tile是Tilemap的基本单位，通常是一个Sprite。每个Tile都代表地图上的一个单元格，可以是地面、障碍物、装饰物等。Unity允许开发者为Tile设置各种属性，如动画、规则等

## Tilemap的创建与设置
Step1: 创建一个Tilemap 
1. 创建Grid
  - 在Unity的场景中，通过`GameObject -> 2D Object -> Tilemap -> Rectangular`来创建一个带有Grid的Tilemap，Grid会自动创建，Tilemap会作为Grid的子对象
  - 也可以选择`Hexagonal`或`Isometric`等不同类型的网格，具体取决于游戏需求

2. 创建Tilemap
  - 在Unity中，Tilemap是由一个`Tilemap`组件和一个`Tilemap Renderer`组件组成的
  - `Tilemap`组件负责存储地图的Tile，而`Tilemap Renderer`负责绘制这些Tile

Step2：创建Tile Palette
Tile Palette是一个管理所有Tiles的工具，它允许将Tile组织在一个面板中，方便在Tilemap中绘制和修改
1. 打开Tile Palette
  - 在Unity菜单栏中，选择`Window -> 2D -> Tile Palette`，打开Tile Palette窗口

2. 创建Tile Palette
  - 在Tile Palette窗口中，点击“Create New Palette”创建一个新的Tile Palette。可以将其命名并选择合适的Tilemap图层（比如地面、背景等）

3. 添加Tiles到Palette
  - 将Sprites（或其他图像资源）拖到Tile Palette中，Unity会自动将它们转换为Tile

Step3：绘制Tilemap
在Tile Palette中选择一个Tile，然后回到Scene视图，开始在Tilemap上绘制，可以像使用画笔一样将Tile放置到网格中
- 刷子工具：Tile Palette提供了多种绘制工具，如单一Tile、区域充填、随机充填等，来快速创建Tilemap
- 删除Tile：选择删除工具后，可以擦除已经绘制的Tile

## Tile的类型与特性
Unity支持多种类型的Tile，每种Tile可以为Tilemap提供不同的功能
1) Sprite Tile
这是最常见的Tile类型，它是一个简单的图像（Sprite）。可以直接将Sprite拖拽到Tile Palette中，使用它在Tilemap中进行绘制

2) Rule Tile
Rule Tile允许自定义Tile之间的连接规则，这意味着，Rule Tile可以自动选择与相邻的Tiles连接的图像，从而让地图更加具自然感，减少手动绘制的工作量
- 自动连接：比如，草地Tile会根据邻近的草地Tile自动连接，而不会产生不规则的接缝

3) Animated Tile
这种Tile支持播放动画，它非常适合动态效果，如流水、火焰等
- 使用方法：可以将多个Sprite作为动画帧添加到Animated Tile中，Unity会在运行时自动播放这些动画

4) Tile Base
`Tile Base`是Tile的基类，所有的Tile类型都会继承它，可以自定义Tile并扩展TileBase，以便实现更复杂的行为和效果

## Tilemap的高级功能
1) 碰撞检测
Tilemap可以与物理系统（如2D碰撞体）一起工作，为Tilemap添加碰撞体
- Tilemap Collider 2D：为Tilemap中的每个Tile自动添加一个碰撞体，适用于简单的Tilemap物理互动
- Composite Collider 2D：如果希望优化性能，可以结合`Composite Collider 2D`，它将多个Tile的碰撞体合并成一个单一的碰撞体，减少物理计算的开销

2) 动态修改Tilemap
Tilemap是可以动态修改的，可以通过代码修改Tile的内容。

例如，在游戏过程中根据玩家的操作或事件来修改地图
```cs
Tilemap tilemap = GetComponent<Tilemap>();
Tile tile = myTilePalette[0]; // 获取Tile
tilemap.SetTile(new Vector3Int(0, 0, 0), tile); // 在指定位置设置Tile
```

3) 多层Tilemap
Tilemap系统允许为不同的层级创建多个Tilemap。例如，可以有一个Tilemap专门用于背景，另一个用于地面，另一个用于障碍物等。这些Tilemap可以共存于同一个Grid对象下，通过Z轴或不同的Sorting Layer来分层显示

4) 自动化地图生成
可以使用Tilemap系统进行程序化地图生产。例如，使用噪声算法（如Perlin Noise）来随机生成地图，或者在游戏中通过关卡编辑器动态生成地图。Tilemap允许运行时动态创建和修改Tile

## Tilemap优化
1) 使用Tilemap的合批功能
Tilemap支持自动合批（batching），它可以将多个Tile的绘制请求合并成一个，从而减少绘制调用次数，提高渲染效率

2) 动态加载Tilemap区域
对于大型地图，动态加载玩家可见区域的Tilemap，可以显著减少内存占用和提高性能。如只加载玩家视野内的Tilemap部分，避免加载整个地图

3) 合并Tiles
可以通过合并相邻的Tile来减少绘制调用，尤其是对重复的地面图块进行合并，Unity的`Tilemap Renderer`可以帮助在合批过程中提高性能

## Tilemap的应用场景
- 平台游戏：Tilemap非常适合用来创建2D平台游戏的地图，地面、墙壁、障碍物等都可以通过Tilemap来构建
- 回合制策略游戏：Tilemap可以用来创建棋盘式的战斗场景，处理单位的移动和碰撞
- 沙盒类游戏：Tilemap适合用来创建可以编辑和修改的游戏世界，如*Minecraft*中的块状世界
- 冒险游戏：Tilemap适合用来制作探索式的地图，如解密或角色扮演游戏的关卡
