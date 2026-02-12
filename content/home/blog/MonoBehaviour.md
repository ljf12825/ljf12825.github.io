---
title: "MonoBehaviour"
date: 2025-06-01
categories: [Note]
tags: [Unity, Syntax, Class]
author: "ljf12825"
type: blog
summary: Unity buildin class MonoBehaviour
---
`MonoBehaviour`是Unity中最重要的基类之一，它是所有挂载到GameObject上的脚本的基础。每当在Unity编译器中创建也给C#脚本，并将其附加到一个GameObject时，这个脚本默认会继承`MonoBehaviour`

`MonoBehaviour`提供了一些非常强大的功能，尤其是在场景生命周期和事件处理方面

`MonoBehaviour`继承自`Behaviour`

## `Behaviour`
`Behaviour`继承自`Component`，是`MonoBehaviour`、`Renderer`、`Collider`等类的基类，它为所有脚本提供了一些通用的启用/禁用功能和调度机制

### API
**Properties**

| 属性 | 类型 | 描述 |
| - | - | - |
| `enabled` | `bool` | 决定了当前`Behaviour`是否启用，当启用时，该组件会响应更新（如`Update()`等声明周期方法），禁用则不会 |
| `isActiveAndEnable` | `bool` | 是一个只读属性，返回当前组件是否被启用并且它的GameObject也启用 |

**示例**  
`enable`用法
```cs
void Start()
{
    // 禁用这个脚本
    this.enabled = false;
}

void Update()
{
    if (this.enabled)
    {
        // 如果脚本启用，这部分代码才会执行
        Debug.Log("Script is enabled.");
    }
}
```
`enable`在继承时的行为  
如果你继承自`Behaviour`，并且禁用该组件，那么Unity会停止调用该组件的方法。但是，如果`Behaviour`的父类被禁用，你仍然可以控制`enable`属性来启用或禁用某些组件行为

#### 启用和禁用的实际应用
##### 控制游戏对象的行为
- 动态启用/禁用：你可以根据游戏的状态动态启用或禁用脚本、组件或整个GameObject  

例如在游戏中按下按钮时禁用某些功能或暂停某些操作
```cs
public class GameController : MonoBehaviour
{
    public GameObject player;

    void PauseGame()
    {
        // 禁用玩家脚本，暂停玩家控制
        player.GetComponent<PlayerController>().enabled = false;
    }

    void ResumeGame()
    {
        // 启用玩家脚本，恢复玩家控制
        player.GetComponent<PlayerController>().enabled = true;
    }
}
```

##### 控制物体动画与行为
- 暂停和恢复：在游戏中，可能会遇到暂停菜单时，禁用和启用某些脚本或动画

##### 控制物理行为
- 禁用物理计算：在某些情况下，你可能只希望在特定条件下启用物理计算

## `MonoBehaviour`
`MonoBehaviour`是Unity中最核心的类之一，它为游戏开发者提供了许多功能和特性，使得脚本能够与Unity引擎进行交互  
通过继承`MonoBehaviour`，可以让自定义类称为Unity组件，并使用Unity引擎提供的生命周期方法、事件处理、协程支持等功能

**`MonoBehaviour`会提供以下特性：**  

### 1.生命周期方法
`MonoBehaviour`提供了多个生命周期方法，让你能够在合适的时机执行代码。这些方法涵盖了Unity引擎中的许多重要事件，包括初始化、更新、碰撞检测等

[生命周期函数示意图](/images/Blog/monobehaviour_flowchart.svg)

#### 初始化阶段（只执行一次）

初始化阶段的生命周期函数是游戏对象创建并激活后、正式开始游戏逻辑之前自动调用的一系列函数，主要用于初始化变量、加载资源、设置状态等操作


| 函数名          | 调用时机         | 用途               | 特点|
| ------------ | ------------ | ---------------- |-|
| `Awake()`    | 脚本实例被 **加载** 后立刻调用（即使对象未启用也会调用） | 初始化数据、引用等（最早）    |初始化非依赖其他组件的逻辑 |
| `OnEnable()` | 对象启用时调用（**每次启用都会调用**） | 脚本激活可以多次触发       | 常用于注册事件 |
| `Start()`    | 所有对象的`Awake()`调用完后，在对象启用的第一帧调用一次 | 初始化逻辑，如加载资源、启动协程 | 初始化依赖其他组件/对象的逻辑 |

- `Awake()`
  - 在脚本实例被加载时调用（即使对象未激活）
  - 多个脚本中Awake的调用顺序是不确定的
  - 通常用于
    - 分配资源
    - 设置初始状态
    - 创建单例

- `OnEnable()`
  - 当对象或脚本被启用时调用
  - 会在每次启用时重复调用
  - 通常用于：
    - 注册事件
    - 启动协程
    - 绑定输入

