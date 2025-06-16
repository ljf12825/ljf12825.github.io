---
title: "Scene System"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
permalink: /posts/2025-06-08-Scene-System/
---
Unity Scene System是Unity中用于组织和管理游戏世界的基础结构，Unity支持多个Scene的加载与卸载，允许构建出大型、分块化的世界

## Scene
Scene是Unity游戏项目中的一个基础构建单元，它就像游戏世界中的一个“地图”或“关卡”，一个Scene就是一个逻辑/物理空间的容器，包含了：
- GameObject
- 地形、UI、声音
- 脚本、组件
- 光照信息、烘焙数据等

在Unity中，一个Scene对应一个`.unity`文件

### Scene 生命周期
1.创建或打开场景（`.unity`文件）

2.布置场景内容

3.保存场景

4.构建和加载场景（Build Settings里添加场景）

5.运行时加载和卸载场景

### 场景最佳实践
- 保持每个场景的职责单一（比如UI与游戏逻辑分离）
- 使用Prefab来管理重复对象
- 使用场景加载器或管理器来控制场景切换和数据传递
- 合理使用DontDestroyOnLoad来跨场景保存数据或对象

## Multi Scene

### SceneManager

### 加载与切换场景

### Additive Load

### 多场景编辑工作流

### 场景打包与构建设置

### 场景分块加载

### 触发器加载机制

### Addressable + Scene Loading

### 性能优化

