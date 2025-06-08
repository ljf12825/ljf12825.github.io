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

## 碰撞机制（Collision）
PhysX下的碰撞系统  

### 碰撞系统的三大核心组件

| 组件            | 用途               |
| ------------- | ---------------- |
| **Collider**  | 定义形状、体积，用于检测碰撞   |
| **Rigidbody** | 让物体参与物理计算（受力、运动） |
| **Physics**   | Unity 提供的物理引擎系统类 |

### 碰撞发生条件

| 物体A                   | 物体B       | 是否有碰撞事件 | 是否物理反应 |
| --------------------- | --------- | ------- | ------ |
| Rigidbody             | Rigidbody |  是     |  是    |
| Rigidbody             | Collider  |  是     |  是    |
| Collider              | Collider  |  否     |  否    |
| IsTrigger             | 任意        |  触发事件  |  否    |
| Rigidbody+IsKinematic | Rigidbody |  可检测   |  否    |

> 触发碰撞事件的最小可行：Both Collider & at least one Rigidbody

### 碰撞回调函数
```cs
void OnCollisionEnter(Collision collision)     // 第一次接触
void OnCollisionStay(Collision collision)      // 持续接触
void OnCollisionExit(Collision collision)      // 分离时
```
```cs
void OnTriggerEnter(Collider other)            // 进入 Trigger 区域
void OnTriggerStay(Collider other)             // 停留在 Trigger 区域
void OnTriggerExit(Collider other)             // 离开 Trigger 区域
```
这些函数只有当GameObject上
- 含有`Collider`
- 至少一个对象含有`Rigidbody`时才会触发

### 碰撞信息
`OnCollisionEnter(Collision collision)`
- `collision.gameObject`:对方物体
- `collision.contacts`：碰撞点数组
- `collision.relativeVelocity`：相对速度
- `collision.impulse`：冲击力
- `collision.collider`：对方的 Collider
`OnTriggerEnter(Collider other)`
- `other.gameObject`:触发进入的对象
- `other.attachedRigidbody`：对方的刚体

### 碰撞流程图
```lua
+--------------+         +--------------+
| 物体A        |         | 物体B        |
| Rigidbody A  |<------->| Rigidbody B  |
| Collider A   |   碰撞  | Collider B   |
+--------------+         +--------------+
         ↓
  Physics Engine 处理（反弹、摩擦、事件）
         ↓
调用 MonoBehaviour 回调函数（如 OnCollisionEnter）
```

### 碰撞和触发器函数的回调流程
Collision 和 Trigger的回调函数是由物理系统在FixedUpdate()周期中根据物体的运动和物理交互自动触发的  

#### 前提条件：发生回调的必要条件
##### 碰撞回调
发生碰撞回调必须满足以下条件：
- 两个物体中至少有一个拥有Rigidbody
- 两个物体都必须有Collider
- 两个Collider都不能设置为isTrigger = true
#### 触发器回调
触发器发生需满足：
- 至少有一个物体有Rigidbody
- 其中一个Collider设置为isTrigger = true
- 另一个对象可以是静态的，但必须有Collider

### 回调函数执行流程
**1.FixedUpdate()执行**  
Unity的物理系统在此阶段检查所有Rigidbody的运动与交互  

**2.碰撞检测**  
Unity内部使用Broad Phase + Narrow Phase检查两个Collider是否发生接触  

**3.判定类型**  
- 如果任意一方isTrigger = true -> 触发器事件
- 否则 -> 碰撞事件

**4.调用回调函数**

#### 内部调用机制
```plaintext
1. FixedUpdate() 周期开始
2. 物理世界更新 Rigidbody 的位置与速度
3. Broad Phase 找出可能接触的 Collider 对
4. Narrow Phase 精确计算接触点
5. 判断是否为 Trigger 还是 Collision
6. 封装成 C# 对象（Collision / Collider）
7. 找到相关脚本组件
8. 依次调用符合条件的 MonoBehaviour 回调函数
```
Unity利用内部的消息机制（如SendMessage）在检测到事件时对拥有相关函数的脚本组件发消息  

#### 注意
- 只有启用的GameObject和启用的MonoBehaviour脚本才会收到回调
- Unity使用反射查找函数名，因此必须命名准确
- 如果GameObject上挂载了多个组件，每个实现了相关回调的组件都会被调用

### 碰撞检测的性能
Unity的碰撞检测系统性能在于碰撞检测阶段（Collision Detection）的复杂度和参与物体的数量与类型  

#### 碰撞检测的两个阶段
Unity的碰撞检测使用了标准的两阶段检测机制： 

| 阶段    | 名称                | 描述                          | 性能影响   |
| ----- | ----------------- | --------------------------- | ------ |
| **1** | Broad Phase（宽阶段）  | 快速粗略筛选可能接触的物体对              | 高频但代价小 |
| **2** | Narrow Phase（窄阶段） | 精确计算两个 Collider 的交点、接触面、法线等 | 耗性能最大  |

#### 影响性能的关键因素
**1.碰撞体数量**  
数量越多，Broad Phase的计算复杂度越高（通常是O(n log n)甚至O(n^2)）  

**2.碰撞体类型**

| Collider 类型     | 性能排序（快 → 慢）    |
| --------------- | -------------- |
| BoxCollider     | 最快（AABB）      |
| SphereCollider  | 次快（数学简洁）      |
| CapsuleCollider | 较快             |
| MeshCollider    | 最慢（需三角面片精确计算） |

> MeshCollider + Convex = 速度提升（但仍比原始体慢）

**3.碰撞体是否为Trigger**  
`isTrigger = true`仍参与Broad Phase和部分 Narrow Phase，但不产生物理反应，性能提升有限  

**4.是否使用Rigidbody**
- 静态Collider（无Rigidbody）：性能最好
- 动态Rigidbody：每帧更新位置，参与碰撞检测，性能开销更高
- Kinematic Rigidbody（使用Transform移动）：需要手动检测碰撞（效率更差）

**5.碰撞检测模式**  
Rigidbody组件有三种检测模式：

| 模式                     | 描述            | 性能      |
| ---------------------- | ------------- | ------- |
| Discrete               | 默认，逐帧计算接触     | 最快     |
| Continuous             | 检查穿透，适用于高速小物体 | 较慢     |
| Continuous Speculative | 更智能的预测碰撞      | 慢但安全性高 |

##### 性能优化建议
**1.减少碰撞体数量**  
- 合并多个小Collider为一个大Collider
- 非必要的GameObject不加Collider
- 批量物体使用静态合批（Static Batching）

**2.使用简单形状的Collider**
- 优先使用Box/Sphere/Capsule
- 尽量避免MeshCollider，必要时使用Convex并限制顶点数

**3.合理使用Rigidbody**
- 静态物体不要加Rigidbody
- 使用Kinematic Rigidbody替代频繁创建销毁物体

**4.合理设置Layer和Layer Collision Matrix**
- 使用Physics -> Layer Collision Matrix关闭不必要的碰撞检测组合
- 精细划分物体层级，减少不必要检测

**5.分区检测（空间分割）**
- 利用网格划分，八叉树，四叉树，分区加载等算法减少碰撞检测范围（自定义或插件）



- 1.Raycast  