- `Start()`
  - 在启用的组件第一帧更新前调用，且只调用一次
  - 所有`Awake()`执行完后才调用`Start()`
  - 通常用于
    - 获取其他组件
    - 设置UI、初始化依赖关系

#### 运行时循环阶段（重复执行）

| 函数名             | 调用频率            | 用途                          |
| --------------- | --------------- | --------------------------- |
| `FixedUpdate()` | 每固定时间（如 0.02 秒） | 物理计算、施加力、碰撞检测等              |
| `Update()`      | 每帧              | 常规逻辑、输入处理、状态更新              |
| `LateUpdate()`  | 每帧              | 摄像机追踪、骨骼动画等需要晚一点处理的逻辑       |
| `OnGUI()`       | 每帧多次            | IMGUI 绘图接口，用于旧 GUI 系统（已不推荐） |

##### 关于`Update()`
- 适合做需要实时响应和更新的逻辑，例如输入检测、动画控制、AI决策等

**在Update()中实现“时间无关”逻辑**
由于帧率变化，直接写逻辑会导致游戏表现不同步  
解决方法：
```csharp
void Update()
{
    float moveSpeed = 5f;
    transform.Translate(Vector3.forward * moveSpeed * Time.deltaTime);
}
```
- `Time.deltaTime`是上一帧到当前帧的时间差
- 乘以`deltaTime`可以保证无论帧率多少，运动速度都一样

**常见用法**
1.键盘输入控制移动

```csharp
void Update()
{
    float h = Input.GetAxis("Horizontal");
    float v = Input.GetAxis("Vertical");
    Vector3 dir = new Vector3(h, 0, v);
    transform.Translate(dir * 5f * Time.deltaTime);
}
```
2.每帧检测条件触发事件
```csharp
void Update()
{
    if (Input.GetKeyDown(KeyCode.Space)) Jump();
}
```

**性能注意事项**
- 频繁且复杂的操作放在`Update()`中会影响帧率
- 可以考虑
  - 减少`Update()`中的耗时计算
  - 合理使用事件驱动替代轮询
  - 利用`Coroutine`或`InvokeRepeating`控制调用频率
  - 对复杂逻辑分帧处理或异步处理

**当关闭或禁用脚本时，Update()不会被调用，当GameObejct被禁用时，所有附加脚本的Update()都停止调用**

#### 关于`LateUpdate()`
- 每帧调用一次，但始终在所有`Update()`函数调用之后调用
- 用于需要在所有`Update()`完成后再处理的逻辑

##### 典型用途
**1.摄像机跟随**
```csharp
public class FollowTarget : MonoBehaviour
{
    public Transform target;

    void LateUpdate()
    {
        if (target != null)
        {
            transform.position = target.position + new Vector3(0, 5, -10);
        }
    }
}
```
- 假设主角的位置在`Update()`中移动
- 如果摄像机在`Update()`中跟随，就会比角色“慢一帧”
- 用`LateUpdate()`可以确保摄像机总是跟着角色最终的位置

**2.骨骼/动画后处理**
- 动画系统也会在`Update()`后更新状态
- 用`LateUpdate()`来处理动画附属物的位置，如武器、特效等

**3.平滑插值（Smooth Follow）**
```csharp
void LateUpdate()
{
    transform.position = Vector3.Lerp(transform.position, target.position, Time.deltaTime * 5);
}
```
- 放在`LateUpdate()`可以让插值始终作用在最终位置上
> `LateUpdate()`是在每帧所有逻辑处理完之后调用的函数，适合做跟随、补偿、视觉同步、动画后处理等操作

#### 关于`FixedUpdate()`
- `FixedUpdate()`是MonoBehaviour提供的生命周期函数
- 以固定的时间间隔执行，默认每0.02s，而不是每帧执行一次
- 适用于物理引擎相关的逻辑（刚体、碰撞器、重力等）
- 使用`Time.fixedDeltaTime`进行时间控制
>`FixedUpdate()`不一定每帧都调用，也可能在一帧内被调用多次（为了补上落后时间）

##### 为什么物理逻辑必须放在`FixedUpdate()`
Unity的物理系统（Rigidbody、Collider等）是在物理引擎中执行的，它以固定步长（Fixed Timestep）计算模拟

如果你在`Update()`中对刚体施加力
```csharp
void Update()
{
    rb.AddForce(Vector3.forward);
}
```
- 每帧调用一次，但帧率变化会导致模拟不准确
- 如果FPS降低，你的物体就加速慢了

正确做法：
```csharp
void FixedUpdate()
{
    rb.AddForce(Vector3.forward);
}
```
- 固定时间模拟，物理表现就一致

