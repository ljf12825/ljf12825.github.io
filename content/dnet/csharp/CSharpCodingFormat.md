---
title: CSharp Coding Format
date: 2026-03-25
author: ljf12825
type: file
summary: C# coding format
---

## 命名规范

C#对命名有非常明确的社区共识

- 类型/类/方法 -> PascalCase（大驼峰）

```cs
public class PlayerController
{
    public void MoveForward() {}
}
``` 

- 局部变量/参数 -> camelCase（小驼峰）

```cs
int playerHealth;
void SetHealth(int newHealth) {}
```

- 私有字段 -> `_camelCase`

```cs
private int _health;
private Transform _target;
```

- 常量 -> PascalCase或ALL_CAPS

```cs
public const int MaxPlayerCount = 4;
```

- 接口 -> `I`前缀

```cs
public interface IMovable
{
    void Move()
}
```

- 布尔变量 -> 语义清晰（is/has/can）

```cs
bool isDead;
bool hasWeapon;
bool canJump;
```

## 代码结构规范

### 成员顺序

推荐顺序

```cs
public class Example
{
    // 1. 常量
    // 2. 字段(private -> protected -> public)
    // 3. 属性
    // 4. 构造函数
    // 5. 公共方法
    // 6. 私有方法
}
```

### using 顺序

```cs
using System;
using System.Collections.Generic;
using UnityEngine; // 第三方/框架
```

系统 -> 第三方 -> 项目内


### 一个文件一个类

```cs
// Player.cs

class Player {}
```

## 属性 vs 字段

不推荐直接暴露字段

```cs
public int health;
```

推荐属性

```cs
public int Health { get; private set; }
```

## 格式规范

### 花括号不省略

```cs
if (isDead)
{
    return;
}

// 不要
if (isDead) return;
```

## 函数设计规范

### SRP

### 方法名要表达行为

```cs
CalculateDamage()
LoadConfig()
InitializeRenderer()
```

而非

```cs
DoStuff()
Handle()
Process()
```

### 参数数量小于等于3

## 注释规范

### 优先写“为什么”，不是“做什么”

不推荐

```cs
// 设置血量
_health = 10;
```

推荐

```cs
// 防止玩家初始血量为0导致死亡动画触发
_health = 10;
```

### XML注释（公共API）

```cs
/// <summary>
/// 计算伤害值
/// </summary>
public int CalculateDamage() {}
```
