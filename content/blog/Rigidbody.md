---
title: "Rigidbody"
date: 2025-06-01
categories: [Note]
tags: [Unity, Unity Component, Physics System]
author: "ljf12825"
summary: Introduction and API of Rigidbody component in Unity
---
在Unity中，`Rigidbody`是一个用于实现物理行为的组件，它允许你的游戏对象受力、重力、碰撞等真实世界的物理规则影响

## Rigidbody的基本功能
当你给一个`GameObject`添加Rigibody后，它具备以下能力：

| 功能  | 描述                            |
| --- | ----------------------------- |
| 重力  | 会受到 Unity 世界的重力影响。            |
| 力作用 | 可通过 `AddForce()` 施加力。         |
| 碰撞  | 可与带有 `Collider` 的物体发生物理碰撞。    |
| 移动  | 可通过物理方式（而不是直接修改 transform）移动。 |

### RigidbodyPanel

![RigidbodyPanel](/images/Blog/RigidbodyPanel.jpg)

**基础物理参数**

| 参数名                   | 作用            | 默认值    | 建议用法                   |
| --------------------- | ------------- | ------ | ---------------------- |
| **Mass**（质量）          | 控制惯性、碰撞反应     | `1`    | 设为真实世界比例（如车 1000、人 70） |
| **Drag**（线性阻力）        | 模拟空气/水的阻力（减速） | `0`    | 移动物体逐渐停止，可设为 `1~5`     |
| **Angular Drag**（角阻力） | 减缓旋转速度        | `0.05` | 防止物体无限旋转，常设为 `0.1~0.5` |

- **Automatic Center Of Mass**（自动质心，默认为true）
  - Unity会根据物体的形状（Collider）和质量分布，自动计算Rigidbody的中心点
  - 通常质心在物体的几何中心，但加多个Collider后可能偏移
  - 这是大多数情况下推荐的方式，因为它物理上是合理的

**手动设置质心**
```csharp
rb.centerOfMass = new Vector3(0, -1f, 0); //手动设一个偏移量
```
>设置后将覆盖自动计算值，适用于如车辆、飞船平衡优化、ragdoll调整等高级用途

可视化质心方法：
```csharp
void OnDrawGizmo()
{
    if (rb != null)
    {
        Gizmos.color = Color.red;
        Gizmos.DrawSphere(rb.worldCenterOfMess, 0.1f);
    }
}
```

**为什么质心重要**

| 应用场景            | 影响               |
| --------------- | ---------------- |
| 飞船 / 载具         | 若质心偏上，容易翻车或晃动    |
| 摆锤 / 吊挂物体       | 旋转效果中心点取决于质心     |
| 多 Collider 组合物体 | 自动质心可能不在视觉中心     |
| 被力击打（AddForce）  | 力不作用在质心会引起旋转（力矩） |

**Automatic Tensor**（自动惯性张量，默认为true）

**什么是Tensor**
- 在物理学中，惯性张量是描述刚体如何响应旋转力（力矩）的数学结构
- 它是质量分布的一个三维矩阵，决定了刚体绕每个轴的旋转惯性
- 简单理解：惯性张量 = “旋转版的质量”

**默认自动计算惯性张量**
- Unity默认根据物体的`Collider`形状和`Mass`自动计算惯性张量
- 这就是`Rigidbody.inertiaTensor`和`inertiaTensorRotation`的来源
- 所以刚体自然会表现出“越大越难转”“形状影响旋转惯性”等真实行为

**手动设置惯性张量（自动覆盖）**
```csharp
rb.inertiaTensor = new Vector3(1, 1, 1); //自定义旋转惯性
rb.inertiaTensorRotation = Quaternion.identity; //张量方向
```
但这样做有前提条件：
```csharp
rb.ResetInertiaTensor(); //可重置为自动计算值
```
>设置之前你要禁用自动张量

**什么情况需要自定义惯性张量**

| 应用              | 目的                  |
| --------------- | ------------------- |
| 物理模拟器 / 实验工具    | 精确控制旋转行为            |
| 异形刚体（如飞船、复杂机器人） | 人为调整旋转惯性，防止旋转太快或不稳定 |
| 某些游戏设计          | 让角色或物体转得更“重”或更“灵活”  |
| 制作旋转玩具 / 陀螺仪    | 可控惯性带来物理可玩性         |

