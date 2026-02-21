---
title: "GameObject"
date: 2025-05-28
categories: [Engine]
tags: [Unity, GameObject]
author: "ljf12825"
type: log
summary: GameObject introduction, usage and API
---
GameObject继承自Object，是所有可以存在于场景中的物体的基类

可以理解为 Unity 世界中一切可见或不可见物体的“容器”，它本身没有实际行为或外观，而是通过添加各种组件（Component）来赋予其功能。

## 一、GameObject的核心概念
- 它是Unity中一切实体的基础类
- 没有组件的GameObject是一个空物体
- 所有可见（如角色、道具、地形）或不可见（如相机、灯光、空容器）的对象，都是GameObject或其派生

![GameObjectinInspector](/images/content/GameObjectinInspector.jpg)

### Active status
默认是激活状态，可以手动设置为非激活状态，在非激活状态下，GameObject会变得不可见，不会接收任何的回调或事件

可以通过`GameObject.SetActive`设置

### Static status
Unity的某些系统（例如全局照明、遮挡、批处理、导航和反射探针）依赖于GameObject的静态状态，可以使用`GameObjectUtility.SetStaticEditorFlags`来控制Unity的哪些系统将GameObject视为静态的

### Tag and Layer
[Tag](log/Tag/)

[Layer](log/Layer)

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
## API
**Properties**

| 属性                    | 类型               | 描述                                           |
| --------------------- | ---------------- | -------------------------------------------- |
| `activeInHierarchy` | `bool` (只读)      | 当前对象是否**在场景中激活**（包括父对象也必须激活）                 |
| `activeSelf`        | `bool` (只读)      | 当前对象自身的激活状态（不考虑父对象）                          |
| `isStatic`          | `bool`           | 是否标记为**静态对象**，用于静态合批、光照贴图等优化                 |
| `layer`             | `int`            | 当前对象所属的**层（Layer）**，用于摄像机渲染、物理碰撞等            |
| `scene`             | `Scene`          | 当前 GameObject 所在的**场景（Scene）**               |
| `sceneCullingMask`  | `ulong` (只读)     | 对象的**视锥剔除掩码**，通常用于内部渲染优化                     |
| `tag`               | `string`         | 对象的**标签（Tag）**，用于查找和分类管理                     |
| `transform`         | `Transform` (只读) | GameObject 所关联的**Transform 组件**，用于位置、旋转、缩放控制 |

**Constructors**

| 构造器 | 描述 |
| - | - |
| `GameObject()` | 创建一个新的GameObject |
| `GameObject(string name)` | 具名 |
| `GameObject(string name, params Type[] components)` | 组件列表 |

```cs
GameObject go = new GameObject("go", typeof(Rigidbody), typeof(BoxCollider));
```

**Public Methods**

| 方法名                                      | 描述                            |
| ---------------------------------------- | ----------------------------- |
| `AddComponent<T>()`                      | 向当前 GameObject 添加指定类型的组件      |
| `GetComponent<T>()`                      | 获取当前 GameObject 上的第一个指定类型组件   |
| `TryGetComponent<T>(out T component)`    | 安全尝试获取指定类型的组件（不抛出异常）          |
| `GetComponents<T>()`                     | 获取当前 GameObject 上所有指定类型组件（数组） |
| `GetComponentInChildren<T>()`            | 获取当前或子物体上的第一个指定类型组件           |
| `GetComponentsInChildren<T>()`           | 获取当前及所有子物体上的所有指定类型组件          |
| `GetComponentInParent<T>()`              | 获取当前或父物体上的第一个指定类型组件           |
| `GetComponentsInParent<T>()`             | 获取当前及所有父物体上的所有指定类型组件          |
| `GetComponentAtIndex(int index)`         | 获取组件数组中指定索引位置的组件              |
| `GetComponentCount()`                    | 获取当前 GameObject 上组件的总数        |
| `GetComponentIndex(Component component)` | 获取指定组件在组件数组中的索引               |
| `SendMessage(string methodName)`         | 调用当前 GameObject 上所有脚本中的指定方法   |
| `BroadcastMessage(string methodName)`    | 向当前 GameObject 及其所有子物体广播调用方法  |
| `SendMessageUpwards(string methodName)`  | 向当前 GameObject 及其所有父物体广播调用方法  |
| `SetActive(bool value)`                  | 启用或禁用当前 GameObject（仅影响自身）     |
| `CompareTag(string tag)`                 | 检查当前 GameObject 是否具有指定标签      |

**Static Methods**

