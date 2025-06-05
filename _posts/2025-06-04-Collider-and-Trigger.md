---
title: "Collider & Trigger"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity Component, Physics System]
author: "ljf12825"
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
![BoxColliderPanel](/assets/images/BoxColliderPanel.jpg)
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
![CapsuleColliderPanel](/assets/images/CapsuleColliderPanel.jpg)
- Edit Collider
  显示Collider边界  
  Hold Alt after clicking control handle to pin center in place（中心缩放） 
  Hold Shift after clicking control handle to scale uniformly（等比缩放）  
- Direction
  The axis of the capsule's lengthwise orientation in the GameObject's local space



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