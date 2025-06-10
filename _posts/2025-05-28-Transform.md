---
title: "Transform"
layout: single
date: 2025-05-28
categories: [笔记]
tags: [Unity, Unity Component]
author: "ljf12825"
---
Transform是Unity中控制物体位置、旋转、缩放和父子层级关系的核心组件

## 一、什么是Transform
`Transfrom`是每个`GameObject`都自带的核心组件，主要负责：  
- 位置（Position）
- 旋转（Rotation）
- 缩放（Scale）
- 父子关系（Hierarchy）

可以理解为每个物体在三维世界中的“坐标轴和局部空间信息”。

## 二、Transform的重要属性和区别

**1.`position`和`localPosition`

| 属性名 | 含义 | 示例用途 |
|-|-|-|
| `position` | 世界坐标（绝对位置） | 物体在整个场景中的位置 |
| `localPosition` | 本地坐标（相对于父物体的位置） | 子物体相对于父物体的偏移 |

**2.`rotation`和`localRotation`

| 属性名             | 含义       | 类型         |
| --------------- | -------- | ---------- |
| `rotation`      | 世界旋转     | Quaternion |
| `localRotation` | 相对父物体的旋转 | Quaternion |


```csharp
transform.rotation = Quaternion.Euler(0, 90, 0); //世界旋转
transform.localRotation = Quaternion.idetity; //本地旋转重置
```

**3.localScale**
- 表示对象自身的缩放
- 注意：缩放不会自动传递到`position`，但会影响渲染尺寸和碰撞盒

```csharp
transform.localScale = new Vector3(2, 2, 2); //放大两倍
```

## 三、父子层级结构*

**设置父物体**
```csharp
child.transform.parent = parent.transform;
//或
child.transform.SetParent(parent.transform);
```

**常见操作**
```csharp
Transform parent = transform.parent; //获取父对象
Transform child = transform.GetChild(0); //获取第一个子对象
int childCount = transform.childCount; //获取子对象数量
```
**使用本地坐标的原因**
当物体成为子对象时，使用`localPosition`更容易控制其相对于父对象的偏移，比如角色头部、武器挂点等

**为什么`Transform`可以决定父子结构？**
1.Unity中父子结构的本质
在Unity中，一个GameObject能成为另一个GameObject的子对象，本质上是通过Transform组件的嵌套结构来实现的
2.为什么`Transform`决定父子关系
因为GameObject的位置、旋转、缩放、层级关系都是由`Transform`控制的，而Unity场景树（Hierarchy）实际上就是一个`Transform`树

**举个例子**
```csharp
GameObject parent = new GameObject("Parent");
GameObject child = new GameObject("Child");

child.transform.parent = parent.transform;
```
这段代码不会修改该GameObject的本体，它只是把`Child`的`Transform`挂到了`Parent`的`Transform`上
- GameObject本身不存储层级结构，它只是一个容器
- Transform组件内部有：
  - `parent`：父级Transform
  - `childCount`：子级数量
  - `.GetChild(i)`：获取第i个子Transform
- 场景中任何层级结构，其实就是多个Transform组件互相引用的结果

## 四、Transform的重要方法
**移动（不考虑物理系统）**
```csharp
transform.Translate(Vector3.forward * Time.deltaTIme);
```
**旋转**
```csharp
tansform.Rotate(Vector3.up, 45);
```
**查找**
```csharp
Transform arm = transform.Find("Body/LeftArm");
```
**向某点转向（LookAt）**
```csharp
transform.LookAt(target.transform);
```

## 五、使用技巧与注意事项
**坐标转换**
- 世界坐标转本地坐标
```csharp
Vector3 local = transform.InverseTransformPoint(worldPos);
```
- 本地坐标转世界坐标
```csharp
Vector3 world = transform.TransformPoint(localPos);
```

**Transform的Property**