**运动状态设置**

| 参数                                          | 作用            | 默认    | 使用场景         |
| ------------------------------------------- | ------------- | ----- | ------------ |
| **Use Gravity**                             | 是否受重力影响       |  true | 用于自由下落、角色跳跃等 |
| **Is Kinematic**                            | 是否由代码控制，不参与物理 |  false | 静态平台、动画控制角色等 |

**Interpolate（插值）**

| 选项              | 说明          | 使用场景           |
| --------------- | ----------- | -------------- |
| **None**        | 不插值，可能抖动    | 一般默认           |
| **Interpolate** | 使用上一帧数据进行平滑 | 摄像机跟随刚体时防抖动    |
| **Extrapolate** | 使用下一帧数据预测位置 | 一般不推荐，容易导致位置错误 |

>插值仅影响视觉表现，不影响物理逻辑，适合处理低帧率时的视觉平滑

**Collision Detection（碰撞检测模式）**

| 模式                         | 描述           | 使用场景         |
| -------------------------- | ------------ | ------------ |
| **Discrete**               | 默认，普通对象      | 慢速运动、低精度要求   |
| **Continuous**             | 防穿透          | 快速移动物体（如子弹）  |
| **Continuous Dynamic**     | 防止快速刚体穿过静态物体 | 用于导弹、飞行物     |
| **Continuous Speculative** | 预测未来路径是否碰撞   | 用于需要超高稳定性的对象 |

>连续检测会增加计算量，不建议用于大量物体

**Constraints（冻结轴向）**
用于锁定物体的移动或旋转，防止不受控的漂移或翻滚  

| 选项                    | 说明        | 常用组合        |
| --------------------- | --------- | ----------- |
| Freeze Position X/Y/Z | 锁定对应轴上的移动 | 冻住平台等静态物体   |
| Freeze Rotation X/Y/Z | 锁定对应轴上的旋转 | 防止角色倒地、车轮翻转 |
| Freeze All            | 锁定所有轴     | 彻底不动，用于静态物体 |

**Layer Overrides（图层覆盖）**  
允许刚体在物理世界中临时使用不同的Layer设置进行碰撞和检测计算，不会影响物体本身的Layer  
影响范围：物理模拟（碰撞、Raycast、Force、Overlap等），不会影响渲染、标签识别、脚本逻辑
- Include Layers
  - 表示允许此刚体与哪些Layer的对象发生物理交互
  - 这实质上是一个LayerMask
- Exclude Layers
  - 表示在物理交互中忽略的Layer
>Exclude Layers优先于Include Layers

## Rigidbody常见用法：
```csharp
Rigidbody rb = GetComponent<Rigidbody>();

rb.AddForce(Vector3.forward * 10f); //施加一个向前的力
rb.AddTorque(Vector3.up * 5f); //添加一个旋转力
rb.MovePosition(newPos); //平滑低移动Rigidbody
rb.velocity = new Vector3(5, 0, 0); //设置线速度
```

### isKinematic 和 非 Kinematic
- `isKinematic = false`（默认）：受物理引擎控制（例如重力、碰撞、AddForce）
- `isKinematic = true`：完全由你控制`transform`或`MovePosition()`，不会被物理引擎影响

用途：
- Kinematic常用于移动平台、动画角色骨骼、摄像机跟随等

### Rigidbody vs Transform控制
**不要在有Rigidbody的物体上直接用`transform.position += ...`来移动，这会跳过物理系统，导致碰撞问题**

正确做法：
- 用`Rigidbody.MovePosition()`移动
- 或使用`AddForce()`、`velocity`等物理方式

问题本质：
在Unity中，Rigidbody是由物理系统控制的，一旦你给GameObject添加了Rigidbody，它的位置和旋转应该只通过物理系统来控制。  

使用`transform.position += ...`会出现的问题

