---
title: "GameObject"
layout: single
date: 2025-05-28
categories: [笔记]
tags: [Unity]
author: "ljf12825"
---
在 Unity 中，GameObject 是游戏中所有对象的基础实体。可以理解为 Unity 世界中一切可见或不可见物体的“容器”，它本身没有实际行为或外观，而是通过添加各种组件（Component）来赋予其功能。

## 一、GameObject的核心概念
- 它是Unity中一切实体的基础类
- 没有组件的GameObject是一个空物体
- 所有可见（如角色、道具、地形）或不可见（如相机、灯光、空容器）的对象，都是GameObject或其派生

## 二、GameObject的结构与组成
一个GameObject至少包含一个组件：Transform

**1.必备组件：Transform**
- 控制GameObject的位置、旋转、缩放
- 组成了Unity的场景层级结构（父子关系）
- 所有GameObject都必须有Transform，不能移除

```csharp 
transform.position = new Vector3(0, 1, 0);
transform.Rotate(Vector3.up, 90);
```

**2.常见组件**

| 组件 | 作用 |
|-|-|
| `MeshRenderer` | 渲染模型表面 |
| `Collider`     | 物理碰撞检测 |
| `Rigidbody`    | 让 GameObject 参与物理计算 |
| `Animator`     | 控制动画状态机 |
| `AudioSource`  | 播放声音 |
| `Camera`       | 摄像头视角 |
| `Light`        | 光源 |
| 自定义脚本          | 实现逻辑行为（继承自 `MonoBehaviour`） |

**3.添加组件方式**
- 在Inspector面板中点击"Add Component"
- 代码中：
```csharp
gameObject.AddComponent<ComponentName>();
```

## 三、GameObject生命周期
生命周期由脚本组件（MonoBehaviour）控制

## 四、GameObject常用操作

**1.创建与销毁**

```csharp
GameObject obj = new GameObject("MyObject"); // Create Empty Object
Destroy(obj);
```

**2.获取组件**

```csharp
ComponentName varname = GetComponent<CompoenentName>();
```

**3.控制启用状态**

```csharp
gameObject.SetActive(false);
someObj.SetActive(true);
```

**4.层级控制**

```csharp
childObj.transform.parent = parentObj.transform; //设置父子关系
```

## 五、GameObject与Prefab的关系
- Prefab是GameObject的模板，可以复用
- 你可以在场景中从一个Prefab实例化多个GameObject
```csharp
Instantiate(prefabObject, position, rotation);
```

## 示例：创建一个带物理的球体对象

```csharp
void CreateBall()
{
    GameObject ball = GameObject.CreatePrimitive(PrimitiveType.Sphere);
    ball.transform.position = new Vector(0, 10, 0);
    ball.AddComponent<Rigidbody>();
}
```