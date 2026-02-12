---
title: "Collider & Trigger"
date: 2025-06-01
categories: [Note]
tags: [Unity, Component, Physics System]
author: "ljf12825"
type: blog
summary: Collider's core functions, categories, Inspector panel parameters, code API, alignment methods, and Trigger application scenarios in Unity
---
Unity中的碰撞体是物理系统的重要组成部分，负责定义游戏对象的形状以进行碰撞检测。简单来说，Collider是一个无形的边界，用于检测物体是否接触或重叠，从而触发碰撞事件和物理响应  

## 什么是Collider
Collider是附加在游戏对象上的组件，用于告诉物理引擎这个对象的碰撞范围。Collider本身不会渲染形状，只是一个隐形的物理边界

## 常见的Collider类型
- BoxCollider  
  立方体形状的碰撞体，适合方形或长方体物体
- SphereCollider
  球形碰撞体，适合球形或圆形物体
- CapsuleCollider
  胶囊碰撞体，适合人物、柱子等
- MeshCollider
  使用自定义网格模型做碰撞体，适合复杂形状，性能较差，且通常用于静态物体
- WheelCollider
  专门用于车辆轮胎的碰撞和物理模拟

## Collider和Rigidbody的关系
- Collider只负责检测碰撞，不会自定产生物理运动
- Rigidbody组件负责物理运动和动力学
- 一个没有Rigidbody的物体的Collider会被当作“静态碰撞体”使用（静态障碍物），不会移动也不响应物理力
- 一个有Rigidbody的物体可以在物理引擎驱动下移动，Collider会随物体运动

## Collider Panel
### Box Collider
![BoxColliderPanel](/images/Blog/BoxColliderPanel.jpg)
- IsTrigger
  默认false，此时Collider是实体碰撞体，会阻挡其他物体，发生物理碰撞和反弹  
  勾选时，Collider变成Trigger，不会阻挡其他物体，但会检测进入、离开和停留事件，可以用来做区域检测、事件触发等
- Provides Contacts
  用于物理引擎的碰撞检测和接触点信息提供  
  默认false，Collider可能只报告碰撞发生，但不提供详细的接触点信息，这样可以节省一些计算资源  
  勾选后，Collider会提供详细的碰撞接触点信息，这样物理引擎在碰撞时，可以把碰撞的具体接触点信息暴露出来，供脚本或物理系统使用  
  ```csharp
  using UnityEngine;

  public class CollisionPointExample : MonoBehaviour
  {
    void OnCollisionEnter(Collision collision)
    {
      foreach (ContactPoint contact in collision.contacts)
      {
        //接触点位置
        Vector3 contactPoint = contact.point;
        //接触点法线方向
        Vector3 contactNormal = contact.normal;

        Debug.Log($"{contactPoint}, {contactNormal}");
      }
    }
  }
  ```
  如果时触发碰撞，IsTrigger勾选情况下，用的是OnTriggerEnter(Collider other)，这个回调中没有接触点信息，只能检测触发
- Material
  指的是Physics Material，用于控制物理行为的材质  
  Create -> Physics Material，编辑后拖入使用  
  作用：Physics Material用于定义物体在碰撞时的物理特性，比如摩擦力（Friction）、弹性（Bounciness）
  常用属性  
  - Dynamic Friction 动摩擦力
  - Static Friction 静摩擦力
  - Bounciness 弹力（0到1之间，1表示完全反弹）
  - Friction Combine 摩擦组合方式（与另一个碰撞体交互时如何合成摩擦）
  - Bounce Combine 弹性组合方式（与另一个碰撞体交互时如何合成弹性）
- Center
  - 指的是碰撞体在物体局部坐标系中的中心点位置
  - 类型是Vector3
  - 不会移动GameObject本身，只会改变碰撞体的位置
- Size
  - 指碰撞体的尺寸
  - 类型是Vector3
  - 控制这个碰撞盒子的大小
- Layer Overrides
  - Layer Override Priority
    用于控制多个Collider在同一物体或子物体上时，哪个Collider的物理层优先生效  
    如果一个物体上有多个Collider，并且它们分别设置了不同的Layer，Unity需要一个优先级来判断最终物体的碰撞行为应该归属哪个Layer  
    When 2 Colliders have conflicting overrides, the settings of the collider with the higher priority are taken  
  - Include Layers
    Layers to include when producing collisions
  - Exclude Layers
    Layers to exclude when producing collisions

