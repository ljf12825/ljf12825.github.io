---
title: "Serialization"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity]
author: "ljf12825"
---

## 序列化（Serialization）
### 什么是序列化
简单来说，序列化就是把内存中的对象转换成可以存储或传输的格式的过程，比如转换成二进制、JSON、XML、或者Unity自己的资产格式  
反过来，反序列化（Deserialization）就是把存储或传输的格式转换回程序内存分钟的对象

### 为什么要序列化
1.保存数据  
游戏存档就是把游戏状态保存到磁盘上的过程，这个过程就是序列化

2.编辑器显示与修改数据  
Unity Inspector面板显示脚本里字段的值，需要序列化这些字段才能让编辑器读写它们

3.网络传输  
多人游戏中，玩家状态需要网络传输，也要序列化成网络能传输的格式

### Unity里的序列化
Unity有自己的一套序列化规则，决定安歇数据会被序列化（保存、显示在Inspector）：
- public字段 默认被序列化
- private字段 需要加[SerializeField]才会序列化
- Unity只序列化支持的类型，比如基本类型、Unity内置类型、自定义继承自UnityEngine.Object的类，和标记为[Serializable]的自定义类
- 属性（Property）默认不序列化，必须用字段

**示例**
```csharp
using UnityEngine;

public class Player : MonoBehaviour
{
    public int health = 100;            // 会序列化并显示在 Inspector
    [SerializeField]
    private int mana = 50;              // 虽然是private，但加了特性会序列化

    private int secret = 999;           // 不序列化，不显示在 Inspector

    [System.NonSerialized]
    public int tempValue = 123;         // 明确不序列化，即使public也不会序列化
}
```