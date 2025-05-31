---
title: "GameObject"
layout: single
date: 2025-05-28
categories: [笔记]
tags: [Unity, GameObject]
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

**GameObject的属性和方法**

- GameObject常用属性

| 属性                  | 类型          | 说明                                     |
| ------------------- | ----------- | -------------------------------------- |
| `name`              | `string`    | 游戏对象的名称                                |
| `tag`               | `string`    | 标签，用于分类和查找                             |
| `layer`             | `int`       | 层，用于渲染、碰撞等                             |
| `activeSelf`        | `bool`      | 当前对象是否激活（自身状态）                         |
| `activeInHierarchy` | `bool`      | 当前对象在层级中是否激活（受父级影响）                    |
| `transform`         | `Transform` | 对象的位置/旋转/缩放组件（固定存在）                    |
| `scene`             | `Scene`     | 当前对象所在的场景（UnityEngine.SceneManagement） |

- GameObject常用方法

| 方法                               | 说明              |
| -------------------------------- | --------------- |
| `AddComponent<T>()`              | 添加组件            |
| `GetComponent<T>()`              | 获取组件            |
| `GetComponentInChildren<T>()`    | 从子对象中获取组件       |
| `GetComponentInParent<T>()`      | 从父对象中获取组件       |
| `TryGetComponent<T>(out T comp)` | 安全地获取组件，不抛出异常   |
| `GetComponents<T>()`             | 获取所有类型为 T 的组件数组 |
| `GetComponentsInChildren<T>()`   | 获取所有子物体上的该组件    |


- 激活与状态控制

| 方法                              | 说明                 |
| ------------------------------- | ------------------ |
| `SetActive(bool)`               | 设置是否激活（自己及子物体是否运行） |
| `CompareTag(string)`            | 比较标签               |
| `FindGameObjectWithTag(string)` | 通过标签查找（不推荐频繁使用）    |

- 创建与销毁

| 方法                   | 说明                 |
| -------------------- | ------------------ |
| `Instantiate()`      | 创建一个 GameObject 实例 |
| `Destroy()`          | 销毁一个对象             |
| `DestroyImmediate()` | 立即销毁（编辑器用）         |


- 查找对象（不推荐频繁使用）

| 方法                                              | 说明              |
| ----------------------------------------------- | --------------- |
| `GameObject.Find(string name)`                  | 通过名字查找对象        |
| `GameObject.FindWithTag(string tag)`            | 通过标签查找第一个匹配对象   |
| `GameObject.FindGameObjectsWithTag(string tag)` | 找到所有标签为 tag 的对象 |

**⚠注意：Find()、FindWithTag()效率低，建议缓存引用或用Inspector绑定引用**

- GameObject静态方法

| 方法                                              | 说明                     |
| ----------------------------------------------- | ---------------------- |
| `CreatePrimitive(PrimitiveType type)`           | 创建基本图形体（如 Cube、Sphere） |
| `GameObject.Find(string name)`                  | 查找场景中某个名字的对象           |
| `GameObject.FindWithTag(string tag)`            | 查找场景中某个标签的对象           |
| `GameObject.FindGameObjectsWithTag(string tag)` | 查找所有拥有某个标签的对象          |

**[Unity官方文档（GameObject）](https://docs.unity3d.com/2022.3/Documentation/ScriptReference/GameObject.html)**

## 示例
**1.动态创建一个Cube，并添加刚体**
```csharp
GameObject cube = GameObject.CentePrimitive(PrimitiveType.Cube);
cube.AddComponenet<Rigidbody>();
cube.name = "FallingCube";
```

**2.启用/禁用对象**
```csharp
gameObject.SetActive(false);
if (!gameObject.activeSelf) Debug.Log("我被禁用了");
```

**3.查找并修改子对象**
```csharp
Transform arm = transform.Find("Body/RightArm");
arm.gameObject.SetActive(true);
```

**4.组件缓存写法（性能优化）**
```csharp
private MeshRenderer renderer;

void Awake() => renderer = GetComponenet<MeshRenderer>(); //只查一次
```
