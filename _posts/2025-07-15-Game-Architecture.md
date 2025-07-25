---
title: "Game Architecture"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Architecture]
author: "ljf12825"
permalink: /posts/2025-07-15-Game-Architecture/
---
架构是一种系统级别的设计思想，决定了整个软件的结构、模块划分、通信机制、扩展性、可维护性等核心特性

架构不仅仅是技术的堆砌，更是游戏项目能否长期维护、扩展和协作的核心保障；掌握架构是从”写功能“进阶到”构建系统“的关键

为什么要关注架构：
- 明确模块职责：分清业务、逻辑、表现层，避免混乱代码
- 方便团队协作：多人开发时架构是协作的基石
- 提升可维护性与扩展性：功能复用、快速迭代、支持热更新
- 应对大型项目复杂度：系统复杂度一旦上升，架构是唯一出路


架构关注的是：
- 模块如何组织
- 模块之间怎么通信
- 如何扩展、复用、部署

# 常见游戏架构模式
## MVC / MVVM / MVP
用于界面层逻辑分离

## Clinet-Server
- 客户端与服务器通过网络通信
- 常用于联网对战、账号系统、排行榜等
- 通常配合协议层使用

## EventBus
- 模块间解耦，低耦合通信方式
- 避免了直接依赖
- 如Unity的`CSharpMessenger`或自定义事件中心



## ECS
- 数据驱动的架构模式
- 解耦GameObject行为逻辑
- 提高运行时性能，适合海量单位（如RTS游戏）

# 进阶架构方案
**架构模式类**
## Layered Architecture
- UI层、逻辑层、数据层、网络层分离
- 每一层只与其相邻层通信，便于解耦
- 控制依赖方向，避免依赖反转

## Hexagonal Architecture
- 核心业务逻辑与输入输出彻底解耦
- 适合构建高度可测试、可复用的系统（比如跨平台逻辑）

## Clean Architecture
- 将项目分为：Entities（核心）、UseCases（应用）、InterfaceAdapters（接口适配）、Framework & Drivers
- 保持核心业务逻辑独立，UI、数据库、网络都是插件式的外围
- 在Unity中可以用Scriptable + 接口注入等方式实现

**编程范式**
## Reactive Programming
- 用数据流驱动系统状态，UI自动响应数据变化
- Unity中常用UniRx、ReactiveProterty来实现
- 优点：逻辑清晰、自动联动、适合处理异步和事件流

## Data-Driven Architecture
- 游戏逻辑尽量通过外部数据（如JSON、ScriptableObject）配置，而不是硬编码
- 好处：非程序可以不改代码即可修改玩法，支持热更

**资源与加载管理**
## Asset Bundle / Addressables
- 对资源进行分组打包，按需加载，减少内存与初始包大小
- Unity推荐使用Addressables架构来替代传统AssetBundle手动管理

**网络**
## 帧同步 vs 状态同步
- 帧同步（lockstep）：客户端发送操作，服务器统一逻辑判定（适用于公平对战）
- 状态同步：服务器发送结果状态，客户端渲染（适合RPG/MMO）

**模块化**
## Plugin Architecture
- 每个系统如商城、背包、战斗独立封装
- 支持动态加载与卸载，扩展性高
- 使用接口、消息机制、反射、或依赖主解耦模块间的关系

## MicroServe
- 将游戏服务器拆成多个小型服务：登录服、战斗服、聊天服、支付服等
- 每个服务独立部署、维护、扩展
- 常用于大型MMORPG或平台类项目

## Lua Hotfix
- 商业化、上线后频繁迭代项目

**AI**
## FSM / Behaviour Tree
- 用于角色AI或复杂流程控制
- 状态切换或树形逻辑结构，易于扩展与调试

**架构之外：工具层辅助架构**
- Dependency Injection（依赖注入）：如Zenject，在Unity中让对象解耦更彻底
- Service Locator（服务定位器）：全局管理模块服务的注册与获取，常见于`Game.Services.Get<ILoginService>()`