| 问题               | 说明                                                                          |
| ---------------- | --------------------------------------------------------------------------- |
|  **绕过物理引擎**     | `transform.position += ...` 是**立即改变 Transform 的位置**，Unity 物理系统（PhysX）对此毫不知情 |
|  **不会产生碰撞检测**   | 物体“穿越”其他碰撞体而不产生物理响应（穿模）                                                     |
|  **不会产生力或速度变化** | `Rigidbody.velocity` 不会更新，你也不能检测运动趋势                                        |
|  **打乱内部物理状态**   | 会破坏 Rigidbody 的睡眠状态、插值、运动预测等机制，造成 jitter（抖动）或奇怪弹跳                           |
|  **失去重力/摩擦等作用** | 物体移动但没有物理感，导致操作不自然                                                          |

只有在以下三种情况中可以使用`transform.position`:  
1.没有`Rigidbody`的对象（纯UI/特效/场景物体）

2.临时调整位置，如传送、重置

3.`isKinematic = true`

### 示例：角色控制器使用Rigidbody
```csharp
public class PlayerMovement : MonoBehaviour
{
    public float speed = 5f;
    private Rigidbody rb;

    void Start() => rb = GetComponent<Rigidbody>();

    void FixedUpdate()
    {
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");

        Vector3 move = new Vector3(h, 0, v);
        rb.MovePosition(rb.position + move * speed * Time.fixedDeltaTime);
    }
}
```
## 物理力应用的类型
Unity提供了多种物理力应用方式，你可以根据物理效果需求选择合适的模式  
```csharp
rb.AddForce(Vector3.force, ForceMode.Force);
```

| ForceMode        | 作用            | 适用场景         |
| ---------------- | ------------- | ------------ |
| `Force`          | 持续施加力（受质量影响）  | 模拟发动机、风力等持续力 |
| `Impulse`        | 瞬时冲量（受质量影响）   | 子弹击中、跳跃、爆炸推动 |
| `VelocityChange` | 改变速度（忽略质量）    | 快速位移、瞬间反弹    |
| `Acceleration`   | 施加加速度（不受质量影响） | 飞行器推进、不考虑质量时 |

## 爆炸力：`AddExplosionForce`
模拟爆炸冲击力，自动考虑距离衰减和力方向
```csharp
rb.AddExplosionForce(force, explosionPosition, radius, upwardsModifier);
```
- `force`:爆炸的最大力
- `explosionPosition`:爆炸中心
- `radius`:爆炸影响范围
- `upwardsModifier`:向上的推力（可增强爆炸效果）

## Rigidbody Constraints（锁定轴向）
锁定位置或旋转，常用于平台类游戏角色防止翻滚
```csharp
rb.constraints = RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationZ;
```
- `FreezePositionX/Y/Z`
- `FreezeRotationX/Y/Z`
- `FreezeAll`

## Rigidbody Interpolation（插值）
用于缓解物体抖动或物理更新频率和渲染帧率不一致的问题  
插值实在渲染帧之间平滑显示刚体位置或旋转，防止因物理更新滞后造成的抖动或卡顿  

>渲染帧和物理帧
>在Unity游戏循环中，渲染帧（Update）和物理帧（Fixed Update）是分开的
>渲染帧率和物理帧率可能不同，这样一来，在两次物理更新之间可能要渲染一次或多次画面，此时刚体的位置还没更新，就会导致物体“跳跃”，摄像机跟随刚体时抖动

```csharp
rb.interpolation = RigidbodyInterpolation.Interpolate;
```

| 插值类型        | 描述        |
| ----------- | --------- |
| None        | 不插值，最性能优先 |
| Interpolate | 插值上一次位置   |
| Extrapolate | 预测下一帧位置   |

适用于：摄像机跟随物体 + Rigidbody，平滑动画等

**插值不是同步手段**  
插值只影响视觉显示，不影响实际物理行为或碰撞检测

## Rigidbody连接（Joint系统）
Unity提供了多个`Joint`来连接两个Rigidbody，来实现机械、吊挂、弹簧等效果

常用Joint类型

| Joint 类型            | 功能       | 应用         |
| ------------------- | -------- | ---------- |
| `FixedJoint`        | 完全绑定两个刚体 | 构建刚性结构     |
| `HingeJoint`        | 像门铰链一样旋转 | 车轮、门       |
| `SpringJoint`       | 模拟弹簧连接   | 弹簧、绳索末端    |
| `ConfigurableJoint` | 自定义约束自由度 | 高级物理装置     |
| `CharacterJoint`    | 模拟人体骨骼   | 人物 ragdoll |