| 属性                 | 类型           | 说明                                        |
| ------------------ | ------------ | ----------------------------------------- |
| `position`         | `Vector3`    | 游戏对象在世界空间中的位置                             |
| `localPosition`    | `Vector3`    | 相对于父对象的本地位置                               |
| `rotation`         | `Quaternion` | 世界空间的旋转（四元数）                              |
| `localRotation`    | `Quaternion` | 相对于父对象的旋转                                 |
| `eulerAngles`      | `Vector3`    | 世界空间的欧拉角（角度制）                             |
| `localEulerAngles` | `Vector3`    | 本地空间的欧拉角                                  |
| `right`            | `Vector3`    | 对象的右方向（本地 X 轴）                            |
| `up`               | `Vector3`    | 对象的上方向（本地 Y 轴）                            |
| `forward`          | `Vector3`    | 对象的前方向（本地 Z 轴）                            |
| `localScale`       | `Vector3`    | 本地空间的缩放比例                                 |
| `parent`           | `Transform`  | 父对象的 Transform                            |
| `childCount`       | `int`        | 子对象数量                                     |
| `lossyScale`       | `Vector3`    | 世界空间中的实际缩放（包含父缩放影响）                       |
| `hasChanged`       | `bool`       | 表示 Transform 是否自上次检查后发生了变化（可以手动重置为 false） |
| `root`             | `Transform`  | 当前 Transform 层级中的最上层对（根）                 |

**Transform的Methods**

| 方法                                                           | 说明                |
| ------------------------------------------------------------ | ----------------- |
| `Translate(Vector3 translation, Space space = Space.Self)`   | 沿给定方向移动对象（默认本地坐标） |
| `Rotate(Vector3 eulerAngles, Space space = Space.Self)`      | 沿给定方向旋转对象         |
| `LookAt(Transform target)` 或 `LookAt(Vector3 worldPosition)` | 使对象面向目标           |
| `RotateAround(Vector3 point, Vector3 axis, float angle)`     | 绕某个点和轴旋转          |
| `TransformDirection(Vector3 localDirection)`                 | 将本地方向转换为世界方向      |
| `InverseTransformDirection(Vector3 worldDirection)`          | 将世界方向转换为本地方向      |
| `TransformPoint(Vector3 localPosition)`                      | 本地坐标转世界坐标         |
| `InverseTransformPoint(Vector3 worldPosition)`               | 世界坐标转本地坐标         |
| `DetachChildren()`                                           | 解除所有子对象的父子关系      |

**层级操作与结构**

| 方法                                                     | 说明                                 |
| ------------------------------------------------------ | ---------------------------------- |
| `SetParent(Transform parent)`                          | 设置父对象                              |
| `SetParent(Transform parent, bool worldPositionStays)` | 设置父对象，同时控制是否保持世界坐标不变               |
| `GetChild(int index)`                                  | 获取指定索引的子 Transform                 |
| `Find(string name)`                                    | 查找名字为 name 的子物体（递归）                |
| `IsChildOf(Transform parent)`                          | 判断当前 Transform 是否是某父 Transform 的子级 |
| `SetAsFirstSibling()`                                  | 将当前对象设置为父对象的第一个子对象                 |
| `SetAsLastSibling()`                                   | 设置为最后一个子对象                         |
| `SetSiblingIndex(int index)`                           | 设置在父 Transform 下的子对象索引             |
| `GetSiblingIndex()`                                    | 获取在父 Transform 下的索引位置              |

**详见[Unity官方文档(Transform)](https://docs.unity3d.com/ScriptReference/Transform.html)**

## 常见组合用法示例
**1.移动并保持世界坐标**
```csharp
child.SetParent(parent, false);
```
**2.朝向某一点**
```csharp
transform.LookAt(new Vector3(0, 0, 0));
```
**3.自转与公转**
```csharp
//公转
transform.RotateAround(center.position, Vector3.up, 20 * Time.deltaTIme);
//自转
transform.Rotate(Vector3.up * 45 * Time.deltaTime);
```
**4.查找指定子物体并设置缩放**
```csharp
Transform gun = transform.Find("Body/Hand/Gun");
gun.localScale = Vector3.one * 2f;
```

## 容易混淆的几个方法说明

| 方法/属性                        | 注意点                                         |
| ---------------------------- | ------------------------------------------- |
| `rotation.eulerAngles = ...` | 实际无效，应该用 `rotation = Quaternion.Euler(...)` |
| `position += ...`            | 本质上是设置绝对世界位置                                |
| `Translate(...)`             | 默认是相对于自身坐标系移动                               |
| `LookAt()`                   | 会修改 rotation，旋转 Z 轴正方向指向目标                  |
| `TransformDirection()`       | 是方向转换，不是位置转换！比如方向向量 `(0, 0, 1)` 表示前方        |

