---
title: EDA(Event Driven Architecture)
type: lab
status: active # active/archived/dead/unstable/suspended
summary: Implement EDA in Unity
date: 2025-12-31
repo: https://www.cctv.com/
---

```text
Event -> Event Communication -> Event Bus -> EDA
```

- EDA的实现

# 委托与事件
Unity中的事件和委托机制是基于C#的语言特性实现的，用于对象之间的解耦通信。它们是实现观察者模式的核心方式，常用于UI更新、角色状态变化、触发器反应等场景

## 委托（Delegate）
委托是对函数的引用，可以把方法当作变量一样传递，就是C++中的函数指针
```cs
public delegate void MyDelegate(string message); // 声明一个委托类型

public class Test
{
    public static void PrintMessage(string msg) => Debug.Log(msg);

    public void UseDelegate()
    {
        MyDelegate del = PrintMessage; // 赋值
        dle("Hello Delegate!"); // 调用
    }
}
```
相当于
```cpp
// 函数指针
void (*func)(string) = &PrintMessage;
```

## 事件（Event）
事件基于委托，是一种特殊的委托类型，但添加了访问限制，只能在声明它的类内部调用，允许其他对象订阅并响应某个特定的行为或状态变化

通常用于对象之间的通信，避免了直接调用，使代码更具解耦性

### 基本使用
在Unity中，可以使用C#的`event`关键字来声明一个事件。事件的订阅和触发通常会在组件之间完成
```cs
// 定义事件的委托类型
public delegate void PlayerScored(int score);

public class GameManager : MonoBehaviour
{
    // 声明一个事件
    public event PlayerScored OnPlayerScored;

    public void PlayerScore(int score)
    {
        // 触发事件
        OnPlayerScored?.Invoke(score);
    }
}

public class UIManager : MonoBehaviour
{
    public GameManager gameManager;

    private void OnEnable()
    {
        // 订阅事件
        gameManager.OnPlayerScored += UpdateScoreDisplay;
    }

    private void OnDisable()
    {
        // 取消订阅
        gameManager.OnPlayerScored -= UpdateScoreDisplay;
    }

    void UpdateScoreDisplay(int score)
    {
        // 更新UI
        Debug.Log("Player scored: " + score);
    }
}
```
事件的特点：
- 解耦：`GameManager`不需要知道`UIManager`的存在，UIManager可以独立地响应得分变化
- 多播：一个事件可以有多个订阅者，也可以通过`+=`和`-=`来添加或移除订阅者
- 安全：通过`?.Invoke()`确保事件只在有订阅者时触发，避免空引用异常

### Unity中常见用法
1. 自定义事件传递数据
```cs
public class Palyer : MonoBehaviour
{
    public delegate void HealthChanged(int newHp);
    public event HealthChanged OnHealthChanged;

    private int hp = 100;

    public void TakeDamage(int damage)
    {
        hp -= damage;
        OnHealthChanged?.Invoke(hp);
    }
}
```
2. 使用Action/Func/EventHandler简化写法（推荐）
```cs
public class Player : MonoBehaviour
{
    public event Action<int> OnHealthChanged;

    public void TakeDamage(int damage) => OnHealthChanged?.Invoke(100 - damamge);
}
```

### 示例
1. UI更新
```cs
public class HealthUI : MonoBehaviour
{
    public Player player;

    void Start() => player.OnHealthChanged += UpdateHealthBar;

    void UpdateHealthBar(int hp)
    {
        // 更新血条UI
    }
}
```

2. 输入控制器通知角色行为
```cs
public class InputManager : MonoBehaviour
{
    public static event Action OnJump;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space)) OnJump?.Invoke();
    }
}

public class PlayerController : MonoBehaviour
{
    void OnEnable() => InputManager.OnJump += Jump;

    void OnDisable() => InputManager.OnJump -= Jump;

    void Jump()
    {
        // 执行跳跃
    }
}
```

### C#委托事件的优点
- 松耦合：组件A不需要直接引用组件B，只需要暴露事件接口，B只需要订阅即可。这减少了组件间的耦合，使得系统更加灵活
- 可扩展性：可以很容易地添加新的实践订阅者，无需更改已有的代码。例如，多个UI元素或音效系统可以同时监听相同的事件
- 响应灵活：委托和事件允许你在运行时动态地绑定方法。例如，UI按钮的带年纪事件可以通过委托绑定不同的处理方法，甚至可以从外部脚本动态添加和移除事件处理方法
- 避免重复执行：事件和委托可以确保方法只被执行一次，避免了多个事件处理方法同时执行同一操作的问题