**示例：固定一个物体**
```csharp
var joint = gameObject.AddComponent<FixedJoint>();
joint.connectedBody = otherRigidbody;
```

## 刚体时间管理
你可以临时控制刚体行为。例如冻结、暂停、缓动
```csharp
rb.isKinematic = true; // 暂停物理影响
rb.detectCollisions = false; //禁用碰撞响应
rb.Sleep(); //进入“休眠”状态，除非外力唤醒
rb.WakeUp(); //强制唤醒
```
## 手动模拟物理（少见但强大）
Unity默认每帧自动调用`Physics.Simulate()`，你可以关闭自动模拟并手动调用它
```csharp
Physics.autoSimulation = false;
Physics.Simulate(Time.fixedDeltaTime);
```
用于录制、回放、预测系统、AI训练等

## 实践建议
### 1.性能优化
- 尽量使用`MovePosition`和`MoveRotation`代替直接设置`transform`
- 使用`Rigidbody.Sleep()`来节省性能，尤其是大量静态物体

### 2.碰撞过滤
- 使用`Layer` + `Physics.IngoreCollision()`或`Physics.IgnoreLayerCollision()`控制碰撞逻辑

### 3.组合Joint
- 复杂角色物理（如ragdoll）可通过多个Joint配合约束自由度实现真实物理表现

### 4.多刚体组合
- 使用空物体为父物体挂多个子物体加不同Rigidbody，用`Joint`连接

## 刚体不能直接禁用
### 1.刚体不是一个标准行为组件
- Unity中大多数组件都继承自`Behaviour`类，这类组件有一个通用的enable属性
- 但Rigidbody继承自`Component`，因此没有`enable`属性4
### 2.Rigidbody是物理系统的一部分，关闭它的逻辑很复杂
Unity的Rigidbody是底层物理引擎（NVIDIA PhysX）注册的一个刚体对象，它包含大量复杂的状态（如质量、速度、力、碰撞状态等），不能简单“关掉”

如果允许直接`enabled = false`，Unity就得把它从物理世界中注销，可能会导致：
- 打乱碰撞检测状态
- 丢失动力学状态
- 导致其他与之交互的刚体行为出错

替代方法：

| 方法                            | 效果        | 场景                        |
| ----------------------------- | --------- | ------------------------- |
| `rb.isKinematic = true`       | 不再受物理引擎驱动 | 暂停物理交互，但可以通过 transform 控制 |
| `rb.detectCollisions = false` | 不再检测碰撞    | 让它“穿透”其他物体                |
| `rb.Sleep()`                  | 让刚体进入休眠   | 减少物理计算开销                  |
| `Destroy(rb)`                 | 彻底移除刚体    | 完全不再参与物理                  |



## `Rigidbody` API

### 常用字段/属性

| 属性                       | 类型                       | 说明        |
| ------------------------ | ------------------------ | --------- |
| `mass`                   | `float`                  | 质量（默认 1）  |
| `drag`                   | `float`                  | 线性阻力      |
| `angularDrag`            | `float`                  | 角阻力       |
| `useGravity`             | `bool`                   | 是否启用重力    |
| `isKinematic`            | `bool`                   | 是否受物理引擎影响 |
| `velocity`               | `Vector3`                | 当前线速度     |
| `angularVelocity`        | `Vector3`                | 当前角速度     |
| `position`               | `Vector3`                | 世界空间位置    |
| `rotation`               | `Quaternion`             | 世界旋转      |
| `centerOfMass`           | `Vector3`                | 质心位置      |
| `inertiaTensor`          | `Vector3`                | 惯性张量      |
| `constraints`            | `RigidbodyConstraints`   | 锁定移动或旋转轴  |
| `interpolation`          | `RigidbodyInterpolation` | 插值方式      |
| `collisionDetectionMode` | `CollisionDetectionMode` | 碰撞检测模式    |

### 常用方法（控制移动、施加力）
#### 施加力的方法（力学模拟）

