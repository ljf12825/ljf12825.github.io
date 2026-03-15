---
title: "Joint"
date: 2025-06-01
categories: [Engine]
tags: [Unity, Component, Physics System]
author: "ljf12825"
type: log
summary: Introduction Joint(Components, Example and API)
---
Joint（关节）系统是物理系统的一部分，用于将两个Rigidbody通过某种方式连接起来，从而形成如机械臂、门铰链、车轮悬挂等复杂的物理结构  

## 常见Joint组件（3D）

| Joint 类型                                        | 功能简介             | 应用场景          |
| ----------------------------------------------- | ---------------- | ------------- |
| **Fixed Joint**                                 | 固定连接两个刚体（类似粘在一起） | 粘接物体，如断裂木桥    |
| **Hinge Joint**                                 | 限制物体绕一个轴旋转       | 门铰链、车轮        |
| **Spring Joint**                                | 使用弹簧连接两个物体       | 弹簧、吊绳         |
| **Character Joint**                             | 模拟生物骨骼的铰接关节      | 角色 ragdoll 系统 |
| **Configurable Joint**                          | 高级自定义关节，可设置自由度   | 自定义复杂机械结构     |

## 使用Joint基本原则
- Joint总是连接两个Rigidbody：当前GameObject上的Rigidbody与`Connected Body`
- 如果`Connected Body`为空，则连接的是世界坐标系
- 添加Joint后，Unity会自动处理物理约束和力反馈

**示例：Hinge Joint（门铰链）**
```csharp
HingeJoint joint = gameObject.AddComponent<HingeJoint>();
joint.connectedBody = otherRigidbody;
joint.useLimits = true;

JointLimits limits = joint.limits;
limits.min = 0;
limits.max = 90;
joint.limits = limits;
```

**示例：Spring Joint（弹簧连接）**
```csharp
SpringJoint spring = gameObject.AddComponent<SpringJoint>();
spring.connectedBody = targetRigidbody;
spring.spring = 100f; //弹力系数
spring.damper = 5f; //阻尼
spring.minDistance = 0.5f;
spring.maxDistance = 2f;
```

## Joint API

### class Joint（基类）

| 常用属性/方法                        | 功能说明           | 适用场景           |
| ------------------------------ | -------------- | -------------- |
| `connectedBody`                | 要连接的 Rigidbody | 所有 Joint 都继承自它 |
| `anchor / connectedAnchor`     | 关节连接点（本地坐标）    | 精确控制连接位置       |
| `breakForce / breakTorque`     | 关节断裂阈值         | 适用于破坏物体        |
| `enableCollision`              | 是否允许连接物体间碰撞    | 物理交互           |
| `autoConfigureConnectedAnchor` | 是否自动计算锚点       | 初学者友好          |
| `OnJointBreak(float force)`    | 关节断裂事件         | 检测爆破等效果        |
| `currentForce / currentTorque` | 当前受力/扭矩（只读）    | 运行时调试          |

### HingeJoint（铰链关节）

| 属性          | 功能                       |
| ----------- | ------------------------ |
| `useLimits` | 是否启用旋转角限制                |
| `limits`    | 设置最小/最大角度（`JointLimits`） |
| `useMotor`  | 是否启用电机                   |
| `motor`     | 电机参数（`JointMotor`）       |
| `useSpring` | 是否启用旋转弹簧                 |
| `spring`    | 弹簧参数（`JointSpring`）      |

### SpringJoint（弹簧关节）

| 属性                          | 功能        |
| --------------------------- | --------- |
| `spring`                    | 弹簧力常数（刚度） |
| `damper`                    | 阻尼系数（摩擦）  |
| `minDistance / maxDistance` | 弹簧收缩/伸展范围 |

### FixedJoint（固定关节）

| 属性                  | 功能           |
| ------------------- | ------------ |
| 无额外属性（仅继承自 `Joint`） | 完全粘连连接，像焊死一样 |

### CharacterJoint（角色关节）

| 属性                               | 功能         |
| -------------------------------- | ---------- |
| `swingAxis`                      | 冲击方向（用于摇摆） |
| `lowTwistLimit / highTwistLimit` | 扭转角度限制     |
| `swing1Limit / swing2Limit`      | 摇摆角度限制     |

### ConfigurableJoint（高级自定义关节）

| 属性                                | 功能             |
| --------------------------------- | -------------- |
| `xMotion / yMotion / zMotion`     | 平移自由度控制        |
| `angularXMotion / Y / Z`          | 旋转自由度控制        |
| `targetPosition / targetRotation` | 驱动目标           |
| `xDrive / yDrive / zDrive`        | 平移驱动           |
| `angularXDrive / YZDrive`         | 旋转驱动           |
| `secondaryAxis`                   | 定义自定义轴方向       |
| `projectionMode`                  | 矛盾时修正方式（位置/旋转） |