| 方法名                                                                                                                   | 描述                                                                         |
| --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `CreatePrimitive(PrimitiveType type)`                                                                                 | 创建一个具有网格渲染器和适当碰撞体的基础类型物体（如 Cube、Sphere 等）                                  |
| `Find(string name)`                                                                                                   | 根据名称查找并返回场景中第一个匹配的激活的 `GameObject`                                         |
| `FindGameObjectsWithTag(string tag)`                                                                                  | 返回所有具有指定标签的激活 `GameObject` 数组；无匹配则返回空数组                                    |
| `FindWithTag(string tag)`                                                                                             | 返回第一个具有指定标签的激活 `GameObject`；无匹配则返回 `null`                                  |
| `GetScene(int instanceID)`                                                                                            | 获取包含指定实例 ID 的 `GameObject` 所在的场景                                           |
| `InstantiateGameObjects(GameObject prefab, int count, NativeArray<int> outIDs, NativeArray<Transform> outTransforms)` | 批量实例化指定数量的 `GameObject`，并用 `NativeArray` 返回它们的 ID 和 Transform（通常用于 Job 系统） |
| `SetGameObjectsActive(NativeArray<int> instanceIDs, bool active)`                                                     | 批量设置多个通过实例 ID 标识的 `GameObject` 的激活状态                                       |



**[Unity官方文档（GameObject）](https://docs.unity3d.com/2022.3/Documentation/ScriptReference/GameObject.html)**

## 示例
### 添加和移除组件
可以在运行时添加和移除组件，这在动态创建GameObject或修改GameObject行为时非常有用，可以在脚本中使用`enable`和`disable`启用和禁用组件

添加组件最好的方式是使用`AddComponent<Type>`，如下所示。移除组件必须对组件本身使用`Object.Destroy`方法

### 获取组件

```cs
void Start() => Rigidbody rb = GetComponent<Rigidbody>();
```
获取组件实例的引用后，可以设置值和调用方法
```cs
void Start()
{
    Rigidbody rb = GetComponent<Rigidbody>();

    rb.mass = 10f;
    rb.AddForce(Vector3.up * 10f);
}
```
一个GameObject可以挂载多个自定义脚本组件，它们之间可以通过`GetComponent`相互访问，如果GameObject上没有这个组件，返回null

### 获取其他GameObject上的组件
```cs
public class Chef : MonoBehaviour
{
    public GameObject stove;

    void Start()
    {
        transform.position = stove.transform.position + Vector3.forward * 2f;
    }
}
```
如果只需要使用组件功能，建议直接声明组件，减少调用链，面向组件编程（推荐）

### 查找子GameObject
如果一个场景中存在多个相同类型的对象与其手动一个个挂引用，不如通过父子结构统一管理，这是更灵活、自动化的方式

将同类对象放到一个父GameObject下，然后通过父物体的`Transform`来访问它们所有的子物体，从而动态获取并管理它们

比如有多个路径点：
```scss
Waypoints（父物体）
|—— Waypoint1
|—— Waypoint2
|—— Waypoint3
```
不需要在代码中这样声明
```cs
public GameObject waypoint1;
public GameObject waypoint2;
public GameObject waypoint3;
```
很不方便，可以这样做：
```cs
public class PathManager : MonoBehaviour
{
    public Transform waypointsParent; // 拖入Waypoints父物体

    private Transform[] waypoints;

    void Start()
    {
        // 获取所有子物体
        int count = waypointsParent.childCount;
        waypoints = new Transform[count];

        for (int i = 0; i < count; ++i)
            waypoints[i] = waypointsParent.GetChild(i);
    }

    void Update()
    {
        // 示例：绘制所有路点
        foreach (Transform wp in waypoints)
        {
            Debug.DrawLine(wp.position, wp.position + Vector3.up * 2, Color.green);
        }
    }
}
```
这样做的优点：
- 无需手动添加引用，添加新的子物体会自动被脚本识别
- 防止丢失引用，删除物体不会引发脚本错误（可做空判断）
- 更清晰的场景结构，所有相关对象集中管理
- 代码更简洁

### 通过Tag或Name查找GameObject

```cs
GameObject player;

void Start() => player = GameObject.Find("MainHeroCharacter");
```

```cs
GameObject chef;
GameObject[] stoves;

void Start()
{
    chef = GameObject.FindWithTag("Chef");
    stoves = GameObject.FindGameObjectsWithTag("Stove");
}
```

### 创建和销毁对象

```cs
GameObject obj = new GameObject("MyNewObject"); // 具名，只有Transform组件
obj.AddComponent<Rigidbody>();
obj.AddComponent<BoxCollider>();
```

从预制体Prefab创建
```cs
public GameObject enemyPrefab; // 拖入预制体
void SpawnEnemy()
{
    GameObject enemy = Instantiate(enemyPrefab, new Vector3(0, 0, 0), Quaternion.identity);
}
```

将子物体挂在其他物体下
```cs
GameObject child = new GameObject("Child");
child.transform.parent = parentTransform;
```
或
```cs
child.transform.SetParent(parentTransform, worldPositionStays: false);
```