| 方法   | 描述                   | 常用参数说明  |
| ------------------------ | -------------------- | ------------------------- |
| `AddForce(Vector3 force, ForceMode mode = ForceMode.Force)`                                                                      | 向刚体施加一个世界空间的力        | - `ForceMode` 可选：`Force`, `Impulse`, `Acceleration`, `VelocityChange` |
| `AddRelativeForce(Vector3 force, ForceMode mode = ForceMode.Force)`                                                              | 向刚体施加一个**相对于自身方向**的力 | 用于局部方向推进，如飞船、角色局部移动                                                   |
| `AddTorque(Vector3 torque, ForceMode mode = ForceMode.Force)`                                                                    | 添加一个旋转力（转矩）          | 控制刚体的旋转，比如陀螺仪效果                                                       |
| `AddRelativeTorque(Vector3 torque, ForceMode mode = ForceMode.Force)`                                                            | 添加一个**相对坐标**的转矩      | 以自身坐标轴方向旋转                                                            |
| `AddExplosionForce(float force, Vector3 position, float radius, float upwardsModifier = 0.0f, ForceMode mode = ForceMode.Force)` | 模拟爆炸力                | 常用于爆炸、炸飞物体等效果                                                         |

#### 移动与旋转（物理友好方式）
这些方法在`FixedUpdate()`中调用，以物理方式平滑移动对象

| 方法                               | 描述                    |
| -------------------------------- | --------------------- |
| `MovePosition(Vector3 position)` | 让刚体以物理方式移动到某位置（会产生碰撞） |
| `MoveRotation(Quaternion rot)`   | 让刚体以物理方式旋转到目标旋转角度     |

>不要使用transform.position = ... 替代移动刚体，会破坏物理系统

#### 状态控制

| 方法             | 描述                   |
| -------------- | -------------------- |
| `Sleep()`      | 让刚体休眠（不再进行物理更新，除非唤醒） |
| `WakeUp()`     | 唤醒休眠的刚体              |
| `IsSleeping()` | 检查当前是否处于休眠状态         |


#### 速度与点速度获取

| 方法                                                | 描述              |
| ------------------------------------------------- | --------------- |
| `GetPointVelocity(Vector3 worldPoint)`            | 获取世界空间中某一点的实际速度 |
| `GetRelativePointVelocity(Vector3 relativePoint)` | 获取某个相对位置的速度（少用） |



### 状态检测与设置

| 方法 / 属性                    | 类型      | 说明               |
| -------------------------- | ------- | ---------------- |
| `IsSleeping()`             | `bool`  | 当前是否休眠           |
| `detectCollisions`         | `bool`  | 是否响应碰撞           |
| `maxDepenetrationVelocity` | `float` | 最大穿透修正速度（用于防止卡住） |
| `solverIterations`         | `int`   | 物理求解器迭代次数（越高越精准） |
| `sleepThreshold`           | `float` | 控制何时休眠           |


### 高级设置

| 属性 / 方法                 | 说明      |
| ----------------------- | ------- |
| `inertiaTensorRotation` | 惯性张量旋转  |
| `maxAngularVelocity`    | 最大角速度   |
| `centerOfMass`          | 自定义质心位置 |
| `ResetCenterOfMass()`   | 重置为默认质心 |
| `ResetInertiaTensor()`  | 重置惯性张量  |


### 与Collider配合相关
Rigidbody本身不处理碰撞细节，但需配合`Collider`组件才能参与物理交互

| 方法                                                                    | 说明               |
| --------------------------------------------------------------------- | ---------------- |
| `ClosestPointOnBounds(Vector3 position)`                              | 获取边界上最接近某点的位置    |
| `SweepTest(Vector3 direction, out RaycastHit hit, float maxDistance)` | 模拟刚体沿方向运动是否会撞到东西 |
| `SweepTestAll(...)`                                                   | 返回所有碰撞信息         |
| `GetRelativePointVelocity(Vector3 relativePoint)`                     | 获取某点相对速度         |
| `GetPointVelocity(Vector3 worldPoint)`                                | 获取世界空间下某点速度      |

**[Unity官方文档（Rigidbody）](https://docs.unity3d.com/ScriptReference/Rigidbody.html)**