### CapsuleCollider
![CapsuleColliderPanel](/images/Blog/CapsuleColliderPanel.jpg)
- Edit Collider
  显示Collider边界  
  Hold Alt after clicking control handle to pin center in place（中心缩放） 
  Hold Shift after clicking control handle to scale uniformly（等比缩放）  
- Direction
  The axis of the capsule's lengthwise orientation in the GameObject's local space

### MeshCollider
![MeshColliderPanel](/images/Blog/MeshColliderPanel.jpg)
`MeshCollider`是Unity提供的一个基于Mesh的碰撞体组件，它允许你使用一个Mesh的集合外形作为碰撞体检测的形状  
它可以让你的碰撞体检测看起来和你的物体一样精细  

- Convex
  是否把Mesh处理为凸包  
  如果勾选了：
    - 可以用于动态刚体
    - 可以用作Trigger
    - 不能太复杂（最多255个三角形）
    
  如果不勾选：  
    - 可精确表示复杂网格，但只能用于静态物体
    - 不支持Trigger和Rigidbody
  
**MeshCollider Convex使用注意事项**

| 场景                | 是否适合用 MeshCollider             |
| ----------------- | ------------------------------ |
| 地形、建筑（静态）         |  非 Convex MeshCollider        |
| 可交互物体 + Rigidbody |  Convex MeshCollider          |
| 复杂模型 + Trigger    |  Convex MeshCollider（前提是够简单）  |
| 移动物体 + 非 Convex   |  不支持，会报错                      |
| 高性能要求的游戏          |  尽量少用 MeshCollider，建议用简化碰撞体代替 |

- Cooking Options
  用于控制在碰撞体生成（或烘焙）过程中如何处理网格数据，以提高碰撞效率或调试准确性  
  Unity在运行时将网格数据转换为物理引擎能使用的碰撞形式格式，这个过程叫做Mesh Cooking

### Terrian Collider
- Enable Tree Colliders
  When selected, Tree Colliders will be enabled

### Wheel Collider
![WheelColliderPanel](/images/Blog/WheelColliderPanel.jpg)
- Wheel Damping Rate
  轮阻，轮子滚动时的摩擦衰减速度
- Suspension Distance
  悬挂行程，表示悬挂系统允许轮子从默认位置向下延伸的最大距离，单位是米
- Force App Point Distance
  力施加点距离，控制Unity向车体施加力的位置，距离轮子中心的垂直距离，单位是米；可以理解为手推玩具车的高度
- Suspension Spring
  用于模拟汽车的避震器（弹簧 + 阻尼）
  - Spring
    弹簧刚度，越大越硬
  - Damper
    阻尼，阻止弹簧震荡的速度，越大越稳定
  - Target Position
    悬挂初始压缩程度，0表示全伸展，1表示全压缩
- Forward Friction & Sideways Friction
  控制轮子在前进方向/侧向的摩擦行为
  `Forward Friction`：控制加速、刹车的打滑程度
  `Sideways Friction`：控制漂移、转弯时的打滑程度
  - Extremum Slip
    轮胎开始打滑时的滑动值阈值
  - Extremum Value
    极限摩擦力值（未打滑前）
  - Asymptote Slip
    完全失控打滑时的滑动值阈值
  - Asymptote Value
    极限打滑摩擦力值
  - Stiffness
    总体摩擦刚度系数（0-1）。调节摩擦强度的“乘法器”
**Wheel Collider API**
- Motor Torque
  通过代码向轮子添加驱动力（加速）
```csharp
wheelCollider.motorTorque = 200f;
```

- Brake Torque
  刹车力
```csharp
wheelCollider.brakeTorque = 500f;
```

- Steer Angle
  控制论在（尤其是前轮）的转向角度
```csharp
wheelCollider.steerAngle = 30f;
```
**使用WheelCollider**

在车体下放置空 GameObject，添加 `WheelCollider`。

设置合适的 `Radius` 和 `Suspension`。

使用一个轮胎模型作为视觉轮子（但它自己不加 Collider）。

每帧用代码同步 `WheelCollider.GetWorldPose()` 更新轮胎模型位置旋转。

用 `motorTorque`、`brakeTorque`、`steerAngle` 控制车轮。

**示例：同步轮子模型**
```csharp
public WheelCollider wheelCollider;
public Transform wheelModel;

void Update()
{
  Vector3 pos;
  Quaternion rot;
  wheelCollider.GetWorldPose(out pos, out rot);
  wheelModel.position = pos;
  wheelModel.rotation = rot;
}
```

## 对齐Collider和GameObject
要保证Collider与GameObject完全重合，要让Collider的Center对准模型的中心，并让他的Size或Radius匹配模型的尺寸

