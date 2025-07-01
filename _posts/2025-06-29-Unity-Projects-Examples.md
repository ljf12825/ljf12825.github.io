---
title: "Unity Projects Examples"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Project]
author: "ljf12825"
permalink: /posts/2025-06-29-Unity-Projects-Examples/
---
项目管理

## Quick List

> 状态说明：
- `Planning`：规划中，生成需求和说明文档
- `TODO`：已立项，未开始
- `In Progress`：开发中
- `Code Review`：审查
- `Testing`：测试
- `Bugfixing`：缺陷修复
- `Paused`：暂停
- `Cancelled`：已取消
- `Archived` : 已归档

> 标签说明：
- `Unity GamePlay`：Unity游戏逻辑实现
- `Unity Graph`：Unity图形学实现
- `Primary`：初级
- `Intermediate`：中级
- `Advanced`：进阶
- `High Rank`：高级

| 项目 | 简介 | 要点 | 标签 | 状态 |
| ---- | ---- | ---- | ---- | ---- |
| 滚动球 Ball Roll | WASD控制球滚动，捡起金币 | 物理系统、Rigidbody、输入系统 | `Unity GamePlay` `Primary` | `Planning` |
| 打砖块 Breakout  | 实现经典打砖块玩法       | 2D物理、碰撞、射线检测、UI    | `Unity GamePlay` `Primary` | `Planning` |
| Flappy Bird     | 鸟穿越管道、简单随机化 | 2D动画、Trigger触发、对象池     | `Unity GamePlay` `Primary` | `Planning` |
| 计时小游戏       | 倒计时 + 得分显示     | UI、Text、Button、Timer        | `Unity GamePlay` `Primary` | `Planning` |
| 第一人称走路模拟  | 基础FPS移动逻辑      | CharacterController、摄像机控制 | `Unity GamePlay` `Primary` | `Planning` |
| 任务系统           | 任务分类、接受/完成任务、进度追踪 | 数据来源、存档机制、事件系统、任务链 | `Unity GamePlay` `System` `Intermediate` | `Planning` |
| 成就系统           | 完成特定条件自动解锁成就 | 模块化架构、事件驱动、进度追踪、数据持久化 | `Unity GamePlay` `System` `Intermediate` | `Planning` |
| 技能系统           | 统一管理技能相关功能 | 静态数据 + 运行时状态、冷却&消耗管理、逻辑流 | `Unity GamePlay` `System` `Intermediate` | `Planning` |
| 状态机系统         | 管理对象在不同状态间切换和行为控制 | 多角色状态、AI状态、战斗状态解耦 | `Unity GamePlay` `System` `Intermediate` | `Planning` |
| 道具拾取 + 背包系统 | 游戏内拾取，物品存储和管理 | 拖拽、叠加、存储、装备栏 | `Unity GamePlay` `System` `Intermediate` | `Planning` |
| Save/Load存档系统  | 持久化保存游戏的关键数据 | 本地JSON/二进制保存、读取场景状态 | `Unity GamePlay` `System` `Intermediate` | `Planning` |
| 抽卡、开箱、开包类  | 随机概率 + 权重算法、奖池管理、玩家消耗 | 奖池设计和概率控制、抽取逻辑、消耗与次数管理 | `Unity GamePlay` `System` `Intermediate` | `Planning` |
| Rouge-like        | 强调随机生成地图、资源和事件，Permadeath | 程序生成地图、道具系统 | `Unity GamePlay` `System` `Intermediate`      | `Planning` |
| 节奏点击游戏       | 根据音乐节奏，在指定时间点点击、滑动或长按 | 节奏匹配、音频事件绑定 | `Unity GamePlay` `System` `Intermediate`      | `Planning` |
| 平台跳跃 Platformer | 可拓展成高级动作系统 | 动画、状态机、跳跃逻辑、碰撞检测 | `Unity GamePlay` `Intermediate` | `Planning` |
| 塔防游戏 Tower Defense | 使用导航网格或自定义路径系统 | 路径系统、对象池、攻击逻辑 | `Unity GamePlay` `Intermediate` | `Planning` |
| 基础RPG Demo     | 包含拾取、装备、攻击等 | Inventory、UI、任务系统、简单AI   | `Unity GamePlay` `Intermediate` | `Planning` |
| TopDown射击      | 包括Boss逻辑、多种敌人 | 射线检测、特效、敌人AI | `Unity GamePlay` `Intermediate` | `Planning` |
| Unity UI交互系统 | 侧重交互与UI动效       | UnityEvent、Button、EventSystem | `Unity GamePlay` `Intermediate` | `Planning` |
| 第三人称动作游戏  | 可使用Animation Rigging提升表现 | Blend Tree、Root Motion、攻击系统、受击反馈 | `Unity GamePlay` `Advanced` | `Planning` |
| 回合制战斗系统（战棋） | 逻辑结构较为复杂 | 网格管理、战斗管理器、状态系统 | `Unity GamePlay` `Advanced` | `Planning` |
| 简易MMO Demo     | 适合入门多人联机项目  | 多人同步、角色同步、基本聊天系统、房间机制 | `Unity GamePlay` `Advanced` | `Planning` |
| 城市模拟/建设类游戏 | 游戏逻辑和状态同步挑战大 | 地图系统、建筑放置、数据持久化 | `Unity GamePlay` `Advanced` | `Planning` |
| 虚拟摄像机系统    | 更适合图形学表现和演示项目 | Cinemachine、Timeline、关键帧控制 | `Unity Graph` `Advanced` | `Planning` |
| Open World (mini) | 需考虑资源管理、加载逻辑 | Streaming、世界管理、AI导航、场景优化 | `Unity GamePlay` `High Rank` | `Planning` |
| ARPG(DMC-like)    | 动作响应和打击感难度大   | Combo系统、时间轴管理、动画事件       | `Unity GamePlay` `High Rank` | `Planning` |
| Shader Collection | 图形学展示              | 自定义Shader、VFX Graph、Render Feature | `Unity Graph` `High Rank` | `Planning` |
| Visual Novel System | 更偏向结构设计与数据处理 | 数据驱动、UI演出、状态管理  | `Unity GamePlay` `High Rank`  | `Planning` |
| SRP               | 高度定制，图形学开发方向  | 图形学、SRP、Render Graph   | `Unity Graph` `High Rank`     | `Planning` |
