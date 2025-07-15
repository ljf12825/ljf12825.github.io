---
title: "Unity Component Communication"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Syntax, Unity Class]
author: "ljf12825"
permalink: /posts/2025-07-15-Unity-Component-Communication/
---

| 通信方式                                       | 类型     | 是否推荐   | 示例                                                 |
| ------------------------------------------ | ------ | ------ | -------------------------------------------------- |
| `GetComponent<T>()` 直接调用                   | 显式调用   |  推荐   | `GetComponent<Health>().TakeDamage(10);`           |
| `UnityEvent`                               | 事件系统   |  推荐   | 在 Inspector 中绑定事件                                  |
| C# 委托/事件 (`delegate`, `event`)             | 原生 C#  |  推荐   | `public event Action OnDead;`                      |
| 接口调用（如 `IDamageable`）                      | 解耦方式   |  推荐   | `target.GetComponent<IDamageable>()?.TakeDamage()` |
| `ScriptableObject` 事件                      | 高级数据驱动 |  推荐   | Game-wide event bus                                |
| **`SendMessage()` / `BroadcastMessage()`** | 反射调用   |  不推荐 | `SendMessage("Explode")`                           |