##### 时间控制
默认情况下：
```plaintext
Time.fixedDeltaTime = 0.02f(每秒调用50次)
```
可以通过`Edit > Project Setting > Time`修改

**示例：让角色持续向前移动（基于物理）**
```csharp
Rigidbody rb;

void Start() => rb = GetComponent<Rigidbody>();

void FixedUpdate() => rb.MovePosition(rb.position + Vector3.forward * 5f * Time.fixedDeltaTime);
```
- 用`MovePosition()`更适合刚体控制
- `Time.fixedDeltaTime`保持匀速

**注意事项**
1.不要在`FixedUpdate()`中检测`Input.GetKey()`  
因为输入每帧更新，可能miss

2.与物理系统交互统一放在`FixedUpdate()`  
避免不一致和jitter

3.可能一帧内调用多次`FixedUpdate()`
这是为了追上物理时间进度

#### 碰撞/触发事件

发生在物理更新阶段（即`FixedUpdate()`阶段）之后调用，调用频率和FixedUpdate()一致，不受帧率的影响

**Rigidbody + Collider才能触发以下函数**

| 函数名                               | 用途     |
| --------------------------------- | ------ |
| `OnCollisionEnter(Collision col)` | 碰撞开始   |
| `OnCollisionStay(Collision col)`  | 碰撞持续   |
| `OnCollisionExit(Collision col)`  | 碰撞结束   |
| `OnTriggerEnter(Collider col)`    | 触发器进入  |
| `OnTriggerStay(Collider col)`     | 触发器内持续 |
| `OnTriggerExit(Collider col)`     | 触发器离开  |

[Unity物理系统](blog/Physics-System/)

#### 渲染阶段

| 阶段                                          | 用途           |
| ------------------------------------------- | ------------ |
| `OnPreRender()`                             | 摄像机开始渲染前     |
| `OnRenderObject()`                          | 所有对象渲染时      |
| `OnPostRender()`                            | 摄像机完成渲染后     |
| `OnWillRenderObject()`                      | 对象将被摄像机渲染前   |
| `OnDrawGizmos()` / `OnDrawGizmosSelected()` | 编辑器中画 Gizmos |

#### 禁用/销毁阶段

| 函数名           | 说明                                                 |
| ------------- | -------------------------------------------------- |
| `OnDisable()` | 脚本被禁用时调用（如 `enabled = false` 或 `SetActive(false)`） |
| `OnDestroy()` | 脚本被销毁前调用，用于释放资源、停止协程等                              |

#### 应用生命周期事件

| 函数名                              | 说明                 |
| -------------------------------- | ------------------ |
| `OnApplicationPause(bool pause)` | 应用暂停/恢复时调用（如手机切后台） |
| `OnApplicationFocus(bool focus)` | 是否获得焦点（如切到其他应用）    |
| `OnApplicationQuit()`            | 应用关闭前调用            |

## 自定义生命周期顺序
Unity默认调用顺序无法改变（例如A的Awake总在B前），但可以手动更改执行顺序

### 方法一：Inspector设置执行顺序
菜单栏：`Edit > Project Settings > Script Execution Order`  
把关键脚本设置为更早或更晚执行

### 方法二：代码显示调用（推荐）
```csharp
void Awake()
{
    manager = FindObjectOfType<GameManager>();
    manager.Register(this);
}
```

### 2.协程（Coroutine）
`MonoBehaviour`提供了对协程的支持，协程允许你在多个帧之间暂停执行某些代码，而不会阻塞主线程。使用协程，你可以轻松实现延迟、定时任务、动画过渡等功能
[Coroutine](blog/Unity-Asynchronous-and-Coroutine/)

### 3.输入处理
[Input-System](blog/Input-System/)

### 4.物理与碰撞
[Physics-System](blog/Physics-System/)

### 5.组件管理
可以使用`GetComponent`和`AddComponent`等方法来访问和控制其他组件。例如，获取物体的Rigidbody`组件或添加新的组件

```cs
Rigidbody rb = GetComponent<Rigidbody>(); // 获取组件
rb.AddForce(Vector3.up * 10f); // 应用力

// 动态添加组件
gameObject.AddComponent<BoxCollider>();
```

### 6.`MonoBehaviour`特性
- 附加到GameObject上：通过`MonoBehaviour`，你可以将脚本附加到GameObject上，从而使该GameObject拥有行为
- 可在Inspector中配置：`MonoBehaviour`的公共字段（如`public`变量）可以在Unity编辑器的Inspector面板中查看和修改
- 生命周期管理：提供了许多生命周期方法，如`Awake`、 `Start`、`Update`，以及与物理和碰撞相关的方法

### 7.其他功能
- 场景管理:[Scene-System](blog/Scene-System/)
- 日志输出：[Debug](blog/Debug/)
