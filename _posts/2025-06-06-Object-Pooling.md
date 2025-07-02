---
title: "Object Pooling"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Design Pattern]
author: "ljf12825"
permalink: /posts/2025-06-06-Object-Pooling/
---
对象池是一种优化性能和内存分配的设计模式，尤其常用于游戏开发和高频率实例化的场景中

## 概念
对象池是一个事先创建好的一组可复用对象的容器，避免频繁地创建和销毁对象。在需要时，从池中取一个对象；使用完毕后，不销毁，而是回收进池中待复用

## 适用场景
- 需要频繁创建/销毁的对象（子弹、特效、敌人）
- 性能敏感场景（高帧率要求）
- GC带来的性能抖动要避免的场合

## 工作流程
1.初始化：创建一定量的对象并放入池中，默认设置为非激活状态

2.取出对象（Spawn/Get）：
  - 如果池中有可用对象，返回它并激活
  - 如果池为空，可选是否创建新对象

3.回收对象（Recycle/Release）：
  - 使用完后，将对象设为非激活并放回池中

4.自动扩展或缩减池大小（可选）

## 简单实现
```cs
public class ObjectPool<T> where T : Component
{
    private Queue<T> pool = new Queue<T>();
    private T prefab;

    public ObjectPool(T prefab, int initialSize)
    {
        this.prefab = prefab;
        for (int i = 0; i < initialSize; i++)
        {
            var obj = GameObject.Instantiate(prefab);
            obj.gameObject.SetActive(false);
            pool.Enqueue(obj);
        }
    }

    public T Get()
    {
        if (pool.Count == 0)
        {
            var obj = GameObject.Instantiate(prefab);
            obj.gameObject.SetActive(false);
            pool.Enqueue(obj);
        }

        var item = pool.Dequeue();
        item.gameObject.SetActive(true);
        return item;
    }

    public void ReturnToPool(T item)
    {
        item.gameObject.SetActive(false);
        pool.Enqueue(item);
    }
}
```

## 优势
- 避免频繁GC和内存分配
- 稳定性能表现
- 可控制资源生命周期

## 注意事项
- 池化的对象应该有明确的重置状态逻辑（例如位置、缩放、状态等）
- 池可能会过大导致内存浪费
- 不能回收引用仍在使用的对象，否则可能造成Bug

## 进阶
对象池的核心思想很简单————重用对象，避免频繁创建销毁  
但是如果想把它做得健壮、泛用、易扩展、适用于复杂项目，就没那么简单了

### 从简单到复杂的演进

#### 第一层：最简单的对象池（适合个人项目）
- 固定大小的Queue或List
- 不支持自动扩容
- 不处理回收时的状态重置
- 不检测重复回收
- 不支持分类（不同类型的对象共用池）

> 仅供学习和简单功能验证；缺乏健壮性

#### 第二层：实用的泛型对象池（中小项目）
- 使用`ObjectPool<T>`结合泛型支持任意类型
- 支持对象自动扩容
- 自动调用`OnSpawn`/`OnDespawn`接口或事件
- 支持回收检测（避免多次回收同一个对象）
- 支持对象归还前的状态重置（位置、父物体、粒子重置等）
- 支持通过标识分不同类对象（子弹/敌人/金币分开池）

> 大多数游戏项目都能满足；但初始化管理、类型多时稍显混乱

#### 第三层：可扩展的池管理系统（大型项目）
- 增加池管理器（PoolManager）统一管理所有池
- 支持预热、懒加载、自动回收超时对象
- 与Addressables/Resources/AssetBundle联动
- 结合ECS/JobSystem/DOTS
- 可支持对象生命周期事件
- 支持调试信息显示（在Editor下查看对象池状态）

> 更适合团队协作/商业项目/动态资源系统；但开发成本高，需要系统设计经验

#### 第四层：框架级池化（配合IoC、DI、状态机）
- Zenject、UniRx、Entitas等框架结合
- 用接口/注入方式控制生成逻辑
- 子系统间通过消息事件或生命周期hook联动
- 自动绑定初始化组件（如`IPoolable.OnCreate()`）