### 方法一：使用Mesh Renderer的Bounds手动对齐
1.选中GameObject  
2.查看Inspector面板中的Mesh Renderer或Mesh Filter：
  - 记下它的Bounds和Center

3.在Collider中手动设置

### 方法二：使用Unity自动对齐
在Inspector面板中，点击组件右上角的菜单->`Reset`  
或删除后重新添加Box Collider，Unity会自动用Mesh尺寸初始化
>注意：自动添加只对Unity支持的标志Mesh效果好，对导入模型FBX有时不准确

### 方法三：通过脚本自动匹配Mesh Bounds
```csharp
using UnityEngine;

[RequireComponent(typeof(BoxCollider))]
public class FitColliderToMesh : MonoBehaviour
{
  void Start()
  {
    var mesh = GetComponent<MeshFilter>().sharedMesh;
    var bounds = mesh.bounds;

    var collider = GetComponent<BoxCollider>();
    collider.center = bounds.center;
    collider.size = bounds.size;
  }
}
```
注意：`mesh.bounds`是局部坐标系下的范围  
如果模型被缩放，需要做缩放修正

### 检查是否重合的方法
1.Gizmo显示：Scene视图中选中物体，勾选Gizmo，可以看到Collider的框是否保住模型  
2.调试代码验证接触：你可以在运行是打印`Collider.contacts[0].point`看碰撞点位置是否符合预期  
3.把Mesh设成透明或关闭渲染，观察Collider是否贴合  

### Collider基类 API
**常用属性**

| 属性名                 | 说明                             |
| ------------------- | ------------------------------ |
| `enabled`           | 是否启用该碰撞体，禁用后不参与碰撞检测。           |
| `isTrigger`         | 是否作为触发器（Trigger），开启后不阻挡，只触发事件。 |
| `attachedRigidbody` | 关联的 Rigidbody 组件（如果有的话）。       |
| `bounds`            | 碰撞体的世界轴对齐包围盒（`Bounds` 类型）。     |
| `sharedMaterial`    | 物理材质，控制摩擦力和弹力。                 |
| `material`          | 碰撞体当前使用的物理材质实例。                |
| `contactOffset`     | 碰撞体接触判定的偏移距离，影响物理碰撞的灵敏度。       |


**常用方法**

| 方法名                                                           | 说明                                                   |
| ------------------------------------------------------------- | ---------------------------------------------------- |
| `ClosestPoint(Vector3 position)`                              | 返回碰撞体表面上距离指定点最近的点。                                   |
| `Raycast(Ray ray, out RaycastHit hitInfo, float maxDistance)` | 以射线检测碰撞体是否被击中，返回击中信息。                                |
| `GetComponent<T>()`                                           | 获取挂载在同一GameObject上的组件（Collider继承自Component，所以可用此方法）。 |
| `OnCollisionEnter/OnTriggerEnter`                             | 物理事件回调，不是Collider自带的方法，但Collider触发时会调用对应脚本方法。        |

**事件相关**  
Collider本身没有事件接口，但它的物理交互会调用以下MonoBehaviour的回调方法

| 事件名                                     | 触发条件  |
| --------------------------------------- | ----- |
| `OnCollisionEnter(Collision collision)` | 碰撞开始  |
| `OnCollisionStay(Collision collision)`  | 碰撞持续  |
| `OnCollisionExit(Collision collision)`  | 碰撞结束  |
| `OnTriggerEnter(Collider other)`        | 触发器进入 |
| `OnTriggerStay(Collider other)`         | 触发器持续 |
| `OnTriggerExit(Collider other)`         | 触发器离开 |


## 什么是Trigger
Trigger是Collider组件的一个特殊状态，用来检测物体的进入、停留和离开事件，但不会产生物理碰撞和响应  
Trigger是Collider的感应区域模式  

### Trigger应用场景
- 检测角色进入某个区域（陷阱、传送门、对话触发区）
- 收集物品（进入物品碰撞区域后触发拾取）
- 触发游戏事件（比如开门、启动机关）
- 检测敌人视野范围

### 注意事项
- 触发器本身不会组织物体移动，物体可以自由穿过
- 要保证触发事件能被调用，涉及的GameObject至少一个带有Collider（且其中至少一个是Trigger）和Rigidbody组件，一般建议被检测的物体带Rigidbody
- 如果两个物体都没有Rigidbody，触发事件不会发生

**本模块仅讲Collider作为组件的使用，详细物理系统请参照：**  
[Physics System](blog/Physics-System/)