### 注意事项

| 问题      | 描述                           |
| ------- | ---------------------------- |
| 内存泄漏 | 如果事件订阅者未取消订阅，引用会一直存在，GC 无法释放 |
| 空检查 | `event?.Invoke()` 避免空引用异常    |
| 多次订阅 | 注意避免重复注册：可能会导致方法被执行多次        |
| 性能问题 | 事件系统比直接调用略慢，但利于解耦            |

# 事件驱动架构
事件驱动架构（Event-Driven Architecture，简称EDA）是一种以事件作为系统运行核心驱动力的软件架构模式\
它的思路是：
> 当某个事件发生时，系统会通知对改事件感兴趣的组件，由它们决定如何响应
这种模式的重点是“触发→通知→响应”，而不是“调用→返回”

## 核心概念
1. 事件（Event）
- 事件是系统状态变化的记录
- 通常包含：
  - 事件类型（例如`"PlayerDied`、`"OrderCreated"`）
  - 事件数据（如死亡位置、订单详情）
- 事件是“一次性的事实”，不会被修改

```cs
public class PlayerDiedEvent
{
    public Vector3 deathPosition;
    public PlayerDiedEvent(Vector3 pos) => deathPosition = pos;
}
```

2. 事件生产者（Event Producer）
- 负责检测某件事情发生，并发出事件
- 它只负责发出，不关心谁接收、怎么处理

```cs
public class PlayerHealth : MonoBehaviour
{
    public event Action<PlayerDiedEvent> OnPlayerDied;

    public void TakeDamage(int amount)
    {
        // 扣血逻辑
        if (/*死亡条件*/) OnPlayerDied?.Invoke(new PlayerDiedEvent(transform.position));
    }
}
```

3. 事件消费者（Event Consumer）
- 订阅（Subscribe）某类事件，并在事件发生时响应
- 不直接调用生产者，而是等待事件通知

```cs
public class GameManager : MonoBehaviour
{
    public PlayerHealth playerHealth;

    void OnEnable() => playerHealth.OnPlayerDied += HandlePlayerDeath;

    void OnDisable() => playerHealth.OnPlayerDied -= HandlePlayerDeath;

    void HandlePlayerDeath(PlayerDiedEvent e)
    {
        Debug.Log($"玩家死亡，位置：{e.deathPosition}");
        // 触发游戏结束逻辑
    }
}
```

## 特点
优点
1. 解耦：生产者和消费者互不依赖，降低模块耦合度
2. 可扩展性强：新增功能只需新建事件监听者，无需更改生产者
3. 异步性：事件可以异步处理，提高系统吞吐量（特别是在分布式系统里）
4. 灵活性：可以有多个监听者对同一事件做出不同反应

缺点
1. 调试困难：事件流是分散的，不能像函数调用链那样直观
2. 事件风暴：事件过多或链式触发，可能引起性能问题
3. 状态一致性：异步事件可能导致数据状态延迟更新

## 架构流程
```rust
事件源（Producer） --发出事件--> 事件通道（Event Bus） --分发--> 事件监听者（Consumer）
```
可以用两种方式实现：
1. 直接回调（同进程、同步）：C#事件、委托
2. 消息总线/事件总线（异步）：如`EventAggregator`、`MessageBus`、`RabbitMQ`、`Kafka`

在Unity中的应用场景

| 场景    | 示例事件             | 好处                       |
| ----- | ---------------- | ------------------------ |
| UI 更新 | `"ScoreChanged"` | UI 只关心分数变化，不管谁改的分数       |
| 游戏状态  | `"GameOver"`     | 所有相关系统（UI、音乐、AI）都能收到结束事件 |
| AI 行为 | `"EnemySpotted"` | AI 角色感知敌人后触发反应           |
| 资源管理  | `"ItemPickedUp"` | 背包系统和音效系统都能响应            |


最佳实践
1. 事件名用过去式（如`PlayerDied`而不是`PlayerDie`）表示它已经发生
2. 数据封装到事件类中，避免传一堆参数
3. 解订阅事件，防止内存泄露（`OnDisable`里取消监听）
4. 避免事件滥用，过多事件会导致性能下降和可维护性变差
5. 集中管理事件（如使用`EventManager`）或第三方事件总线库

事件驱动架构的精髓是让变化“广播”出去，由感兴趣的模块去响应，而不是让变化方直接控制接下来发生的事
