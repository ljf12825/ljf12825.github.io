---
title: "Event and Delegate"
layout: single
date: 2025-06-01
categories: [笔记]
tags: [Unity, Unity Syntax]
author: "ljf12825"
parmalink: /posts/2025-06-03-Event-and-Delegate/
---
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