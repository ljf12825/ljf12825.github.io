---
title: "Physics System"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
permalink: /posts/2025-06-03-Physics-System/
---
Unity实际上提供了两个物理系统：3D物理（基于PhysX）和2D物理（基于Box2D），它们是独立的

## 物理系统的核心职责

| 分类              | 内容                                           | 示例                               |
| --------------- | -------------------------------------------- | -------------------------------- |
| **1. 碰撞检测**     | 检测物体之间是否发生接触（重叠、触发、碰撞）                       | 玩家与墙体碰撞、子弹击中敌人                   |
| **2. 碰撞响应**     | 根据碰撞产生反作用力、反弹、停止等                            | 小球碰撞墙壁后弹开                        |
| **3. 力与运动**     | 模拟重力、加速度、摩擦力、空气阻力等                           | 角色掉落、物体滚动、滑动                     |
| **4. 刚体动力学**    | 使用 `Rigidbody` 模拟真实世界中的质量、惯性、力矩等             | 推箱子、砸东西、车子加速转弯                   |
| **5. 关节系统**     | 使用 `Joint` 或 `ArticulationBody` 模拟多刚体之间的约束连接 | 吊桥、机器人手臂、门铰链                     |
| **6. 触发器检测**    | 使用 `isTrigger` 实现非物理交互                       | 进入危险区域触发警报、检测拾取道具                |
| **7. 布料、软体、车辆** | 特定模拟，如布料系统、软体物理、车轮碰撞和悬挂                      | Unity 的 `WheelCollider`, `Cloth` |
| **8. 碰撞信息收集**   | 获取碰撞点、法线、力大小、接触信息等                           | 用于播放音效、粒子、震动反馈等                  |
| **9.射线检测** | 用于看到什么，而非物理互动 | 子弹打击、AI视线检测、落地检测 |
| **10.高级关节系统** | 用于模拟机器人、机械臂、多自由度关节系统 | 工业机器人模拟、物理骨骼模拟 |

## 物理系统的基本原理
Unity的物理系统用于模拟真实世界中的力、运动、碰撞和约束，主要用于：
- 实现自然的移动（重力、摩擦、反弹）
- 实现碰撞检测和响应
- 创建可破坏环境、角色ragdoll、机械关节等系统
物理系统每个一段固定时间（FixedUpdate）执行一次物理模拟帧（Physics Step），并根据场景中所有Rigidbody、Collider、Joint计算它们的运动和相互作用  

## 核心组件
### [Rigidbody]({{site.baseurl}}/posts/2025-06-02-Rigidbody/) / Rigidbody2D
- 使GameObject受物理规则控制（重力、力、加速度等）
- 你不能只加Collider而不用Rigidbody，否则不会触发物理反应
- 属性：
  - `mass`：质量
  - `drag`：空气阻力
  - `angularDrag`：旋转阻力
  - `useGravity`
  - `isKinematic`
```csharp
rb.AddForce(Vector3.forward * 10);
```

### [Collider]({{site.baseurl}}/posts/2025-06-04-Collider-and-Trigger) / Collider2D
- 物体的物理形状，用于碰撞检测

### Physics Material / PhysicsMaterial2D
- 用于设置摩擦力、弹力等物理特性  

### [Joint]({{site.baseurl}}/posts/2025-06-07-Joint) / Joint2D
- 连接两个Rigidbody，形成复杂的物理结构

## 物理系统的执行流程
1.FixedUpdate()：调用应用力、设置速度等（稳定的时间间隔）  
2.物理模拟器处理 Rigidbody、Collider、Joint状态  
3.碰撞检测  
4.触发回调函数  
5.渲染帧刷新（Update、LateUpdate）

## 碰撞检测和层过滤
Unity提供了碰撞层和遮罩机制来控制哪些物体会发生碰撞：
- Layer Collision Matrix: 可在`Edit > Project Setting > Physics`中设置
- `Physics.Raycast()`、`Physics.OverlapSphere()`等API可用于脚本检测

## 使用物理系统时的注意事项
- 不要用`transform.position`移动物体（绕过物理系统），应使用`Rigidbody.MovePosition()`或`AddForce()`
- 所有施加力的操作应在`FixedUpdate()`中完成
- 为每个具有Collider的对象添加Rigidbody，否则不会碰撞检测
- 控制器角色不见时使用物理控制，推荐使用[CharacterController]({{site.baseurl}}/posts/2025-06-07-Character-Controller/)



- 1.Raycast  
- 2.碰撞和触发器以及函数的回调流程
- 3.碰撞检测的性能